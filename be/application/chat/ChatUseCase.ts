import { ApiResponseGenerator } from '@/be/application/ApiResponseGenerator';
import { AIChatAPIResponse, AIChatSimpleFormatHistory, AuthenticatedClientChatReuqest } from '@/types/chat';
import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';
import { NotFoundError, ForbiddenError } from '@/lib/be/utils/errors';
import { ChatRoom } from '@/be/domain/chat/ChatRoom';
import { ChatModel } from '@/be/domain/chat/ChatModel';
import { ChatMessage } from '@/be/domain/chat/ChatMessage';

/**
 * @description 채팅 관련 UseCase 추상 클래스
 *
 * @template T 반환 타입 (UseCase 실행 결과)
 * @template U 입력 타입 (클라이언트 요청 객체)
 * @template R 외부 서비스 반환 데이터 타입 (예: 응답의 메타데이터)
 */
export abstract class ChatUseCase<T extends AIChatAPIResponse, U extends AuthenticatedClientChatReuqest, R> {
   constructor(
      protected chatService: ApiResponseGenerator<unknown, R>,
      protected unitOfWork: IUnitOfWorkChat,
   ) {}

   async processChat(request: U): Promise<T> {
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

   async processChatStreaming(request: U, onData: (chunk: string) => void): Promise<void> {
      try {
         await this.unitOfWork.beginTransaction();

         let responseChunk: string[] = [];
         await this.requestValidate(request);
         const modelInfo = await this.unitOfWork.chatRoomRepository.findByIdWithModel(request.roomId);
         const promptInput = await this.formatStreamRequest(request, modelInfo);
         const stream = await this.chatService.generateResponseStream(promptInput);
         for await (const chunk of stream) {
            responseChunk.push(chunk as string);
            onData(chunk as string);
         }
         const response = responseChunk.join('');
         const formattedResponse = this.formatResponse(response as unknown as R);
         await this.storeChat(request, formattedResponse);

         await this.unitOfWork.commit();
      } catch (error) {
         await this.unitOfWork.rollback();
         throw error;
      }
   }

   /* 원본 응답 -> 클라이언트 전달 타입 변환 로직 */
   protected abstract formatResponse(originResponse: R): T;
   // TODO : 추후 strategy pattern으로 변경 가능하다면 변경하는게 좋아보임.
   protected abstract formatRequest(request: U, modelInfo: unknown): unknown;

   protected abstract formatStreamRequest(request: U, modelInfo: unknown): unknown;

   // protected abstract requestValidate(request: U): Promise<void>;

   protected async requestValidate(request: U): Promise<void> {
      const { userId } = request;

      const modelInfo = await this.unitOfWork.chatRoomRepository.findByIdWithModel(request.roomId);
      if (!modelInfo || !modelInfo.model) {
         throw new NotFoundError('채팅방이 존재하지 않습니다.');
      }
      if (!modelInfo.isUserOwnerOfRoom(userId)) {
         throw new ForbiddenError('잘못된 room 소유자 입니다.');
      }
   }
   protected async storeChat(request: AuthenticatedClientChatReuqest, response: AIChatAPIResponse): Promise<void> {
      const { roomId, message, nativeLanguage } = request;

      const userData = ChatMessage.createFromUserMessage(roomId, message);
      const aiData = ChatMessage.createFromAIResponse(roomId, nativeLanguage, response);
      await this.unitOfWork.chatRepository.saveChat(userData, aiData);
   }
   // TODO : 추후 UseCase 분리가 가능하다면 아래 메소드부터는 분리 권장
   async getHistory({
      roomId,
      startIndex,
      endIndex,
      limit,
   }: {
      roomId: string;
      startIndex?: string | undefined;
      endIndex?: string | undefined;
      limit: number | undefined;
   }): Promise<AIChatSimpleFormatHistory[]> {
      return this.unitOfWork.chatRepository.getSimpleHistory({ roomId, startIndex, endIndex, limit: limit ?? 10 });
   }
   async getOrCreateRoom({ userId, modelId }: { userId: string; modelId: string }) {
      const existing = await this.unitOfWork.chatRoomRepository.getRoomByUserIdAndModelId({ userId, modelId });
      if (existing) return existing;

      const created = await this.unitOfWork.chatRoomRepository.createRoom({ userId, modelId });
      return created;
   }
   async getLatestModelInfo({ name, isStreaming }: { name: string; isStreaming: boolean }) {
      return this.unitOfWork.chatModelRepository.getLastModelInfo(name, isStreaming);
   }
   protected async getModelInfo(roomId: string): Promise<{ room: ChatRoom; model: ChatModel }> {
      const modelInfo = await this.unitOfWork.chatRoomRepository.findByIdWithModel(roomId);
      if (!modelInfo?.model) {
         throw new NotFoundError('채팅방 모델 정보를 찾을 수 없습니다.');
      }
      return { room: modelInfo, model: modelInfo.model };
   }
}
