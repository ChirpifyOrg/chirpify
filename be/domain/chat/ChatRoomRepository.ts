export interface ChatRoomRepository {
   createRoom();
   findByIdWidthModel(roomId: string);
}
