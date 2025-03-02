import { WebSocket } from 'ws';
import { WebSocketMessage } from './ChatMessage';

export interface IWebSocketManager {
  addConnection(userId: string, ws: WebSocket): void;
  removeConnection(userId: string): void;
  sendMessage(userId: string, message: WebSocketMessage): void;
  closeInactiveConnections(): void;
} 