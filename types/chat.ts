// issue의 경우 타입이 지정되어있으나, 기능 개발이 좀더 된 이후에 적용도록 하겠음.
export interface Feedback {
   issue: string;
   description: string;
}

// 감정표현
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

type ChatRole = 'User' | 'Assistant';
type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

// 기본 AI 응답 타입
export interface AIChatAPIResponse {
   message: string;
   evaluation: {
      comprehension: number;
      grammarAccuracy: number;
      sentenceNaturalness: number;
      vocabularyNaturalness: number;
   };
   totalScore: number;
   feedback: {
      grammarAccuracy: Feedback[];
      sentenceNaturalness: Feedback[];
      vocabularyNaturalness: Feedback[];
      comprehension: Feedback[];
   };
   totalFeedback: {
      en: string;
      [key: string]: string;
   };
   difficultyLevel: DifficultyLevel;
   emotion: Emotion;
}

// 모델 정보
export interface StoredChatAIModelInfo {
   persona: string;
   gptModel: string;
   createdAt: string;
}

//
export interface ChatHistory {
   id: string;
   roomId: string;
   message: string;
   role: ChatRole;
}

export interface ClientChatRequest {
   roomId: string;
   message: string;
}

export interface StoredUserChatMessage {
   id: string;
   content: {
      message: string;
   };
   roomId: string;
   createdAt: string;
}

export interface StoredAIChatMessage {
   id: string;
   content: GPTAPIResponse;
   roomId: string;
   createdAt: string;
}

// 피드백용 AI 응답 타입
export interface AIFeedbackResponse extends Omit<ChatAIResponse, 'answer'> {
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
