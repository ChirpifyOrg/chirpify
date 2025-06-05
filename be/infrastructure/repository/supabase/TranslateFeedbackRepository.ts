import { TranslateFeedbackRepository } from '@/be/domain/translate/TranslateFeedbackRepository';
import { TranslateFeedback } from '@/be/domain/translate/TranslateFeedback';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export class TranslateFeedbackRepositoryImpl implements TranslateFeedbackRepository {
   private supabase: SupabaseClient;

   constructor(supabaseUrl: string, supabaseKey: string) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
   }

   async save(feedback: TranslateFeedback): Promise<void> {
      const entity = TranslateFeedback.toPrisma(feedback);
      const { error } = await this.supabase.from('translate_feedback').insert(entity);
      if (error) throw error;
   }

   async getFindAllByUserIdBetweenSeq({
      userId,
      start,
      limit,
   }: {
      userId: string;
      start?: number;
      limit: number;
   }): Promise<TranslateFeedback[] | null> {
      const query = this.supabase
         .from('translate_feedback')
         .select('*, translate_generate_senetence(*)')
         .eq('user_id', userId)
         .order('id', { ascending: false })
         .limit(limit);

      if (start) {
         query.lt('id', start);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (!data) return null;

      return data.map((item: any) => TranslateFeedback.fromPrisma(item));
   }
}
