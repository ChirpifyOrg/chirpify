import { WebSocket } from 'ws';
import { IWebSocketManager } from '@/domain/chat/IWebSocketManager';
import { WebSocketMessage } from '@/domain/chat/ChatMessage';

export class WebSocketManager implements IWebSocketManager {
  private static instance: WebSocketManager;
  private connections: Map<string, WebSocket>;

  private constructor() {
    this.connections = new Map();
  }

  static getInstance(): WebSocketManager {
    if (!this.instance) {
      this.instance = new WebSocketManager();
    }
    return this.instance;
  }

  addConnection(userId: string, ws: WebSocket): void {
    const existingConnection = this.connections.get(userId);
    if (existingConnection) {
      existingConnection.close();
    }
    this.connections.set(userId, ws);
  }

  removeConnection(userId: string): void {
    this.connections.delete(userId);
  }

  sendMessage(userId: string, message: WebSocketMessage): void {
    const connection = this.connections.get(userId);
    if (connection) {
      connection.send(JSON.stringify(message));
    }
  }

  closeInactiveConnections(): void {
    const now = new Date();
    Array.from(this.connections.entries()).forEach(([userId, ws]: [string, any]) => {
      if (now.getTime() - ws.lastActivity.getTime() > 30 * 60 * 1000) {
        console.log('Closing inactive connection:', userId);
        ws.close();
        this.connections.delete(userId);
      }
    });
  }
} 