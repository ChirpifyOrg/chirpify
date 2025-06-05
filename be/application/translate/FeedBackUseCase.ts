import { AITranslateFeedbackResponse, GenerateFeedbackRequestDTO } from '@/types/translate';
import { AIReponseGeneratorFactory } from '../AIResponseGeneratorFactory';
import { NotFoundError } from '@/lib/be/utils/errors';
import { TranslateAIModelUseCase } from './TranslateAIModelUseCase';
import { TranslateFeedback } from '@/be/domain/translate/TranslateFeedback';

export class FeedBackUseCase extends TranslateAIModelUseCase<AITranslateFeedbackResponse> {
   async execute(data: GenerateFeedbackRequestDTO): Promise<AITranslateFeedbackResponse> {
      const { answer, language, level, question, selectedOptions, userId, sentenceId } = data;
      const model = await this.uow.translateModelReopsitory.findByUseTypeActive('feedback');
      if (!model) {
         throw new NotFoundError('피드백 모델이 존재하지 않습니다.');
      }
      if (!model.prompt) {
         throw new NotFoundError('피드백 모델의 프롬프트가 없습니다.');
      }

      const modelType = model.aiModelType.getValue();
      const param = model.defaultParam;

      const tmpContent = model.prompt ?? '';
      const replacedContent = tmpContent
         .replace('${{question}}', question)
         .replace('${{answer}}', answer)
         .replace('${{level}}', String(level))
         .replace('${{level}}', selectedOptions?.join(',') ?? '')
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
      const json = JSON.parse(cleanJson) as AITranslateFeedbackResponse;

      const entity = TranslateFeedback.create({
         feedback: json,
         sentenceId,
         userId,
      });
      await this.uow.translateFeedbackRepository.save(entity);

      return json;
   }
}
