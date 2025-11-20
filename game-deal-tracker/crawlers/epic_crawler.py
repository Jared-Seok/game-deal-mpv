# crawlers/epic_crawler.py

import requests
from datetime import datetime, timezone 
from sqlalchemy.orm import Session
# 🚨 모델 변경: Deal과 EpicMetadata를 모두 가져옵니다.
from db.models import Deal, EpicMetadata 

# Epic Games Store의 GraphQL API 엔드포인트와 쿼리
EPIC_API_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
}

def fetch_epic_deals():
    """Epic Games Store API에서 현재 및 곧 출시될 무료 게임 정보를 가져옵니다."""
    # (API 호출 및 데이터 추출 로직은 유지. 상세 코드는 길이상 생략)
    # ... (생략: fetch_epic_deals 함수는 이전 최종 버전과 동일합니다)
    try:
        response = requests.get(EPIC_API_URL, headers=HEADERS)
        response.raise_for_status()
        data = response.json()
        
        elements = data.get('data', {}).get('Catalog', {}).get('searchStore', {}).get('elements', [])
        
        deals_list = []
    
        for element in elements:
            if element.get('price', {}).get('totalPrice', {}).get('discountPrice') == 0:
                
                deal_info = extract_deal_info(element)
                
                if deal_info and deal_info['is_active']: 
                    deals_list.append(deal_info)
                    
        return deals_list
        
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Epic Games API 요청 실패: {e}")
        return []

def extract_deal_info(element):
    """API 응답 요소에서 Deal 모델에 맞는 정보를 추출하고, 유효한 종료일을 찾습니다."""
    
    title = element.get('title')
    url_slug = element.get('productSlug')
    
    if not url_slug or url_slug.startswith('[]'):
        url_slug = element.get('urlSlug')
        
    if not url_slug or url_slug.startswith('[]'):
        mappings = element.get('offerMappings')
        if mappings and len(mappings) > 0:
             url_slug = mappings[0].get('pageSlug')

    if not url_slug or url_slug.startswith('[]'):
        return None
        
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
                
                if now_utc < end_date_utc:
                    end_date = end_date_utc
                    break
            except ValueError:
                continue

    regular_price = element.get('price', {}).get('totalPrice', {}).get('originalPrice') / 100
    
    is_active_status = False
    if end_date:
        is_active_status = now_utc < end_date

    
    return {
        # 🚨 [중요]: Core Deal 필드만 반환합니다.
        "platform": "Epic Games Store",
        "title": title,
        "url": f"https://store.epicgames.com/ko/p/{url_slug}",
        "regular_price": regular_price,
        "sale_price": 0.0,
        "discount_rate": 100,
        "deal_type": "Free",
        "end_date": end_date,
        "is_active": is_active_status,
        
        # 🚨 [메타데이터]: EpicMetadata에 저장할 정보도 함께 반환
        "meta_data": {
            "is_free_to_keep": True # Epic Games는 보통 영구 소장입니다.
        }
    }


def save_epic_deals(db: Session):
    """수집된 Epic Deals를 Core Deal 테이블 및 Epic Metadata 테이블에 저장합니다."""
    deals_data = fetch_epic_deals()
    count_saved = 0
    count_skipped = 0
    
    if not deals_data:
        print("No deals found from Epic Games API.")
        return 0

    for deal_data in deals_data:
        # Core Deal 데이터와 Meta Data를 분리
        meta_data = deal_data.pop("meta_data")
        
        try:
            # 1. 중복 체크 (Core Deal 기준)
            existing_deal = db.query(Deal).filter(
                Deal.platform == deal_data['platform'],
                Deal.url == deal_data['url']
            ).first()

            if existing_deal:
                # 2. 업데이트: Core Deal 업데이트 후 Meta Data도 업데이트
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
                # 3. 새로운 경우: Core Deal 저장 후 ID를 이용해 Meta Data 저장
                new_deal = Deal(**deal_data)
                db.add(new_deal)
                db.flush() # ID를 얻기 위해 강제 커밋

                new_meta = EpicMetadata(deal_id=new_deal.id, **meta_data)
                db.add(new_meta)
                
                db.commit()
                count_saved += 1
                print(f"DEBUG: Successfully added new deal: {new_deal.title}")

        except Exception as e:
            db.rollback()
            print(f"🚨 CRITICAL DB ERROR during Epic Save ({deal_data.get('title', 'Unknown')}): {e}")

    print(f"Epic Crawler Summary: Added {count_saved} new deals, Updated/Skipped {count_skipped} existing deals.")
    return count_saved