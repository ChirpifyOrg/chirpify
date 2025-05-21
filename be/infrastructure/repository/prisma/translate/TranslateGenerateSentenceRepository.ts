import { BasePrismaRepository } from '../BasePrismaRepository';
import { TranslateGenerateSentenceRepository } from '@/be/domain/translate/TranslateGenerateSentenceRepository';

export class TranslateGenerateSentenceRepositoryImpl
   extends BasePrismaRepository
   implements TranslateGenerateSentenceRepository {}
