from pydantic import BaseModel
from datetime import date, datetime
from typing import Optional

class PolicyBase(BaseModel):
    asset_id: int
    coverage_amount: float
    premium_amount: float
    start_date: date
    end_date: date

class PolicyCreate(PolicyBase):
    pass

class PolicyUpdate(BaseModel):
    status: Optional[str] = None

class Policy(PolicyBase):
    id: int
    policy_number: str
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True