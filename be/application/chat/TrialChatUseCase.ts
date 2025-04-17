import { AIChatAPIResponse, AuthenticatedClientChatReuqest, ClientChatRequest } from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletion } from 'openai/resources';
import { ChatCompletionChunk, ChatCompletion as GPTChatFormat } from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
import { ChatRepository } from '@/be/domain/chat/ChatRepository';
import { ChatModelRepository } from '@/be/domain/chat/ChatModelRepository';
import { ChatRoomRepository } from '@/be/domain/chat/ChatRoomRepository';
import { ChatModel } from '@/be/domain/chat/ChatModel';
import { ForbiddenError, TooManyRequestsError } from '@/lib/be/utils/errors';

export class TrialChatUseCase extends ChatUseCase<AIChatAPIResponse, AuthenticatedClientChatReuqest, ChatCompletion> {
   constructor(
      protected chatService: ApiResponseGenerator<unknown, GPTChatFormat, ChatCompletionChunk>,
      protected chatRepository: ChatRepository,
      protected ChatModelRepository: ChatModelRepository,
      protected chatRoomRepository: ChatRoomRepository,
   ) {
      super(chatService, chatRepository, ChatModelRepository, chatRoomRepository);
   }
   private static get MAX_TRIAL_COUNT(): number {
      return parseInt(process.env.NEXT_PUBLIC_MAX_TRIAL_COUNT ?? '5', 10);
   }

   protected formatResponse(originResponse: ChatCompletion): AIChatAPIResponse {
      originResponse?.choices[0].message.content;
   }

   protected async formatRequest(
      request: AuthenticatedClientChatReuqest,
      modelInfo: ChatModel,
   ): Promise<ChatCompletionCreateParamsBase> {
      const defaultParam = modelInfo.defaultParam as ChatCompletionCreateParamsBase;
      defaultParam.messages.push({ role: 'user', content: request.message });
      defaultParam.stream = false;
      return defaultParam;
   }
   protected async formatStreamRequest(
      request: AuthenticatedClientChatReuqest,
      modelInfo: ChatModel,
   ): Promise<ChatCompletionCreateParamsBase> {
      const defaultParam = modelInfo.defaultParam as ChatCompletionCreateParamsBase;
      defaultParam.messages.push({ role: 'user', content: request.message });
      defaultParam.stream = true;
      return defaultParam;
   }

   protected async requestValidate(request: AuthenticatedClientChatReuqest): Promise<void> {
      const { roomId, userId } = request;
      const trialCount = await this.chatRepository.getMessageCountForUserInRoom(roomId);
      if (trialCount >= TrialChatUseCase.MAX_TRIAL_COUNT) {
         throw new TooManyRequestsError('Trial 최대 횟수를 초과하였습니다.');
      }
      const isUserOwnerOfRoom = await this.chatRoomRepository.isUserInRoom({ roomId, userId });
      if (!isUserOwnerOfRoom) {
         throw new ForbiddenError('잘못된 room 소유자 입니다.');
      }
   }
}
