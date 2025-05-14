import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';

export class GetLastChatMessageUseCase {
   constructor(protected unitOfWork: IUnitOfWorkChat) {
      unitOfWork;
   }
   async execute(roomId: string) {
      const response = await this.unitOfWork.chatRepository.getLastAIResponse(roomId);
      return response;
   }
}
