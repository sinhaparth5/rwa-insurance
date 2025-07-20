from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssetBase(BaseModel):
    nft_contract: str
    token_id: int
    asset_type: str
    name: str
    description: Optional[str] = None
    current_value: float
    location: Optional[str] = None
    postcode: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    vin: Optional[str] = None
    registration_number: Optional[str] = None
    mileage: Optional[int] = None
    fuel_type: Optional[str] = None

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    current_value: Optional[float] = None
    location: Optional[str] = None
    postcode: Optional[str] = None
    mileage: Optional[int] = None
    verification_status: Optional[str] = None

class Asset(AssetBase):
    id: int
    user_id: int
    verification_status: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class AssetWithRisk(Asset):
    risk_score: Optional[float] = None
    risk_factors: Optional[dict] = None