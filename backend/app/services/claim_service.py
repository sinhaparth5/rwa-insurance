from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.claim import Claim
from app.schemas.claim import ClaimCreate
import uuid

class ClaimService:
    @staticmethod
    def create_claim(db: Session, claim_data: ClaimCreate) -> Claim:
        """Create new claim"""
        claim_number = f"CLM-{uuid.uuid4().hex[:8].upper()}"
        
        claim = Claim(
            **claim_data.dict(),
            claim_number=claim_number
        )
        db.add(claim)
        db.commit()
        db.refresh(claim)
        return claim
    
    @staticmethod
    def get_user_claims(db: Session, user_id: int) -> List[Claim]:
        """Get all claims for a user"""
        from app.models.assets import Asset
        from app.models.policy import Policy
        
        # Get user's assets
        user_assets = db.query(Asset).filter(Asset.user_id == user_id).all()
        asset_ids = [asset.id for asset in user_assets]
        
        # Get policies for those assets
        policies = db.query(Policy).filter(Policy.asset_id.in_(asset_ids)).all()
        policy_ids = [policy.id for policy in policies]
        
        # Get claims for those policies
        return db.query(Claim).filter(Claim.policy_id.in_(policy_ids)).all()
    
    @staticmethod
    def update_claim_status(db: Session, claim_id: int, status: str) -> Optional[Claim]:
        """Update claim status"""
        claim = db.query(Claim).filter(Claim.id == claim_id).first()
        if claim:
            claim.status = status
            if status in ['approved', 'rejected']:
                claim.processed_at = datetime.utcnow()
            db.commit()
            db.refresh(claim)
        return claim