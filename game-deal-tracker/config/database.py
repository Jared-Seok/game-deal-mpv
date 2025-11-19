from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db.models import Base

DATABASE_URL = "postgresql://admin:@localhost:5432/game_deals_db"

engine = create_engine(
    DATABASE_URL,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()
        
def init_db():
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized successfully.")