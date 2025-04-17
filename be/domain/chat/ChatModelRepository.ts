import { ChatModel } from './ChatModel';

export interface ChatModelRepository {
   getLastModelInfo(name: string): Promise<ChatModel | null>;
}
