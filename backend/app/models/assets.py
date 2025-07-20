from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    nft_contract = Column(String(42), nullable=False)
    token_id = Column(Integer, nullable=False)
    asset_type = Column(String(50), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    current_value = Column(Float, nullable=False)
    location = Column(String(255), nullable=True)
    postcode = Column(String(20), nullable=True)
    verification_status = Column(String(20), default="pending")
    make = Column(String(100), nullable=True)
    model = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    vin = Column(String(50), nullable=True)
    registration_number = Column(String(20), nullable=True)
    mileage = Column(Integer, nullable=True)
    fuel_type = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="assets")
    risk_assessments = relationship("RiskAssessment", back_populates="asset")
    policies = relationship("Policy", back_populates="asset")
    
    __table_args__ = (
        {"sqlite_autoincrement": True},
    )