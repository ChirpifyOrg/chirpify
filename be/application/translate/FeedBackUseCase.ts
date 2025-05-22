import { GenerateFeedbackRequest } from '@/types/translate';
import { TranslateAIModel } from './TranslateAIModelUseCaseFactory';
import { AIReponseGeneratorFactory } from '../AIResponseGeneratorFactory';

export class FeedBackUseCase extends TranslateAIModel {
   async execute(data: GenerateFeedbackRequest): Promise<string> {
      // TODO :: 추후 테이블상에서 GPT인지 판별 로직 필요.
      const aiModel = AIReponseGeneratorFactory.create('GPT');
      const response = await aiModel.generateResponse(data);
      const jsonStr = response.choices[0].message.content ?? '';
      const cleanJson = jsonStr.replace(/```[\s\S]*?```/g, function (match) {
         // 코드 블록 안의 내용만 추출 (``` 제거)
         return match.replace(/```[\s]?(?:\w+)?[\s]?|```$/g, '');
      });
      const json = JSON.parse(cleanJson);
      return json;
      throw new Error('Method not implemented.');
   }
}
