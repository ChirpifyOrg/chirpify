import { AIChatAPIResponse, AIChatAPIResponseSchema, AuthenticatedClientChatReuqest } from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletionChunk, ChatCompletion as GPTChatFormat } from 'openai/resources';
import { ChatRepository } from '@/be/domain/chat/ChatRepository';
import { AIModelRepository } from '@/be/domain/chat/AIModelRepository';
import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
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
 * @param {ChatRepository} chatRepository - 채팅 기록을 저장하고 조회하는 리포지토리입니다.
 *
 * @param {AIModelRepository} aiModelRepository - AI 모델 정보를 관리하는 리포지토리입니다.
 */
// TODO : [현재 GPT API 의존] GPT API가 아닌 다른 LLM도 지원하도록 Generic 공통 interface 개발 및 변경 필요.
export class AuthenticationChatUseCase extends ChatUseCase<
   AIChatAPIResponse,
   AuthenticatedClientChatReuqest,
   GPTChatFormat
> {
   constructor(
      protected chatService: ApiResponseGenerator<unknown, GPTChatFormat, ChatCompletionChunk>,
      protected chatRepository: ChatRepository,
      protected aiModelRepository: AIModelRepository,
   ) {
      super(chatService, chatRepository, aiModelRepository);
   }
   protected formatResponse(originResponse: GPTChatFormat): AIChatAPIResponse {
      try {
         const response = JSON.parse(originResponse.choices[0].message.content ?? '');
         console.log(response);
         const validatedResponse = AIChatAPIResponseSchema.parse(response);
         return validatedResponse;
      } catch (e) {
         console.error(e);
         throw new Error('Method not implemented.');
      }
   }
   protected async requestValidate(request: AuthenticatedClientChatReuqest): Promise<void> {
      // TODO : 여기서 방의 소유권을 확인하는 절차 작성.
      const { userId, roomId } = request;
   }

   async processChatStreaming(request: AuthenticatedClientChatReuqest, onData: (chunk: string) => void): Promise<void> {
      let responseChunk: string[] = [];
      await this.requestValidate(request);
      const stream = await this.chatService.generateResponseStream(request);
      for await (const chunk of stream) {
         const content = chunk.choices[0].delta?.content; // Optional chaining 사용
         if (typeof content === 'string') {
            // content가 string인지 확인
            responseChunk.push(content);
            onData(content);
         }
      }
      const response = responseChunk.join('');
      const formattedResponse = this.formatResponse(JSON.parse(response) as GPTChatFormat);
      await this.storeChat(request, formattedResponse);
   }
}
