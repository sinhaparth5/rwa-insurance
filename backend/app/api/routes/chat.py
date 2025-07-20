from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.chat import ChatMessage, ChatResponse, ChatHistory
from app.services.chatbot_service import ChatbotService
from app.api.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/chat", tags=["chatbot"])

chatbot_service = ChatbotService()

@router.post("/message", response_model=ChatResponse)
def send_message(
    message: ChatMessage,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send message to chatbot"""
    result = chatbot_service.process_message(
        db,
        current_user.id,
        message.message,
        message.session_id
    )
    
    return ChatResponse(**result)

@router.get("/history/{session_id}", response_model=ChatHistory)
def get_chat_history(
    session_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get chat history for a session"""
    history = chatbot_service.get_chat_history(db, current_user.id, session_id)
    return ChatHistory(**history)

@router.get("/sessions")
def get_chat_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all chat sessions for user"""
    from app.models.chat_session import ChatSession
    
    sessions = db.query(ChatSession.session_id).filter(
        ChatSession.user_id == current_user.id
    ).distinct().all()
    
    return {"sessions": [s[0] for s in sessions]}