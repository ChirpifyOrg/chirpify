import { ChatModel } from '@/be/domain/chat/ChatModel';
import { ChatModelRepository } from '@/be/domain/chat/ChatModelRepository';

import { BasePrismaRepository } from '../BasePrismaRepository';
import { ChatModelParameter } from '@/be/domain/chat/ChatModelParameter';
import { chat_model, chat_model_parameters, Prisma } from '@prisma/client';

/**
 * ChatModelRepositoryImpl 클래스
 *
 * Prisma ORM을 사용하여 ChatModel 엔티티에 대한 데이터베이스 작업을 처리하는 리포지토리 구현체입니다.
 * 채팅 모델 조회, 채팅방 ID 기반 모델 검색, 활성화된 모델 목록 조회 등의 기능을 제공합니다.
 * 도메인 엔티티와 Prisma 모델 간의 변환 메서드를 포함합니다.
 *
 */

export class ChatModelRepositoryImpl extends BasePrismaRepository implements ChatModelRepository {
   async getAvailableChatModels(): Promise<ChatModel[] | null> {
      const prismaModels = await this.prisma.chat_model.findMany({
         where: {
            chat_model_parameters: {
               some: {
                  is_active: true,
               },
            },
         },
         include: {
            chat_model_parameters: {
               where: {
                  is_active: true, // 비활성화 파라미터는 포함하지 않음
               },
            },
         },
         orderBy: {
            created_at: 'desc',
         },
      });

      if (!prismaModels || prismaModels.length === 0) return null;

      const entity = prismaModels.map(model => ChatModelRepositoryImpl.toEntity(model));
      return entity;
   }
   // persona 이름으로 마지막 모델 정보 가져오기
   async getLastModelInfo(name: string, isStreaming: boolean) {
      const prismaModel = await this.prisma.chat_model.findFirst({
         where: { persona: name, chat_model_parameters: { some: { is_streaming: isStreaming, is_active: true } } },
         include: {
            chat_model_parameters: true,
         },
         orderBy: { created_at: 'desc' },
      });
      if (!prismaModel) return null;
      return ChatModelRepositoryImpl.toEntity(prismaModel);
   }

   static toEntity(prismaModel: chat_model & { chat_model_parameters?: chat_model_parameters[] }): ChatModel {
      const chatModelParameters =
         prismaModel?.chat_model_parameters?.map(
            param =>
               new ChatModelParameter({
                  id: param.id,
                  prompt: param.prompt ?? undefined,
                  defaultParam: param.default_param,
                  isActive: param.is_active ?? true,
                  isStreaming: param.is_streaming ?? false,
                  createdAt: param.created_at,
               }),
         ) ?? [];

      return new ChatModel({
         id: prismaModel.id,
         persona: prismaModel.persona ?? undefined,
         description: prismaModel.description ?? undefined,
         createdAt: prismaModel.created_at,
         chatModelParameter: chatModelParameters, // ChatModelParameter 포함
         chatRooms: [], // 필요시 매핑
      });
   }

   static toPrisma(entity: ChatModel): Prisma.chat_modelUncheckedCreateInput {
      return {
         id: entity.id,
         persona: entity.persona,
         description: entity.description,
         created_at: entity.createdAt,
         // chat_model_parameters: {
         //    create: entity.chatModelParameter.map(param => ({
         //       id: param.id,
         //       prompt: param.prompt,
         //       default_param: param.defaultParam,
         //       is_active: param.isActive,
         //       is_streaming: param.isStreaming,
         //       created_at: param.createdAt,
         //    })),
         // },
      };
   }
}
