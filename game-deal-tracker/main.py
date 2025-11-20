# main.py
from config.database import init_db, get_db
from crawlers.epic_crawler import save_epic_deals
from crawlers.xbox_gamepass_crawler import save_xbox_deals 

if __name__ == "__main__":
    print("--- Game Deal Crawler Service Initialization ---")
    
    # 1. 데이터베이스 초기화 및 테이블 생성
    # 🚨 모델 변경 후에는 기존 테이블을 지우고 실행해야 합니다. (DROP TABLE deals; DROP TABLE xbox_metadata;)
    try:
        init_db() 
    except Exception as e:
        print(f"FATAL ERROR: Database connection failed. Check your PostgreSQL settings.")
        print(f"Detail: {e}")
        exit(1)
    
    # --- Epic Games Crawler 실행 ---
    print("\n--- Starting Epic Games Crawler ---")
    db_generator = get_db()
    db = next(db_generator) 
    
    try:
        save_epic_deals(db)
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR during Epic Crawling: {e}")
        db.rollback()
    finally:
        db_generator.close()
    
    # 🚨 Xbox Crawler 실행 블록 추가 🚨
    print("\n--- Starting Xbox Crawler ---")
    db_generator = get_db()
    db = next(db_generator) 
    
    try:
        save_xbox_deals(db)
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR during Xbox Crawling: {e}")
        db.rollback()
    finally:
        db_generator.close()
    
    print("\n--- Crawler execution finished. ---")