from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ClaimBase(BaseModel):
    policy_id: int
    claim_type: str
    claim_amount: float
    description: Optional[str] = None

class ClaimCreate(ClaimBase):
    pass

class ClaimUpdate(BaseModel):
    status: Optional[str] = None

class Claim(ClaimBase):
    id: int
    claim_number: str
    status: str
    submitted_at: datetime
    processed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True