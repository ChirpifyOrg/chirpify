import { AIChatAPIResponse } from '@/types/chat';
import { ChatEvaluation, ChatFeedbackItem } from './ChatEvaluation';
import { ChatMetadata } from './ChatMetaData';

export class ChatMessage {
   id: string;
   roomId?: string;
   role?: string;
   message?: string;
   rawMessage?: any;
   createdAt: Date;
   evaluations: ChatEvaluation[];
   metadata?: ChatMetadata;
   seq?: number;

   constructor(props: {
      id?: string;
      roomId?: string;
      role?: string;
      message?: string;
      rawMessage?: any;
      createdAt?: Date;
      evaluations?: ChatEvaluation[];
      metadata?: ChatMetadata;
      seq?: number;
   }) {
      this.id = props.id || crypto.randomUUID();
      this.roomId = props.roomId;
      this.role = props.role;
      this.message = props.message;
      this.rawMessage = props.rawMessage;
      this.createdAt = props.createdAt || new Date();
      this.evaluations = props.evaluations || [];
      this.metadata = props.metadata;
      this.seq = props.seq;
   }

   static createFromUserMessage(roomId: string, message: string): ChatMessage {
      return new ChatMessage({
         roomId,
         role: 'user',
         message: message,
         rawMessage: { message },
      });
   }

   static createFromAIResponse(roomId: string, nativeLanguage: string, response: AIChatAPIResponse): ChatMessage {
      const metadata = new ChatMetadata({
         totalFeedback: response.total_feedback['en-US'],
         nativeTotalFeedback: response.total_feedback[nativeLanguage],
         nativeLanguage,
         difficultyLevel: response.difficulty_level,
         emotion: response.emotion,
         totalScore: response.total_score,
      });

      const evaluations = Object.entries(response.evaluation).map(([type, score]) => {
         const feedbackItems =
            response.feedback[type as keyof typeof response.feedback]?.map(
               item =>
                  new ChatFeedbackItem({
                     issue: item.issue,
                     description: item.description,
                  }),
            ) || [];

         return new ChatEvaluation({
            type,
            score,
            feedbackItems,
         });
      });

      return new ChatMessage({
         roomId,
         role: 'assistant',
         message: response.message,
         rawMessage: response,
         metadata,
         evaluations,
      });
   }
}
