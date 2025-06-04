import { TranslateGenerateSentence } from '@/be/domain/translate/TranslateGenerateSentence';
import { BasePrismaRepository } from '../BasePrismaRepository';
import { TranslateGenerateSentenceRepository } from '@/be/domain/translate/TranslateGenerateSentenceRepository';

export class TranslateGenerateSentenceRepositoryImpl
   extends BasePrismaRepository
   implements TranslateGenerateSentenceRepository
{
   async registerSentence(sentence: TranslateGenerateSentence) {
      try {
         const convertData = TranslateGenerateSentence.toPrisma(sentence);
         const result = await this.prisma.translate_generate_senetence.create({ data: convertData });
         return result.id;
      } catch (e) {
         console.error(e);
         throw e;
      }
   }
}
