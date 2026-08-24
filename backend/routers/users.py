from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from database import get_db
from models import User
from auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["users"])

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str
    role: str
    bu_name: Optional[str] = None

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = None
    bu_name: Optional[str] = None

def check_admin(current_user: dict):
    if current_user.get("role") != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized. Admins only.")

@router.get("/")
def get_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    check_admin(current_user)
    users = db.query(User).all()
    # Exclude passwords in response
    return [{"id": u.id, "username": u.username, "full_name": u.full_name, "role": u.role, "bu_name": u.bu_name} for u in users]

@router.post("/")
def create_user(user_in: UserCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    check_admin(current_user)
    
    # Check if username exists
    existing = db.query(User).filter(User.username == user_in.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
        
    new_user = User(
        username=user_in.username,
        password=user_in.password,
        full_name=user_in.full_name,
        role=user_in.role,
        bu_name=user_in.bu_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully"}

@router.put("/{user_id}")
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    check_admin(current_user)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_in.username:
        # Check uniqueness if username changed
        if user_in.username != user.username:
            existing = db.query(User).filter(User.username == user_in.username).first()
            if existing:
                raise HTTPException(status_code=400, detail="Username already exists")
        user.username = user_in.username
        
    if user_in.password: # Only update if not empty
        user.password = user_in.password
        
    if user_in.full_name is not None:
        user.full_name = user_in.full_name
    if user_in.role is not None:
        user.role = user_in.role
    if user_in.bu_name is not None:
        user.bu_name = user_in.bu_name
        
    db.commit()
    return {"message": "User updated successfully"}

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    check_admin(current_user)
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.username == current_user.get("username"):
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
        
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
