"""Helper functions"""
import random
import string
from datetime import datetime, date
from typing import Dict, Any, Optional

def generate_unique_id(prefix: str, length: int = 8) -> str:
    """Generate unique ID with prefix"""
    chars = string.ascii_uppercase + string.digits
    random_part = ''.join(random.choices(chars, k=length))
    return f"{prefix}-{random_part}"

def calculate_days_between(start_date: date, end_date: date) -> int:
    """Calculate days between two dates"""
    delta = end_date - start_date
    return delta.days

def format_currency(amount: float) -> str:
    """Format amount as currency"""
    return f"£{amount:,.2f}"

def get_risk_level(risk_score: float) -> str:
    """Get risk level from score"""
    if risk_score <= 30:
        return "low"
    elif risk_score <= 60:
        return "medium"
    elif risk_score <= 80:
        return "high"
    else:
        return "very_high"

def parse_vehicle_info(asset_name: str) -> Dict[str, str]:
    """Parse vehicle info from asset name"""
    parts = asset_name.split()
    if len(parts) >= 3:
        return {
            "year": parts[0],
            "make": parts[1],
            "model": " ".join(parts[2:])
        }
    return {"year": "", "make": "", "model": asset_name}

def validate_postcode(postcode: str) -> bool:
    """Validate UK postcode format"""
    import re
    pattern = r'^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}'