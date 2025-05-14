import { z } from 'zod';

export type ChatRole = 'User' | 'Assistant';

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
   seq: number;
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

// 클라이언트에서 요청하는 채팅 목록
export interface ClientChatSimpleFormatHistoryRequest {
   roomId: string;
   startIndex?: string;
   endIndex?: string;
   limit?: number;
}
export interface AuthenticatedClientChatReuqest extends ClientChatRequest {
   userId: string;
}
// Feedback 스키마 정의
export const FeedbackSchema = z.object({
   issue: z.string(),
   description: z.string(),
});
export type Feedback = z.infer<typeof FeedbackSchema>;

// issue의 경우 타입이 prompt 내부에 되어있으나, 기능 개발이 좀더 된 이후에 적용도록 하겠음.
// zod로 변경하여 검증
// export interface Feedback {
//    issue: string;
//    description: string;
// }
export const EvaluationCategorySchema = z.enum([
   'comprehension',
   'grammar_accuracy',
   'vocabulary_naturalness',
   'sentence_naturalness',
]);
export const FeedBackStructureSchema = z.record(EvaluationCategorySchema, z.array(FeedbackSchema).default([]));

// 타입 추론
export type FeedBackStructure = z.infer<typeof FeedBackStructureSchema>;
export type EvaluationCategory = z.infer<typeof EvaluationCategorySchema>;
// AIChatAPIResponse 스키마 정의
export const AIChatAPIResponseSchema = z.object({
   message: z.string().default(''),
   evaluation: z.record(EvaluationCategorySchema, z.number().default(0)),
   total_score: z.number().default(0),
   feedback: FeedBackStructureSchema,
   total_feedback: z.intersection(
      z.object({
         'en-US': z.string(),
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
export const defaultAIChatResponse: AIChatAPIResponse = {
   message: '',
   evaluation: {
      grammar_accuracy: 0,
      sentence_naturalness: 0,
      vocabulary_naturalness: 0,
      comprehension: 0,
   },
   total_score: 0,
   feedback: {
      grammar_accuracy: [],
      sentence_naturalness: [],
      vocabulary_naturalness: [],
      comprehension: [],
   },
   total_feedback: {
      'en-US': '',
   },
   difficulty_level: 'Medium',
   emotion: 'Calm',
};
export type AIChatAPIResponse = z.infer<typeof AIChatAPIResponseSchema>;

/**
 * AIChatAPIResponse 객체를 NDJSON 문자열로 변환
 * 의미 있는 섹션별로 줄 단위 JSON 객체 생성
 */
export function convertAIChatResponseToNDJSON(data: AIChatAPIResponse): string {
   const ndjsonLines: string[] = [];

   // message
   ndjsonLines.push(JSON.stringify({ type: 'message', value: data.message }));

   // evaluation
   ndjsonLines.push(JSON.stringify({ type: 'evaluation', value: data.evaluation }));

   // total_score
   ndjsonLines.push(JSON.stringify({ type: 'total_score', value: data.total_score }));

   // feedback per category
   for (const [key, value] of Object.entries(data.feedback)) {
      ndjsonLines.push(JSON.stringify({ type: 'feedback', category: key, value }));
   }

   // total_feedback (병합된 객체)
   ndjsonLines.push(JSON.stringify({ type: 'total_feedback', value: data.total_feedback }));

   // difficulty_level
   ndjsonLines.push(JSON.stringify({ type: 'difficulty_level', value: data.difficulty_level }));

   // emotion
   ndjsonLines.push(JSON.stringify({ type: 'emotion', value: data.emotion }));

   return ndjsonLines.join('\n');
}

export function parseNDJSONToAIChatResponse(ndjsonString: string): AIChatAPIResponse {
   // NDJSON 파싱
   const lines = ndjsonString.trim().split('\n');
   const jsonObjects = lines.map(line => JSON.parse(line));

   const result = AIChatAPIResponseSchema.parse({ ...defaultAIChatResponse });

   // 피드백 항목들을 모으기 위한 배열
   jsonObjects.forEach(obj => {
      switch (obj.type) {
         case 'message':
            result.message = obj.text;
            break;
         case 'evaluation':
            result.evaluation = {
               comprehension: obj.comprehension,
               grammar_accuracy: obj.grammar_accuracy,
               sentence_naturalness: obj.sentence_naturalness,
               vocabulary_naturalness: obj.vocabulary_naturalness,
            };
            break;
         case 'total_score':
            result.total_score = obj.value;
            break;
         case 'feedback':
            const category = obj.category as EvaluationCategory;
            if (!result.feedback[category]) {
               result.feedback[category] = [];
            }
            result.feedback[category].push({
               issue: obj.issue,
               description: obj.description,
            });
            break;
         case 'total_feedback':
            result.total_feedback = { ...obj };
            delete result.total_feedback.type;
            break;
         case 'difficulty_level':
            result.difficulty_level = obj.value;
            break;
         case 'emotion':
            result.emotion = obj.value;
            break;
      }
   });

   return result;
}

type userMessage = { userMessage: string };
// 피드백 데이터 전달을 위한 타입
export type AIChatFeedBackAndScore = Omit<AIChatAPIResponse, 'message' | 'emotion'> & userMessage;
