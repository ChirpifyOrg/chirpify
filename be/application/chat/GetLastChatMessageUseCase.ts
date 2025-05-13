import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';

export class GetLastChatMessageUseCase {
   constructor(protected unitOfWork: IUnitOfWorkChat) {
      unitOfWork;
   }
   async execute(roomId: string, startIndex?: string, endIndex?: string) {
      const response = await this.unitOfWork.chatRepository.getSimpleHistory({
         roomId,
         limit: 1,
         endIndex,
         startIndex,
      });
      if (response.length > 0) {
         return response[response.length - 1];
      } else {
         return null;
      }
   }
}
