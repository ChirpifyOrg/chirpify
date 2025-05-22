import { z } from 'zod';

export const TranslateFeedBackSchema = z.object({
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
export const TranslateResponseSchema = z.object({
   level: z.number().default(1),
   sentence: z.string().default(''),
   feedback: TranslateFeedBackSchema,
});
export type AITranslateReponse = z.infer<typeof TranslateResponseSchema>;

export const defaultAIChatResponse: AITranslateReponse = {
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

export interface RequestTranslateFeedback {
   question: string;
   answer: string;
   level: number;
   selectOptions: string[];
   language: string;
}

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

export interface GenerateSentenceRequest extends BaseClientTranslateRequest {
   userId: string;
}
export interface GenerateFeedbackRequest extends BaseClientTranslateRequest {
   userId: string;
   question: string;
   answer: string;
   sentenceId: number;
}
export type ClientTranslateRequest = GenerateSentenceRequest | GenerateFeedbackRequest;
