export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  metadata?: {
    action?: 'create_policy' | 'submit_claim' | 'check_quote';
    data?: any;
  };
}
