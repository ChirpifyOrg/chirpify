import { IAIService } from '@/domain/chat/IAIService';
import { ChatMessageContent } from '@/domain/chat/ChatMessage';

export class OpenAIService implements IAIService {
  async generateResponse(content: string): Promise<ChatMessageContent> {
    // TODO: OpenAI API 호출 로직 구현
    return {
      answer: "AI response to: " + content,
      evaluation: {
        comprehension: 5,
        grammar_accuracy: 5,
        sentence_naturalness: 5,
        vocabulary_naturalness: 5
      },
      total_score: 5,
      feedback: {
        grammar_accuracy: { issue: "Grammar", count: 0, details: [] },
        sentence_naturalness: { issue: "Naturalness", count: 0, details: [] },
        vocabulary_naturalness: { issue: "Vocabulary", count: 0, details: [] },
        comprehension: { issue: "Comprehension", count: 0, details: [] }
      },
      total_feedback: {
        en: "Great job!",
        ko: "잘했어요!"
      },
      difficulty_level: "intermediate"
    };
  }
} 