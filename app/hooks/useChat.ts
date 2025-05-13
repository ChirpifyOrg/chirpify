'use client';
import { useEffect, useState } from 'react';
import { AIChatAPIResponse, ClientChatRequest, parseNDJSONToAIChatResponse } from '@/types/chat';

// 채팅 훅
// 메시지 전송, 스트리밍 메시지, 전체 응답 메시지
export function useChat() {
   const [aiStreamedMessage, setAiStreamedMessage] = useState('');
   const [aiFullResponse, setAiFullResponse] = useState<AIChatAPIResponse | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);

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
         setIsLoading(true);
         const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),
         });
         if (!response.ok) {
            console.log('reponse status', response);
            // if (response.status === '429')
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
                           setAiStreamedMessage(prev => prev + parsedMessage.text);
                        } else if (parsedMessage.type === 'error') {
                           console.error('🚨 Server-side error from stream:', parsedMessage);
                           throw parsedMessage;
                        }
                     } catch (error) {
                        console.error('❌ JSON parsing error:', error, 'for line:', trimmedLine);
                        throw error;
                     }
                  }
               }
            }
            const finalResponse = parseNDJSONToAIChatResponse(buffer);
            setAiFullResponse(finalResponse); // 파싱된 결과를 상태에 저장
         } else {
            const json = await response.json();
            setAiFullResponse(json);
         }
      } catch (error) {
         console.error('Error sending message:', error);
         throw error;
      } finally {
         setIsLoading(false);
      }
   }
   useEffect(() => {
      console.log('ai full response', aiFullResponse);
   }, [aiFullResponse]);
   return {
      aiStreamedMessage,
      aiFullResponse,
      handleSendMessage,
      isLoading,
   };
}
