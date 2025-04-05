export interface ChatRepository {
   saveChat(data: any, data2: any): Promise<void>;
   getHistory(data: any): Promise<any>;
}
