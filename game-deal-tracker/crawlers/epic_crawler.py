# crawlers/epic_crawler.py

import requests
from datetime import datetime, timezone 
# 🚨 [수정] Session은 더 이상 필요 없으며, 공통 모듈 임포트로 대체
from db.models import Deal, EpicMetadata 
from config.database import get_db_context # <- 필수 임포트
from db.crud import upsert_deal           # <- 필수 임포트

# Epic Games Store의 GraphQL API 엔드포인트
EPIC_API_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
}

def fetch_epic_deals():
    """Epic Games Store API에서 현재 및 곧 출시될 무료 게임 정보를 가져옵니다."""
    try:
        response = requests.get(EPIC_API_URL, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        
        elements = data.get('data', {}).get('Catalog', {}).get('searchStore', {}).get('elements', [])
        
        deals_list = []
    
        for element in elements:
            # 할인 가격이 0원인 경우만 추출
            if element.get('price', {}).get('totalPrice', {}).get('discountPrice') == 0:
                deal_info = extract_deal_info(element)
                # [Fix] extract_deal_info가 이제 dict를 리턴하므로 key 접근 수정
                if deal_info and deal_info['deal_data']['is_active']: 
                    deals_list.append(deal_info)
                    
        return deals_list
        
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Epic Games API 요청 실패: {e}")
        return []

def extract_deal_info(element):
    """API 응답 요소에서 정확한 URL Slug와 정보를 추출하고, deal_data와 meta_data로 분리합니다."""
    
    title = element.get('title')
    
    # --- 1. URL Slug 추출 로직 개선 ---
    url_slug = None
    
    # 우선순위 1: offerMappings (스토어 페이지 매핑)
    offer_mappings = element.get('offerMappings', [])
    if offer_mappings and len(offer_mappings) > 0:
        for mapping in offer_mappings:
            if mapping.get('pageType') == 'productHome':
                url_slug = mapping.get('pageSlug')
                break
    
    # 우선순위 2: customAttributes (프로모션용 Slug)
    if not url_slug:
        for attr in element.get('customAttributes', []):
            if attr.get('key') == 'com.epicgames.app.productSlug':
                url_slug = attr.get('value')
                break

    # 우선순위 3: 기본 productSlug 또는 urlSlug
    if not url_slug:
        url_slug = element.get('productSlug') or element.get('urlSlug')

    # Slug가 유효하지 않으면 건너뜀
    if not url_slug or url_slug == '[]':
        return None

    # --- 2. URL 타입 결정 (일반 게임 vs 번들) ---
    url_type = "p" # 기본값
    categories = element.get('categories', [])
    for cat in categories:
        if 'bundles' in cat.get('path', '').lower():
            url_type = "bundles"
            break
            
    final_url = f"https://store.epicgames.com/ko/{url_type}/{url_slug}"

    # --- 3. 이미지 추출 ---
    image_url = None
    key_images = element.get('keyImages', [])
    
    # 썸네일 우선, 없으면 와이드 이미지
    for img in key_images:
        if img.get('type') == 'Thumbnail':
            image_url = img.get('url')
            break
    if not image_url:
        for img in key_images:
            if img.get('type') == 'OfferImageWide':
                image_url = img.get('url')
                break
    # 그래도 없으면 첫 번째 이미지 사용
    if not image_url and key_images:
        image_url = key_images[0].get('url')
        
    # --- 4. 날짜 및 유효성 체크 ---
    end_date = None
    promotions = element.get('promotions', {})
    current_promo_groups = promotions.get('promotionalOffers', []) if promotions else []
    line_offers = element.get('price', {}).get('lineOffers', [])
    
    all_offers_to_check = []
    if current_promo_groups:
        for group in current_promo_groups:
            all_offers_to_check.extend(group.get('promotionalOffers', []))
    if line_offers and line_offers[0].get('appliedOffers'):
        all_offers_to_check.extend(line_offers[0]['appliedOffers'])

    now_utc = datetime.now(timezone.utc)
    
    for offer in all_offers_to_check:
        end_date_str = offer.get('endDate')
        if end_date_str:
            try:
                parsed_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
                end_date_utc = parsed_date.astimezone(timezone.utc)
                
                # 현재 시간보다 미래에 끝나는 프로모션만 유효
                if now_utc < end_date_utc:
                    end_date = end_date_utc
                    break
            except ValueError:
                continue

    regular_price = element.get('price', {}).get('totalPrice', {}).get('originalPrice') / 100 if element.get('price') else 0
    
    is_active_status = False
    if end_date:
        is_active_status = now_utc < end_date

    # 🚨 [수정 3] 반환 형식을 Deal 데이터와 Meta 데이터로 명확히 분리하여 반환합니다.
    return {
        "deal_data": {
            "platform": "Epic Games Store",
            "title": title,
            "url": final_url,
            "image_url": image_url,
            "regular_price": regular_price,
            "sale_price": 0.0,
            "discount_rate": 100,
            "deal_type": "Free",
            "end_date": end_date,
            "is_active": is_active_status,
        },
        "meta_data": {
            "is_free_to_keep": True 
        }
    }

# 🚨 [수정 4] 원래 코드를 유지하면서 save_epic_deals 함수를 삭제하지 않고, crawl_epic 함수가 DB 저장을 담당하도록 변경합니다.
# 사용자가 제공한 코드 전문을 보면, save_epic_deals 함수와 crawl_epic 함수가 모두 존재하며, crawl_epic 함수가 새로운 DB 로직을 사용하려고 합니다.
# 기존 로직을 최대한 유지하면서 새로운 crawl_epic을 작동시키기 위해, 기존 save_epic_deals는 주석 처리하거나 삭제하는 것이 논리적입니다.
# 여기서는 기존 save_epic_deals 함수를 삭제하고 crawl_epic이 DB를 처리하도록 통합합니다.
# (원래 save_epic_deals는 Session을 인자로 받지만, 새로운 구조는 SessionLocal을 사용하므로 호환성이 없음)

# def save_epic_deals(db: Session):
#     """기존 DB 저장 로직 (삭제 또는 주석 처리 권장)"""
#     ... (삭제) ...

# 🚨 [수정 5] main.py가 임포트하는 최종 진입점 함수 (DB 로직 통합)
# 이 함수가 새로운 upsert_deal 로직을 사용하여 DB에 저장합니다.
def crawl_epic():
    print("🎮 Starting Epic Games Crawler...")
    deals_structured = fetch_epic_deals()
    
    if not deals_structured:
        print("   - No deals found.")
        return

    # 🚨 get_db_context를 사용하여 안전하게 세션 관리
    with get_db_context() as db:
        added, updated = 0, 0
        for item in deals_structured:
            try:
                filters = {
                    "platform": "Epic Games Store",
                    "title": item["deal_data"]["title"] # 타이틀로 중복 체크
                }
                
                result = upsert_deal(
                    db, 
                    deal_data=item["deal_data"], 
                    metadata_model=EpicMetadata, 
                    metadata_data=item["meta_data"],
                    unique_filters=filters
                )
                if result == "created": added += 1
                else: updated += 1
            except Exception as e:
                # DB 오류 발생 시 롤백 (세션 복구) 후 다음 항목 진행
                db.rollback() 
                print(f"⚠️ Epic Insert Error ({item['deal_data'].get('title', 'Unknown')}): {e}")
                continue
        
        db.commit()
        print(f"✅ Epic Crawler Finished: Added {added}, Updated {updated}")

if __name__ == "__main__":
    crawl_epic()