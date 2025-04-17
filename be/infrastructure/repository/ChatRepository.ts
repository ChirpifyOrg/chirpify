import { ChatRepository } from '@/be/domain/chat/ChatRepository';
import { PrismaClient } from '@/lib/generated/prisma';

export class ChatRepositoryImpl implements ChatRepository {
   constructor(private readonly prisma: PrismaClient = prisma) {}

   async getMessageCountForUserInRoom(roomId: string): Promise<number> {
      const count = await this.prisma.chat_message.count({
         where: { room_id: roomId },
      });
      return count;
   }
   saveChat(data: any, data2: any): Promise<void> {
      throw new Error('Method not implemented.');
   }
   getHistory(data: any): Promise<any> {
      throw new Error('Method not implemented.');
   }
}
