from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean
from sqlalchemy.sql import func
from db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Smartphone(Base):
    __tablename__ = "smartphones"
    
    id = Column(Integer, primary_key=True, index=True)
    brand = Column(String, nullable=False, index=True)
    model_name = Column(String, nullable=False, index=True)
    price = Column(Float, nullable=False, index=True)
    ram = Column(Integer, nullable=False, index=True)  # in GB
    storage = Column(Integer, nullable=False, index=True)  # in GB
    battery = Column(Integer, nullable=False)  # in mAh
    rating = Column(Float, nullable=False, index=True)  # out of 5
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
