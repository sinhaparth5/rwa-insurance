import joblib
import numpy as np
from typing import Dict, Any
import os

class RiskModel:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.feature_names = [
            'year', 'current_value', 'mileage', 'area_crime_rate',
            'is_luxury', 'is_sports', 'is_verified', 'fuel_type_encoded',
            'location_risk_encoded'
        ]
        
    def load_model(self):
        """Load the trained model"""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            raise FileNotFoundError(f"Model not found at {self.model_path}")
    
    def predict(self, features: Dict[str, Any]) -> float:
        """Predict risk score for given features"""
        if self.model is None:
            self.load_model()
        
        # Prepare features
        feature_vector = self._prepare_features(features)
        
        # Make prediction
        risk_score = self.model.predict([feature_vector])[0]
        
        return float(risk_score)
    
    def _prepare_features(self, features: Dict[str, Any]) -> np.ndarray:
        """Prepare feature vector from raw features"""
        # Extract and transform features
        year = features.get('year', 2020)
        current_value = features.get('current_value', 10000)
        mileage = features.get('mileage', 50000)
        area_crime_rate = features.get('area_crime_rate', 50)
        category = features.get('category', 'standard')
        is_verified = features.get('is_verified', False)
        fuel_type = features.get('fuel_type', 'Petrol')
        area_risk_level = features.get('area_risk_level', 'medium')
        
        # Encode categorical variables
        is_luxury = 1 if category == 'luxury' else 0
        is_sports = 1 if category == 'sports' else 0
        is_verified_encoded = 1 if is_verified else 0
        
        fuel_type_map = {'Petrol': 0, 'Diesel': 1, 'Hybrid': 2, 'Electric': 3}
        fuel_type_encoded = fuel_type_map.get(fuel_type, 0)
        
        risk_level_map = {'low': 0, 'medium': 1, 'high': 2, 'very high': 3}
        location_risk_encoded = risk_level_map.get(area_risk_level.lower(), 1)
        
        return np.array([
            year, current_value, mileage, area_crime_rate,
            is_luxury, is_sports, is_verified_encoded,
            fuel_type_encoded, location_risk_encoded
        ])