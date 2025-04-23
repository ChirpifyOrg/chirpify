import { AIChatSimpleFormatHistory } from '@/types/chat';
import { ChatMessage } from './ChatMessage';

export interface ChatRepository {
   saveChat(userData: ChatMessage, aiData: ChatMessage): Promise<void>;
   getSimpleHistory({
      roomId,
      startIndex,
      endIndex,
      limit,
   }: {
      roomId: string;
      startIndex: string | undefined;
      endIndex: string | undefined;
      limit: number | undefined;
   }): Promise<AIChatSimpleFormatHistory[]>;
   getMessageCountForUserInRoom(roomId: string): Promise<number>;
}
