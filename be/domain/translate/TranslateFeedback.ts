import { AITranslateReponse } from '@/types/translate';

export interface TranslateFeedbackProps {
   id?: bigint;
   userId: string;
   sentenceId: string;
   feedback: AITranslateReponse;
   createdAt?: Date;
}

export class TranslateFeedback {
   public readonly id: bigint;
   public readonly userId: string;
   public readonly sentenceId: string;
   public readonly feedback: AITranslateReponse;
   public readonly createdAt: Date;

   protected constructor(props: TranslateFeedbackProps) {
      this.id = props.id ?? BigInt(0); // DB에서 autoincrement로 할당 예정
      this.userId = props.userId;
      this.sentenceId = props.sentenceId;
      this.feedback = props.feedback;
      this.createdAt = props.createdAt ?? new Date();
   }

   static create(props: Omit<TranslateFeedbackProps, 'id' | 'createdAt'>): TranslateFeedback {
      return new TranslateFeedback({
         ...props,
         id: BigInt(0),
         createdAt: new Date(),
      });
   }
}
