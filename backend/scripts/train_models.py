#!/usr/bin/env python
"""Train all ML models"""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.ml.training.train_risk_model import train_risk_model
from app.ml.training.train_premium_model import train_premium_model
from app.ml.training.train_chatbot import train_chatbot_model

def train_all_models():
    """Train all ML models"""
    print("Training Risk Assessment Model...")
    train_risk_model()
    
    print("\nTraining Premium Calculation Model...")
    train_premium_model()
    
    print("\nTraining Chatbot Model...")
    train_chatbot_model()
    
    print("\nAll models trained successfully!")

if __name__ == "__main__":
    train_all_models()