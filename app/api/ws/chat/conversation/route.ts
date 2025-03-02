import { ChatService } from '@/be/infrastructure/service/ChatService';
import { OpenAIService } from '@/be/infrastructure/service/OpenAIService';
import { SupabaseChatRepository } from '@/be/infrastructure/repository/SupabaseChatRepository';
import { WebSocketManager } from '@/be/infrastructure/repository/WebSocketManager';
import { WebSocketMessage } from '@/types/chat';
import { WebSocket } from 'ws';

interface ConversationSocket extends WebSocket {
  userId: string;
  lastActivity: Date;
}

// 서비스 인스턴스 생성
const chatService = new ChatService(
  new SupabaseChatRepository(),
  WebSocketManager.getInstance(),
  new OpenAIService()
);

export default function handler(ws: ConversationSocket, req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  
  if (!userId) {
    ws.close();
    return;
  }

  ws.userId = userId;
  ws.lastActivity = new Date();

  const webSocketManager = WebSocketManager.getInstance();
  webSocketManager.addConnection(userId, ws);

  ws.on('message', async (data: string) => {
    try {
      const message: WebSocketMessage = JSON.parse(data);
      ws.lastActivity = new Date();

      switch (message.type) {
        case 'chat-message':
          const response = await chatService.handleChatMessage(userId, message.payload.content);
          ws.send(JSON.stringify(response));
          break;

        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
      ws.send(JSON.stringify({
        type: 'error',
        payload: {
          message: 'Error processing message'
        },
        timestamp: new Date().toISOString()
      }));
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error for user', userId, ':', error);
  });

  ws.on('close', () => {
    console.log('Client disconnected:', userId);
    webSocketManager.removeConnection(userId);
  });

  // 연결 성공 메시지 전송
  ws.send(JSON.stringify({
    type: 'connection-established',
    payload: {
      userId
    },
    timestamp: new Date().toISOString()
  }));
}

// 비활성 연결 정리
setInterval(() => {
  WebSocketManager.getInstance().closeInactiveConnections();
}, 5 * 60 * 1000); 