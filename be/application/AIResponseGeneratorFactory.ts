import { env } from '@/lib/be/utils/env';
import { ApiResponseGenerator } from './ApiResponseGenerator';
import { OpenAIChatService } from '../infrastructure/service/OpenAIChatService';

// 향후 추가 모델 지원시 해당 기능 사용
type AviliableAIModel = 'GPT';

export class AIReponseGeneratorFactory {
   private static instance: Record<string, ApiResponseGenerator<unknown, unknown>> = {};

   static create(modelName: AviliableAIModel) {
      if (!AIReponseGeneratorFactory.instance[modelName]) {
         switch (modelName) {
            case 'GPT':
               AIReponseGeneratorFactory.instance[modelName] = new OpenAIChatService(env.openAPIKey);
         }
      }
      return AIReponseGeneratorFactory.instance[modelName];
   }
}
