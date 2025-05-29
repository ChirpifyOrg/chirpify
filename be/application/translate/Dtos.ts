import { TranslateFeedback } from '@/be/domain/translate/TranslateFeedback';
import { AITranslateFeedbackResponse } from '@/types/translate';

interface Dto {
   toString(): string;
}

export class GetLastTranslateFeedbackDTO implements Dto {
   constructor(
      private readonly id: string,
      private readonly userId: string,
      private readonly sentence: string,
      private readonly feedback: AITranslateFeedbackResponse,
   ) {}
   static fromEntity(entity: TranslateFeedback, sentence: string): GetLastTranslateFeedbackDTO {
      return new GetLastTranslateFeedbackDTO(
         entity.id?.toString() ?? '', // bigint -> string 처리
         entity.userId,
         sentence, // sentenceId만 있으므로 문장은 외부에서 주입
         entity.feedback!,
      );
   }

   toString(): string {
      return JSON.stringify({
         id: this.id,
         userId: this.userId,
         sentence: this.sentence,
         feedback: this.feedback,
      });
   }
}
