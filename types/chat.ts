export interface Feedback {
   issue: string;
   description: string;
}

type Emotion =
   | 'Calm'
   | 'Joy'
   | 'Sadness'
   | 'Anger'
   | 'Fear'
   | 'Surprise'
   | 'Discomfort'
   | 'Love'
   | 'Shame'
   | 'Confidence'
   | 'Jealousy'
   | 'Guilt'
   | 'Confusion'
   | 'Doubt';

// 기본 AI 응답 타입
export interface AIResponse {
   message: string;
   evaluation: {
      comprehension: number;
      grammar_accuracy: number;
      sentence_naturalness: number;
      vocabulary_naturalness: number;
   };
   total_score: number;
   feedback: {
      grammar_accuracy: Feedback[];
      sentence_naturalness: Feedback[];
      vocabulary_naturalness: Feedback[];
      comprehension: Feedback[];
   };
   total_feedback: {
      en: string;
      [key: string]: string;
   };
   difficulty_level: string;
   emotion: Emotion;
}

// 피드백용 AI 응답 타입
export interface AIFeedbackResponse extends Omit<AIResponse, 'answer'> {
   userMessage: string;
}

export interface UserChatMessage {
   id: string;
   content: string;
   role: 'user';
   timestamp: string;
}

export interface ChatMessage {
   id: string;
   content: string | AIResponse;
   role: 'user' | 'assistant';
   timestamp: string;
}

export interface ChallengeTask {
   id: string;
   description: string;
   completed: boolean;
   achievedAt?: string;
}
