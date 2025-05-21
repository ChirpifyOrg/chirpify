import { env } from '@/lib/be/utils/env';
import { ApiResponseGenerator } from './ApiResponseGenerator';
import { OpenAIChatService } from '../infrastructure/service/OpenAIChatService';

// 향후 추가 모델 지원시 해당 기능 사용
type AvailableAIModel = 'GPT' | 'Gemini' | 'Claude';

export class AIReponseGeneratorFactory {
   private static instance: Record<string, ApiResponseGenerator<unknown, unknown>> = {};

   static create(modelName: AvailableAIModel) {
      if (!AIReponseGeneratorFactory.instance[modelName]) {
         switch (modelName) {
            case 'GPT':
               AIReponseGeneratorFactory.instance[modelName] = new OpenAIChatService(env.openAPIKey);
               break;
            case 'Gemini':
               throw new Error('Not implemented');
            case 'Claude':
               throw new Error('Not implemented');
         }
      }
      return AIReponseGeneratorFactory.instance[modelName];
   }
}
