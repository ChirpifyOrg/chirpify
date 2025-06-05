import { z } from 'zod';

export const TranslateFeedBackDetailSchema = z.object({
   correct: z.boolean().default(false),
   errors: z.array(z.string()).default([]),
   meaning_feedback: z.string().default(''),
   grammar_feedback: z.string().default(''),
   story_feedback: z.string().default(''),
   score: z.object({
      comprehension: z.number().default(0),
      grammar: z.number().default(0),
      fluency: z.number().default(0),
      vocabulary: z.number().default(0),
   }),
   total_score: z.number().default(0),
});
export const TranslatFeedbackResponseSchema = z.object({
   level: z.number().default(1),
   sentence: z.string().default(''),
   feedback: TranslateFeedBackDetailSchema,
});

export const TranslateSentenceSchema = z.object({
   level: z.number(),
   selectedOptions: z.array(z.string()),
   language: z.string(),
   sentence: z.string(),
});
export type AITranslateFeedbackResponse = z.infer<typeof TranslatFeedbackResponseSchema>;
export type AITranslateSentenceResponse = z.infer<typeof TranslateSentenceSchema>;

export const defaultAITranslateFeedbackResponse: AITranslateFeedbackResponse = {
   level: 5,
   sentence: '',
   feedback: {
      correct: false,
      errors: [],
      meaning_feedback: '.',
      grammar_feedback: '',
      story_feedback: '',
      score: {
         comprehension: 0,
         grammar: 0,
         fluency: 0,
         vocabulary: 0,
      },
      total_score: 0.0,
   },
};

export const TranslateModelUseType = {
   GENERATE_SENTENCE: 'sentence',
   GENERATE_FEEDBACK: 'feedback',
} as const;
export type TranslateModelUseType = (typeof TranslateModelUseType)[keyof typeof TranslateModelUseType];
const TranstlateModelUseTypeValues = Object.values(TranslateModelUseType) as [
   TranslateModelUseType,
   ...TranslateModelUseType[],
];
export const translateModelUseTypeSchema = z.enum(TranstlateModelUseTypeValues);

export interface BaseClientTranslateRequest {
   level: number;
   selectedOptions: string[];
   language: string;
}

export interface GenerateSentenceRequest extends BaseClientTranslateRequest {}
export interface GenerateFeedbackRequest extends BaseClientTranslateRequest {
   question: string;
   answer: string;
   sentenceId: bigint;
}
export interface GenerateSentenceRequestDTO extends GenerateSentenceRequest {
   userId: string;
}
export interface GenerateFeedbackRequestDTO extends GenerateFeedbackRequest {
   userId: string;
}
export type ClientTranslateRequest = GenerateSentenceRequest | GenerateFeedbackRequest;

export type GetLastTranslateFeedback = {
   id: string;
   userId: string;
   sentence: string;
   feedback: AITranslateFeedbackResponse;
};
