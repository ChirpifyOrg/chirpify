import { ChatMessage, ChatMessageContent, WebSocketMessage } from '@/domain/chat/ChatMessage';
import { IChatRepository } from '@/domain/chat/IChatRepository';
import { IWebSocketManager } from '@/domain/chat/IWebSocketManager';
import { IAIService } from '@/domain/chat/IAIService';

export class ChatService {
  constructor(
    private chatRepository: IChatRepository,
    private webSocketManager: IWebSocketManager,
    private aiService: IAIService
  ) {}

  async handleChatMessage(userId: string, content: string): Promise<WebSocketMessage> {
    try {
      const aiResponse = await this.aiService.generateResponse(content);
      
      const chatMessage: ChatMessage = {
        id: this.generateMessageId(),
        userId,
        content,
        aiResponse,
        timestamp: new Date().toISOString()
      };

      await this.chatRepository.save(chatMessage);

      return {
        type: 'chat-message',
        payload: {
          id: chatMessage.id,
          content: aiResponse,
          sender: 'assistant',
          timestamp: chatMessage.timestamp
        },
        timestamp: chatMessage.timestamp
      };
    } catch (error) {
      console.error('Error handling chat message for user', userId, ':', error);
      throw error;
    }
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
} 