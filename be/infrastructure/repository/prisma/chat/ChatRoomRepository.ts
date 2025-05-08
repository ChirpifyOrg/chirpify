import { ChatRoom } from '@/be/domain/chat/ChatRoom';
import { ChatRoomRepository } from '@/be/domain/chat/ChatRoomRepository';

import { ChatModelRepositoryImpl } from './ChatModelRepository';
import { BasePrismaRepository } from '../BasePrismaRepository';
import { chat_model, chat_rooms, Prisma } from '@prisma/client';
import { AppError } from '@/lib/be/utils/errors';

type ChatRoomWithModel = chat_rooms & { chat_model: chat_model };

export class ChatRoomRepositoryImpl extends BasePrismaRepository implements ChatRoomRepository {
   async getChatModelByChatRoomId(chatRoomId: string): Promise<ChatRoom | null> {
      const prismaModel = await this.prisma.chat_rooms.findFirst({
         where: {
            id: chatRoomId,
         },
         include: {
            chat_model: true,
         },
      });
      if (!prismaModel) return null;
      return ChatRoomRepositoryImpl.toEntity(prismaModel);
   }
   async isUserInRoom({ roomId, userId }: { roomId: string; userId: string }): Promise<boolean> {
      try {
         const prismaModel = await this.prisma.chat_rooms.findUnique({
            where: { id: roomId },
         });

         if (!prismaModel) return false;

         return prismaModel.user_id === userId;
      } catch (e) {
         console.error('Error checking if user is in room:', e);

         throw new AppError('Error checking if user in room');
      }
   }
   // 채팅방 아이디를 통해 모델 정보를 같이 추출
   async findByIdWithModel(roomId: string) {
      try {
         const prismaModel = await this.prisma.chat_rooms.findUnique({
            where: { id: roomId },
            include: {
               chat_model: {
                  include: {
                     chat_model_parameters: true,
                  },
               },
            },
         });

         if (!prismaModel) return null;

         return ChatRoomRepositoryImpl.toEntity(prismaModel as ChatRoomWithModel);
      } catch (e) {
         console.error('Error finding room with model:', e);
         throw e;
      }
   }

   // `userId`와 `modelId`를 통해 방이 있는지 확인
   async getRoomByUserIdAndModelId({ userId, modelId }: { userId: string; modelId: string }) {
      try {
         const prismaModel = await this.prisma.chat_rooms.findFirst({
            where: {
               user_id: userId,
               model_id: modelId,
            },
         });
         if (!prismaModel) return null;

         return ChatRoomRepositoryImpl.toEntity(prismaModel);
      } catch (e) {
         console.error('Error finding room by userId and modelId:', e);
         throw new AppError('Error finding room');
         throw e;
      }
   }

   // 방 생성
   async createRoom({ userId, modelId }: { userId: string; modelId: string }) {
      try {
         const prismaModel = await this.prisma.chat_rooms.create({
            data: {
               user_id: userId,
               model_id: modelId,
               // 추가적으로 필요한 필드가 있으면 여기에 포함할 수 있습니다.
            },
         });
         if (!prismaModel) return null;

         return ChatRoomRepositoryImpl.toEntity(prismaModel);
      } catch (e) {
         console.error('Error creaete room by userId and modelId:', e);

         throw new AppError('Error creaete room');
      }
   }

   // Prisma 모델을 ChatRoom 엔터티로 변환
   static toEntity(prismaModel: chat_rooms & { chat_model?: chat_model | null }): ChatRoom {
      return new ChatRoom({
         id: prismaModel.id,
         userId: prismaModel.user_id ?? undefined,
         modelId: prismaModel.model_id ?? undefined,
         createdAt: prismaModel.created_at,
         deletedAt: prismaModel.deleted_at ?? undefined,
         messages: [], // 메시지는 별도로 로드해야 함
         model: prismaModel.chat_model
            ? ChatModelRepositoryImpl.toEntity({
                 ...prismaModel.chat_model,
              })
            : undefined, // chat_model이 null일 경우 undefined로 처리
      });
   }

   static toPrisma(entity: ChatRoom): Prisma.chat_roomsUncheckedCreateInput {
      return {
         id: entity.id,
         user_id: entity.userId,
         model_id: entity.modelId,
         created_at: entity.createdAt,
         deleted_at: entity.deletedAt,
      };
   }

   // chatModelParameter 추가
   async addChatModelParameter(
      modelId: string,
      parameter: {
         defaultParam?: any;
         prompt?: string;
         isActive?: boolean;
         isStreaming?: boolean;
      },
   ) {
      try {
         const prismaModel = await this.prisma.chat_model_parameters.create({
            data: {
               chat_model_id: modelId,
               default_param: parameter.defaultParam,
               prompt: parameter.prompt,
               is_active: parameter.isActive ?? true,
               is_streaming: parameter.isStreaming ?? false,
            },
         });
         return prismaModel;
      } catch (e) {
         console.error('Error adding chat model parameter:', e);
         throw e;
      }
   }

   // 스트리밍 여부에 따라 chatModelParameter 조회
   async getChatModelParametersByStreaming(modelId: string, isStreaming: boolean) {
      try {
         const prismaModel = await this.prisma.chat_model_parameters.findMany({
            where: {
               chat_model_id: modelId,
               is_streaming: isStreaming,
               is_active: true,
            },
         });
         return prismaModel;
      } catch (e) {
         console.error('Error getting chat model parameters by streaming:', e);
         throw e;
      }
   }
}
