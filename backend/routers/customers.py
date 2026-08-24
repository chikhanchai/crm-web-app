from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_
from database import get_db
from models import Customer
from auth import get_current_user

router = APIRouter()

def row2dict(row):
    return {col.name: getattr(row, col.name) for col in row.__table__.columns}

@router.get("/")
def get_customers(
    search: str = None, 
    industry: str = None,
    bu: str = None,
    ae: str = None,
    skip: int = Query(0, ge=0), 
    limit: int = Query(2000, ge=1, le=5000), 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    query = db.query(Customer)
    
    # 1. RBAC Filtering
    role = current_user.get("role")
    if role == "AE":
        query = query.filter(Customer.ACCOUNT_OWNER == current_user.get("full_name"))
    elif role == "BU":
        query = query.filter(Customer.CURR_BU == current_user.get("bu_name"))
    elif role == "Admin":
        pass 
    
    # 2. Search & Filter
    if search:
        query = query.filter(Customer.CUSTOMER_NAME.ilike(f"%{search}%"))
    if industry and industry != "All":
        query = query.filter(Customer.INDUSTRY_SEGMENT == industry)
    
    # Custom Dropdown Filters
    if bu and bu != "All":
        # Only allow filtering by BU if Admin
        if role == "Admin":
            query = query.filter(Customer.CURR_BU == bu)
            
    if ae and ae != "All":
        # Allow filtering by AE if Admin or BU (BU can only see their own AEs anyway due to RBAC)
        if role in ["Admin", "BU"]:
            query = query.filter(Customer.ACCOUNT_OWNER == ae)
        
    total = query.count()
    customers = query.offset(skip).limit(limit).all()
        
    return {"total": total, "data": [row2dict(c) for c in customers]}

@router.get("/industries")
def get_industries(db: Session = Depends(get_db)):
    rows = db.query(Customer.INDUSTRY_SEGMENT).distinct().all()
    industries = [r[0] for r in rows if r[0] and str(r[0]).strip() not in ('-', 'None', '')]
    return sorted(industries)

@router.get("/bus")
def get_bus(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    # Only Admin needs to see all BUs
    if current_user.get("role") != "Admin":
        return []
    rows = db.query(Customer.CURR_BU).distinct().all()
    bus = [r[0] for r in rows if r[0] and str(r[0]).strip() not in ('-', 'None', '')]
    return sorted(bus)

@router.get("/aes")
def get_aes(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    query = db.query(Customer.ACCOUNT_OWNER).distinct()
    
    role = current_user.get("role")
    if role == "BU":
        query = query.filter(Customer.CURR_BU == current_user.get("bu_name"))
    elif role == "AE":
        return [] # AE doesn't need this filter
        
    rows = query.all()
    aes = [r[0] for r in rows if r[0] and str(r[0]).strip() not in ('-', 'None', '')]
    return sorted(aes)

@router.get("/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    role = current_user.get("role")
    if role == "AE" and getattr(customer, "ACCOUNT_OWNER") != current_user.get("full_name"):
        raise HTTPException(status_code=403, detail="Not authorized to view this customer")
    if role == "BU" and getattr(customer, "CURR_BU") != current_user.get("bu_name"):
        raise HTTPException(status_code=403, detail="Not authorized to view this customer")
        
    return row2dict(customer)
    
@router.put("/{customer_id}")
def update_customer(customer_id: int, update_data: dict, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    role = current_user.get("role")
    if role == "AE" and getattr(customer, "ACCOUNT_OWNER") != current_user.get("full_name"):
        raise HTTPException(status_code=403, detail="Not authorized to edit this customer")
    if role == "BU" and getattr(customer, "CURR_BU") != current_user.get("bu_name"):
        raise HTTPException(status_code=403, detail="Not authorized to edit this customer")

    for key, value in update_data.items():
        if hasattr(customer, key) and key != "id":
            setattr(customer, key, value)
            
    db.commit()
    return {"message": "Customer updated successfully in Cloud Database"}
