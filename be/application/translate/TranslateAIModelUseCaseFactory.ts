import { TranslateModelUseType, translateModelUseTypeSchema } from '@/types/translate';

import { FeedBackUseCase } from './FeedBackUseCase';
import { MakeSentenceUseCase } from './MakeSentenceUseCase';

export class TranslateAIModelUseCaseFactory {
   private static instance: TranslateAIModelUseCaseFactory;
   private usecases: Map<TranslateModelUseType, TranslateAIModel> = new Map();

   private constructor() {}

   public static getInstance(): TranslateAIModelUseCaseFactory {
      if (!TranslateAIModelUseCaseFactory.instance) {
         TranslateAIModelUseCaseFactory.instance = new TranslateAIModelUseCaseFactory();
      }
      return TranslateAIModelUseCaseFactory.instance;
   }
   getUseCase(useType: unknown) {
      const parsed = translateModelUseTypeSchema.safeParse(useType);
      if (!parsed.success) {
         throw new Error('잘못된 useType 값입니다 : ' + useType);
      }
      const vaildUseType = parsed.data;
      const existingService = this.usecases.get(vaildUseType);
      if (existingService) {
         return existingService;
      }
      let useCase;
      switch (vaildUseType) {
         case 'feedback':
            useCase = new FeedBackUseCase();
            break;
         case 'sentence':
            useCase = new MakeSentenceUseCase();
            break;
         default:
            throw new Error('잘못된 useType 값입니다 : ' + useType);
      }
      this.usecases.set(vaildUseType, useCase);
      return useCase;
   }
}

export abstract class TranslateAIModel {
   constructor() {}
   abstract execute(): Promise<string>;
}
