import { ChatMessage } from '../application/chat/ChatMessage';

export interface IChatRepository {
  save(message: ChatMessage): Promise<void>;
  findByUserId(userId: string): Promise<ChatMessage[]>;
} 