import {
   AIChatAPIResponse,
   AIChatAPIResponseSchema,
   AuthenticatedClientChatReuqest,
   defaultAIChatResponse,
   parseNDJSONToAIChatResponse,
} from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletion } from 'openai/resources';
import { ChatCompletionChunk, ChatCompletion as GPTChatFormat } from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';
import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
import { ChatModel } from '@/be/domain/chat/ChatModel';
import { TooManyRequestsError, ValidationError, NotFoundError } from '@/lib/be/utils/errors';
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

   protected async requestValidate(request: AuthenticatedClientChatReuqest): Promise<void> {
      super.requestValidate(request);
      const { roomId } = request;
      const trialCount = await this.unitOfWork.chatRepository.getMessageCountForUserInRoom(roomId);
      if (trialCount >= TrialChatUseCase.MAX_TRIAL_COUNT) {
         throw new TooManyRequestsError('Trial 최대 횟수를 초과하였습니다.');
      }
   }

   async processChat(request: AuthenticatedClientChatReuqest): Promise<AIChatAPIResponse> {
      await this.requestValidate(request);
      const { model } = await this.getModelInfo(request.roomId);
      const promptInput = await this.formatRequest(request, model);
      const response = await this.chatService.generateResponse(promptInput);
      return this.unitOfWork.executeInTransaction(async () => {
         const formattedResponse = this.formatResponse(response);
         await this.storeChat(request, formattedResponse);
         return formattedResponse;
      });
   }

   async processChatStreaming(request: AuthenticatedClientChatReuqest, onData: (chunk: string) => void): Promise<void> {
      await this.requestValidate(request);
      const { model } = await this.getModelInfo(request.roomId);

      const promptInput = await this.formatStreamRequest(request, model);
      const stream = await this.chatService.generateResponseStream(promptInput);
      const responseChunks: string[] = [];

      for await (const chunk of stream) {
         const choice = chunk.choices[0];

         if (choice.delta?.content) {
            responseChunks.push(choice.delta.content);
            onData(choice.delta.content);
         }
      }

      const raw = responseChunks.join('');
      const jsonLines = raw.split(/(?<=})\s*(?={)/); // 안전하게 줄 나누기
      const ndjson = jsonLines.join('\n');
      const cleanNdJson = ndjson.replace(/```[\s\S]*?```/g, function (match) {
         // 코드 블록 안의 내용만 추출 (``` 제거)
         return match.replace(/```[\s]?(?:\w+)?[\s]?|```$/g, '');
      });
      const formattedResponse = parseNDJSONToAIChatResponse(cleanNdJson);
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
      // 비스트리밍 파라미터만 필터링
      const nonStreamingParameters = modelInfo.getParametersByStreaming(false);
      if (nonStreamingParameters.length === 0) {
         throw new NotFoundError('비스트리밍 파라미터가 설정되지 않았습니다. 지원 여부를 확인해 주세요');
      }
      const defaultParam = nonStreamingParameters[0].defaultParam as ChatCompletionCreateParamsBase;
      defaultParam.messages.push({ role: 'system', content: nonStreamingParameters[0].prompt ?? '' });
      defaultParam.messages.push({ role: 'user', content: request.message });
      defaultParam.stream = false;
      return defaultParam;
   }

   protected async formatStreamRequest(
      request: AuthenticatedClientChatReuqest,
      modelInfo: ChatModel,
   ): Promise<ChatCompletionCreateParamsBase> {
      // 스트리밍 파라미터만 필터링
      const streamingParameters = modelInfo.getParametersByStreaming(true);
      if (streamingParameters.length === 0) {
         throw new NotFoundError('스트리밍 파라미터가 설정되지 않았습니다. 지원 여부를 확인해 주세요');
      }
      const defaultParam = streamingParameters[0].defaultParam as ChatCompletionCreateParamsBase;
      defaultParam.messages.push({ role: 'system', content: streamingParameters[0].prompt ?? '' });
      defaultParam.messages.push({ role: 'user', content: request.message });
      defaultParam.stream = true;
      return defaultParam;
   }

   protected async storeChat(request: AuthenticatedClientChatReuqest, response: AIChatAPIResponse): Promise<void> {
      const { roomId, message, nativeLanguage } = request;

      const userData = ChatMessage.createFromUserMessage(roomId, message);
      const aiData = ChatMessage.createFromAIResponse(roomId, nativeLanguage, response);
      await this.unitOfWork.chatRepository.saveChat(userData, aiData);
   }
}
