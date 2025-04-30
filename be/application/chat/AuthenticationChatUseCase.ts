import {
   AIChatAPIResponse,
   AIChatAPIResponseSchema,
   AuthenticatedClientChatReuqest,
   defaultAIChatResponse,
} from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletionChunk, ChatCompletion as GPTChatFormat } from 'openai/resources';
import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
import { ForbiddenError, NotFoundError, ValidationError } from '@/lib/be/utils/errors';
import { ChatCompletion, ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { ChatModel } from '@/be/domain/chat/ChatModel';
import { ChatMessage } from '@/be/domain/chat/ChatMessage';
import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';
/**
 * @class AuthenticationChatUseCase
 * @extends ChatUseCase
 *
 * @description
 * 로그인된 사용자를 위한 채팅 유즈케이스 클래스입니다.
 * 이 클래스는 인증된 사용자의 채팅 요청을 처리하고,
 * OpenAI API와의 상호작용을 통해 응답을 생성합니다.
 *
 * @template AIChatAPIResponse - 반환되는 API 응답의 타입
 * @template AuthenticatedClientChatReuqest - 클라이언트 요청의 타입
 * @template GPTChatFormat - OpenAI API의 응답 형식
 *
 * @param {ApiResponseGenerator<unknown, GPTChatFormat, ChatCompletionChunk>} chatService -
 * OpenAI API와의 상호작용을 담당하는 서비스입니다.
 *
 * @param {IUnitOfWorkChat}  unitOfWork- UoW 패턴을 통해 chat domain repository를 warpping
 */
// TODO : [현재 GPT API 의존] GPT API가 아닌 다른 LLM도 지원하도록 Generic 공통 interface 개발 및 변경 필요.
export class AuthenticationChatUseCase extends ChatUseCase<
   AIChatAPIResponse,
   AuthenticatedClientChatReuqest,
   GPTChatFormat
> {
   constructor(
      protected chatService: ApiResponseGenerator<unknown, GPTChatFormat, ChatCompletionChunk>,
      protected unitOfWork: IUnitOfWorkChat,
   ) {
      super(chatService, unitOfWork);
   }

   async processChat(request: AuthenticatedClientChatReuqest): Promise<AIChatAPIResponse> {
      try {
         await this.unitOfWork.beginTransaction();

         await this.requestValidate(request);
         const modelInfo = await this.unitOfWork.chatRoomRepository.findByIdWithModel(request.roomId);
         if (!modelInfo || !modelInfo.model) {
            throw new NotFoundError('채팅방이 존재하지 않습니다.');
         }
         const promptInput = await this.formatRequest(request, modelInfo.model);
         const response = await this.chatService.generateResponse(promptInput);
         const formattedResponse = this.formatResponse(response);
         await this.storeChat(request, formattedResponse);

         await this.unitOfWork.commit();
         return formattedResponse;
      } catch (error) {
         await this.unitOfWork.rollback();
         throw error;
      }
   }

   async processChatStreaming(request: AuthenticatedClientChatReuqest, onData: (chunk: string) => void): Promise<void> {
      await this.requestValidate(request);
      const { model } = await this.getModelInfo(request.roomId);
      const promptInput = await this.formatStreamRequest(request, model);
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
      const { roomId, userId } = request;
      const isUserOwnerOfRoom = await this.unitOfWork.chatRoomRepository.isUserInRoom({ roomId, userId });
      if (!isUserOwnerOfRoom) {
         throw new ForbiddenError('잘못된 room 소유자 입니다.');
      }
   }
}
