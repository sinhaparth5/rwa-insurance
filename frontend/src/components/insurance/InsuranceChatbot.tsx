"use client";

import { useState } from 'react';
import { useWalletAuth } from '@/hooks/useWalletAuth';
import type { ChatMessage } from '../types/chatbot.d.ts';

export function InsuranceChatbot() {
  const { userSession } = useWalletAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your AI insurance assistance. I can help you insure your tokenized assets like vehicle, properties, or art. What would you like to insure today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!inputValue.trim() || !userSession?.address) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);
    // @TODO this is just wireframes need to add original apis 
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          walletAddress: userSession.address,
          context: messages.slice(-5), // Last 5 messages for context 
        }),
      });

      const aiResponse = await response.json();
      
      const aiMessages: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.message,
        timestamp: new Date(),
        metadata: aiResponse.metadata,
      };

      setMessages(prev => [...prev, aiMessages]);

      // Handle AI actions (create policy, submit claim, etc)
      if (aiResponse.metadata?.action) {
        await handleAIAction(aiResponse.metadata);
      }
    } catch (error) {
      console.error('Failed to send messages:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAIAction = async (metadata: any) => {
    switch (metadata.action) {
      case 'create_policy':
        // Redirect to policy creation with pre-filled data
        window.location.href = `/create-policy?data=${encodeURIComponent(JSON.stringify(metadata.data))}`;
        break;
      case 'submit_claim':
        // Open claim submission modal
        // setShowClaimModal(true);
        break;
      case 'check_quote':
        // Display quote in chat
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">AI Insurance Assistant</h2>
      
      {!userSession?.isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p className="text-yellow-800">Please connect your wallet to start chatting with the AI assistant.</p>
        </div>
      )}

      <div className="h-96 overflow-y-auto mb-4 p-4 border rounded">
        {messages.map((message) => (
          <div key={message.id} className={`mb-4 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-3 rounded-lg max-w-xs ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p>{message.content}</p>
              <small className="text-xs opacity-75">
                {message.timestamp.toLocaleTimeString()}
              </small>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about insurance for your assets..."
          className="flex-1 p-3 border rounded-lg"
          disabled={!userSession?.isConnected || loading}
        />
        <button
          onClick={sendMessage}
          disabled={!userSession?.isConnected || loading || !inputValue.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          Send
        </button>
      </div>
    </div>
  );
}
