import { Prisma, translate_generate_senetence } from '@prisma/client';

export interface TranslateGenerateSentenceProps {
   id?: bigint;
   sentence: string;
   userId: string;
   createdAt?: Date;
}

export class TranslateGenerateSentence {
   private readonly id: bigint;
   private readonly sentence: string;
   private readonly userId: string;
   private readonly createdAt: Date;

   protected constructor(props: TranslateGenerateSentenceProps) {
      this.id = props.id ?? BigInt(0); // auto-increment placeholder
      this.sentence = props.sentence;
      this.userId = props.userId;
      this.createdAt = props.createdAt ?? new Date();
   }

   static create(props: Omit<TranslateGenerateSentenceProps, 'id' | 'createdAt'>): TranslateGenerateSentence {
      return new TranslateGenerateSentence({
         ...props,
         id: BigInt(0),
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
         id: entity.id,
         sentence: entity.sentence,
         user_id: entity.userId,
         created_at: entity.createdAt,
      };
   }
}
