import { createClient } from '@/lib/be/superbase/server';
import { IChatRepository } from '@/domain/chat/IChatRepository';
import { ChatMessage } from '@/domain/chat/ChatMessage';

export class SupabaseChatRepository implements IChatRepository {
  async save(message: ChatMessage): Promise<void> {
    const supabase = await createClient();
    await supabase.from('chat_messages').insert([{
      user_id: message.userId,
      content: message.content,
      ai_response: message.aiResponse,
      timestamp: message.timestamp
    }]);
  }

  async findByUserId(userId: string): Promise<ChatMessage[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data.map(row => ({
      id: row.id,
      userId: row.user_id,
      content: row.content,
      aiResponse: row.ai_response,
      timestamp: row.timestamp
    }));
  }
} 