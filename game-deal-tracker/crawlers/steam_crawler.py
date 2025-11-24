# game-deal-tracker/crawlers/steam_crawler.py

import requests
import re
import time
from datetime import datetime
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session
from sqlalchemy import func
from db.models import Deal, SteamMetadata 
from config.database import SessionLocal

# 스팀 검색 API 엔드포인트
# specials=1 (할인 상품), cc=kr (한국 기준), l=koreana (언어 설정)
STEAM_SEARCH_URL = "https://store.steampowered.com/search/results/?query&start={start}&count=100&dynamic_data=&sort_by=_ASC&snr=1_7_7_151_7&infinite=1&specials=1&cc=kr&l=koreana"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7'
}

def fetch_steam_sales(limit=500):
    """스팀 할인 게임 목록을 가져와 파싱합니다."""
    all_deals = []
    start = 0
    
    print(f"🚂 Fetching Steam sales (Target: ~{limit} items)...")

    while len(all_deals) < limit:
        try:
            url = STEAM_SEARCH_URL.format(start=start)
            response = requests.get(url, headers=HEADERS)
            
            if response.status_code != 200:
                print(f"  - Failed to fetch Steam data: {response.status_code}. Stopping.")
                break
                
            data = response.json()
            html_content = data.get('results_html')
            
            if not html_content:
                print("  - No more results found. Stopping.")
                break
                
            soup = BeautifulSoup(html_content, 'html.parser')
            rows = soup.select('a.search_result_row')
            
            if not rows:
                break
                
            for row in rows:
                deal_info = parse_steam_row(row)
                if deal_info:
                    all_deals.append(deal_info)
            
            # 다음 페이지로 이동
            start += len(rows)
            print(f"  - Fetched {len(all_deals)} deals so far...")
            
            # 너무 빠른 요청 방지
            time.sleep(1)
            
        except Exception as e:
            print(f"❌ Error during Steam crawling: {e}")
            break
            
    return all_deals[:limit]

def parse_steam_row(row):
    """HTML 행 하나에서 게임 정보를 추출합니다."""
    try:
        title = row.select_one('span.title').text.strip()
        url = row['href']
        
        # App ID 추출 (deal_id로 사용될 스팀 고유 ID)
        app_id_str = row.get('data-ds-appid')
        steam_app_id = int(app_id_str.split(',')[0]) if app_id_str else None
        if not steam_app_id: return None
        
        # 이미지 URL (고해상도 헤더 이미지로 변환 시도)
        img_tag = row.select_one('div.search_capsule img')
        image_url = img_tag['src'].replace("capsule_sm_120", "header") if img_tag and img_tag.get('src') else None

        # 가격 및 할인율 추출
        price_div = row.select_one('div.search_price')
        discount_span = row.select_one('div.search_discount span')
        
        if not discount_span or not price_div:
            return None 

        discount_rate = int(discount_span.text.replace('-', '').replace('%', ''))
        
        # 가격 파싱 (정가 + 할인가)
        price_text = price_div.select('strike')
        if not price_text:
            return None
            
        regular_price_text = price_text[0].get_text(strip=True)
        sale_price_tag = price_div.select_one('.search_price span:not([class])') # 할인가 텍스트
        
        regular_price = float(re.sub(r'[^\d.]', '', regular_price_text.replace(',', '')))
        sale_price = float(re.sub(r'[^\d.]', '', sale_price_tag.get_text(strip=True).replace(',', ''))) if sale_price_tag else 0.0

        # 리뷰 정보 추출
        review_summary = ""
        positive_percent = 0
        total_reviews = 0
        
        review_span = row.select_one('span.search_review_summary')
        if review_span:
            tooltip = review_span.get('data-tooltip-html', '')
            review_parts = tooltip.split('<br>')
            if len(review_parts) > 0:
                review_summary = review_parts[0]
                
            # 퍼센트 및 개수 추출
            match = re.search(r'(\d+)%[^0-9]+([\d,]+)', tooltip)
            if match:
                positive_percent = int(match.group(1))
                total_reviews = int(match.group(2).replace(',', ''))
        
        # End Date: 스팀 검색 결과에는 없으므로 None
        
        return {
            "platform": "Steam",
            "title": title,
            "url": url,
            "image_url": image_url,
            "regular_price": regular_price,
            "sale_price": sale_price,
            "discount_rate": discount_rate,
            "deal_type": "Sale", # 스팀 할인은 Sale로 분류
            "is_active": True,
            "end_date": None, 
            "steam_meta": {
                "steam_app_id": steam_app_id,
                "review_summary": review_summary,
                "positive_review_percent": positive_percent,
                "total_reviews": total_reviews
            }
        }
    except Exception as e:
        # print(f"Row parsing error for Steam: {e}")
        return None

def save_steam_deals(db: Session):
    deals = fetch_steam_sales()
    if not deals:
        print("  - No Steam deals found.")
        return 0
        
    count_saved = 0
    count_updated = 0
    
    for data in deals:
        steam_meta_data = data.pop("steam_meta")
        
        try:
            existing_deal = db.query(Deal).filter(Deal.url == data['url']).first()
            
            if existing_deal:
                # Deal 정보 업데이트
                existing_deal.sale_price = data['sale_price']
                existing_deal.discount_rate = data['discount_rate']
                existing_deal.is_active = True
                
                # SteamMetadata 업데이트
                if existing_deal.steam_meta:
                    for key, value in steam_meta_data.items():
                        setattr(existing_deal.steam_meta, key, value)
                else:
                    new_meta = SteamMetadata(deal_id=existing_deal.id, **steam_meta_data)
                    db.add(new_meta)
                    
                count_updated += 1
            else:
                # 신규 Deal 생성
                new_deal = Deal(**data)
                db.add(new_deal)
                db.flush() 
                
                # SteamMetadata 연결
                new_meta = SteamMetadata(deal_id=new_deal.id, **steam_meta_data)
                db.add(new_meta)
                count_saved += 1
                
            db.commit()
            
        except Exception as e:
            db.rollback()
            print(f"❌ Error saving Steam deal {data['title']}: {e}")
            
    print(f"✅ Steam Crawler Summary: Added {count_saved}, Updated {count_updated}.")
    return count_saved

def crawl_steam():
    session = SessionLocal()
    try:
        save_steam_deals(session)
    finally:
        session.close()

if __name__ == "__main__":
    crawl_steam()