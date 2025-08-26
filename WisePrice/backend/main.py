from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn
import os

from db import engine, SessionLocal, get_db
from models import Base
from routes import auth, smartphones
from utils import verify_token
from seed import seed_database

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="PriceWise API", description="Smartphone Price Comparison Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(smartphones.router, prefix="/api/smartphones", tags=["smartphones"])

@app.on_event("startup")
async def startup_event():
    """Seed database with sample data on startup"""
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to PriceWise API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
