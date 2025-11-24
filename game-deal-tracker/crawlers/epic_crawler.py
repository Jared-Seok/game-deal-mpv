# crawlers/epic_crawler.py

import requests
from datetime import datetime, timezone 
from sqlalchemy.orm import Session
from db.models import Deal, EpicMetadata 

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
                if deal_info and deal_info['is_active']: 
                    deals_list.append(deal_info)
                    
        return deals_list
        
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Epic Games API 요청 실패: {e}")
        return []

def extract_deal_info(element):
    """API 응답 요소에서 정확한 URL Slug와 정보를 추출합니다."""
    
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
    # 카테고리 정보를 확인하여 'bundles'인지 'p'(product)인지 결정
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
    
    # 가격 정보 내의 lineOffers에서도 프로모션 확인
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

    return {
        "platform": "Epic Games Store",
        "title": title,
        "url": final_url,  # 수정된 URL 사용
        "image_url": image_url,
        "regular_price": regular_price,
        "sale_price": 0.0,
        "discount_rate": 100,
        "deal_type": "Free",
        "end_date": end_date,
        "is_active": is_active_status,
        "meta_data": {
            "is_free_to_keep": True 
        }
    }

def save_epic_deals(db: Session):
    """수집된 Epic Deals를 저장합니다."""
    deals_data = fetch_epic_deals()
    count_saved = 0
    count_skipped = 0
    
    if not deals_data:
        print("No deals found from Epic Games API.")
        return 0

    for deal_data in deals_data:
        meta_data = deal_data.pop("meta_data")
        
        try:
            # 1. 중복 체크 (타이틀 기준 업데이트로 변경 - URL이 변경되었을 수 있으므로)
            # 기존에는 URL로 체크했으나, URL 로직이 바뀌었으므로 title + platform 조합으로 찾거나
            # URL이 업데이트되어야 하므로 일단 title로 찾는 것이 안전할 수 있음.
            # 하지만 가장 안전한 것은 기존 URL 체크 유지 + 신규 추가.
            # (기존 잘못된 URL 데이터는 삭제 권장)
            
            existing_deal = db.query(Deal).filter(
                Deal.platform == deal_data['platform'],
                Deal.title == deal_data['title'] # 타이틀로 비교하여 URL 업데이트 수행
            ).first()

            if existing_deal:
                # URL 및 정보 업데이트
                for key, value in deal_data.items():
                    setattr(existing_deal, key, value)
                
                existing_meta = db.query(EpicMetadata).filter_by(deal_id=existing_deal.id).first()
                if existing_meta:
                    for key, value in meta_data.items():
                        setattr(existing_meta, key, value)
                
                db.commit()
                count_skipped += 1
                print(f"DEBUG: Updated existing deal: {existing_deal.title}")

            else:
                new_deal = Deal(**deal_data)
                db.add(new_deal)
                db.flush()

                new_meta = EpicMetadata(deal_id=new_deal.id, **meta_data)
                db.add(new_meta)
                
                db.commit()
                count_saved += 1
                print(f"DEBUG: Successfully added new deal: {new_deal.title}")

        except Exception as e:
            db.rollback()
            print(f"🚨 CRITICAL DB ERROR during Epic Save ({deal_data.get('title', 'Unknown')}): {e}")

    print(f"Epic Crawler Summary: Added {count_saved}, Updated {count_skipped} deals.")
    return count_saved