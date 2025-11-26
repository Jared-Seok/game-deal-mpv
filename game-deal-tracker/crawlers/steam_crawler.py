# game-deal-tracker/crawlers/steam_crawler.py

import sys
import os

# [핵심 수정] 현재 스크립트(crawlers/)의 부모 디렉터리(game-deal-tracker/)를 경로에 추가
# 이를 통해 'config'와 'db' 모듈을 불러올 수 있게 됩니다.
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
import re
import time
from datetime import datetime
from bs4 import BeautifulSoup
from typing import List # 사용하지 않는 Dict, Set, Tuple 제거됨

# 이제 경로가 추가되었으므로 정상적으로 import 됩니다.
from config.database import get_db_context 
from db.models import Deal, SteamMetadata 
from db.crud import upsert_deal 

# 스팀 검색 API 엔드포인트
STEAM_SEARCH_URL = "https://store.steampowered.com/search/results/?query&start={start}&count=100&dynamic_data=&sort_by=_ASC&snr=1_7_7_151_7&infinite=1&specials=1&cc=kr&l=koreana"
STEAM_COUNT_URL = "https://store.steampowered.com/search/results/?query&start=0&count=1&dynamic_data=&sort_by=_ASC&snr=1_7_7_151_7&infinite=1&specials=1&cc=kr&l=koreana"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
}

def get_total_sales_count() -> int:
    """API에 접속하여 현재 세일 중인 게임의 총 개수를 가져옵니다."""
    try:
        response = requests.get(STEAM_COUNT_URL, headers=HEADERS)
        response.raise_for_status()
        
        try:
            data = response.json()
        except requests.exceptions.JSONDecodeError:
            print("  - WARNING: Initial API call returned non-JSON. Possible temporary block. Returning 0.")
            return 0
        
        return data.get('total_count', 0)
        
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Failed to fetch initial sales count: {e}")
        return 0

def fetch_steam_sales() -> List[dict]:
    """스팀 할인 게임 목록을 가져와 파싱합니다."""
    total_count = get_total_sales_count()
    if total_count == 0:
        print("  - No sales found or initial API fetch failed.")
        return []
        
    all_deals = []
    start = 0
    
    print(f"🚂 Fetching Steam sales (Target: {total_count} items)...")

    while len(all_deals) < total_count:
        try:
            url = STEAM_SEARCH_URL.format(start=start)
            response = requests.get(url, headers=HEADERS)
            
            if response.status_code != 200:
                print(f"  - Failed to fetch Steam data: Status {response.status_code}. Stopping.")
                break
            
            try:
                data = response.json()
            except requests.exceptions.JSONDecodeError:
                print("  - CRITICAL: JSON decoding failed during bulk fetch. Stopping.")
                break
                
            html_content = data.get('results_html')
            if not html_content:
                break
                
            soup = BeautifulSoup(html_content, 'html.parser')
            rows = soup.select('a.search_result_row')
            
            if not rows:
                break
                
            for row in rows:
                deal_info = parse_steam_row(row)
                if deal_info:
                    all_deals.append(deal_info)
            
            start += len(rows)
            print(f"  - Fetched {len(all_deals)} deals so far...")
            
            time.sleep(1)
            
        except Exception as e:
            print(f"❌ Error during Steam crawling loop: {e}. Stopping.")
            break
            
    return all_deals

def parse_steam_row(row):
    """HTML 행 하나에서 게임 정보를 추출하고, deal_data와 meta_data로 분리합니다."""
    title = "Unknown Title"
    try:
        title_tag = row.select_one('span.title')
        if not title_tag: return None
        title = title_tag.text.strip()
        url = row['href']
        
        # App ID 추출
        app_id_str = row.get('data-ds-appid')
        steam_app_id = int(app_id_str.split(',')[0]) if app_id_str else None
        if not steam_app_id: return None
        
        # 이미지 URL
        img_tag = row.select_one('div.search_capsule img')
        image_url = img_tag['src'].replace("capsule_231x87", "header") if img_tag and img_tag.get('src') else None

        # 가격 요소 추출
        discount_block = row.select_one('.discount_block.search_discount_block')
        
        if not discount_block: return None 

        discount_rate = int(discount_block.get('data-discount', '0'))
        
        original_price_tag = discount_block.select_one('.discount_original_price')
        final_price_tag = discount_block.select_one('.discount_final_price')

        if not original_price_tag or not final_price_tag:
             return None

        # 가격 숫자 변환 로직
        try:
            regular_price_text = original_price_tag.get_text(strip=True)
            regular_price = float(re.sub(r'[^\d.]', '', regular_price_text.replace(',', '')))
            
            final_price_text = final_price_tag.get_text(strip=True)
            sale_price = float(re.sub(r'[^\d.]', '', final_price_text.replace(',', '')))
            
        except ValueError:
            return None
        
        # 리뷰 정보 파싱 로직 (한국어/영어 호환)
        review_summary, positive_percent, total_reviews = "평가 없음", 0, 0
        review_span = row.select_one('span.search_review_summary')
        
        if review_span:
            tooltip = review_span.get('data-tooltip-html', '')
            
            review_parts = tooltip.split('<br>')
            if len(review_parts) > 0:
                review_summary = review_parts[0].strip()
            
            percent_match = re.search(r'(\d+)%', tooltip)
            if percent_match:
                positive_percent = int(percent_match.group(1))
            
            count_match = re.search(r'([\d,]+)(?:개|건| user reviews)', tooltip)
            if count_match:
                total_reviews = int(count_match.group(1).replace(',', ''))
        
        return {
            "deal_data": { 
                "platform": "Steam",
                "title": title,
                "url": url,
                "image_url": image_url,
                "regular_price": regular_price,
                "sale_price": sale_price,
                "discount_rate": discount_rate,
                "deal_type": "Sale", 
                "is_active": True,
                "end_date": None, 
            },
            "meta_data": { 
                "steam_app_id": steam_app_id,
                "review_summary": review_summary,
                "positive_review_percent": positive_percent,
                "total_reviews": total_reviews
            }
        }
    except Exception as e:
        print(f"❌ CRITICAL PARSING ERROR for Steam deal: {e} (Title: {title})")
        return None

# --- main.py가 임포트하는 최종 진입점 함수 ---
def crawl_steam():
    deals_structured = fetch_steam_sales()
    if not deals_structured:
        return 0

    # [Fix] Filter out duplicates based on steam_app_id before saving
    unique_deals = {}
    for item in deals_structured:
        app_id = item["meta_data"]["steam_app_id"]
        if app_id not in unique_deals:
            unique_deals[app_id] = item

    print(f"  - Found {len(deals_structured)} raw deals, filtered down to {len(unique_deals)} unique deals.")
        
    count_saved = 0
    count_updated = 0
    
    with get_db_context() as db:
        for item in unique_deals.values():
            try:
                result = upsert_deal(
                    db,
                    deal_data=item["deal_data"],
                    metadata_model=SteamMetadata,
                    metadata_data=item["meta_data"]
                )
                
                if result == "created": count_saved += 1
                else: count_updated += 1
                
            except Exception as e:
                db.rollback() 
                print(f"⚠️ Steam DB Error ({item['deal_data'].get('title', 'Unknown')}): {e}")
                continue
                
        db.commit()
        print(f"✅ Steam Crawler Finished: Added {count_saved}, Updated {count_updated}.")
        return count_saved

if __name__ == "__main__":
    crawl_steam()