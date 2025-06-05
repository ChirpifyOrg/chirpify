import { TranslateFeedbackRepository } from '@/be/domain/translate/TranslateFeedbackRepository';
import { BasePrismaRepository } from '../BasePrismaRepository';
import { TranslateFeedback } from '@/be/domain/translate/TranslateFeedback';

export class TranslateFeedbackRepositoryImpl extends BasePrismaRepository implements TranslateFeedbackRepository {
   async save(feedback: TranslateFeedback): Promise<void> {
      const entity = TranslateFeedback.toPrisma(feedback);
      await this.prisma.translate_feedback.create({
         data: entity,
      });
   }
   async getFindAllByUserIdBetweenSeq({ userId, start, limit }: { userId: string; start?: number; limit: number }) {
      const where = start ? { user_id: userId, id: { lt: start } } : { user_id: userId };
      const feedbacks = await this.prisma.translate_feedback.findMany({
         where,
         include: {
            translate_generate_senetence: true,
         },
         orderBy: { id: 'desc' },
         take: limit,
      });
      const convertFeedbacks = feedbacks.map(feedback => TranslateFeedback.fromPrisma(feedback));
      return convertFeedbacks;
   }
}
