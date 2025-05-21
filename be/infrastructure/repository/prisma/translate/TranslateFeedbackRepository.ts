import { TranslateFeedbackRepository } from '@/be/domain/translate/TranslateFeedbackRepository';
import { BasePrismaRepository } from '../BasePrismaRepository';
import { TranslateFeedback } from '@/be/domain/translate/TranslateFeedback';

export class TranslateFeedbackRepositoryImpl extends BasePrismaRepository implements TranslateFeedbackRepository {
   save(): Promise<void> {
      throw new Error('Method not implemented.');
   }
   getFindAllByUserIdBetweenSeq({
      userId,
      start,
      end,
   }: {
      userId: string;
      start?: number;
      end?: number;
   }): Promise<TranslateFeedback> {
      console.log(userId, start, end);
      throw new Error('Method not implemented.');
   }
}
