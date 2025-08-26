from sqlalchemy.orm import Session
from models import User, Smartphone
from utils import get_password_hash
import pandas as pd
import os

def seed_database(db: Session):
    """Seed database with initial data"""
    
    # Create admin user if not exists
    admin_user = db.query(User).filter(User.email == "admin@pricewise.com").first()
    if not admin_user:
        admin_user = User(
            email="admin@pricewise.com",
            hashed_password=get_password_hash("admin123"),
            is_admin=True
        )
        db.add(admin_user)
        db.commit()
        print("Created admin user: admin@pricewise.com")
    
    # Check if smartphones already exist
    existing_count = db.query(Smartphone).count()
    if existing_count > 0:
        print(f"Database already contains {existing_count} smartphones")
        return
    
    # Load sample smartphones from CSV
    csv_path = "shared/sample_smartphones.csv"
    if os.path.exists(csv_path):
        try:
            df = pd.read_csv(csv_path)
            
            for _, row in df.iterrows():
                smartphone = Smartphone(
                    brand=row['brand'],
                    model_name=row['model_name'],
                    price=float(row['price']),
                    ram=int(row['ram']),
                    storage=int(row['storage']),
                    battery=int(row['battery']),
                    rating=float(row['rating'])
                )
                db.add(smartphone)
            
            db.commit()
            print(f"Seeded database with {len(df)} smartphones from CSV")
            
        except Exception as e:
            print(f"Error loading CSV: {e}")
            # Fallback to hardcoded data if CSV fails
            seed_hardcoded_smartphones(db)
    else:
        print("CSV file not found, using hardcoded data")
        seed_hardcoded_smartphones(db)

def seed_hardcoded_smartphones(db: Session):
    """Seed with hardcoded smartphone data as fallback"""
    smartphones = [
        {
            "brand": "Apple",
            "model_name": "iPhone 15 Pro",
            "price": 999.99,
            "ram": 8,
            "storage": 128,
            "battery": 3274,
            "rating": 4.5
        },
        {
            "brand": "Samsung",
            "model_name": "Galaxy S24 Ultra",
            "price": 1199.99,
            "ram": 12,
            "storage": 256,
            "battery": 5000,
            "rating": 4.6
        },
        {
            "brand": "Google",
            "model_name": "Pixel 8 Pro",
            "price": 899.99,
            "ram": 12,
            "storage": 128,
            "battery": 5050,
            "rating": 4.4
        },
        {
            "brand": "OnePlus",
            "model_name": "12 Pro",
            "price": 799.99,
            "ram": 12,
            "storage": 256,
            "battery": 5400,
            "rating": 4.3
        },
        {
            "brand": "Xiaomi",
            "model_name": "14 Ultra",
            "price": 699.99,
            "ram": 16,
            "storage": 512,
            "battery": 5300,
            "rating": 4.2
        }
    ]
    
    for phone_data in smartphones:
        smartphone = Smartphone(**phone_data)
        db.add(smartphone)
    
    db.commit()
    print(f"Seeded database with {len(smartphones)} hardcoded smartphones")
