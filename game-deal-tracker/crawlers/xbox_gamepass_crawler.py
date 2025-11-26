# crawlers/xbox_gamepass_crawler.py

import sys
import os

# 부모 디렉터리를 sys.path에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import requests
from datetime import datetime, timezone
# 🚨 [수정 1] 외부에서 필요한 함수를 사용하기 위해 임포트 추가 (config/database.py와 db/crud.py가 이미 수정되었어야 함)
from config.database import get_db_context
from db.crud import upsert_deal 

from db.models import Deal, XboxMetadata
from typing import List, Dict, Set, Tuple

# 1단계 API: Game Pass ID 목록
XBOX_ID_URL = "https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=ko-kr&market=KR"
# 2단계 API: 상세 정보
XBOX_DETAIL_URL = "https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds={ids}&market=KR&languages=ko-kr"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
}

# --- 1. ID 목록 가져오기 ---
def get_product_ids() -> List[str]:
    try:
        response = requests.get(XBOX_ID_URL, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        
        product_ids = []
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
        
        return product_ids
    except Exception as e:
        print(f"ERROR: Xbox ID 목록 요청 실패: {e}")
        return []

# --- 2. 상세 정보 가져오기 ---
def fetch_xbox_details(product_ids: List[str]) -> List[dict]:
    details_list = []
    chunk_size = 40 
    id_chunks = [product_ids[i:i + chunk_size] for i in range(0, len(product_ids), chunk_size)]

    for chunk in id_chunks:
        ids_string = ",".join(chunk)
        url = XBOX_DETAIL_URL.format(ids=ids_string)
        
        try:
            response = requests.get(url, headers=HEADERS)
            response.raise_for_status()
            
            data = response.json()
            products = data.get('Products', [])
            details_list.extend(products)
                
        except Exception as e:
            print(f"ERROR: 상세 정보 요청 실패 (Chunk): {e}")
            
    print(f"Successfully fetched details for {len(details_list)} products.")
    return details_list

# --- 🔍 가격 정보 추출 ---
def get_ms_store_price(product: dict) -> float:
    try:
        skus = product.get('DisplaySkuAvailabilities', [])
        if skus:
            for sku in skus:
                availabilities = sku.get('Availabilities', [])
                for avail in availabilities:
                    order_mgmt = avail.get('OrderManagementData', {})
                    price_data = order_mgmt.get('Price', {})
                    msrp = price_data.get('MSRP')
                    if msrp is not None:
                        return float(msrp)
        
        orig_price = product.get('Properties', {}).get('OriginalPrice')
        if orig_price:
            return float(orig_price)
    except Exception:
        pass
    return 0.0

# --- 🎮 플랫폼 및 요금제 분석 ---
def analyze_platform_and_tier(product: dict) -> Tuple[Set[str], Set[str]]:
    platforms = set()
    plans = set()
    
    props = product.get('Properties', {})
    
    # 1. 기본 AllowedPlatforms 확인
    allowed_raw = props.get('AllowedPlatforms', [])
    if not allowed_raw:
        allowed_raw = product.get('AllowedPlatforms', [])
    
    # 2. SKU 내부의 조건 확인
    if not allowed_raw:
        skus = product.get('DisplaySkuAvailabilities', [])
        for sku in skus:
            avails = sku.get('Availabilities', [])
            for avail in avails:
                conditions = avail.get('Conditions', {}).get('ClientConditions', {})
                sku_allowed = conditions.get('AllowedPlatforms')
                if sku_allowed:
                    allowed_raw.extend(sku_allowed)

    # 리스트 정리
    allowed_str = []
    for item in allowed_raw:
        if isinstance(item, dict): 
            val = item.get('PlatformName') or item.get('Name')
            if val: allowed_str.append(str(val).lower())
        else:
            allowed_str.append(str(item).lower())
            
    allowed_str = list(set(allowed_str))

    # --- 플랫폼 판별 ---
    is_pc = False
    is_console = False
    is_cloud = False

    # PC
    if props.get('IsGamePassPC') or any(x in p for p in allowed_str for x in ['windows', 'desktop', 'pc']):
        is_pc = True
        platforms.add("PC")

    # Console
    console_keywords = ['xbox', 'console', 'durango', 'scarlett', 'gen9', 'gen8', 'one']
    if props.get('IsGamePassConsole') or any(x in p for p in allowed_str for x in console_keywords):
        is_console = True
        platforms.add("Console")

    # Cloud
    if props.get('IsGamePassCloud') or props.get('XboxCloudGaming'):
        is_cloud = True
    elif any('cloud' in p for p in allowed_str):
        is_cloud = True
    else:
        attrs = props.get('Attributes', [])
        if isinstance(attrs, list):
            for attr in attrs:
                if isinstance(attr, dict) and 'cloud' in str(attr.get('Name', '')).lower():
                    is_cloud = True
                    break
    
    if is_cloud:
        platforms.add("Cloud")

    # --- 요금제(Tier) 매핑 ---
    if is_pc:
        plans.add("PC")
        plans.add("Ultimate")
    if is_console:
        plans.add("Premium")
        plans.add("Ultimate")
    if is_cloud:
        plans.add("Ultimate")
    if props.get('IsGamePassCore'):
        plans.add("Essential")
    if not plans and (is_pc or is_console or is_cloud):
        plans.add("Ultimate")

    return platforms, plans

# --- 3. 데이터 추출 (병합 전 단계) ---
def extract_raw_data(product: dict):
    if not isinstance(product, dict):
        return None
        
    product_id = product.get('ProductId')
    localized_props = product.get('LocalizedProperties', [{}])[0]
    market_props = product.get('MarketProperties', [{}])[0]

    title = localized_props.get('ProductTitle')
    url_slug = localized_props.get('ProductUrl')
    
    if not title or not product_id:
        return None
    
    safe_slug = url_slug if url_slug else "unknown"
    final_url = f"https://www.xbox.com/ko-KR/games/store/{safe_slug}/{product_id}"
    regular_price = get_ms_store_price(product)
    
    # 플랫폼 및 요금제 분석
    platforms, plans = analyze_platform_and_tier(product)
    
    # 🆕 [추가] 이미지 URL 추출 로직
    image_url = None
    images = localized_props.get('Images', [])
    
    # BoxArt > Poster > SuperHeroArt 순으로 우선순위 검색
    target_purposes = ['BoxArt', 'Poster', 'SuperHeroArt']
    
    for purpose in target_purposes:
        for img in images:
            if img.get('ImagePurpose') == purpose:
                image_url = img.get('Uri')
                break
        if image_url:
            break
            
    # 못 찾았으면 아무거나 첫 번째 이미지
    if not image_url and images:
        image_url = images[0].get('Uri')
    
    # Xbox API는 //로 시작하는 URL을 줄 때가 많음 -> https: 붙여주기
    if image_url and image_url.startswith('//'):
        image_url = f"https:{image_url}"

    # 날짜 처리
    is_day_one = False
    removal_date = None
    
    release_date_str = localized_props.get('ReleaseDate')
    start_date_str = localized_props.get('OriginalReleaseDate') 

    if release_date_str and start_date_str:
        try:
            r_date = datetime.fromisoformat(release_date_str.replace('Z', '+00:00')).date()
            s_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00')).date()
            if r_date == s_date:
                is_day_one = True
        except ValueError:
            pass

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

    return {
        "title": title,
        "product_id": product_id,
        "url": final_url,
        "price": regular_price,
        "platforms": platforms,
        "plans": plans,
        "is_day_one": is_day_one,
        "removal_date": removal_date,
        "image_url": image_url # 🆕 반환 데이터에 포함
    }

# --- 4. 데이터 병합 (Merge Logic) ---
def merge_xbox_deals(products: List[dict]) -> List[dict]:
    merged_data: Dict[str, dict] = {}

    for product in products:
        raw = extract_raw_data(product)
        if not raw:
            continue
            
        title = raw['title']
        
        if title not in merged_data:
            merged_data[title] = raw
        else:
            existing = merged_data[title]
            existing['platforms'].update(raw['platforms']) 
            existing['plans'].update(raw['plans'])         
            
            if raw['price'] > existing['price']:
                existing['price'] = raw['price']
            if raw['is_day_one']:
                existing['is_day_one'] = True
            if not existing['removal_date'] and raw['removal_date']:
                existing['removal_date'] = raw['removal_date']
            # 🆕 더 나은 이미지가 있으면 업데이트 (기존이 없거나 비었을 때)
            if not existing.get('image_url') and raw.get('image_url'):
                existing['image_url'] = raw['image_url']

    final_list = []
    now_utc = datetime.now(timezone.utc)

    for title, data in merged_data.items():
        sorted_platforms = sorted(list(data['platforms']))
        platform_str = ", ".join(sorted_platforms) if sorted_platforms else "Xbox"

        sorted_plans = sorted(list(data['plans']))
        tier_str = ", ".join(sorted_plans) if sorted_plans else "Ultimate"

        is_active = True
        if data['removal_date']:
            is_active = data['removal_date'].astimezone(timezone.utc) > now_utc

        final_list.append({
            "core_deal": {
                "platform": platform_str,
                "title": title,
                "url": data['url'],
                "image_url": data['image_url'], # 🆕 Core Deal 모델에 전달
                "regular_price": data['price'],
                "sale_price": 0.0,
                "discount_rate": 100,
                "deal_type": "GamePass",
                "end_date": data['removal_date'],
                "is_active": is_active
            },
            "xbox_meta": {
                "is_game_pass": True,
                "is_day_one": data['is_day_one'],
                "game_pass_tier": tier_str,
                "removal_date": data['removal_date']
            }
        })
        
    return final_list

# --- 🚨 [수정 2] main.py가 찾고 있는 진입점 함수 정의 (save_xbox_deals 로직 대체) ---
def crawl_xbox_gamepass():
    print("🟢 Starting Xbox Game Pass Crawler...")
    ids = get_product_ids()
    if not ids:
        print("   - No Product IDs found.")
        return

    products_raw = fetch_xbox_details(ids)
    deals_structured = merge_xbox_deals(products_raw)

    print(f"Processing {len(deals_structured)} unique titles (Merged from {len(products_raw)} raw items)...")

    count_saved = 0
    count_updated = 0

    with get_db_context() as db:
        for item in deals_structured:
            try:
                filters = {
                    "title": item["core_deal"]["title"],
                    "deal_type": "GamePass"
                }
                # crud.py의 upsert_deal 함수 사용 (기존 save_xbox_deals의 복잡한 로직 대체)
                result = upsert_deal(
                    db,
                    deal_data=item["core_deal"],
                    metadata_model=XboxMetadata,
                    metadata_data=item["xbox_meta"],
                    unique_filters=filters
                )
                if result == "created": count_saved += 1
                else: count_updated += 1
            except Exception as e:
                # DB 트랜잭션 오류 발생 시 롤백 (세션 복구)
                db.rollback() 
                print(f"⚠️ Xbox Insert Error ({item['core_deal']['title']}): {e}")
                continue
        
        db.commit()
        print(f"✅ Xbox Crawler Finished: Added {count_saved}, Updated {count_updated}")

if __name__ == "__main__":
    # 이 부분은 원래 코드를 유지하지만, 위 crawl_xbox_gamepass가 실제 실행됩니다.
    # crawl_xbox_gamepass 함수가 save_xbox_deals의 기능을 포함하도록 변경했습니다.
    crawl_xbox_gamepass()