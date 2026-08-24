from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from database import get_db
from models import Opportunity
from auth import get_current_user

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])

class OpportunityCreate(BaseModel):
    customer_id: int
    deal_name: str
    product_category: str
    est_deal_value_thb: Optional[float] = 0
    stage: str
    confidence_percent: Optional[int] = 0
    expected_close_date: Optional[date] = None

class OpportunityUpdate(BaseModel):
    deal_name: Optional[str] = None
    product_category: Optional[str] = None
    est_deal_value_thb: Optional[float] = None
    stage: Optional[str] = None
    confidence_percent: Optional[int] = None
    expected_close_date: Optional[date] = None

@router.get("/customer/{customer_id}")
def get_opportunities(customer_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    items = db.query(Opportunity).filter(Opportunity.customer_id == customer_id).order_by(Opportunity.id.desc()).all()
    result = []
    for i in items:
        result.append({
            "id": i.id,
            "customer_id": i.customer_id,
            "user_id": i.user_id,
            "user_name": i.user.full_name if i.user else "Unknown",
            "deal_name": i.deal_name,
            "product_category": i.product_category,
            "est_deal_value_thb": i.est_deal_value_thb,
            "stage": i.stage,
            "confidence_percent": i.confidence_percent,
            "expected_close_date": i.expected_close_date
        })
    return result

@router.post("/")
def create_opportunity(item: OpportunityCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    new_item = Opportunity(
        customer_id=item.customer_id,
        user_id=current_user["id"],
        deal_name=item.deal_name,
        product_category=item.product_category,
        est_deal_value_thb=item.est_deal_value_thb,
        stage=item.stage,
        confidence_percent=item.confidence_percent,
        expected_close_date=item.expected_close_date
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{id}")
def update_opportunity(id: int, item: OpportunityUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_item = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Not found")
        
    for key, value in item.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{id}")
def delete_opportunity(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    item = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}
