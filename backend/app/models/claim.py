from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Claim(Base):
    __tablename__ = "claims"
    
    id = Column(Integer, primary_key=True, index=True)
    policy_id = Column(Integer, ForeignKey("policies.id"), nullable=False)
    claim_number = Column(String(50), unique=True, nullable=False)
    claim_type = Column(String(50), nullable=False)
    claim_amount = Column(Float, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(20), default="pending")
    submitted_at = Column(DateTime, default=datetime.utcnow)
    processed_at = Column(DateTime, nullable=True)
    
    # Relationships
    policy = relationship("Policy", back_populates="claims")