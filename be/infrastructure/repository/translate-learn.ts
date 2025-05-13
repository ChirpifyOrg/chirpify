import {TranslateLearnRepository} from "@/be/domain/translate-learn";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import {TranslateLearn} from "@/be/domain/translate-learn";

export class TranslateLearnRepositoryImpl implements TranslateLearnRepository{
  supabase : SupabaseClient;
  constructor(supabase_public_url : string, supabase_secret : string)  {
    this.supabase = createClient(supabase_public_url, supabase_secret);
  }

  async findByUserId(userId :string, from :number =0 , to :number =10){
    const {data, error} = await this.supabase.from('translate_learn')
    .select('userId, messageType, message')
    .eq('userId', userId)
    .limit(30)
    .range(from, to);
    if (error) {
      throw new Error(error.message);
    }
    if (!data || data.length === 0) {
      return []; // 빈 배열 반환
    }

    return data.map(item => new TranslateLearn(
        item.userId,
        item.messageType,
        item.message
    ));
  }
}