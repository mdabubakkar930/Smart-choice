from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import pandas as pd
import io
import os

from db import get_db
from models import User, Smartphone

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

security = HTTPBearer()

def verify_password(plain_password, hashed_password):
    """Verify a plain password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create a JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify JWT token"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """Get current authenticated user"""
    email = verify_token(credentials)
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user

def import_smartphones_from_csv(df: pd.DataFrame, db: Session) -> int:
    """Import smartphones from CSV DataFrame"""
    required_columns = ['brand', 'model_name', 'price', 'ram', 'storage', 'battery', 'rating']
    
    # Check if all required columns exist
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Missing required columns: {missing_columns}")
    
    imported_count = 0
    
    for _, row in df.iterrows():
        try:
            # Check if smartphone already exists
            existing = db.query(Smartphone).filter(
                Smartphone.brand == row['brand'],
                Smartphone.model_name == row['model_name']
            ).first()
            
            if not existing:
                smartphone = Smartphone(
                    brand=str(row['brand']).strip(),
                    model_name=str(row['model_name']).strip(),
                    price=float(row['price']),
                    ram=int(row['ram']),
                    storage=int(row['storage']),
                    battery=int(row['battery']),
                    rating=float(row['rating'])
                )
                db.add(smartphone)
                imported_count += 1
        except Exception as e:
            # Skip invalid rows and continue
            continue
    
    db.commit()
    return imported_count

def export_smartphones_to_csv(db: Session) -> str:
    """Export smartphones to CSV string"""
    smartphones = db.query(Smartphone).all()
    
    data = []
    for phone in smartphones:
        data.append({
            'id': phone.id,
            'brand': phone.brand,
            'model_name': phone.model_name,
            'price': phone.price,
            'ram': phone.ram,
            'storage': phone.storage,
            'battery': phone.battery,
            'rating': phone.rating,
            'created_at': phone.created_at.isoformat() if phone.created_at else None
        })
    
    df = pd.DataFrame(data)
    return df.to_csv(index=False)
