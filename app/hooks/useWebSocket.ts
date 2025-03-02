import { useEffect, useRef, useState } from 'react';
import { ChatMessage, WebSocketMessage } from '../../types/chat';

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: ChatMessage) => void;
  onChallengeTask?: (challengeTask: any) => void;
  mode?: 'full' | 'trial';
}

export function useWebSocket({ url, onMessage, onChallengeTask, mode }: UseWebSocketProps) {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const wsUrl = new URL(url);
    if (mode === 'trial') {
      wsUrl.searchParams.set('trial', 'true');
    }
    
    const socket = new WebSocket(wsUrl.toString());

    socket.onopen = () => {
      setIsConnected(true);
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        
        switch (data.type) {
          case 'chat-message':
            onMessage?.(data.payload);
            break;
          case 'challenge-task':
            onChallengeTask?.(data.payload);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (err) {
        console.error('Failed to parse message:', err);
      }
    };

    socket.onerror = (event) => {
      setError('WebSocket error occurred');
      console.error('WebSocket error:', event);
    };

    socket.onclose = () => {
      setIsConnected(false);
      setError('WebSocket connection closed');
    };

    ws.current = socket;

    return () => {
      socket.close();
    };
  }, [url, onMessage, onChallengeTask, mode]);

  const sendMessage = (content: string) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat-message',
        payload: {
          content,
          timestamp: new Date().toISOString(),
          isTrial: mode === 'trial'
        },
      }));
    }
  };

  return {
    isConnected,
    error,
    sendMessage,
  };
} 