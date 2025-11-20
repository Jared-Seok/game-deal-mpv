# crawlers/xbox_gamepass_crawler.py

import requests
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from db.models import Deal, XboxMetadata 
from typing import List, Dict, Set, Tuple

# 🚨 1단계 API: Game Pass ID 목록
XBOX_ID_URL = "https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=ko-kr&market=KR"
# 🚨 2단계 API: 상세 정보
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

# --- 🎮 플랫폼 및 요금제 분석 (로직 강화됨) ---
def analyze_platform_and_tier(product: dict) -> Tuple[Set[str], Set[str]]:
    platforms = set()
    plans = set()
    
    props = product.get('Properties', {})
    
    # 1. 기본 AllowedPlatforms 확인
    allowed_raw = props.get('AllowedPlatforms', [])
    if not allowed_raw:
        allowed_raw = product.get('AllowedPlatforms', [])
    
    # 2. 🚨 [추가] SKU 내부의 조건 확인 (최상위 정보 누락 대비)
    if not allowed_raw:
        skus = product.get('DisplaySkuAvailabilities', [])
        for sku in skus:
            # SKU -> Availabilities -> Conditions -> ClientConditions -> AllowedPlatforms
            avails = sku.get('Availabilities', [])
            for avail in avails:
                conditions = avail.get('Conditions', {}).get('ClientConditions', {})
                sku_allowed = conditions.get('AllowedPlatforms')
                if sku_allowed:
                    allowed_raw.extend(sku_allowed)

    # 리스트 정리
    allowed_str = []
    for item in allowed_raw:
        if isinstance(item, dict): # 가끔 dict 형태로 올 때가 있음
            # { 'PlatformName': 'Windows.Desktop' } 형태 대비
            val = item.get('PlatformName') or item.get('Name')
            if val: allowed_str.append(str(val).lower())
        else:
            allowed_str.append(str(item).lower())
            
    # 중복 제거
    allowed_str = list(set(allowed_str))

    # --- 플랫폼 판별 ---
    is_pc = False
    is_console = False
    is_cloud = False

    # PC 판별
    if props.get('IsGamePassPC') or any(x in p for p in allowed_str for x in ['windows', 'desktop', 'pc']):
        is_pc = True
        platforms.add("PC")

    # Console 판별 (키워드 확장: gen9, gen8 등)
    console_keywords = ['xbox', 'console', 'durango', 'scarlett', 'gen9', 'gen8', 'one']
    if props.get('IsGamePassConsole') or any(x in p for p in allowed_str for x in console_keywords):
        is_console = True
        platforms.add("Console")

    # Cloud 판별
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

    # 🚨 [보정] 만약 플랫폼이 아무것도 감지되지 않았는데 Category가 'Game'이라면?
    # 보통 Console일 확률이 높지만, 데이터 오염 방지를 위해 'Unknown'으로 두거나
    # ProductTitle에 'Windows'가 없으면 Console로 추정하는 등 휴리스틱 적용 가능.
    # 여기서는 안전하게 최소한의 보정만 수행.
    if not platforms and product.get('ProductKind') == 'Game':
        # 아무 정보도 없으면 보통 구형 콘솔 게임일 수 있음
        pass

    # --- 요금제(Tier) 매핑 ---
    # 요청 사항: Essential, Premium, Ultimate, PC
    
    # 1. PC -> PC, Ultimate
    if is_pc:
        plans.add("PC")
        plans.add("Ultimate")

    # 2. Console -> Premium, Ultimate
    if is_console:
        plans.add("Premium")
        plans.add("Ultimate")

    # 3. Cloud -> Ultimate
    if is_cloud:
        plans.add("Ultimate")

    # 4. Essential (Core)
    # 명시적 플래그가 있거나, 'Gold' 관련 속성이 있는 경우
    if props.get('IsGamePassCore'):
        plans.add("Essential")

    # 5. 예외 처리: 아무 Plan도 없다면 (데이터 누락) -> Ultimate (가장 포괄적)
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
    
    image_url = None
    images = localized_props.get('Image', [])
    
    for img in images:
        if img.get('ImagePurpose') in ['BoxArt', 'Poster']:
            image_url = img.get('Url')
            if image_url and image_url.startswith('//'):
                image_url = f"https:{image_url}"
            break
        
        if not image_url and images:
            image_url = images[0].get('Url')
            if image_url and image_url.startswith('//'):
                image_url = f"https:{image_url}"
    
    safe_slug = url_slug if url_slug else "unknown"
    final_url = f"https://www.xbox.com/ko-KR/games/store/{safe_slug}/{product_id}"
    regular_price = get_ms_store_price(product)
    
    # 플랫폼 및 요금제 분석
    platforms, plans = analyze_platform_and_tier(product)
    
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
        "image_url": image_url,
        "price": regular_price,
        "platforms": platforms,
        "plans": plans,
        "is_day_one": is_day_one,
        "removal_date": removal_date
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
            existing['platforms'].update(raw['platforms']) # 플랫폼 합집합
            existing['plans'].update(raw['plans'])         # 요금제 합집합
            
            if raw['price'] > existing['price']:
                existing['price'] = raw['price']
            if raw['is_day_one']:
                existing['is_day_one'] = True
            if not existing['removal_date'] and raw['removal_date']:
                existing['removal_date'] = raw['removal_date']
                
            if not existing['image_url'] and raw['image_url']:
                existing['image_url'] = raw['image_url']

    final_list = []
    now_utc = datetime.now(timezone.utc)

    for title, data in merged_data.items():
        # 플랫폼 목록 생성
        sorted_platforms = sorted(list(data['platforms']))
        platform_str = ", ".join(sorted_platforms) if sorted_platforms else "Xbox"

        # 요금제 목록 생성
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
                "image_url": data['image_url'],
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

# --- 5. DB 저장 함수 ---
def save_xbox_deals(db: Session):
    product_ids = get_product_ids()
    if not product_ids:
        print("No products found.")
        return 0
        
    products_raw = fetch_xbox_details(product_ids)
    deals_structured = merge_xbox_deals(products_raw)
    
    print(f"Processing {len(deals_structured)} unique titles (Merged from {len(products_raw)} raw items)...")

    count_saved = 0
    count_updated = 0
    
    for data_set in deals_structured:
        core_deal = data_set["core_deal"]
        xbox_meta = data_set["xbox_meta"]
        
        try:
            existing_deal = db.query(Deal).filter(
                Deal.title == core_deal['title'],
                Deal.deal_type == "GamePass"
            ).first()

            if existing_deal:
                existing_deal.platform = core_deal['platform']
                existing_deal.regular_price = core_deal['regular_price']
                existing_deal.end_date = core_deal['end_date']
                existing_deal.is_active = core_deal['is_active']
                existing_deal.url = core_deal['url']
                
                existing_meta = db.query(XboxMetadata).filter_by(deal_id=existing_deal.id).first()
                if existing_meta:
                    existing_meta.game_pass_tier = xbox_meta['game_pass_tier']
                    existing_meta.is_day_one = xbox_meta['is_day_one']
                    existing_meta.removal_date = xbox_meta['removal_date']
                else:
                    new_meta = XboxMetadata(deal_id=existing_deal.id, **xbox_meta)
                    db.add(new_meta)
                count_updated += 1
            else:
                try:
                    new_deal = Deal(**core_deal)
                    db.add(new_deal)
                    db.flush()
                    new_meta = XboxMetadata(deal_id=new_deal.id, **xbox_meta)
                    db.add(new_meta)
                    count_saved += 1
                except Exception:
                    db.rollback()
                    continue

            db.commit()

        except Exception as e:
            db.rollback()
            print(f"🚨 DB ERROR ({core_deal.get('title')}): {e}")
            continue

    print(f"Xbox Crawler Summary: Added {count_saved} new titles, Updated {count_updated} existing titles.")
    return count_saved