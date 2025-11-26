# game-deal-tracker/main.py

import schedule
import time
from config.database import engine
from db.models import Base
from crawlers.xbox_gamepass_crawler import crawl_xbox_gamepass
from crawlers.epic_crawler import crawl_epic
from crawlers.ubisoft_crawler import crawl_ubisoft
from crawlers.steam_crawler import crawl_steam  # [Mod] 스팀 크롤러 임포트
from crawlers.ea_play_crawler import crawl_ea_play  # [Mod] EA Play 크롤러 임포트

def init_db():
    print("📦 Initializing Database...")
    # [Mod] Base.metadata.create_all(bind=engine)을 실행하여 새로운 테이블들을 생성합니다.
    Base.metadata.create_all(bind=engine)
    print("✅ Database Tables Created.")

def run_all_crawlers():
    print("\n🚀 Starting All Crawlers...")

    # 1. Xbox Game Pass
    crawl_xbox_gamepass()

    # 2. Epic Games Free
    crawl_epic()

    # 3. Ubisoft Free
    crawl_ubisoft()

    # 4. [Mod] Steam Sales (할인 정보)
    crawl_steam()

    # 5. [Mod] EA Play Subscription (구독 서비스)
    crawl_ea_play()

    print("✅ All crawling tasks finished.\n")

def main():
    init_db()
    
    # 앱 시작 시 1회 즉시 실행
    run_all_crawlers()
    
    # 스케줄 설정 (예: 6시간마다)
    schedule.every(6).hours.do(run_all_crawlers)
    
    print("🕒 Scheduler started. Waiting for next job...")
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == "__main__":
    main()