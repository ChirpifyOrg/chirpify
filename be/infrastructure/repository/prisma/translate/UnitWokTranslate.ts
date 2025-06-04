import { PrismaClient } from '@prisma/client';

import { PrismaUnitOfWork } from '../PrismaUnitOfWork';

import { TranslateFeedbackRepository } from '@/be/domain/translate/TranslateFeedbackRepository';
import { IUnitOfWorkTranslate } from '@/be/domain/translate/IUnitOfTranslate';
import { TranslateGenerateSentenceRepository } from '@/be/domain/translate/TranslateGenerateSentenceRepository';
import { TranslateModelReopsitory } from '@/be/domain/translate/TranslateModelReopsitory';
import { TranslateFeedbackRepositoryImpl } from './TranslateFeedbackRepository';
import { TranslateGenerateSentenceRepositoryImpl } from './TranslateGenerateSentenceRepository';
import { TranslateModelReopsitoryImpl } from './TranslateModelReopsitory';

export class UnitOfWorkTranslate extends PrismaUnitOfWork implements IUnitOfWorkTranslate {
   private constructor(
      protected readonly client: PrismaClient,
      public readonly translateFeedbackRepository: TranslateFeedbackRepository,
      public readonly translateGenerateSentenceRepository: TranslateGenerateSentenceRepository,
      public readonly translateModelReopsitory: TranslateModelReopsitory,
   ) {
      super(client);
   }

   static create(prisma: PrismaClient): UnitOfWorkTranslate {
      return new UnitOfWorkTranslate(
         prisma,
         new TranslateFeedbackRepositoryImpl(prisma),
         new TranslateGenerateSentenceRepositoryImpl(prisma),
         new TranslateModelReopsitoryImpl(prisma),
      );
   }
}
