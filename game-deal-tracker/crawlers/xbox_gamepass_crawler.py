# crawlers/xbox_crawler.py

import requests
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from db.models import Deal, XboxMetadata # Core Deal 및 메타데이터 모델
from typing import List

# 🚨 1단계 API: Game Pass ID 목록 가져오기 (전체 카탈로그 ID)
XBOX_ID_URL = "https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=ko-kr&market=KR"
# 🚨 2단계 API: 상세 정보 가져오기 (bigIds={ids} 부분에 ID를 삽입해야 함)
XBOX_DETAIL_URL = "https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds={ids}&market=KR&languages=ko-kr"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
}

# --- 1단계: ID 목록 가져오기 (안정성 강화) ---
def get_product_ids() -> List[str]:
    """1단계: Game Pass 카탈로그의 모든 제품 ID를 가져옵니다. (안정성 강화)"""
    try:
        response = requests.get(XBOX_ID_URL, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        
        product_ids = []

        # 데이터 타입 안정성 확보
        if isinstance(data, list):
            for item in data:
                if isinstance(item, dict) and item.get('id'):
                    product_ids.append(item['id'])
        
        elif isinstance(data, dict):
            content_items = data.get('contentItems', [])
            if isinstance(content_items, list):
                for item in content_items:
                    if isinstance(item, dict) and item.get('id'):
                        product_ids.append(item['id'])
        
        if product_ids:
            return product_ids

        print("Warning: Could not parse product IDs from XBOX_ID_URL.")
        return []
        
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Xbox ID 목록 요청 실패: {e}")
        return []
    except Exception as e:
        print(f"ERROR during ID list processing: {e}")
        return []

# --- 2단계: 상세 정보 가져오기 (이전 코드와 동일하게 유지) ---
def fetch_xbox_details(product_ids: List[str]) -> List[dict]:
    """2단계: ID 목록을 기반으로 상세 제품 정보를 가져옵니다."""
    details_list = []
    chunk_size = 50
    id_chunks = [product_ids[i:i + chunk_size] for i in range(0, len(product_ids), chunk_size)]

    for chunk in id_chunks:
        ids_string = ",".join(chunk)
        url = XBOX_DETAIL_URL.format(ids=ids_string)
        
        try:
            response = requests.get(url, headers=HEADERS)
            response.raise_for_status()
            
            data = response.json()
            products = data.get('Products', [])
            
            for product in products:
                details_list.append(product)
                
        except requests.exceptions.RequestException as e:
            print(f"ERROR: 상세 정보 요청 실패 (Chunk): {e}")
            
    print(f"Successfully fetched details for {len(details_list)} products.")
    return details_list

# --- 3단계: 데이터 추출 및 가공 ---
def extract_deal_info(product: dict):
    """상세 제품 JSON에서 Core Deal 및 Xbox Metadata 정보를 추출합니다."""
    
    if not isinstance(product, dict):
        return None
        
    product_id = product.get('ProductId')
    
    # 🚨 리스트에서 첫 번째 요소를 안전하게 추출
    localized_props = product.get('LocalizedProperties')
    localized_props = localized_props[0] if localized_props and isinstance(localized_props, list) else {}

    market_props = product.get('MarketProperties')
    market_props = market_props[0] if market_props and isinstance(market_props, list) else {}

    title = localized_props.get('ProductTitle')
    url_slug = localized_props.get('ProductUrl')
    
    if not title or not product_id:
        # 🚨 디버그 로그 추가
        print(f"DEBUG SKIP: Product ID {product_id} skipped (Missing Title)")
        return None
        
    final_url = f"https://www.xbox.com/ko-KR/games/store/{url_slug}/"
    regular_price = product.get('Properties', {}).get('OriginalPrice', 0.0)
    
    # --- Game Pass Metadata 추출 로직 ---
    is_day_one = False
    tiers = []
    removal_date = None
    
    # Day 1 계산 (출시일 vs Game Pass 시작일)
    release_date_str = localized_props.get('ReleaseDate')
    start_date_str = localized_props.get('OriginalReleaseDate') 

    if release_date_str and start_date_str:
        try:
            release_date = datetime.fromisoformat(release_date_str.replace('Z', '+00:00')).date()
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00')).date()
            
            if release_date == start_date:
                is_day_one = True
        except ValueError:
            pass
            
    # 티어 확인
    if product.get('Properties', {}).get('IsGamePassConsole'):
        tiers.append("Console")
    if product.get('Properties', {}).get('IsGamePassPC'):
        tiers.append("PC")

    # 만료일 확인
    usage_data = market_props.get('UsageData', [])
    for usage in usage_data:
        if usage.get('UsageType') == 'Subscription':
            expiration_str = usage.get('expirationDate')
            if expiration_str:
                try:
                    removal_date = datetime.fromisoformat(expiration_str.replace('Z', '+00:00'))
                    break
                except ValueError:
                    pass

    game_pass_tier = ", ".join(tiers)
    
    # 🚨 [핵심 수정]: 1단계 API 목록을 신뢰하여 Game Pass 상태는 무조건 True로 설정
    is_game_pass_status = True

    # Core Deal 필드 설정
    now_utc = datetime.now(timezone.utc)
    is_active_status = True
    
    if removal_date:
        is_active_status = removal_date.astimezone(timezone.utc) > now_utc
    
    return {
        "core_deal": {
            "platform": "Xbox Game Pass",
            "title": title,
            "url": final_url,
            "regular_price": regular_price,
            "sale_price": 0.0,
            "discount_rate": 100, 
            "deal_type": "GamePass",
            "end_date": removal_date, 
            "is_active": is_active_status,
        },
        "xbox_meta": {
            "is_game_pass": is_game_pass_status,
            "is_day_one": is_day_one,
            "game_pass_tier": game_pass_tier,
            "removal_date": removal_date,
        }
    }

# --- 최종 통합 함수 (DB 저장) ---
def fetch_xbox_deals_integrated():
    product_ids = get_product_ids()
    if not product_ids:
        return []
    
    products = fetch_xbox_details(product_ids)
    
    deals = []
    for product in products:
        deal = extract_deal_info(product)
        if deal: # 🚨 None이 아닌 유효한 딜만 추가
            deals.append(deal)
            
    return deals

def save_xbox_deals(db: Session):
    """수집된 Xbox Deals를 Core Deal 테이블 및 Xbox Metadata 테이블에 저장합니다."""
    deals_data_structured = fetch_xbox_deals_integrated()
    count_saved = 0
    count_skipped = 0
    
    if not deals_data_structured:
        print("No deals found from Xbox Game Pass API.")
        return 0

    for data_set in deals_data_structured:
        core_deal = data_set["core_deal"]
        xbox_meta = data_set["xbox_meta"]
        
        try:
            # 1. 중복 체크 (Core Deal 기준)
            existing_deal = db.query(Deal).filter(
                Deal.platform == core_deal['platform'],
                Deal.url == core_deal['url']
            ).first()

            if existing_deal:
                # 2. 업데이트: Core Deal 업데이트 후 Metadata도 업데이트
                for key, value in core_deal.items():
                    setattr(existing_deal, key, value)
                
                existing_meta = db.query(XboxMetadata).filter_by(deal_id=existing_deal.id).first()
                if existing_meta:
                    for key, value in xbox_meta.items():
                        setattr(existing_meta, key, value)
                else:
                    new_meta = XboxMetadata(deal_id=existing_deal.id, **xbox_meta)
                    db.add(new_meta)
                
                db.commit()
                count_skipped += 1

            else:
                # 3. 새로운 경우: Core Deal 저장 후 ID를 이용해 Metadata 저장
                new_deal = Deal(**core_deal)
                db.add(new_deal)
                db.flush() # ID를 얻기 위해 강제 커밋

                new_meta = XboxMetadata(deal_id=new_deal.id, **xbox_meta)
                db.add(new_meta)
                
                db.commit()
                count_saved += 1

        except Exception as e:
            db.rollback()
            print(f"🚨 CRITICAL DB ERROR during Xbox Save ({core_deal.get('title', 'Unknown')}): {e}")

    print(f"Xbox Crawler Summary: Added {count_saved} new deals, Updated/Skipped {count_skipped} existing deals.")
    return count_saved