import { useState } from 'react';
import { ChatMessage, AIFeedbackResponse, AIResponse } from '../../types/chat';

// 채팅 훅
export function useChat(data: ChatMessage[]) {
   const [messages, setMessages] = useState<ChatMessage[]>(data);
   const [selectedFeedback, setSelectedFeedback] = useState<AIFeedbackResponse | null>(null);
   const [isExpanded, setIsExpanded] = useState(false);

   const handleSendMessage = (content: string) => {
      const newMessage: ChatMessage = {
         id: String(Date.now()),
         content,
         sender: 'user',
         timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, newMessage]);
   };

   const lastAIResponse = messages.filter(m => m.sender === 'assistant').slice(-1)[0]?.content as AIResponse;

   return {
      messages,
      selectedFeedback,
      isExpanded,
      setSelectedFeedback,
      setIsExpanded,
      handleSendMessage,
      lastAIResponse: lastAIResponse?.message || '',
   };
}
