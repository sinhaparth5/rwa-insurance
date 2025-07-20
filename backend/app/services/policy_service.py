from typing import List, Optional
from datetime import datetime, date, timedelta
from sqlalchemy.orm import Session
from app.models.policy import Policy
from app.schemas.policy import PolicyCreate
import uuid

class PolicyService:
    @staticmethod
    def create_policy(db: Session, policy_data: PolicyCreate) -> Policy:
        """Create new insurance policy"""
        policy_number = f"POL-{uuid.uuid4().hex[:8].upper()}"
        
        policy = Policy(
            **policy_data.dict(),
            policy_number=policy_number
        )
        db.add(policy)
        db.commit()
        db.refresh(policy)
        return policy
    
    @staticmethod
    def get_user_policies(db: Session, user_id: int) -> List[Policy]:
        """Get all policies for a user"""
        from app.models.assets import Asset
        
        # Get user's assets
        user_assets = db.query(Asset).filter(Asset.user_id == user_id).all()
        asset_ids = [asset.id for asset in user_assets]
        
        # Get policies for those assets
        return db.query(Policy).filter(Policy.asset_id.in_(asset_ids)).all()
    
    @staticmethod
    def get_policy_by_id(db: Session, policy_id: int) -> Optional[Policy]:
        """Get specific policy by ID"""
        return db.query(Policy).filter(Policy.id == policy_id).first()
    
    @staticmethod
    def update_policy_status(db: Session, policy_id: int, status: str) -> Optional[Policy]:
        """Update policy status"""
        policy = db.query(Policy).filter(Policy.id == policy_id).first()
        if policy:
            policy.status = status
            db.commit()
            db.refresh(policy)
        return policy