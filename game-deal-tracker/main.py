# main.py
from config.database import init_db, get_db
from crawlers.epic_crawler import save_epic_deals

if __name__ == "__main__":
    print("--- Game Deal Crawler Service Initialization ---")
    
    # 1. 데이터베이스 초기화 및 테이블 생성
    try:
        init_db()
    except Exception as e:
        print(f"FATAL ERROR: Database connection failed. Check your PostgreSQL settings.")
        print(f"Detail: {e}")
        exit(1) # DB 연결 실패 시 프로그램 종료
    
    print("\n--- Starting Epic Games Crawler ---")
    
    # 2. DB 세션을 얻어 크롤러 함수 실행
    # get_db() 제너레이터에서 세션을 얻는 표준 방식
    db_generator = get_db()
    db = next(db_generator) 
    
    try:
        # 크롤러 실행 및 데이터베이스 저장
        count = save_epic_deals(db)
        print(f"\n✅ Total Epic Deals processed: {count} new deals added.")
        
    except Exception as e:
        print(f"\n❌ CRITICAL ERROR during Epic Crawling: {e}")
        db.rollback()
    finally:
        # 세션 닫기
        db_generator.close()
    
    print("\n--- Crawler execution finished. ---")