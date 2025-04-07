import { ChatRepository } from '@/be/domain/chat/ChatRepository';

export class ChatRepositoryImpl implements ChatRepository {
   saveChat(data: any, data2: any): Promise<void> {
      throw new Error('Method not implemented.');
   }
   getHistory(data: any): Promise<any> {
      throw new Error('Method not implemented.');
   }
}
