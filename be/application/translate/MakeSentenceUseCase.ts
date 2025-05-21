import { TranslateAIModel } from './TranslateAIModelUseCaseFactory';

export class MakeSententsUseCase extends TranslateAIModel {
   async execute(): Promise<string> {
      throw new Error('Method not implemented.');
   }
}
