import { ChatModel } from '@/be/domain/chat/ChatModel';
import { ChatModelRepository } from '@/be/domain/chat/ChatModelRepository';
import { chat_model, chat_model_parameters } from '@/lib/generated/prisma';
import { Prisma } from '@/lib/generated/prisma';
import { BasePrismaRepository } from '../BasePrismaRepository';
import { ChatModelParameter } from '@/be/domain/chat/ChatModelParameter';

export class ChatModelRepositoryImpl extends BasePrismaRepository implements ChatModelRepository {
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

   static toEntity(prismaModel: chat_model & { chat_model_parameters: chat_model_parameters[] }): ChatModel {
      const chatModelParameters =
         prismaModel?.chat_model_parameters.map(
            param =>
               new ChatModelParameter({
                  id: param.id,
                  prompt: param.prompt ?? undefined,
                  defaultParam: param.default_param,
                  isActive: param.is_active ?? true,
                  isStremaing: param.is_streaming ?? false,
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
         //       is_streaming: param.isStremaing,
         //       created_at: param.createdAt,
         //    })),
         // },
      };
   }
}
