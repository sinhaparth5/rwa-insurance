from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.risk import RiskAssessmentRequest, RiskAssessmentResponse
from app.services.risk_service import RiskService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/risk", tags=["risk"])

@router.post("/assess", response_model=RiskAssessmentResponse)
def assess_risk(
    request: RiskAssessmentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Assess risk for an asset"""
    risk_service = RiskService()
    
    try:
        risk_data = risk_service.assess_asset_risk(db, request.asset_id)
        return RiskAssessmentResponse(**risk_data)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk assessment failed: {str(e)}")

@router.get("/history/{asset_id}")
def get_risk_history(
    asset_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get risk assessment history for an asset"""
    from app.models.risk_assessment import RiskAssessment
    
    assessments = db.query(RiskAssessment).filter(
        RiskAssessment.asset_id == asset_id
    ).order_by(RiskAssessment.assessment_date.desc()).all()
    
    return {
        "asset_id": asset_id,
        "assessments": [
            {
                "id": a.id,
                "risk_score": a.risk_score,
                "risk_factors": a.risk_factors,
                "assessment_date": a.assessment_date
            }
            for a in assessments
        ]
    }