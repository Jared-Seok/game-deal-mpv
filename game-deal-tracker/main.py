import logging
from config.database import SessionLocal
# 기존 크롤러 파일에 정의된 함수들을 직접 임포트 (수정 불필요)
from crawlers.xbox_gamepass_crawler import save_xbox_deals
from crawlers.epic_crawler import save_epic_deals
# 새로 추가한 유비소프트 크롤러 (이전 단계에서 생성했다고 가정)
from crawlers.ubisoft_crawler import crawl_ubisoft

# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

def main():
    logger.info("--- 🚀 게임 딜 크롤러 시작 ---")
    
    # 데이터베이스 세션 생성
    db = SessionLocal()
    
    try:
        # 1. Xbox Game Pass 크롤링 (세션 전달 필요)
        logger.info("🎮 Xbox Game Pass 크롤링 시작...")
        try:
            save_xbox_deals(db)
            logger.info("✅ Xbox Game Pass 크롤링 완료")
        except Exception as e:
            logger.error(f"❌ Xbox Game Pass 크롤링 실패: {e}")

        # 2. Epic Games Store 무료 배포 크롤링 (세션 전달 필요)
        logger.info("🛒 Epic Games Store 크롤링 시작...")
        try:
            save_epic_deals(db)
            logger.info("✅ Epic Games Store 크롤링 완료")
        except Exception as e:
            logger.error(f"❌ Epic Games Store 크롤링 실패: {e}")

        # 3. Ubisoft Store 무료 배포 크롤링 (자체 세션 관리)
        # ubisoft_crawler.py는 내부에서 SessionLocal을 직접 호출하도록 작성되었으므로 db 인자 불필요
        logger.info("🌀 Ubisoft Store 크롤링 시작...")
        try:
            crawl_ubisoft() # 내부에서 세션 생성 및 관리
            logger.info("✅ Ubisoft Store 크롤링 완료")
        except Exception as e:
            logger.error(f"❌ Ubisoft Store 크롤링 실패: {e}")

    except Exception as e:
        logger.error(f"🚨 메인 프로세스 에러: {e}")
    
    finally:
        # 세션 종료 (리소스 해제)
        db.close()
        logger.info("--- 👋 모든 작업 완료 및 DB 세션 종료 ---")

if __name__ == "__main__":
    main()