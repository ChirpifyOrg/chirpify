import { TranslateFeedback } from './TranslateFeedback';

export interface TranslateFeedbackRepository {
   save(): Promise<void>;
   getFindAllByUserIdBetweenSeq({
      userId,
      start,
      end,
   }: {
      userId: string;
      start?: number;
      end?: number;
   }): Promise<TranslateFeedback>;
}
