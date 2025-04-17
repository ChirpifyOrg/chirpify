import { ChatModelRepository } from '@/be/domain/chat/ChatModelRepository';
import { ChatRepository } from '@/be/domain/chat/ChatRepository';
import { ApiResponseGenerator } from '@/be/domain/ApiResponseGenerator';
import { ClientChatRequest } from '@/types/chat';
import { ChatRoomRepository } from '@/be/domain/chat/ChatRoomRepository';

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
      protected ChatModelRepository: ChatModelRepository,
      protected chatRoomRepository: ChatRoomRepository,
   ) {}

   async processChat(request: U): Promise<T> {
      await this.requestValidate(request);
      const modelInfo = await this.chatRoomRepository.findByIdWithModel(request.roomId);
      const promptInput = await this.formatRequest(request, modelInfo);
      const response = await this.chatService.generateResponse(promptInput);
      const formattedResponse = this.formatResponse(response);
      await this.storeChat(request, formattedResponse);
      return formattedResponse;
   }

   async processChatStreaming(request: U, onData: (chunk: string) => void): Promise<void> {
      let responseChunk: string[] = [];
      await this.requestValidate(request);
      const modelInfo = await this.chatRoomRepository.findByIdWithModel(request.roomId);
      const promptInput = await this.formatStreamRequest(request, modelInfo);
      const stream = await this.chatService.generateResponseStream(promptInput);
      for await (const chunk of stream) {
         responseChunk.push(chunk as string);
         onData(chunk as string);
      }
      const response = responseChunk.join('');
      const formattedResponse = this.formatResponse(response as R);
      await this.storeChat(request, formattedResponse);
   }

   /* 원본 응답 -> 클라이언트 전달 타입 변환 로직 */
   protected abstract formatResponse(originResponse: R): T;

   // TODO : 추후 strategy pattern으로 변경 가능하다면 변경하는게 좋아보임.
   protected abstract formatRequest(request: U, modelInfo: unknown): unknown;
   protected abstract formatStreamRequest(request: U, modelInfo: unknown): unknown;

   protected abstract requestValidate(request: U): Promise<void>;
   protected async storeChat(request: U, response: T): Promise<void> {
      await this.chatRepository.saveChat(request, response);
   }

   // TODO : 추후 UseCase 분리가 가능하다면 아래 메소드부터는 분리 권장
   async getHistory(roomId: string) {
      return this.chatRepository.getHistory(roomId);
   }
   async getOrCreateRoom({ userId, modelId }: { userId: string; modelId: string }) {
      const existing = await this.chatRoomRepository.getRoomByUserIdAndModelId({ userId, modelId });
      if (existing) return existing;

      const created = await this.chatRoomRepository.createRoom({ userId, modelId });
      return created;
   }
   async getLatestModelInfo({ name }: { name: string }) {
      return this.ChatModelRepository.getLastModelInfo(name);
   }
}
