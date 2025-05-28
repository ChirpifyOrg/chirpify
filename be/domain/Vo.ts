import { AvailableAIModelType, AvailableAIModelTypeSchema } from '@/types/shared';

export class AIModelTypeVO {
   private readonly value: AvailableAIModelType;
   private constructor(value: unknown) {
      const parsed = AvailableAIModelTypeSchema.safeParse(value);
      if (!parsed.success) {
         throw new Error('잘못된 useType 값입니다 : ' + value);
      }
      this.value = parsed.data;
   }
   static create(value: unknown) {
      return new AIModelTypeVO(value);
   }
   equals(other: AIModelTypeVO) {
      return this.value === other.value;
   }
   getValue(): AvailableAIModelType {
      return this.value;
   }
   toString() {
      return this.value;
   }
}
