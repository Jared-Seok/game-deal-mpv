# crawlers/debug_gamepass.py

import requests
import json
from typing import List

# 🚨 1단계 API: Game Pass ID 목록 가져오기 (전체 카탈로그 ID)
XBOX_ID_URL = "https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=ko-kr&market=KR"
# 🚨 2단계 API: 상세 정보 가져오기
XBOX_DETAIL_URL = "https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds={ids}&market=KR&languages=ko-kr"

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json',
}

# --- 1단계: ID 목록 가져오기 (오류 방지 로직 포함) ---
def get_product_ids() -> List[str]:
    """1단계: Game Pass 카탈로그의 모든 제품 ID를 가져옵니다."""
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
        
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Xbox ID 목록 요청 실패: {e}")
        return []
    except Exception as e:
        print(f"ERROR during ID list processing: {e}")
        return []


# --- 2단계: 상세 정보 가져오기 ---
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
            
    return details_list

# --- 3단계: 데이터 추출 및 디버깅 로직 (핵심) ---
def analyze_data(products: List[dict]):
    total_products = len(products)
    skipped_count = 0
    saved_count = 0
    
    print(f"\n--- Total Products Fetched: {total_products} ---")

    for product in products:
        product_id = product.get('ProductId')
        
        # LocalizedProperties 안전하게 추출
        localized_props = product.get('LocalizedProperties')
        localized_props = localized_props[0] if localized_props and isinstance(localized_props, list) else {}

        title = localized_props.get('ProductTitle')
        
        # 🚨 [핵심 디버그 로직] 스킵된 이유를 출력합니다.
        if not title:
            skipped_count += 1
            print(f"❌ SKIP: Product ID {product_id} (Reason: Missing ProductTitle)")
            continue
        
        if not product_id:
            skipped_count += 1
            print(f"❌ SKIP: Title '{title}' (Reason: Missing Product ID)")
            continue
            
        # 이 단계에 도달한 제품은 저장 가능한 제품입니다.
        saved_count += 1
        print(f"✅ PASS: Title '{title}' (ID: {product_id})")


    print("\n--- Summary ---")
    print(f"Attempted to process: {total_products}")
    print(f"Successfully passed checks (Should be saved): {saved_count}")
    print(f"Skipped due to missing metadata: {skipped_count}")


if __name__ == '__main__':
    # DB 저장 없이 API 호출 및 분석만 수행
    product_ids = get_product_ids()
    
    if not product_ids:
        print("FATAL: Could not retrieve any product IDs. Check API URL.")
    else:
        print(f"Successfully retrieved {len(product_ids)} product IDs.")
        products = fetch_xbox_details(product_ids)
        analyze_data(products)