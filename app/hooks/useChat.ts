'use client';
import { useState } from 'react';
import { AIChatAPIResponse, ClientChatRequest } from '@/types/chat';

// 채팅 훅
// 메시지 전송, 스트리밍 메시지, 전체 응답 메시지
export function useChat() {
   const [aiStreamedMessage, setAiStreamedMessage] = useState('');
   const [aiFullResponse, setAiFullResponse] = useState<AIChatAPIResponse | null>(null);

   async function handleSendMessage(
      content: ClientChatRequest,
      isStreaming: boolean = false,
      onStreamChunk?: (chunk: any) => void,
   ) {
      try {
         if (!content.message) {
            throw Error('invalid Message');
         }
         const url = isStreaming ? `/api/chat/${content.roomId}/message/stream` : `/api/chat/${content.roomId}/message`;

         const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer YOUR_SUPABASE_ANON_KEY`,
            },
            body: JSON.stringify(content),
         });

         if (!response.ok) {
            throw new Error('Network response was not ok');
         }

         if (isStreaming && response.body) {
            setAiStreamedMessage(''); // 초기화
            const decoder = new TextDecoder();
            let buffer = '';
            const reader = response.body.getReader();

            while (true) {
               const { done, value } = await reader.read();
               if (done) break;

               buffer += decoder.decode(value, { stream: true });
               let lines = buffer.split('\n');
               buffer = lines.pop() || '';

               for (const line of lines) {
                  const trimmedLine = line.trim();
                  if (trimmedLine) {
                     try {
                        const parsedMessage = JSON.parse(trimmedLine);
                        if (onStreamChunk) {
                           onStreamChunk(parsedMessage);
                        }

                        if (parsedMessage.type === 'message') {
                           setAiStreamedMessage(prev => prev + parsedMessage.value);
                        }
                     } catch (error) {
                        console.error('JSON parsing error:', error, 'for line:', trimmedLine);
                     }
                  }
               }
            }
         } else {
            const json = await response.json();
            setAiFullResponse(json);
         }
      } catch (error) {
         console.error('Error sending message:', error);
      }
   }

   return {
      aiStreamedMessage,
      aiFullResponse,
      handleSendMessage,
   };
}
