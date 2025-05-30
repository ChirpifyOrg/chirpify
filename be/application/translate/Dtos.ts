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
   static fromEntity(entity: TranslateFeedback): GetLastTranslateFeedbackDTO {
      return new GetLastTranslateFeedbackDTO(
         entity.id?.toString() ?? '', // bigint -> string 처리
         entity.userId,
         entity.sentence,
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
