'use client';
import { AIChatAPIResponse, AIChatFeedBackAndScore } from '@/types/chat';
import { useState } from 'react';
// import { fetchWithTypedBody } from './useFetchData';
import { API_ENDPOINTS } from '@/lib/fe/api-endpoints';
import { mockAIChatResponseData } from '@/lib/fe/mock/ai-chat-response-data';

// 피드백 후크
export function useFeedBack(roomId: string) {
   const [selectedFeedback, setSelectedFeedback] = useState<AIChatFeedBackAndScore | null>(null);

   async function onShowFeedback({ messageId, clientSendMessage }: onShowFeedbackProps) {
      try {
         API_ENDPOINTS.getChatFeedBack({ roomId, messageId });
         // const response = await fetchWithTypedBody<unknown, AIChatAPIResponse>(
         //  ,API_ENDPOINTS.getChatFeedBack(roomId, messageId)
         //    {
         //       method: 'GET',
         //    },
         // );
         setSelectedFeedback(convertToFeedBackAndScore(mockAIChatResponseData, clientSendMessage));
      } catch (error) {
         console.error('Error sending message:', error);
      }
   }

   return {
      selectedFeedback,
      onShowFeedback,
   };
}
function convertToFeedBackAndScore(data: AIChatAPIResponse, clientSendMessage: string): AIChatFeedBackAndScore {
   const { evaluation, feedback, total_score, total_feedback, difficulty_level } = data;
   return {
      difficulty_level,
      evaluation,
      feedback,
      total_feedback,
      total_score,
      userMessage: clientSendMessage,
   };
}
export type onShowFeedBackFn = {
   ({ messageId, clientSendMessage }: onShowFeedbackProps): void;
};
export type onShowFeedbackProps = {
   messageId: string;
   clientSendMessage: string;
};
