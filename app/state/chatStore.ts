// store/chatStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ClientStoredAIChatMessage } from '@/types/chat';

// Zustand 스토어 생성 (persist 미들웨어 포함)
export const useChatStore = create(
   persist<{
      messages: ClientStoredAIChatMessage;
      addMessage: (message: any) => void;
      setMessages: (messages: ClientStoredAIChatMessage) => void;
      clearMessages: () => void;
   }>(
      set => ({
         messages: [],
         addMessage: message =>
            set(state => ({
               messages: [...state.messages, message],
            })),
         setMessages: messages => set({ messages }),
         clearMessages: () => set({ messages: [] }),
      }),
      {
         name: 'ai-chat-message-persist',
         storage: createJSONStorage(() => localStorage),
         // SSR/SSG 환경에서 안전하게 사용하기 위한 조건 추가
         skipHydration: typeof window === 'undefined',
      },
   ),
);
