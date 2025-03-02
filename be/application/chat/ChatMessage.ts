import { WebSocketMessage, AIResponse } from '@/types/chat';

export type { WebSocketMessage };
export type ChatMessageContent = AIResponse;

// 데이터베이스 모델
export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  aiResponse: ChatMessageContent;
  timestamp: string;
} 