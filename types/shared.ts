import { z } from 'zod';

// 향후 추가 모델 지원시 해당 기능 사용

export const AvailableAIModelTypes = ['GPT', 'Gemini', 'Claude'] as const;

export const AvailableAIModelTypeSchema = z.enum(AvailableAIModelTypes);

export type AvailableAIModelType = z.infer<typeof AvailableAIModelTypeSchema>;
