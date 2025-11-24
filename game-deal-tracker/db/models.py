# game-deal-tracker/db/models.py

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

# --- 1. Core Deal Table (모든 플랫폼 공통 정보) ---
class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    url = Column(String, unique=True, nullable=False)
    regular_price = Column(Float)
    sale_price = Column(Float)
    discount_rate = Column(Integer)
    deal_type = Column(String, nullable=False)
    image_url = Column(String, nullable=True)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), index=True)
    
    # 🚨 플랫폼별 메타데이터와의 관계 설정 (1:1 관계)
    epic_meta = relationship("EpicMetadata", back_populates="deal", uselist=False)
    xbox_meta = relationship("XboxMetadata", back_populates="deal", uselist=False)
    steam_meta = relationship("SteamMetadata", back_populates="deal", uselist=False) 
    ubi_meta = relationship("UbisoftMetadata", back_populates="deal", uselist=False) 

    def __repr__(self):
        return f"<Deal(title='{self.title}', platform='{self.platform}')>"


# --- 2. 플랫폼별 메타데이터 테이블 ---

# 2-A. Epic Games Store Metadata (Epic 전용 정보)
class EpicMetadata(Base):
    __tablename__ = "epic_metadata"
    
    # Deal 테이블과 1:1 연결을 위한 Foreign Key
    deal_id = Column(Integer, ForeignKey('deals.id'), primary_key=True) 
    
    # 🚨 Epic 전용 필드 (현재는 딱히 없지만, 향후 있을 수 있는 필드를 위한 구조)
    is_free_to_keep = Column(Boolean, default=True) # 무료로 영구 소유 가능 여부
    
    # Deal 테이블로 돌아가는 관계 설정
    deal = relationship("Deal", back_populates="epic_meta")

    def __repr__(self):
        return f"<EpicMetadata(deal_id={self.deal_id}, is_free={self.is_free_to_keep})>"

# 2-B. Xbox Game Pass Metadata (Xbox 전용 정보)
class XboxMetadata(Base):
    __tablename__ = "xbox_metadata"
    
    deal_id = Column(Integer, ForeignKey('deals.id'), primary_key=True) 

    is_game_pass = Column(Boolean, default=False)
    is_day_one = Column(Boolean, default=False)
    game_pass_tier = Column(String, nullable=True) # PC, Console, Ultimate 등
    removal_date = Column(DateTime, nullable=True) # Game Pass에서 제외되는 날짜
    
    deal = relationship("Deal", back_populates="xbox_meta")

    def __repr__(self):
        return f"<XboxMetadata(deal_id={self.deal_id}, is_day_one={self.is_day_one})>"
    
    class SteamMetadata(Base):
        __tablename__ = "steam_metadata"
        deal_id = Column(Integer, ForeignKey('deals.id'), primary_key=True)
        steam_app_id = Column(Integer, nullable=True)
        review_summary = Column(String, nullable=True)
        positive_review_percent = Column(Integer, default=0)
        total_reviews = Column(Integer, default=0)
        deal = relationship("Deal", back_populates="steam_meta")
        
class UbisoftMetadata(Base):
    __tablename__ = "ubisoft_metadata"
    
    deal_id = Column(Integer, ForeignKey('deals.id'), primary_key=True)
    
    # 유비소프트 특화 정보
    is_freeplay = Column(Boolean, default=False)      # 체험판/주말무료 여부
    has_giveaway_badge = Column(Boolean, default=False) # 정식 배포 배지 유무
    
    deal = relationship("Deal", back_populates="ubi_meta")

    def __repr__(self):
        return f"<UbisoftMetadata(deal_id={self.deal_id}, giveaway={self.has_giveaway_badge})>"
        
# 🚨 참고: Steam, Ubisoft Metadata 테이블도 유사한 구조로 추가 예정