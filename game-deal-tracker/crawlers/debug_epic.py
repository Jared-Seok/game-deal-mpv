# crawlers/debug_epic.py

import requests
import json

EPIC_API_URL = "https://store-site-backend-static-ipv4.ak.epicgames.com/freeGamesPromotions"
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
}

# crawlers/debug_epic.py

# ... (상단 import 및 HEADERS 정의 유지)

# crawlers/debug_epic.py 파일 내 analyze_epic_response 함수를 다음으로 대체

def analyze_epic_response():
    try:
        response = requests.get(EPIC_API_URL, headers=HEADERS)
        response.raise_for_status() 
        data = response.json()
        
        elements = data.get('data', {}).get('Catalog', {}).get('searchStore', {}).get('elements', [])
        
        if not elements:
            print("❌ ERROR: 'elements' 리스트를 찾지 못했습니다.")
            return
            
        print(f"--- Total Elements Found: {len(elements)} ---")
        
        free_game_count = 0
        
        for element in elements:
            title = element.get('title', 'Unknown Title')
            
            discount_price = element.get('price', {}).get('totalPrice', {}).get('discountPrice')
            
            if discount_price == 0:
                free_game_count += 1
                
                # 🚨 extract_deal_info 함수는 이 파일에 없으므로, 핵심 정보만 직접 추출합니다.
                
                # 1. Promotions 경로 검사
                promotions = element.get('promotions')
                
                end_date_from_promo = 'N/A'
                if promotions and promotions.get('promotionalOffers'):
                    offer_group = promotions['promotionalOffers'][0]
                    if offer_group.get('promotionalOffers'):
                        end_date_from_promo = offer_group['promotionalOffers'][0].get('endDate')
                
                # 2. LineOffers 경로 검사
                end_date_from_line = 'N/A'
                line_offers = element.get('price', {}).get('lineOffers')
                if line_offers and line_offers[0].get('appliedOffers'):
                    end_date_from_line = line_offers[0]['appliedOffers'][0].get('endDate')


                print("-" * 50)
                print(f"[{free_game_count}] Title: {title}")
                print(f"  > PROMOTIONS END DATE: {end_date_from_promo}")
                print(f"  > LINEOFFERS END DATE: {end_date_from_line}")
                
        print("-" * 50)

    except requests.exceptions.RequestException as e:
        print(f"ERROR: Epic Games API 요청 실패: {e}")
        
if __name__ == '__main__':
    analyze_epic_response()