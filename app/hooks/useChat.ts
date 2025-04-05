import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { ClientChatRequest, ClientStoredAIChatMessage, StoredAIChatMessage, StoredUserChatMessage } from '@/types/chat';
import { clientStoredAIChatMessageState } from '../state/atom';

// 채팅 훅
export function useChat(data: ClientStoredAIChatMessage[], isLoggedIn: boolean) {
   const [messages, setMessages] = useState<ClientStoredAIChatMessage[]>(data);
   const [isExpanded, setIsExpanded] = useState(false);

   const setClientStoredMessages = useSetRecoilState(clientStoredAIChatMessageState);

   const handleSendMessage = async (content: ClientChatRequest) => {
      try {
         const response = await fetch(`/api/chat/${content.roomId}/message`, {
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

         const decoder = new TextDecoder();
         let buffer = '';
         const processedMessages: any[] = [];

         if (response.body) {
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
                        console.log(trimmedLine);
                        const parsedMessage = JSON.parse(trimmedLine);
                        processedMessages.push(parsedMessage);
                        console.log('Received message:', parsedMessage);
                     } catch (error) {
                        console.error('JSON parsing error:', error, 'for line:', trimmedLine);
                     }
                  }
               }
            }
         }

         // 마지막에 메시지 처리
         const newMessage = convertChatRequestToStoredMessage(content);
         setClientStoredMessages(prev => [...prev, newMessage]);

         // 필요하다면 받은 메시지들 사용 가능
         console.log('All processed messages:', processedMessages);
      } catch (error) {
         console.error('Error sending message:', error);
      }
   };

   return {
      messages,
      isExpanded,
      setIsExpanded,
      handleSendMessage,
   };
}

function convertChatRequestToStoredMessage(content: ClientChatRequest): StoredUserChatMessage {
   const { message, nativeLanguage } = content;
   return {
      id: String(Date.now()), // 고유 ID 생성
      roomId: content.roomId,
      message,
      content: {
         message, // 메시지 내용
         nativeLanguage, // 네이티브 언어
      },
      role: 'User',
      createdAt: new Date().toISOString(), // 현재 시간으로 생성일시 설정
   };
}
