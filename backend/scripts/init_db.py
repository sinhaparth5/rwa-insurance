#!/usr/bin/env python
"""Initialize the database"""
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))

from app.database import engine, Base
from app.models import *  # Import all models

def init_db():
    """Create all database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()