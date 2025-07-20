from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.models.assets import Asset
from app.models.policy import Policy
from app.models.claim import Claim
from app.models.risk_assessment import RiskAssessment
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get dashboard statistics"""
    # Get user's assets
    assets = db.query(Asset).filter(Asset.user_id == current_user.id).all()
    asset_ids = [asset.id for asset in assets]
    
    # Calculate statistics
    total_assets = len(assets)
    total_value = sum(asset.current_value for asset in assets)
    
    # Get policies
    policies = db.query(Policy).filter(Policy.asset_id.in_(asset_ids)).all()
    active_policies = [p for p in policies if p.status == 'active']
    
    # Get claims
    policy_ids = [p.id for p in policies]
    claims = db.query(Claim).filter(Claim.policy_id.in_(policy_ids)).all()
    pending_claims = [c for c in claims if c.status == 'pending']
    
    # Calculate monthly premium
    monthly_premium = sum(p.premium_amount for p in active_policies)
    
    # Get recent risk assessments
    recent_assessments = db.query(RiskAssessment).filter(
        RiskAssessment.asset_id.in_(asset_ids),
        RiskAssessment.assessment_date >= datetime.utcnow() - timedelta(days=30)
    ).all()
    
    avg_risk_score = 0
    if recent_assessments:
        avg_risk_score = sum(a.risk_score for a in recent_assessments) / len(recent_assessments)
    
    return {
        "total_assets": total_assets,
        "total_value": total_value,
        "active_policies": len(active_policies),
        "total_claims": len(claims),
        "pending_claims": len(pending_claims),
        "monthly_premium": monthly_premium,
        "average_risk_score": round(avg_risk_score, 2),
        "insured_assets": len(active_policies),
        "uninsured_assets": total_assets - len(active_policies)
    }

@router.get("/portfolio")
def get_portfolio_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get portfolio overview"""
    assets = db.query(Asset).filter(Asset.user_id == current_user.id).all()
    
    portfolio = []
    for asset in assets:
        # Get latest policy
        policy = db.query(Policy).filter(
            Policy.asset_id == asset.id,
            Policy.status == 'active'
        ).first()
        
        # Get latest risk assessment
        risk_assessment = db.query(RiskAssessment).filter(
            RiskAssessment.asset_id == asset.id
        ).order_by(RiskAssessment.assessment_date.desc()).first()
        
        portfolio.append({
            "asset": {
                "id": asset.id,
                "name": asset.name,
                "type": asset.asset_type,
                "value": asset.current_value,
                "location": asset.location,
                "postcode": asset.postcode,
                "verification_status": asset.verification_status
            },
            "policy": {
                "id": policy.id if policy else None,
                "policy_number": policy.policy_number if policy else None,
                "coverage_amount": policy.coverage_amount if policy else 0,
                "premium": policy.premium_amount if policy else 0,
                "status": policy.status if policy else "uninsured",
                "end_date": policy.end_date if policy else None
            },
            "risk": {
                "score": risk_assessment.risk_score if risk_assessment else None,
                "last_assessed": risk_assessment.assessment_date if risk_assessment else None
            }
        })
    
    return {"portfolio": portfolio}

@router.get("/analytics")
def get_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get analytics data"""
    # Get user's assets
    assets = db.query(Asset).filter(Asset.user_id == current_user.id).all()
    asset_ids = [asset.id for asset in assets]
    
    # Asset distribution by type
    asset_distribution = {}
    for asset in assets:
        asset_type = asset.asset_type
        if asset_type not in asset_distribution:
            asset_distribution[asset_type] = {"count": 0, "value": 0}
        asset_distribution[asset_type]["count"] += 1
        asset_distribution[asset_type]["value"] += asset.current_value
    
    # Claims by status
    policies = db.query(Policy).filter(Policy.asset_id.in_(asset_ids)).all()
    policy_ids = [p.id for p in policies]
    claims = db.query(Claim).filter(Claim.policy_id.in_(policy_ids)).all()
    
    claims_by_status = {}
    for claim in claims:
        status = claim.status
        if status not in claims_by_status:
            claims_by_status[status] = 0
        claims_by_status[status] += 1
    
    # Monthly premium trend (last 6 months)
    monthly_premiums = []
    for i in range(6):
        month_start = datetime.utcnow().replace(day=1) - timedelta(days=30*i)
        month_end = (month_start + timedelta(days=32)).replace(day=1)
        
        active_policies_in_month = [
            p for p in policies 
            if p.start_date <= month_end.date() and p.end_date >= month_start.date()
        ]
        
        total_premium = sum(p.premium_amount for p in active_policies_in_month)
        monthly_premiums.append({
            "month": month_start.strftime("%B %Y"),
            "premium": total_premium
        })
    
    return {
        "asset_distribution": asset_distribution,
        "claims_by_status": claims_by_status,
        "monthly_premiums": list(reversed(monthly_premiums))
    }