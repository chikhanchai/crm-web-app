from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime
from database import get_db
from models import Interaction, Customer
from auth import get_current_user

router = APIRouter(prefix="/api/interactions", tags=["interactions"])

class InteractionCreate(BaseModel):
    customer_id: int
    interaction_date: datetime
    interaction_type: str
    notes: Optional[str] = None
    next_action: Optional[str] = None
    next_action_date: Optional[date] = None

class InteractionUpdate(BaseModel):
    interaction_date: Optional[datetime] = None
    interaction_type: Optional[str] = None
    notes: Optional[str] = None
    next_action: Optional[str] = None
    next_action_date: Optional[date] = None

@router.get("/customer/{customer_id}")
def get_interactions(customer_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Simple RBAC check could be added here
    interactions = db.query(Interaction).filter(Interaction.customer_id == customer_id).order_by(Interaction.interaction_date.desc()).all()
    # Join with User to get creator name if needed, but for simplicity returning as is
    result = []
    for i in interactions:
        result.append({
            "id": i.id,
            "customer_id": i.customer_id,
            "user_id": i.user_id,
            "user_name": i.user.full_name if i.user else "Unknown",
            "interaction_date": i.interaction_date,
            "interaction_type": i.interaction_type,
            "notes": i.notes,
            "next_action": i.next_action,
            "next_action_date": i.next_action_date
        })
    return result

@router.post("/")
def create_interaction(item: InteractionCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    new_item = Interaction(
        customer_id=item.customer_id,
        user_id=current_user["id"],
        interaction_date=item.interaction_date,
        interaction_type=item.interaction_type,
        notes=item.notes,
        next_action=item.next_action,
        next_action_date=item.next_action_date
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{id}")
def delete_interaction(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    item = db.query(Interaction).filter(Interaction.id == id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Not found")
    if current_user["role"] != "Admin" and item.user_id != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this interaction")
    
    db.delete(item)
    db.commit()
    return {"message": "Deleted successfully"}
