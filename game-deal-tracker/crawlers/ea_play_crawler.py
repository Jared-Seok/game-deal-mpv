import sys
import os
import re
import time
from datetime import datetime, timezone
from typing import List, Dict, Set, Optional

from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright

# 부모 디렉터리를 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database import get_db_context
from db.models import Deal, EAPlayMetadata
from db.crud import upsert_deal

# === CONFIGURATION ===
EA_PLAY_URL = "https://gamescriptions.com/subscription/service/ea_pc"  # EA Play catalog
EA_PLAY_PRO_URL = "https://gamescriptions.com/subscription/service/ea_pc_pro"  # EA Play Pro catalog

# === PHASE 1: FETCH ===
def fetch_ea_play_data() -> List[dict]:
    """
    Fetch EA Play catalog data from web source using Playwright to handle dynamic content.
    """
    print("  - Fetching EA Play data from web sources...")
    games = fetch_from_gamescriptions()
    print(f"  - Found {len(games)} games from data source")
    return games

def fetch_from_gamescriptions() -> List[dict]:
    """
    Fetch data from gamescriptions.com, which aggregates EA Play info.
    Uses Playwright to render JavaScript-heavy pages.
    """
    games = []
    urls_to_scrape = {
        "EA Play": EA_PLAY_URL,
        "EA Play Pro": EA_PLAY_PRO_URL
    }

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        for tier, url in urls_to_scrape.items():
            try:
                print(f"  - Fetching {tier} games from {url}")
                page.goto(url, wait_until='networkidle', timeout=30000)
                
                # Wait for the table body to be present
                page.wait_for_selector('tbody', timeout=15000)

                content = page.content()
                soup = BeautifulSoup(content, 'lxml')

                # Find the table body
                tbody = soup.find('tbody')
                if not tbody:
                    print(f"  - Could not find 'tbody' section for {tier}")
                    continue

                # Extract game titles
                for row in tbody.find_all('tr'):
                    title_cell = row.find('a')
                    if title_cell:
                        title = title_cell.text.strip()
                        if title:
                            games.append({'title': title, 'tier': tier, 'source': 'gamescriptions'})

            except Exception as e:
                print(f"  - Error fetching or parsing {url}: {e}")

        browser.close()
    return games

# === PHASE 2: TRANSFORM ===
def extract_game_info(raw_game: dict) -> Optional[dict]:
    """
    Extract and structure game information
    """
    try:
        title = raw_game.get('title', '').strip()
        if not title:
            return None

        tier = determine_ea_play_tier(raw_game)
        game_url = f"https://www.ea.com/games/{title.lower().replace(' ', '-')}"
        image_url = raw_game.get('image_url') or None
        platform = raw_game.get('platform', 'PC')

        return {
            'title': title,
            'url': game_url,
            'image_url': image_url,
            'tiers': tier,
            'platform': platform,
            'removal_date': raw_game.get('removal_date')
        }
    except Exception as e:
        print(f"  - Error extracting game info: {e}")
        return None

def determine_ea_play_tier(raw_game: dict) -> Set[str]:
    """
    Determine which EA Play tier(s) include this game
    """
    tiers = set()
    tier_str = raw_game.get('tier', '').lower()

    if 'pro' in tier_str:
        tiers.add("EA Play Pro")
    else:
        tiers.add("EA Play")

    return tiers

# === PHASE 3: MERGE ===
def merge_ea_play_deals(games: List[dict]) -> List[dict]:
    """
    Merge games available in multiple tiers
    """
    merged = {}
    for game in games:
        if not game:
            continue
        title = game['title']
        if title not in merged:
            merged[title] = game.copy()
            merged[title]['tiers'] = set(game['tiers'])
        else:
            merged[title]['tiers'].update(game['tiers'])

    structured_deals = []
    for game in merged.values():
        tier_str = ", ".join(sorted(list(game['tiers'])))
        is_active = True  # Assuming all found games are active

        structured_deals.append({
            "deal_data": {
                "platform": "EA Play",
                "title": game['title'],
                "url": game['url'],
                "image_url": game['image_url'],
                "regular_price": 0.0,
                "sale_price": 0.0,
                "discount_rate": 100,
                "deal_type": "Subscription",
                "end_date": None,
                "is_active": is_active
            },
            "ea_play_meta": {
                "is_ea_play": True,
                "ea_play_tier": tier_str,
                "platform_availability": game['platform'],
                "removal_date": None
            }
        })
    return structured_deals

# === MAIN ENTRY POINT ===
def crawl_ea_play():
    """
    Main crawler function for EA Play games.
    """
    print("\n🎯 Starting EA Play Crawler...")
    
    raw_games = fetch_ea_play_data()
    if not raw_games:
        print("  - No EA Play games found. Stopping.")
        return 0

    extracted_games = [extract_game_info(game) for game in raw_games if game]
    if not extracted_games:
        print("  - No valid games after extraction. Stopping.")
        return 0
    
    print(f"  - Extracted {len(extracted_games)} valid games")
    
    structured_deals = merge_ea_play_deals(extracted_games)
    print(f"  - Created {len(structured_deals)} structured deals")

    added_count = 0
    updated_count = 0
    with get_db_context() as db:
        for item in structured_deals:
            try:
                unique_filters = {
                    "title": item["deal_data"]["title"],
                    "deal_type": "Subscription",
                    "platform": "EA Play"
                }
                result = upsert_deal(
                    db,
                    deal_data=item["deal_data"],
                    metadata_model=EAPlayMetadata,
                    metadata_data=item["ea_play_meta"],
                    unique_filters=unique_filters
                )
                if result == "created":
                    added_count += 1
                else:
                    updated_count += 1
            except Exception as e:
                db.rollback()
                print(f"⚠️ EA Play DB Error ({item['deal_data'].get('title', 'Unknown')}): {e}")
                continue
        db.commit()

    print(f"✅ EA Play Crawler Finished: Added {added_count}, Updated {updated_count}")
    return added_count

# === FOR TESTING ===
if __name__ == "__main__":
    crawl_ea_play()
