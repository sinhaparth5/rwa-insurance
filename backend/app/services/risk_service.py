from typing import Dict, Any
from sqlalchemy.orm import Session
from app.models.assets import Asset
from app.models.risk_assessment import RiskAssessment
from app.ml.models.risk_model import RiskModel
from app.ml.models.premium_model import PremiumModel
from app.config import get_settings
import pandas as pd

settings = get_settings()

class RiskService:
    def __init__(self):
        self.risk_model = RiskModel(settings.risk_model_path)
        self.premium_model = PremiumModel(settings.premium_model_path)
        self.crime_data = None
        self._load_crime_data()
    
    def _load_crime_data(self):
        """Load crime data for risk assessment"""
        try:
            crime_df = pd.read_csv('data/raw/london_vehicle_crimes_sample.csv')
            self.crime_rates = crime_df.groupby('postcode')['borough_crime_rate'].mean().to_dict()
            self.risk_levels = crime_df.groupby('postcode')['borough_risk_level'].first().to_dict()
        except:
            self.crime_rates = {}
            self.risk_levels = {}
    
    def assess_asset_risk(self, db: Session, asset_id: int) -> Dict[str, Any]:
        """Assess risk for an asset"""
        # Get asset
        asset = db.query(Asset).filter(Asset.id == asset_id).first()
        if not asset:
            raise ValueError("Asset not found")
        
        # Prepare features
        features = {
            'year': asset.year or 2020,
            'current_value': asset.current_value,
            'mileage': asset.mileage or 50000,
            'area_crime_rate': self.crime_rates.get(asset.postcode, 50),
            'category': asset.asset_type,
            'is_verified': asset.verification_status == 'verified',
            'fuel_type': asset.fuel_type or 'Petrol',
            'area_risk_level': self.risk_levels.get(asset.postcode, 'medium')
        }
        
        # Get risk score
        risk_score = self.risk_model.predict(features)
        
        # Calculate premium
        coverage_amount = asset.current_value * 0.8
        premium = self.premium_model.calculate_premium(
            risk_score, coverage_amount, asset.current_value
        )
        
        # Determine coverage recommendation
        if risk_score > 70:
            coverage_recommendation = "comprehensive"
        elif risk_score > 40:
            coverage_recommendation = "standard"
        else:
            coverage_recommendation = "basic"
        
        # Save risk assessment
        risk_assessment = RiskAssessment(
            asset_id=asset_id,
            risk_score=risk_score,
            risk_factors=features
        )
        db.add(risk_assessment)
        db.commit()
        
        return {
            'asset_id': asset_id,
            'risk_score': risk_score,
            'risk_factors': features,
            'premium_estimate': premium,
            'coverage_recommendation': coverage_recommendation
        }