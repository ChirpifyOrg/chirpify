import {
   AIChatAPIResponse,
   AIChatAPIResponseSchema,
   AuthenticatedClientChatReuqest,
   defaultAIChatResponse,
} from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletion } from 'openai/resources';
import { ChatCompletionChunk, ChatCompletion as GPTChatFormat } from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
import { ChatModel } from '@/be/domain/chat/ChatModel';
import { ForbiddenError, NotFoundError, TooManyRequestsError, ValidationError } from '@/lib/be/utils/errors';
import { ChatMessage } from '@/be/domain/chat/ChatMessage';
import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';

export class TrialChatUseCase extends ChatUseCase<AIChatAPIResponse, AuthenticatedClientChatReuqest, ChatCompletion> {
   constructor(
      protected chatService: ApiResponseGenerator<ChatCompletionCreateParamsBase, GPTChatFormat, ChatCompletionChunk>,
      protected unitOfWork: IUnitOfWorkChat,
   ) {
      super(chatService, unitOfWork);
   }

   private static get MAX_TRIAL_COUNT(): number {
      return parseInt(process.env.NEXT_PUBLIC_MAX_TRIAL_COUNT ?? '5', 10);
   }

   async processChat(request: AuthenticatedClientChatReuqest): Promise<AIChatAPIResponse> {
      await this.requestValidate(request);
      const modelInfo = await this.unitOfWork.chatRoomRepository.findByIdWithModel(request.roomId);
      if (!modelInfo || !modelInfo.model) {
         throw new NotFoundError('채팅방이 존재하지 않습니다.');
      }
      const promptInput = await this.formatRequest(request, modelInfo.model);
      const response = await this.chatService.generateResponse(promptInput);
      return this.unitOfWork.executeInTransaction(async () => {
         const formattedResponse = this.formatResponse(response);
         await this.storeChat(request, formattedResponse);
         return formattedResponse;
      });
   }
   async processChatStreaming(request: AuthenticatedClientChatReuqest, onData: (chunk: string) => void): Promise<void> {
      await this.requestValidate(request);
      const modelInfo = await this.unitOfWork.chatRoomRepository.findByIdWithModel(request.roomId);
      if (!modelInfo || !modelInfo.model) {
         throw new NotFoundError('채팅방이 존재하지 않습니다.');
      }
      const promptInput = await this.formatStreamRequest(request, modelInfo.model);

      const stream = await this.chatService.generateResponseStream(promptInput);

      const responseChunks: string[] = [];
      let isFinished = false;
      for await (const chunk of stream) {
         const choice = chunk.choices[0];

         if (choice.delta?.content) {
            responseChunks.push(choice.delta.content);
            onData(choice.delta.content);
         }

         if (choice.finish_reason) {
            isFinished = true;
            break; // 스트림 끝났으면 빠져나오기
         }
      }
      if (!isFinished) {
         throw new Error('Stream이 비정상적으로 종료되었습니다.');
      }
      const response = responseChunks.join('');
      const formattedResponse = JSON.parse(response);
      await this.storeChat(request, formattedResponse);
   }
   protected formatResponse(originResponse: ChatCompletion): AIChatAPIResponse {
      const result = AIChatAPIResponseSchema.safeParse(JSON.parse(originResponse?.choices[0]?.message?.content ?? ''));
      if (result.error) {
         throw new ValidationError('응답 형식이 올바르지 않습니다. API 응답 형식을 확인해주세요.');
      }
      const parsed = result.success
         ? result.data
         : ({ ...defaultAIChatResponse, ...originResponse } as AIChatAPIResponse);
      return parsed;
   }

   protected async formatRequest(
      request: AuthenticatedClientChatReuqest,
      modelInfo: ChatModel,
   ): Promise<ChatCompletionCreateParamsBase> {
      const defaultParam = modelInfo.chatModelParameter[0].defaultParam as ChatCompletionCreateParamsBase;
      defaultParam.messages.push({ role: 'system', content: modelInfo.chatModelParameter[0].prompt ?? '' });
      defaultParam.messages.push({ role: 'user', content: request.message });
      defaultParam.stream = false;
      return defaultParam;
   }

   protected async formatStreamRequest(
      request: AuthenticatedClientChatReuqest,
      modelInfo: ChatModel,
   ): Promise<ChatCompletionCreateParamsBase> {
      const defaultParam = modelInfo.chatModelParameter[0].defaultParam as ChatCompletionCreateParamsBase;
      defaultParam.messages.push({ role: 'system', content: modelInfo.chatModelParameter[0].prompt ?? '' });
      defaultParam.messages.push({ role: 'user', content: request.message });
      defaultParam.stream = true;
      return defaultParam;
   }

   protected async requestValidate(request: AuthenticatedClientChatReuqest): Promise<void> {
      const { roomId, userId } = request; // this = trailChatUseCase , proxy = Proxy(UnitOfWorkChat)
      const trialCount = await this.unitOfWork.chatRepository.getMessageCountForUserInRoom(roomId); // 내부의 respository 구현체에서 에러
      if (trialCount >= TrialChatUseCase.MAX_TRIAL_COUNT) {
         throw new TooManyRequestsError('Trial 최대 횟수를 초과하였습니다.');
      }
      const isUserOwnerOfRoom = await this.unitOfWork.chatRoomRepository.isUserInRoom({ roomId, userId });
      if (!isUserOwnerOfRoom) {
         throw new ForbiddenError('잘못된 room 소유자 입니다.');
      }
   }

   protected async storeChat(request: AuthenticatedClientChatReuqest, response: AIChatAPIResponse): Promise<void> {
      const { roomId, message, nativeLanguage } = request;

      const userData = ChatMessage.createFromUserMessage(roomId, message);
      const aiData = ChatMessage.createFromAIResponse(roomId, nativeLanguage, response);
      await this.unitOfWork.chatRepository.saveChat(userData, aiData);
   }
}
