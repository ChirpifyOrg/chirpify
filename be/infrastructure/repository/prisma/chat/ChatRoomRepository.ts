import { ChatRoom } from '@/be/domain/chat/ChatRoom';
import { ChatRoomRepository } from '@/be/domain/chat/ChatRoomRepository';
import { chat_model, chat_rooms, Prisma } from '@/lib/generated/prisma';
import { ChatModelRepositoryImpl } from './ChatModelRepository';
import { BasePrismaRepository } from '../BasePrismaRepository';

type ChatRoomWithModel = chat_rooms & { chat_model: chat_model };

export class ChatRoomRepositoryImpl extends BasePrismaRepository implements ChatRoomRepository {
   async isUserInRoom({ roomId, userId }: { roomId: string; userId: string }): Promise<boolean> {
      try {
         const prismaModel = await this.prisma.chat_rooms.findUnique({
            where: { id: roomId },
         });

         if (!prismaModel) return false;

         return prismaModel.user_id === userId;
      } catch (e) {
         console.error('Error checking if user is in room:', e);
         throw e;
      }
   }
   // 채팅방 아이디를 통해 모델 정보를 같이 추출
   async findByIdWithModel(roomId: string) {
      try {
         const prismaModel = await this.prisma.chat_rooms.findUnique({
            where: { id: roomId },
            include: {
               chat_model: true,
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
         console.error('Error creating room:', e);
         return null; // 방 생성 실패 시 null 반환
      }
   }

   // Prisma 모델을 ChatRoom 엔터티로 변환
   static toEntity(prismaModel: chat_rooms & { chat_model?: chat_model }): ChatRoom {
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
                 chat_model_parameters: [],
              })
            : undefined,
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
}
