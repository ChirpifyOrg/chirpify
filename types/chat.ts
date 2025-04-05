import { z } from 'zod';

// issue의 경우 타입이 prompt 내부에 되어있으나, 기능 개발이 좀더 된 이후에 적용도록 하겠음.
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

// 모델 정보
export interface StoredAIChatOpenAIModel {
   id: string;
   persona: string;
   gptModel: string;
   createdAt: string;
}

// 채팅방 정보
export interface StoredAIChatRoom {
   id: string;
   modelId: string;
   userId: string;
   createdAt: string;
}

// 채팅 히스토리 (채팅 형식 출력용)
export interface AIChatSimpleFormatHistory {
   id: string;
   roomId: string;
   message: string;
   role: ChatRole;
   createdAt: string;
}

// AI 채팅 저장시 공통속성
// content가 추후 추가/변경될 가능성이 있을 경우 제네릭으로 전환 할수도 있어보임.
export interface StoredChatMessageBase {
   id: string;
   roomId: string;
   message: string;
   role: ChatRole;
   createdAt?: string;
}
// AI 채팅 저장시 사용자 추가 속성
export interface StoredUserChatMessage extends StoredChatMessageBase {
   content: {
      message: string;
      nativeLanguage: string;
   };
}
// AI 채팅 저장시 AI 응답 추가 속성
export interface StoredAIChatMessage extends StoredChatMessageBase {
   content: AIChatAPIResponse;
}

export type ClientStoredAIChatMessage = (StoredAIChatMessage | StoredUserChatMessage)[];

// 도전과제
export interface ChallengeTask {
   id: string;
   description: string;
   completed: boolean;
   createdAt?: string;
}
export type ChallengeTaskList = ChallengeTask[];
// 클라이언트에서 요청하는 AI 채팅 요청
export interface ClientChatRequest {
   roomId: string;
   message: string;
   nativeLanguage: string;
   isTrial?: boolean;
}
export interface AuthenticatedClientChatReuqest extends ClientChatRequest {
   userId: string;
}
// Feedback 스키마 정의
export const FeedbackSchema = z.object({
   issue: z.string(),
   description: z.string(),
});

// AIChatAPIResponse 스키마 정의
export const AIChatAPIResponseSchema = z.object({
   message: z.string(),
   evaluation: z.object({
      comprehension: z.number().default(0),
      grammar_accuracy: z.number().default(0),
      sentence_naturalness: z.number().default(0),
      vocabulary_naturalness: z.number().default(0),
   }),
   total_score: z.number().default(0),
   feedback: z.object({
      grammar_accuracy: z.array(FeedbackSchema).default([]),
      sentence_naturalness: z.array(FeedbackSchema).default([]),
      vocabulary_naturalness: z.array(FeedbackSchema).default([]),
      comprehension: z.array(FeedbackSchema).default([]),
   }),
   // [z.string()] : z.string() 이 동작하지 않아 아래 링크 참고하여 해결
   // 유사 이슈 : https://stackoverflow.com/questions/75546547/create-a-schema-that-has-some-dynamic-keys-and-some-static-keys-with-zod
   total_feedback: z.intersection(
      z.object({
         en: z.string(),
      }),
      z.record(z.string(), z.string()),
   ),
   difficulty_level: z.enum(['Easy', 'Medium', 'Hard']),
   emotion: z.enum([
      'Calm',
      'Joy',
      'Sadness',
      'Anger',
      'Fear',
      'Surprise',
      'Discomfort',
      'Love',
      'Shame',
      'Confidence',
      'Jealousy',
      'Guilt',
      'Confusion',
      'Doubt',
   ]),
});

export type AIChatAPIResponse = z.infer<typeof AIChatAPIResponseSchema>;
