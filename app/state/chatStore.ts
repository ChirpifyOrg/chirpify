import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AIChatSimpleFormatHistory } from '@/types/chat';

type useSimpleStoreAddParam = {
   roomId: string;
   messages: AIChatSimpleFormatHistory[];
};

// Zustand 스토어 생성 (persist 미들웨어 포함)
export const useSimpleChatStore = create(
   persist<{
      currentRoomId: string | null;
      setRoomId: (roomId: string) => void;
      messages: Record<string, AIChatSimpleFormatHistory[]>;
      appendMessage: ({ roomId, messages }: useSimpleStoreAddParam) => void;
      prependMessage: ({ roomId, messages }: useSimpleStoreAddParam) => void;
      setMessages: ({ roomId, messages }: useSimpleStoreAddParam) => void;
      clearAllMessages: () => void;
      clearMessages: (roomId: string) => void;
      getMessage: (roomId: string) => AIChatSimpleFormatHistory[];
      startIndex: Record<string, string | undefined>;
      endIndex: Record<string, string | undefined>;
   }>(
      (set, get) => ({
         currentRoomId: null,
         setRoomId: roomId => {
            set(state => ({ ...state, currentRoomId: roomId }));
         },
         messages: {},
         appendMessage: ({ roomId, messages }) => {
            set(state => {
               const combined = [...(state.messages[roomId] || []), ...messages];
               combined.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
               return {
                  messages: {
                     ...state.messages,
                     [roomId]: combined,
                  },
                  startIndex: {
                     ...state.startIndex,
                     [roomId]: state.startIndex[roomId] ?? combined[0]?.createdAt,
                  },
                  endIndex: {
                     ...state.endIndex,
                     [roomId]: combined[combined.length - 1]?.createdAt,
                  },
               };
            });
         },

         prependMessage: ({ roomId, messages }) => {
            set(state => {
               const combined = [...messages, ...(state.messages[roomId] || [])];
               combined.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
               return {
                  messages: {
                     ...state.messages,
                     [roomId]: combined,
                  },
                  startIndex: {
                     ...state.startIndex,
                     [roomId]: combined[0]?.createdAt,
                  },
                  endIndex: {
                     ...state.endIndex,
                     [roomId]: state.endIndex[roomId] ?? combined[combined.length - 1]?.createdAt,
                  },
               };
            });
         },
         setMessages: ({ roomId, messages }) => {
            set(state => {
               const combined = [...messages, ...(state.messages[roomId] || [])];
               combined.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
               return {
                  messages: {
                     ...state.messages,
                     [roomId]: messages,
                  },
                  startIndex: {
                     ...state.startIndex,
                     [roomId]: state.startIndex[roomId] ?? combined[0]?.createdAt,
                  },
                  endIndex: {
                     ...state.endIndex,
                     [roomId]: combined[combined.length - 1]?.createdAt,
                  },
               };
            });
         },

         clearAllMessages: () => {
            set({ messages: {}, startIndex: {}, endIndex: {} });
         },
         clearMessages: roomId => {
            set(state => ({
               messages: { ...state.messages, [roomId]: [] },
               startIndex: {
                  ...state.startIndex,
                  [roomId]: undefined,
               },
               endIndex: {
                  ...state.endIndex,
                  [roomId]: undefined,
               },
            }));
         },
         getMessage: roomId => {
            const state = get();
            return state.messages[roomId] || [];
         },
         startIndex: {},
         endIndex: {},
      }),
      {
         name: 'ai-chat-simple-message-persist',
         storage: createJSONStorage(() => localStorage),
         // SSR/SSG 환경에서 안전하게 사용하기 위한 조건 추가
         skipHydration: typeof window === 'undefined',
      },
   ),
);
