# db/crud.py (최신 버전 확인용)

from sqlalchemy.orm import Session
from db.models import Deal

def upsert_deal(db: Session, deal_data: dict, metadata_model, metadata_data: dict, unique_filters: dict = None):
    try:
        existing_deal = None
        
        # 1차 검색: 요청받은 필터(예: Title)로 검색
        if unique_filters:
            query = db.query(Deal)
            for attr, value in unique_filters.items():
                query = query.filter(getattr(Deal, attr) == value)
            existing_deal = query.first()

        # 2차 검색: 1차에서 못 찾았지만, URL이 이미 DB에 있다면 그것을 가져옴 (중복 방지)
        if not existing_deal:
            # URL이 필수 필드이므로 항상 체크 가능
            existing_deal = db.query(Deal).filter(Deal.url == deal_data['url']).first() 

        if existing_deal:
            # [Update] 로직...
            for key, value in deal_data.items():
                if hasattr(existing_deal, key):
                    setattr(existing_deal, key, value)
            
            existing_meta = db.query(metadata_model).filter(metadata_model.deal_id == existing_deal.id).first()
            
            if existing_meta:
                for key, value in metadata_data.items():
                    if hasattr(existing_meta, key):
                        setattr(existing_meta, key, value)
            else:
                new_meta = metadata_model(deal_id=existing_deal.id, **metadata_data)
                db.add(new_meta)
                
            return "updated"

        else:
            # [Insert] 로직...
            new_deal = Deal(**deal_data)
            db.add(new_deal)
            db.flush() 

            new_meta = metadata_model(deal_id=new_deal.id, **metadata_data)
            db.add(new_meta)
            
            return "created"

    except Exception as e:
        # DB 오류 발생 시 상위 컨텍스트(crawl_*)에서 rollback 처리
        raise e