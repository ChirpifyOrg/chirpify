import { TranslateModelReopsitory } from '@/be/domain/translate/TranslateModelReopsitory';
import { BasePrismaRepository } from '../BasePrismaRepository';
import { TranslateModel } from '@/be/domain/translate/TranslateModel';
import { TranslateModelUseType } from '@/types/translate';

export class TranslateModelReopsitoryImpl extends BasePrismaRepository implements TranslateModelReopsitory {
   async findByUseTypeActive(useType: TranslateModelUseType): Promise<TranslateModel | null> {
      try {
         const response = await this.prisma.translate_model.findFirst({
            where: {
               use_type: useType,
               is_active: true,
            },
         });
         const entity = TranslateModel.fromPrisma(response);
         return entity;
      } catch (e) {
         console.error(e);
         throw e;
      }
   }
}
