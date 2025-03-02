import { ChatMessageContent } from './ChatMessage';

export interface IAIService {
  generateResponse(content: string): Promise<ChatMessageContent>;
} 