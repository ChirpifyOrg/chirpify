// infrastructure/factory/UnitOfWorkChatFactory.ts

import { prisma } from '@/lib/be/prisma';
import { IUnitOfWorkTranslate } from '@/be/domain/translate/IUnitOfTranslate';
import { UnitOfWorkTranslate } from '../../prisma/translate/UnitWokTranslate';

export class UnitOfWorkTranslateFactory {
   static create(): IUnitOfWorkTranslate {
      return UnitOfWorkTranslate.create(prisma); // 현재는 prisma로 지정
   }
}
