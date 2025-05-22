import { GenerateSentenceRequest } from '@/types/translate';
import { TranslateAIModel } from './TranslateAIModelUseCaseFactory';

export class MakeSentenceUseCase extends TranslateAIModel {
   async execute(data: GenerateSentenceRequest): Promise<string> {
      throw new Error('Method not implemented.');
   }
}
