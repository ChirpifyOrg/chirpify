import { TranslateAIModel } from './TranslateAIModelUseCaseFactory';

export class MakeSentenceUseCase extends TranslateAIModel {
   async execute(): Promise<string> {
      throw new Error('Method not implemented.');
   }
}
