// infrastructure/factory/UnitOfWorkChatFactory.ts

import { prisma } from '@/lib/be/prisma';
import { IUnitOfWorkChat } from '@/be/domain/chat/IUnitOfWorkChat';
import { UnitOfWorkChat } from '../../prisma/chat/UnitWorkChat';

export class UnitOfWorkChatFactory {
   private static instance: IUnitOfWorkChat;
   static create(): IUnitOfWorkChat {
      if (!UnitOfWorkChatFactory.instance) UnitOfWorkChatFactory.instance = UnitOfWorkChat.create(prisma);
      return UnitOfWorkChatFactory.instance; // 현재는 prisma로 지정
   }
}
