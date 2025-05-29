import { TranslateFeedback } from './TranslateFeedback';

export interface TranslateFeedbackRepository {
   save(feedback: TranslateFeedback): Promise<void>;
   getFindAllByUserIdBetweenSeq({
      userId,
      start,
      limit,
   }: {
      userId: string;
      start?: number;
      limit: number;
   }): Promise<TranslateFeedback[] | null>;
}
