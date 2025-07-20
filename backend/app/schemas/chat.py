from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: datetime

class ChatHistory(BaseModel):
    messages: List[dict]
    session_id: str