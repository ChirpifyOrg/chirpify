import { AITranslateReponse } from '@/types/translate';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Zustand 스토어 생성 (persist 미들웨어 포함)
export const useTranslateStore = create(
   persist<{
      currentSentents: string;
      currentEvaluation: AITranslateReponse | null;
      currentInput: string;
      setCurrentSentents: (sentents: string) => void;
      setCurrentEvaluation: (evaluation: AITranslateReponse) => void;
      setCurrentInput: (input: string) => void;
      currentLevel: number;
      setCurrentLevel: (level: number) => void;
      selectOptions: string[];
      setCurrentSelectOptions: (options: string[]) => void;
   }>(
      set => ({
         currentSentents: '',
         currentEvaluation: null,
         currentInput: '',
         setCurrentSentents: sentents => {
            set(state => ({ ...state, currentSentents: sentents }));
         },
         setCurrentEvaluation: evaluation => {
            set(state => ({ ...state, currentEvaluation: evaluation }));
         },
         setCurrentInput: input => {
            set(state => ({ ...state, currentInput: input }));
         },
         currentLevel: 1,
         setCurrentLevel: level => {
            set(state => ({ ...state, currentLevel: level }));
         },
         selectOptions: [],
         setCurrentSelectOptions: options => {
            set(state => ({ ...state, selectOptions: options }));
         },
         reset: () => {
            set({
               currentSentents: '',
               currentEvaluation: null,
               currentInput: '',
               currentLevel: 1,
               selectOptions: [],
            });
         },
      }),
      {
         name: 'ai-translate-persist',
         storage: createJSONStorage(() => localStorage),
         // SSR/SSG 환경에서 안전하게 사용하기 위한 조건 추가
         skipHydration: typeof window === 'undefined',
      },
   ),
);
