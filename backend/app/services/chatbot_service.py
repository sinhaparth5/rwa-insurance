from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from app.models.assets import Asset
from app.models.chat_session import ChatSession
from app.ml.models.chatbot_model import ChatbotModel
from app.config import get_settings
import uuid

settings = get_settings()

class ChatbotService:
    def __init__(self):
        self.chatbot_model = ChatbotModel(settings.chatbot_model_path)
        self.chatbot_model.load_model()
    
    def process_message(self, db: Session, user_id: int, message: str, 
                       session_id: Optional[str] = None) -> Dict[str, Any]:
        """Process user message and generate response"""
        # Generate session ID if not provided
        if not session_id:
            session_id = str(uuid.uuid4())
        
        # Get user's assets for context
        assets = db.query(Asset).filter(Asset.user_id == user_id).all()
        
        # Prepare context
        context = None
        if assets:
            # Use first asset for context (in production, parse message to identify which asset)
            asset = assets[0]
            context = {
                'value': asset.current_value,
                'vehicle_info': f"{asset.year} {asset.make} {asset.model}",
                'location': asset.location or 'London',
                'risk_score': 50,  # Would get from risk assessment
                'premium': 10  # Would calculate based on risk
            }
        
        # Get chatbot response
        response = self.chatbot_model.get_response(message, context)
        
        # Save chat session
        chat_session = ChatSession(
            user_id=user_id,
            session_id=session_id,
            message=message,
            response=response
        )
        db.add(chat_session)
        db.commit()
        
        return {
            'response': response,
            'session_id': session_id,
            'timestamp': chat_session.timestamp
        }
    
    def get_chat_history(self, db: Session, user_id: int, 
                        session_id: str) -> Dict[str, Any]:
        """Get chat history for a session"""
        sessions = db.query(ChatSession).filter(
            ChatSession.user_id == user_id,
            ChatSession.session_id == session_id
        ).order_by(ChatSession.timestamp).all()
        
        messages = []
        for session in sessions:
            messages.append({
                'role': 'user',
                'content': session.message,
                'timestamp': session.timestamp
            })
            messages.append({
                'role': 'assistant',
                'content': session.response,
                'timestamp': session.timestamp
            })
        
        return {
            'messages': messages,
            'session_id': session_id
        }