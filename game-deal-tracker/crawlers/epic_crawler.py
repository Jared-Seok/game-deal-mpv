# crawlers/epic_crawler.py

import requests
from datetime import datetime, timezone 
from db.models import Deal
from sqlalchemy.orm import Session
from sqlalchemy import func

# Epic Games Store의 GraphQL API 엔드포인트와 쿼리
EPIC_API_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions"

# API 호출 시 필요한 헤더 (일반적인 웹 요청처럼 보이기 위함)
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
            # 1. 가격이 0인지 확인 (무료 또는 F2P)
            if element.get('price', {}).get('totalPrice', {}).get('discountPrice') == 0:
                
                # 복잡한 필터 제거. 가격이 0이면 무조건 추출 시도.
                deal_info = extract_deal_info(element)
                
                # 2. extract_deal_info에서 is_active로 판별된 딜만 추가
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
        return None
        
    end_date = None
    
    # API 응답 내 모든 잠재적인 프로모션 정보 그룹을 통합하여 순회
    promotions = element.get('promotions', {})
    current_promo_groups = promotions.get('promotionalOffers', [])
    line_offers = element.get('price', {}).get('lineOffers', [])
    
    all_offers_to_check = []
    
    # promotions 경로에서 추출
    for group in current_promo_groups:
        all_offers_to_check.extend(group.get('promotionalOffers', []))

    # lineOffers 경로에서 추출
    if line_offers and line_offers[0].get('appliedOffers'):
        all_offers_to_check.extend(line_offers[0]['appliedOffers'])

    # 유효한 (아직 끝나지 않은) 종료일 찾기
    now_utc = datetime.now(timezone.utc)
    
    for offer in all_offers_to_check:
        end_date_str = offer.get('endDate')
        if end_date_str:
            try:
                # 1. ISO 형식 문자열을 파싱합니다. 'Z'는 UTC를 의미하므로 +00:00으로 대체
                parsed_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
                
                # 2. 명시적으로 UTC 시간대 인식 객체로 변환합니다.
                end_date_utc = parsed_date.astimezone(timezone.utc)
                
                # 3. 현재 시간보다 미래인지 확인
                if now_utc < end_date_utc:
                    # 4. UTC-aware 객체를 저장하고 루프를 종료합니다.
                    end_date = end_date_utc
                    break
            except ValueError:
                # 날짜 파싱 오류가 발생하면 건너뜁니다.
                continue

    # 가격 정보 추출
    regular_price = element.get('price', {}).get('totalPrice', {}).get('originalPrice') / 100
    
    # 최종 is_active 상태 결정
    is_active_status = False
    if end_date:
        # end_date가 이미 UTC-aware 객체이므로 간단히 비교
        is_active_status = now_utc < end_date

    
    return {
        "platform": "Epic Games Store",
        "title": title,
        "url": f"https://store.epicgames.com/ko/p/{url_slug}",
        "regular_price": regular_price,
        "sale_price": 0.0,
        "discount_rate": 100,
        "deal_type": "Free",
        "end_date": end_date, # UTC-aware datetime 객체
        "is_active": is_active_status
    }

def save_epic_deals(db: Session):
    """수집된 Epic Deals를 데이터베이스에 저장하거나 업데이트합니다."""
    deals_data = fetch_epic_deals()
    count_saved = 0
    count_skipped = 0
    
    if not deals_data:
        print("No deals found from Epic Games API.")
        return 0

    for deal_data in deals_data:
        try:
            # 중복 체크: 동일한 플랫폼과 URL을 가진 딜이 있는지 확인
            existing_deal = db.query(Deal).filter(
                Deal.platform == deal_data['platform'],
                Deal.url == deal_data['url']
            ).first()

            if existing_deal:
                # 이미 존재하는 경우: UPDATE
                for key, value in deal_data.items():
                    setattr(existing_deal, key, value)
                db.commit()
                count_skipped += 1
                print(f"DEBUG: Updated existing deal: {deal_data['title']}")

            else:
                # 새로운 경우: ADD
                new_deal = Deal(**deal_data)
                db.add(new_deal)
                db.commit()
                count_saved += 1
                print(f"DEBUG: Successfully added new deal: {deal_data['title']}")

        except Exception as e:
            db.rollback()
            # 🚨 롤백 후 오류 내용을 출력하여 문제의 원인을 파악합니다.
            print(f"🚨 CRITICAL DB ERROR for deal {deal_data.get('title', 'Unknown')}: {e}")
            print(f"🚨 This deal was likely skipped due to a UNIQUE constraint violation (Duplicate URL or Title).")
            # 🚨 오류가 발생하면 이 딜은 추가되지 못하고 넘어갑니다.

    print(f"Epic Crawler Summary: Added {count_saved} new deals, Updated/Skipped {count_skipped} existing deals.")
    return count_saved
    """수집된 Epic Deals를 데이터베이스에 저장하거나 업데이트합니다."""
    deals_data = fetch_epic_deals()
    count_saved = 0
    count_skipped = 0
    
    if not deals_data:
        print("No deals found from Epic Games API.")
        return 0

    for deal_data in deals_data:
        # 중복 체크: 동일한 플랫폼과 URL을 가진 딜이 있는지 확인
        existing_deal = db.query(Deal).filter(
            Deal.platform == deal_data['platform'],
            Deal.url == deal_data['url']
        ).first()

        if existing_deal:
            # 이미 존재하는 딜은 정보(예: 종료일)만 업데이트
            for key, value in deal_data.items():
                setattr(existing_deal, key, value)
            db.commit()
            count_skipped += 1
        else:
            # 새 딜은 추가
            new_deal = Deal(**deal_data)
            db.add(new_deal)
            db.commit()
            count_saved += 1
            
    print(f"Epic Crawler Summary: Added {count_saved} new deals, Updated/Skipped {count_skipped} existing deals.")
    return count_saved