// infrastructure/factory/UnitOfWorkChatFactory.ts

import { prisma } from '@/lib/be/prisma';
import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';
import { UnitOfWorkChat } from '../../prisma/chat/UnitWorkChat';

export class UnitOfWorkChatFactory {
   static create(): IUnitOfWorkChat {
      return UnitOfWorkChat.create(prisma); // 현재는 prisma로 지정
   }
}
