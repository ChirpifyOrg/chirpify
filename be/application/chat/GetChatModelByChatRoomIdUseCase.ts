import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';

export class GetChatModelByChatRoomIdUseCase {
   constructor(protected unitOfWork: IUnitOfWorkChat) {
      unitOfWork;
   }
   async execute(chatRoomId: string) {
      return this.unitOfWork.chatRoomRepository.getChatModelByChatRoomId(chatRoomId);
   }
}
