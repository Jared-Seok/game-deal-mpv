# game-deal-tracker/config/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.models import Base
from contextlib import contextmanager # 🚨 contextmanager를 임포트합니다.

# 데이터베이스 URL (환경에 맞게 사용자 이름/비밀번호 확인 필요)
DATABASE_URL = "postgresql://admin:@localhost:5432/game_deals_db"

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """테이블 생성"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables initialized successfully.")

@contextmanager
def get_db_context():
    """
    세션의 생명주기를 관리하는 Context Manager입니다.
    """
    db = SessionLocal()
    try:
        yield db
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()