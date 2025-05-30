import { Prisma } from '.prisma/client';
import { AITranslateFeedbackResponse, TranslatFeedbackResponseSchema } from '@/types/translate';
import { TranslateGenerateSentence } from './TranslateGenerateSentence';
import { NotFoundError } from '@/lib/be/utils/errors';

export interface TranslateFeedbackProps {
   id?: bigint | null;
   userId: string;
   sentenceId: bigint;
   translate_generate_senetence: TranslateGenerateSentence;
   feedback: AITranslateFeedbackResponse | null;
   createdAt?: Date;
}

export class TranslateFeedback {
   private readonly _id: bigint | null;
   private readonly _userId: string;
   private readonly _sentenceId: bigint;
   private readonly _translate_generate_senetence: TranslateGenerateSentence;
   private readonly _feedback: AITranslateFeedbackResponse | null;
   private readonly _createdAt: Date;

   protected constructor(props: TranslateFeedbackProps) {
      this._id = props.id ?? null; // DB에서 autoincrement로 할당 예정
      this._userId = props.userId;
      this._sentenceId = props.sentenceId;
      this._feedback = props.feedback;
      this._translate_generate_senetence = props.translate_generate_senetence;
      this._createdAt = props.createdAt ?? new Date();
   }

   get id() {
      return this._id;
   }
   get userId() {
      return this._userId;
   }
   get sentenceId() {
      return this._sentenceId;
   }
   // get translate_generate_senetence() {
   //    return this._translate_generate_senetence;
   // }
   get feedback() {
      return this._feedback;
   }
   get createdAt() {
      return this._createdAt;
   }
   get sentence() {
      return this._translate_generate_senetence.sentence;
   }
   static create(props: Omit<TranslateFeedbackProps, 'id' | 'createdAt'>): TranslateFeedback {
      return new TranslateFeedback({
         ...props,
         id: null,
         createdAt: new Date(),
      });
   }
   // Prisma 객체 → 도메인 엔티티 변환 메서드 추가
   static fromPrisma(
      prismaObj: Prisma.translate_feedbackGetPayload<{ include: { translate_generate_senetence: true } }>,
   ): TranslateFeedback {
      let feedback = null;
      // feedback이 존재할 경우에만 파싱 시도
      if (prismaObj.feedback) {
         try {
            const parsedFeedback = JSON.parse(prismaObj.feedback as string);
            const result = TranslatFeedbackResponseSchema.safeParse(parsedFeedback);
            if (result.success) {
               feedback = result.data;
            } else {
               throw new Error('Invalid feedback schema');
            }
         } catch (e) {
            throw new NotFoundError('TranslateFeedback: 유효한 feedback이 없습니다.');
         }
      } else {
         throw new NotFoundError('TranslateFeedback: feedback이 존재하지 않습니다.');
      }
      return new TranslateFeedback({
         id: typeof prismaObj.id === 'bigint' ? prismaObj.id : BigInt(prismaObj.id),
         userId: prismaObj.user_id ?? '',
         sentenceId: prismaObj.senetence_id,
         feedback,
         translate_generate_senetence: TranslateGenerateSentence.fromPrisma(prismaObj.translate_generate_senetence),
         createdAt: prismaObj.created_at instanceof Date ? prismaObj.created_at : new Date(prismaObj.created_at),
      });
   }

   static toPrisma(entity: TranslateFeedback): Prisma.translate_feedbackUncheckedCreateInput {
      return {
         id: entity._id !== null ? Number(entity._id) : undefined,
         user_id: entity._userId,
         senetence_id: entity._sentenceId,
         feedback: entity._feedback ? JSON.stringify(entity._feedback) : undefined, // Change null to undefined
         created_at: entity._createdAt,
      };
   }
}
