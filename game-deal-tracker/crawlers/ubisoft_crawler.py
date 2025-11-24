# crawlers/ubisoft_crawler.py

import time
import logging
import re
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup
from config.database import get_db_context
from db.models import UbisoftMetadata
from db.crud import upsert_deal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_ubisoft_date(date_str):
    if not date_str:
        return None
    try:
        clean_date = date_str.replace(" GMT", "")
        return datetime.strptime(clean_date, "%a %b %d %H:%M:%S %Y")
    except Exception:
        return None

# 🚨 main.py가 임포트하는 함수 (진입점 함수)
def crawl_ubisoft():
    logger.info("🌀 Starting Ubisoft Crawler...")
    
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36")

    driver = webdriver.Chrome(options=options)
    deals_found = []

    try:
        url = "https://store.ubisoft.com/kr/free-games"
        driver.get(url)

        try:
            WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.CLASS_NAME, "product-tile"))
            )
        except Exception:
            logger.warning("⏳ 카드 요소 로딩 대기 시간 초과")

        last_height = driver.execute_script("return document.body.scrollHeight")
        for _ in range(3):
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        game_cards = soup.find_all("div", class_="product-tile")
        
        for card in game_cards:
            try:
                price_sales_tag = card.select_one(".price-sales")
                price_text = price_sales_tag.get_text(strip=True) if price_sales_tag else ""
                is_price_zero = False
                
                if price_text:
                    price_num_str = re.sub(r'[^\d.]', '', price_text)
                    try:
                        if price_num_str and float(price_num_str) == 0:
                            is_price_zero = True
                        elif "free" in price_text.lower() or "무료" in price_text:
                            is_price_zero = True
                    except ValueError:
                        pass

                availability_tag = card.select_one(".product-availability-label")
                if not availability_tag:
                    continue

                is_freeplay = availability_tag.get("data-freeplay") == "true"
                offer_end_str = availability_tag.get("data-freeofferenddate")
                offer_end_date = parse_ubisoft_date(offer_end_str)
                has_giveaway_badge = card.select_one(".card-label.giveaway") is not None

                is_valid_giveaway = False
                if has_giveaway_badge:
                    is_valid_giveaway = True
                elif is_price_zero and offer_end_date:
                    is_valid_giveaway = True
                
                if is_freeplay and not has_giveaway_badge:
                    is_valid_giveaway = False

                if not is_valid_giveaway:
                    continue

                title_tag = card.select_one(".prod-title")
                title = title_tag.get_text(strip=True) if title_tag else "Unknown"

                if any(x in title.lower() for x in ['demo', 'trial', '체험판']):
                    continue

                link_tag = card.select_one("a.thumb-link")
                game_url = link_tag['href'] if link_tag else ""
                if game_url and not game_url.startswith("http"):
                    game_url = "https://store.ubisoft.com" + game_url

                img_tag = card.select_one("img.product_image")
                image_url = None
                if img_tag:
                    image_url = img_tag.get('data-desktop-src') or img_tag.get('data-src') or img_tag.get('src')

                regular_price = 0.0
                std_price_tag = card.select_one(".price-standard .price-item")
                if std_price_tag:
                    try:
                        std_price_text = std_price_tag.get_text(strip=True)
                        regular_price = float(re.sub(r'[^\d.]', '', std_price_text))
                    except:
                        pass
                        
                # 데이터 구성
                deal_data = {
                    "platform": "Ubisoft",
                    "title": title,
                    "url": game_url,
                    "regular_price": regular_price,
                    "sale_price": 0,
                    "discount_rate": 100,
                    "deal_type": "Free",
                    "image_url": image_url,
                    "end_date": offer_end_date,
                    "is_active": True
                }
                meta_data = {
                    "is_freeplay": is_freeplay,
                    "has_giveaway_badge": has_giveaway_badge
                }
                deals_found.append({"deal": deal_data, "meta": meta_data})

            except Exception as e:
                logger.error(f"카드 처리 실패: {e}")
                continue

    except Exception as e:
        logger.error(f"❌ Ubisoft Crawl Error: {e}")
    finally:
        driver.quit()

    # DB 저장
    with get_db_context() as db:
        added, updated = 0, 0
        for item in deals_found:
            try:
                filters = {"title": item["deal"]["title"], "platform": "Ubisoft"}
                
                result = upsert_deal(
                    db,
                    deal_data=item["deal"],
                    metadata_model=UbisoftMetadata,
                    metadata_data=item["meta"],
                    unique_filters=filters
                )
                if result == "created": added += 1
                else: updated += 1
            except Exception as e:
                db.rollback() # 🚨 롤백을 명시적으로 호출하여 세션 상태를 복구
                logger.error(f"⚠️ Ubisoft Insert Error ({item['deal']['title']}): {e}")
                continue
                
        db.commit()
        logger.info(f"✅ Ubisoft Crawler Finished: Added {added}, Updated {updated}")

if __name__ == "__main__":
    crawl_ubisoft()