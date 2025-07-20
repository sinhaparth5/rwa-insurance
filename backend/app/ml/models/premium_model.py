import joblib
import numpy as np
from typing import Dict, Any
import os

class PremiumModel:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        
    def load_model(self):
        """Load the trained model"""
        if os.path.exists(self.model_path):
            self.model = joblib.load(self.model_path)
        else:
            raise FileNotFoundError(f"Model not found at {self.model_path}")
    
    def calculate_premium(self, risk_score: float, coverage_amount: float, 
                         asset_value: float) -> float:
        """Calculate premium based on risk score and coverage"""
        if self.model is None:
            self.load_model()
        
        # Prepare features
        features = np.array([[risk_score, coverage_amount, asset_value]])
        
        # Predict premium
        premium = self.model.predict(features)[0]
        
        # Ensure minimum premium
        return max(float(premium), 1.0)