from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Deal(Base):
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    platform = Column(String, index=True, nullable=False)
    title = Column(String, index=True, nullable=False)
    url= Column(String, unique=True, nullable=False)
    regular_price = Column(Float)
    sale_price = Column(Float)
    discount_rate = Column(Integer)
    deal_type = Column(String, nullable=False)
    end_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    def __repr__(self):
        return f"<Deal(title='{self.title}', platform='{self.platform}')>"
    