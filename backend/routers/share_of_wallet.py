from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from database import get_db
from models import ShareOfWallet
from auth import get_current_user

router = APIRouter(prefix="/api/wallet", tags=["wallet"])

class ShareOfWalletCreate(BaseModel):
    customer_id: int
    product_category: str
    current_vendor: str
    quantity: Optional[str] = None
    current_price_thb: Optional[float] = 0
    contract_expiry_date: Optional[date] = None
    notes: Optional[str] = None

class ShareOfWalletUpdate(BaseModel):
    product_category: Optional[str] = None
    current_vendor: Optional[str] = None
    quantity: Optional[str] = None
    current_price_thb: Optional[float] = None
    contract_expiry_date: Optional[date] = None
    notes: Optional[str] = None

@router.get("/customer/{customer_id}")
def get_wallets(customer_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    items = db.query(ShareOfWallet).filter(ShareOfWallet.customer_id == customer_id).order_by(ShareOfWallet.id.desc()).all()
    return items

@router.post("/")
def create_wallet(item: ShareOfWalletCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    new_item = ShareOfWallet(
        customer_id=item.customer_id,
        product_category=item.product_category,
        current_vendor=item.current_vendor,
        quantity=item.quantity,
        current_price_thb=item.current_price_thb,
        contract_expiry_date=item.contract_expiry_date,
        notes=item.notes
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.put("/{id}")
def update_wallet(id: int, item: ShareOfWalletUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_item = db.query(ShareOfWallet).filter(ShareOfWallet.id == id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Not found")
        
    for key, value in item.dict(exclude_unset=True).items():
        setattr(db_item, key, value)
        
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{id}")
def delete_wallet(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    item = db.query(ShareOfWallet).filter(ShareOfWallet.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}
