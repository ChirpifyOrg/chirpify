import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';
import { ChatCompletionChunk, ChatCompletion as GPTChatFormat } from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

export class FeedBackUseCase {
   constructor(
      private readonly chatService: ApiResponseGenerator<
         ChatCompletionCreateParamsBase,
         GPTChatFormat,
         ChatCompletionChunk
      >,
      private readonly unitOfWork: IUnitOfWorkChat,
   ) {}

   async execute(chatRoomId: string) {
      return this.unitOfWork.chatRoomRepository.getChatModelByChatRoomId(chatRoomId);
   }
}
