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
export interface StoredAIChatOpenAIModel {
   id : string;
   persona: string;
   gptModel: string;
   createdAt: string;
}

// 채팅방 정보
export interface StoredAIChatRoom  {
   id : string;
   modelId : string;
   userId : string;
   createdAt : string;
}

// 채팅 히스토리 (채팅 형식 출력용)
export interface AIChatSimpleFormatHistory {
   id: string;
   roomId: string;
   message: string;
   role: ChatRole;
}

export interface StoredChatMessageBase {
   id : string;
   roomId : string;
   message : string;
   createdAt : string;
}


export interface StoredUserChatMessage extends StoredChatMessageBase {
   content: {
      message: string;
      nativeLanguage : string;
   };
}

export interface StoredAIChatMessage extends StoredChatMessageBase {
   content: AIChatAPIResponse;
}


export interface ChallengeTask {
   id: string;
   description: string;
   completed: boolean;
   achievedAt?: string;
}



export interface ClientChatRequest {
   roomId: string;
   message: string;
}
