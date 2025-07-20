from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Optional

class RiskAssessmentBase(BaseModel):
    asset_id: int
    risk_score: float
    risk_factors: Optional[Dict] = None

class RiskAssessmentCreate(RiskAssessmentBase):
    pass

class RiskAssessment(RiskAssessmentBase):
    id: int
    assessment_date: datetime
    
    class Config:
        from_attributes = True

class RiskAssessmentRequest(BaseModel):
    asset_id: int

class RiskAssessmentResponse(BaseModel):
    asset_id: int
    risk_score: float
    risk_factors: Dict
    premium_estimate: float
    coverage_recommendation: str