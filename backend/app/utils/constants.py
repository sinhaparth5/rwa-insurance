"""Application constants"""

# Asset types
ASSET_TYPES = {
    "standard": "Standard Vehicle",
    "luxury": "Luxury Vehicle",
    "sports": "Sports Car",
    "classic": "Classic Car",
    "commercial": "Commercial Vehicle"
}

# Policy status
POLICY_STATUS = {
    "active": "Active",
    "expired": "Expired",
    "cancelled": "Cancelled",
    "pending": "Pending"
}

# Claim status
CLAIM_STATUS = {
    "pending": "Pending Review",
    "investigating": "Under Investigation",
    "approved": "Approved",
    "rejected": "Rejected",
    "paid": "Paid Out"
}

# Risk levels
RISK_LEVELS = {
    "low": (0, 30),
    "medium": (31, 60),
    "high": (61, 80),
    "very_high": (81, 100)
}

# Coverage types
COVERAGE_TYPES = {
    "basic": "Basic Coverage",
    "standard": "Standard Coverage",
    "comprehensive": "Comprehensive Coverage"
}