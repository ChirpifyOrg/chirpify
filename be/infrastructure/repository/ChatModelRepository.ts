import { ChatModel } from '@/be/domain/chat/ChatModel';
import { ChatModelRepository } from '@/be/domain/chat/ChatModelRepository';
import { chat_model, PrismaClient } from '@/lib/generated/prisma';
import { Prisma } from '@/lib/generated/prisma';

export class ChatModelRepositoryImpl implements ChatModelRepository {
   constructor(private readonly prisma: PrismaClient = prisma) {}

   // persona 이름으로 마지막 모델 정보 가져오기
   async getLastModelInfo(name: string) {
      const prismaModel = await this.prisma.chat_model.findFirst({
         where: { persona: name },
         orderBy: { created_at: 'desc' },
      });
      if (!prismaModel) return null;
      return ChatModelRepositoryImpl.toEntity(prismaModel);
   }

   static toEntity(prismaModel: chat_model): ChatModel {
      return new ChatModel({
         id: prismaModel.id,
         persona: prismaModel.persona ?? undefined,
         description: prismaModel.description ?? undefined,
         prompt: prismaModel.prompt ?? undefined,
         isActive: prismaModel.is_active ?? undefined,
         createdAt: prismaModel.created_at,
         defaultParam: prismaModel.default_param,
         chatRooms: [], // 필요시 매핑
      });
   }

   static toPrisma(entity: ChatModel): Prisma.chat_modelUncheckedCreateInput {
      return {
         id: entity.id,
         persona: entity.persona,
         description: entity.description,
         prompt: entity.prompt,
         is_active: entity.isActive,
         created_at: entity.createdAt,
         default_param: entity.defaultParam,
         // chat_rooms: [], // 관계형 입력은 조심
      };
   }
}
