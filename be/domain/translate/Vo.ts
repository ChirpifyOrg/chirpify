import { TranslateModelUseType, translateModelUseTypeSchema } from '@/types/translate';

// useTypeVO
export class TranslateModelUseTypeVO {
   private readonly value: TranslateModelUseType;
   private constructor(value: unknown) {
      const parsed = translateModelUseTypeSchema.safeParse(value);
      if (!parsed.success) {
         throw new Error('잘못된 useType 값입니다 : ' + value);
      }
      this.value = parsed.data;
   }
   static create(value: unknown) {
      return new TranslateModelUseTypeVO(value);
   }

   equals(other: TranslateModelUseTypeVO) {
      return this.value === other.value;
   }
   toString() {
      return this.value;
   }
}
