import { translate_feedback } from '.prisma/client';
import { AITranslateReponse, TranslateResponseSchema } from '@/types/translate';

export interface TranslateFeedbackProps {
   id?: bigint;
   userId: string;
   sentenceId: string;
   feedback: AITranslateReponse | null;
   createdAt?: Date;
}

export class TranslateFeedback {
   public readonly id: bigint;
   public readonly userId: string;
   public readonly sentenceId: string;
   public readonly feedback: AITranslateReponse | null;
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
   // Prisma 객체 → 도메인 엔티티 변환 메서드 추가
   static fromPrisma(prismaObj: translate_feedback): TranslateFeedback {
      let feedback = null;
      // feedback이 존재할 경우에만 파싱 시도
      if (prismaObj.feedback) {
         const { error, data } = TranslateResponseSchema.safeParse(prismaObj.feedback);
         if (!error) {
            feedback = data;
         }
      }
      return new TranslateFeedback({
         id: typeof prismaObj.id === 'bigint' ? prismaObj.id : BigInt(prismaObj.id),
         userId: prismaObj.user_id ?? '',
         sentenceId: prismaObj.senetence_id ?? '',
         feedback,
         createdAt: prismaObj.created_at instanceof Date ? prismaObj.created_at : new Date(prismaObj.created_at),
      });
   }
}
