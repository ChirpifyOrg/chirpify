import { env } from '@/lib/be/utils/env';
import { ApiResponseGenerator } from './ApiResponseGenerator';
import { OpenAIChatService } from '../infrastructure/service/OpenAIChatService';
import { AvailableAIModelType } from '@/types/shared';

type ModelMap = {
   GPT: OpenAIChatService;
   Gemini: null;
   Claude: null;
};

export class AIReponseGeneratorFactory {
   private static instance: Partial<{ [K in AvailableAIModelType]: ApiResponseGenerator<any, any> }> = {};
   static create<M extends AvailableAIModelType>(modelName: M): ModelMap[M] {
      if (!AIReponseGeneratorFactory.instance[modelName]) {
         switch (modelName) {
            case 'GPT':
               AIReponseGeneratorFactory.instance[modelName] = new OpenAIChatService(env.openAPIKey);
               break;
            case 'Claude':
               throw new Error('Not implemented');
            case 'Gemini':
               throw new Error('Not implemented');
         }
      }
      return AIReponseGeneratorFactory.instance[modelName] as ModelMap[M];
   }
}
