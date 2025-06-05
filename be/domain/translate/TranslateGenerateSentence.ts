import { Prisma, translate_generate_senetence } from '@prisma/client';

export interface TranslateGenerateSentenceProps {
   id?: bigint | null;
   sentence: string;
   userId: string;
   createdAt?: Date;
}

export class TranslateGenerateSentence {
   private readonly _id: bigint | null;
   private readonly _sentence: string;
   private readonly _userId: string;
   private readonly _createdAt: Date;

   protected constructor(props: TranslateGenerateSentenceProps) {
      this._id = props.id ?? null; // auto-increment placeholder
      this._sentence = props.sentence;
      this._userId = props.userId;
      this._createdAt = props.createdAt ?? new Date();
   }

   static create(props: Omit<TranslateGenerateSentenceProps, 'id' | 'createdAt'>): TranslateGenerateSentence {
      return new TranslateGenerateSentence({
         ...props,
         id: null,
         createdAt: new Date(),
      });
   }

   // Prisma 객체 → 도메인 엔티티 변환 메서드 추가
   static fromPrisma(prismaObj: translate_generate_senetence): TranslateGenerateSentence {
      const { id, created_at, sentence, user_id } = prismaObj;
      return new TranslateGenerateSentence({
         id,
         sentence: sentence ?? '',
         userId: user_id ?? '',
         createdAt: created_at,
      });
   }

   static toPrisma(entity: TranslateGenerateSentence): Prisma.translate_generate_senetenceUncheckedCreateInput {
      return {
         id: entity.id !== null ? Number(entity.id) : undefined,
         sentence: entity.sentence,
         user_id: entity.userId,
         created_at: entity.createdAt,
      };
   }

   get id(): bigint | null {
      return this._id;
   }

   get sentence(): string {
      return this._sentence;
   }

   get userId(): string {
      return this._userId;
   }

   get createdAt(): Date {
      return this._createdAt;
   }
}
