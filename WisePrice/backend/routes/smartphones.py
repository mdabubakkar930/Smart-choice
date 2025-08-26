from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Response
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from pydantic import BaseModel
from typing import List, Optional
import pandas as pd
import io
from datetime import datetime

from db import get_db
from models import Smartphone, User
from utils import get_current_user, import_smartphones_from_csv, export_smartphones_to_csv

router = APIRouter()

class SmartphoneBase(BaseModel):
    brand: str
    model_name: str
    price: float
    ram: int
    storage: int
    battery: int
    rating: float

class SmartphoneCreate(SmartphoneBase):
    pass

class SmartphoneUpdate(SmartphoneBase):
    pass

class SmartphoneResponse(SmartphoneBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class SmartphoneFilter(BaseModel):
    search: Optional[str] = None
    brand: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_ram: Optional[int] = None
    max_ram: Optional[int] = None
    min_storage: Optional[int] = None
    max_storage: Optional[int] = None
    min_rating: Optional[float] = None
    max_rating: Optional[float] = None
    sort_by: Optional[str] = "created_at"
    sort_order: Optional[str] = "desc"

@router.get("/", response_model=List[SmartphoneResponse])
async def get_smartphones(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_ram: Optional[int] = None,
    max_ram: Optional[int] = None,
    min_storage: Optional[int] = None,
    max_storage: Optional[int] = None,
    min_rating: Optional[float] = None,
    max_rating: Optional[float] = None,
    sort_by: str = "created_at",
    sort_order: str = "desc",
    db: Session = Depends(get_db)
):
    """Get smartphones with filtering and search"""
    query = db.query(Smartphone)
    
    # Search functionality
    if search:
        query = query.filter(
            or_(
                Smartphone.brand.ilike(f"%{search}%"),
                Smartphone.model_name.ilike(f"%{search}%")
            )
        )
    
    # Filters
    if brand:
        query = query.filter(Smartphone.brand.ilike(f"%{brand}%"))
    if min_price is not None:
        query = query.filter(Smartphone.price >= min_price)
    if max_price is not None:
        query = query.filter(Smartphone.price <= max_price)
    if min_ram is not None:
        query = query.filter(Smartphone.ram >= min_ram)
    if max_ram is not None:
        query = query.filter(Smartphone.ram <= max_ram)
    if min_storage is not None:
        query = query.filter(Smartphone.storage >= min_storage)
    if max_storage is not None:
        query = query.filter(Smartphone.storage <= max_storage)
    if min_rating is not None:
        query = query.filter(Smartphone.rating >= min_rating)
    if max_rating is not None:
        query = query.filter(Smartphone.rating <= max_rating)
    
    # Sorting
    if hasattr(Smartphone, sort_by):
        sort_column = getattr(Smartphone, sort_by)
        if sort_order.lower() == "desc":
            query = query.order_by(sort_column.desc())
        else:
            query = query.order_by(sort_column.asc())
    
    return query.offset(skip).limit(limit).all()

@router.get("/{smartphone_id}", response_model=SmartphoneResponse)
async def get_smartphone(smartphone_id: int, db: Session = Depends(get_db)):
    """Get a specific smartphone by ID"""
    smartphone = db.query(Smartphone).filter(Smartphone.id == smartphone_id).first()
    if smartphone is None:
        raise HTTPException(status_code=404, detail="Smartphone not found")
    return smartphone

@router.post("/", response_model=SmartphoneResponse)
async def create_smartphone(
    smartphone: SmartphoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new smartphone (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db_smartphone = Smartphone(**smartphone.dict())
    db.add(db_smartphone)
    db.commit()
    db.refresh(db_smartphone)
    return db_smartphone

@router.put("/{smartphone_id}", response_model=SmartphoneResponse)
async def update_smartphone(
    smartphone_id: int,
    smartphone: SmartphoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a smartphone (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db_smartphone = db.query(Smartphone).filter(Smartphone.id == smartphone_id).first()
    if db_smartphone is None:
        raise HTTPException(status_code=404, detail="Smartphone not found")
    
    for key, value in smartphone.dict().items():
        setattr(db_smartphone, key, value)
    
    db.commit()
    db.refresh(db_smartphone)
    return db_smartphone

@router.delete("/{smartphone_id}")
async def delete_smartphone(
    smartphone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a smartphone (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    db_smartphone = db.query(Smartphone).filter(Smartphone.id == smartphone_id).first()
    if db_smartphone is None:
        raise HTTPException(status_code=404, detail="Smartphone not found")
    
    db.delete(db_smartphone)
    db.commit()
    return {"message": "Smartphone deleted successfully"}

@router.post("/import-csv")
async def import_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Import smartphones from CSV file (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=400,
            detail="File must be a CSV"
        )
    
    try:
        contents = await file.read()
        df = pd.read_csv(io.StringIO(contents.decode('utf-8')))
        
        imported_count = import_smartphones_from_csv(df, db)
        
        return {
            "message": f"Successfully imported {imported_count} smartphones",
            "imported_count": imported_count
        }
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error processing CSV file: {str(e)}"
        )

@router.get("/export/csv")
async def export_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export smartphones to CSV file (admin only)"""
    if not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions"
        )
    
    try:
        csv_content = export_smartphones_to_csv(db)
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=smartphones_export.csv"}
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error exporting data: {str(e)}"
        )

@router.get("/brands/list")
async def get_brands(db: Session = Depends(get_db)):
    """Get list of all unique brands"""
    brands = db.query(Smartphone.brand).distinct().all()
    return [brand[0] for brand in brands]

@router.get("/stats/summary")
async def get_stats(db: Session = Depends(get_db)):
    """Get summary statistics"""
    total_phones = db.query(Smartphone).count()
    avg_price = db.query(Smartphone).with_entities(
        db.func.avg(Smartphone.price)
    ).scalar()
    avg_rating = db.query(Smartphone).with_entities(
        db.func.avg(Smartphone.rating)
    ).scalar()
    
    return {
        "total_phones": total_phones,
        "average_price": round(avg_price, 2) if avg_price else 0,
        "average_rating": round(avg_rating, 2) if avg_rating else 0
    }
