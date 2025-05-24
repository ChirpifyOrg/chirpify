import { AITranslateSentenceResponse, GenerateSentenceRequestDTO } from '@/types/translate';

import { NotFoundError } from '@/lib/be/utils/errors';
import { AIReponseGeneratorFactory } from '../AIResponseGeneratorFactory';
import { TranslateAIModelUseCase } from './TranslateAIModelUseCase';
import { TranslateGenerateSentence } from '@/be/domain/translate/TranslateGenerateSentence';

interface MakeSentenceRepsonse extends AITranslateSentenceResponse {
   sentenceId: bigint;
}

export class MakeSentenceUseCase extends TranslateAIModelUseCase<MakeSentenceRepsonse> {
   async execute(data: GenerateSentenceRequestDTO): Promise<MakeSentenceRepsonse> {
      const { language, level, selectedOptions, userId } = data;
      const model = await this.uow.translateModelReopsitory.findByUseTypeActive('sentence');
      if (!model) {
         throw new NotFoundError('문장 생성 모델이 존재하지 않습니다.');
      }
      if (!model.prompt) {
         throw new NotFoundError('문장 생성 모델의 프롬프트가 없습니다.');
      }
      const modelType = model.aiModelType.getValue();
      const param = model.defaultParam;

      const tmpContent = model.prompt ?? '';
      const replacedContent = tmpContent
         .replace('${{level}}', String(level))
         .replace('${{selectedOptions}}', selectedOptions.join(', '))
         .replace('${{language}}', language);
      param.messages[1].content = replacedContent;
      param.stream = false;

      const aiModelService = AIReponseGeneratorFactory.create(modelType);

      const response = await aiModelService?.generateResponse(param);
      const jsonStr = response?.choices[0].message.content ?? '';
      const cleanJson = jsonStr.replace(/```[\s\S]*?```/g, function (match) {
         // 코드 블록 안의 내용만 추출 (``` 제거)
         return match.replace(/```[\s]?(?:\w+)?[\s]?|```$/g, '');
      });
      const json = JSON.parse(cleanJson) as AITranslateSentenceResponse;

      const sentenceEntity = TranslateGenerateSentence.create({ sentence: json.sentence, userId });
      const sentenceId = await this.uow.translateGenerateSentenceRepository.registerSentence(sentenceEntity);
      return {
         level: json.level,
         selectedOptions: json.selectedOptions,
         language: json.language,
         sentence: json.sentence,
         sentenceId: sentenceId,
      };
   }
}
