import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';

export class GetChatModelByChatRoomIdUseCase {
   constructor(protected unitOfWork: IUnitOfWorkChat) {
      unitOfWork;
   }
   async execute() {
      return this.unitOfWork.chatModelRepository.getAvailableChatModels();
   }
}
