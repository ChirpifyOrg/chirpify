import { TranslateFeedbackRepository } from '@/be/domain/translate/TranslateFeedbackRepository';
import { BasePrismaRepository } from '../BasePrismaRepository';
import { TranslateFeedback } from '@/be/domain/translate/TranslateFeedback';

export class TranslateFeedbackRepositoryImpl extends BasePrismaRepository implements TranslateFeedbackRepository {
   async save(feedback: TranslateFeedback): Promise<void> {
      const entity = TranslateFeedback.toPrisma(feedback);
      this.prisma.translate_feedback.create({
         data: entity,
      });
   }
   async getFindAllByUserIdBetweenSeq({
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
