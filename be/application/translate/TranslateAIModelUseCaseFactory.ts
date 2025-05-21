import { TranslateModelUseType, translateModelUseTypeSchema } from '@/types/translate';
import { MakeSententsUseCase } from './MakeSententsUseCase';
import { FeedBackUseCase } from './FeedBackUseCase';

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
   getUseCase(useType: TranslateModelUseType) {
      const parsed = translateModelUseTypeSchema.safeParse(useType);
      if (!parsed.success) {
         throw new Error('잘못된 useType 값입니다 : ' + useType);
      }
      useType = parsed.data;
      const existingService = this.usecases.get(useType);
      if (existingService) {
         return existingService;
      }

      switch (useType) {
         case 'feedback':
            return this.usecases.set('feedback', new FeedBackUseCase());
         case 'sentence':
            return this.usecases.set('sentence', new MakeSententsUseCase());
         default:
            throw new Error('잘못된 useType 값입니다 : ' + useType);
      }
   }
}

export abstract class TranslateAIModel {
   constructor() {}
   abstract execute(): Promise<string>;
}
