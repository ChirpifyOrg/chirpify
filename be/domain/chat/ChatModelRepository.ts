import { ChatModel } from './ChatModel';

export interface ChatModelRepository {
   getLastModelInfo(name: string, isStreaming: boolean): Promise<ChatModel | null>;
   getAvailableChatModels(): Promise<ChatModel[] | null>;
   getChatModelByChatRoomId(): Promise<ChatModel | null>;
}
