export interface TranslateGenerateSentenceProps {
   id?: bigint;
   sentence: string;
   userId: string;
   createdAt?: Date;
}

export class TranslateGenerateSentence {
   public readonly id: bigint;
   public readonly sentence: string;
   public readonly userId: string;
   public readonly createdAt: Date;

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
}
