import { AIModelRepository } from '@/be/domain/chat/AIModelRepository';
import { ChatRepository } from '@/be/domain/chat/ChatRepository';
import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
import { ClientChatRequest } from '@/types/chat';

/**
 * @description 채팅 관련 UseCase 추상 클래스
 *
 * @template T 반환 타입 (UseCase 실행 결과)
 * @template U 입력 타입 (클라이언트 요청 객체)
 * @template R 외부 서비스 반환 데이터 타입 (예: 응답의 메타데이터)
 */
export abstract class ChatUseCase<T, U extends ClientChatRequest, R> {
   constructor(
      protected chatService: ApiResponseGenerator<unknown, R>,
      protected chatRepository: ChatRepository,
      protected aiModelRepository: AIModelRepository,
   ) {}

   async processChat(request: U): Promise<T> {
      await this.requestValidate(request);
      const response = await this.requestChat(request);
      const formattedResponse = this.formatResponse(response);
      await this.storeChat(request, formattedResponse);
      return formattedResponse;
   }

   async processChatStreaming(request: U, onData: (chunk: string) => void): Promise<void> {
      let responseChunk: string[] = [];
      await this.requestValidate(request);
      const stream = await this.requestChatStreaming(request);
      for await (const chunk of stream) {
         responseChunk.push(chunk);
         onData(chunk);
      }
      const response = responseChunk.join('');
      const formattedResponse = this.formatResponse(response as R);
      await this.storeChat(request, formattedResponse);
   }

   async getHistory(roomId: string) {
      return this.chatRepository.getHistory(roomId);
   }
   /* 원본 응답 -> 클라이언트 전달 타입 변환 로직 */
   protected abstract formatResponse(originResponse: R): T;

   /*  비동기 요청 */
   protected async requestChat(request: U): Promise<R> {
      return this.chatService.generateResponse(request);
   }
   /* 비동기 스트리밍 요청 */
   protected async requestChatStreaming(request: U): Promise<AsyncIterable<string>> {
      return this.chatService.generateResponseStream(request);
   }

   protected abstract requestValidate(request: U): Promise<void>;

   protected async storeChat(request: U, response: T): Promise<void> {
      await this.chatRepository.saveChat(request, response);
   }
}
