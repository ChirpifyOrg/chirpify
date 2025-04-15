export interface ChatRoomRepository {
   createRoom({ userId, modelId }: { userId: string; modelId: string });
   findByIdWithModel(roomId: string);
   getRoomIdByUserIdAndModelId({ userId, modelId }: { userId: string; modelId: string });
}
