import { AITranslateFeedbackResponse, GetLastTranslateFeedback } from '@/types/translate';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Zustand 스토어 생성 (persist 미들웨어 포함)
export const useTranslateStore = create(
   persist<{
      histories: GetLastTranslateFeedback[];
      setHistories: (feedbacks: GetLastTranslateFeedback[] | null) => void;
      currentSentents: string;
      currentSententsId: number | null;
      currentFeedback: AITranslateFeedbackResponse | null;
      currentInput: string;
      setCurrentSentents: (sentents: string) => void;
      setCurrentSententsId: (sententsId: number) => void;
      setCurrentFeedback: (feedback: AITranslateFeedbackResponse | null) => void;
      setCurrentInput: (input: string) => void;
      currentLevel: number;
      setCurrentLevel: (level: number) => void;
      selectOptions: string[];
      setCurrentSelectOptions: (options: string[]) => void;
   }>(
      set => ({
         histories: [],
         setHistories: feedbacks => {
            set(state => ({ ...state, histories: feedbacks || [] }));
         },
         currentSentents: '',
         currentFeedback: null,
         currentInput: '',
         currentSententsId: null,
         setCurrentSententsId: sententsId => {
            set(state => ({ ...state, currentSententsId: sententsId }));
         },
         setCurrentSentents: sentents => {
            set(state => ({ ...state, currentSentents: sentents }));
         },
         setCurrentFeedback: feedback => {
            set(state => ({ ...state, currentFeedback: feedback }));
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
               currentFeedback: null,
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
