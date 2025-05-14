import { ChatMessage } from '@/be/domain/chat/ChatMessage';
import { ChatRepository } from '@/be/domain/chat/ChatRepository';
import { objectCamelToSnake } from '@/lib/case-utils';
import { AIChatSimpleFormatHistory } from '@/types/chat';
import type { ChatRole } from '@/types/chat';
import { BasePrismaRepository } from '../BasePrismaRepository';

export class ChatRepositoryImpl extends BasePrismaRepository implements ChatRepository {
   async getLastAIResponse(roomId: string): Promise<AIChatSimpleFormatHistory | null> {
      try {
         const messages = await this.prisma.chat_message.findFirst({
            where: {
               room_id: roomId,
               role: 'assistant',
            },
            select: {
               id: true,
               room_id: true,
               message: true,
               role: true,
               chat_metadata: true,
               created_at: true,
               seq: true,
            },
            orderBy: [{ seq: 'desc' }], //,
         });

         if (!messages) return null; // Handle null case
         return this.mapToSimpleHistory(messages);
      } catch (error) {
         console.error('Error finding messages:', error);
         throw new Error('Failed to retrieve chat history');
      }
   }
   async getMessageCountForUserInRoom(roomId: string): Promise<number> {
      try {
         return await this.prisma.chat_message.count({
            where: { room_id: roomId },
         });
      } catch (error) {
         console.error('Error getting message count:', error);
         throw new Error('Failed to get message count');
      }
   }

   async saveChat(userData: ChatMessage, aiData: ChatMessage): Promise<void> {
      try {
         const roomExists = await this.prisma.chat_rooms.findUnique({
            where: { id: userData.roomId },
         });
         const exclude = {
            paths: new Set(['rawMessage.totalFeedBack']), // 이 경로는 통째로 변환 안함
         };
         console.log(roomExists);
         await this.prisma.chat_message.create({
            data: objectCamelToSnake(this.mapChatMessageToPrismaInput(userData)),
         });
         await this.prisma.chat_message.create({
            data: objectCamelToSnake(this.mapChatMessageToPrismaInput(aiData), exclude),
         });
      } catch (error) {
         console.error('Error saving chat:', error);
         throw new Error('Failed to save chat messages');
      }
   }

   private async findMessages(params: {
      roomId: string;
      startIndex?: string;
      limit: number;
   }): Promise<AIChatSimpleFormatHistory[]> {
      const { roomId, startIndex, limit } = params;

      const where = startIndex ? { room_id: roomId, created_at: { lt: startIndex } } : { room_id: roomId };

      try {
         const messages = await this.prisma.chat_message.findMany({
            where,
            select: {
               id: true,
               room_id: true,
               message: true,
               role: true,
               chat_metadata: true,
               created_at: true,
               seq: true,
            },
            orderBy: { seq: 'desc' },
            take: limit,
         });

         return messages.map(this.mapToSimpleHistory);
      } catch (error) {
         console.error('Error finding messages:', error);
         throw new Error('Failed to retrieve chat history');
      }
   }

   async getSimpleHistory({
      roomId,
      startIndex,
      endIndex,
      limit,
   }: {
      roomId: string;
      startIndex: string | undefined;
      endIndex: string | undefined;
      limit: number;
   }): Promise<AIChatSimpleFormatHistory[]> {
      if (!startIndex && !endIndex) {
         return await this.findMessages({ roomId, limit });
      }

      if (startIndex) {
         return await this.findMessages({ roomId, startIndex, limit });
      }

      return [];
   }

   private mapToSimpleHistory(msg: {
      id: string;
      room_id: string | null;
      message: any;
      role: string | null;
      created_at: Date;
      seq: number | null;
   }): AIChatSimpleFormatHistory {
      return {
         id: msg.id,
         roomId: msg.room_id ?? '',
         message: typeof msg.message === 'string' ? msg.message : JSON.stringify(msg.message ?? {}),
         role: (msg.role?.toLowerCase() === 'user' ? 'User' : 'Assistant') as ChatRole,
         createdAt: msg.created_at.toISOString(),
         seq: msg.seq ?? 0,
      };
   }

   private mapChatMessageToPrismaInput(entity: ChatMessage): any {
      const { id, roomId, role, message, rawMessage, createdAt, evaluations } = entity;

      const result: Record<string, any> = {
         id,
         room_id: roomId,
         role,
         message,
         raw_message: rawMessage,
         created_at: createdAt,
      };

      // chat_evaluations가 있을 경우 nested write 구성
      if (evaluations && evaluations.length > 0) {
         result.chat_evaluations = {
            create: evaluations.map(e => ({
               id: e.id,
               type: e.type,
               score: e.score !== undefined && e.score !== null ? BigInt(e.score) : undefined,
               created_at: e.createdAt,
               chat_feedback:
                  e.feedbackItems && e.feedbackItems.length > 0
                     ? {
                          create: e.feedbackItems.map(f => ({
                             id: f.id,
                             issue: f.issue,
                             description: f.description,
                             created_at: f.createdAt,
                          })),
                       }
                     : undefined,
            })),
         };
      }

      // nullish 값 제거
      Object.keys(result).forEach(key => {
         if (result[key] === undefined || result[key] === null) {
            delete result[key];
         }
      });

      return result;
   }
}
