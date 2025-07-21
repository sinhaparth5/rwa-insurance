"use client";

import { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { useAuth } from '@/contexts/AuthContext';
import { chatAPI } from '@/lib/api/services';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function InsuranceChatbot() {
  const { address, isConnected } = useWallet();
  const { isAuthenticated, token } = useAuth();
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI insurance assistant. I can help you with questions about tokenized asset insurance. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration error
  useEffect(() => {
    setIsClient(true);
  }, []);

  const formatTime = (date: Date) => {
    if (!isClient) return '';
    return date.toLocaleTimeString();
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !isAuthenticated || !token) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setLoading(true);

    try {
      console.log('💬 Sending message to chatbot:', currentInput);

      // Only call chat API - no other endpoints
      const aiResponse = await chatAPI.sendMessage(currentInput, sessionId, token);
      
      console.log('🤖 AI Response:', aiResponse);
      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.response || aiResponse.message || "I understand your question about insurance. For full functionality like creating policies or managing assets, please use the full ChatbotInterface.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "Sorry, I'm having trouble connecting to the chat service. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Simple Chat Assistant</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-800">Please connect your wallet to start chatting.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Simple Chat Assistant</h2>
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-blue-800">Please authenticate your wallet to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Simple Chat Assistant</h2>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          <span className="text-xs text-gray-600">Chat Only</span>
        </div>
      </div>
      
      {/* Connection Status */}
      <div className="bg-green-50 border border-green-200 rounded p-2 mb-4">
        <div className="text-xs text-green-800">
          ✅ Connected as {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-80 overflow-y-auto mb-4 p-3 border rounded bg-gray-50">
        {messages.map((message) => (
          <div key={message.id} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg max-w-xs text-sm ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white text-gray-800 border'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <small className="text-xs opacity-75" suppressHydrationWarning>
                {formatTime(message.timestamp)}
              </small>
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="text-left">
            <div className="inline-block p-2 rounded-lg bg-white border">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <span className="text-xs text-gray-600 ml-1">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me about insurance..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !inputValue.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 transition-colors text-sm"
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-3 text-xs text-gray-500 text-center">
        <p>💡 For full functionality (create policies, manage assets), use the full ChatbotInterface</p>
      </div>
    </div>
  );
}