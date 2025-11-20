# reset_db.py
import sys
import os

# 프로젝트 루트 경로를 sys.path에 추가하여 모듈 인식
sys.path.append(os.getcwd())

from config.database import engine
from db.models import Base, Deal, XboxMetadata, EpicMetadata

def reset_database():
    print("⚠️  데이터베이스 초기화를 시작합니다...")
    
    # 1. 모든 테이블 삭제 (의존성 순서 자동 처리)
    # deals, xbox_metadata, epic_metadata 등 모든 테이블이 삭제됩니다.
    Base.metadata.drop_all(bind=engine)
    print("✅  기존 테이블 삭제 완료")

    # 2. 모든 테이블 재생성
    Base.metadata.create_all(bind=engine)
    print("✅  새 테이블 생성 완료")
    
    print("🎉  데이터베이스가 성공적으로 초기화되었습니다.")

if __name__ == "__main__":
    # 실수 방지를 위한 확인 절차
    confirm = input("정말 모든 데이터를 삭제하고 DB를 초기화하시겠습니까? (y/n): ")
    if confirm.lower() == 'y':
        reset_database()
    else:
        print("❌  초기화가 취소되었습니다.")