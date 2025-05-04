import { ChatRoom } from './ChatRoom';

export interface ChatRoomRepository {
   createRoom({ userId, modelId }: { userId: string; modelId: string }): Promise<ChatRoom | null>;
   findByIdWithModel(roomId: string): Promise<ChatRoom | null>;
   getRoomByUserIdAndModelId({ userId, modelId }: { userId: string; modelId: string }): Promise<ChatRoom | null>;
   isUserInRoom({ roomId, userId }: { roomId: string; userId: string }): Promise<boolean>;
}
