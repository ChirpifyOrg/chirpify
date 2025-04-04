import { atom } from 'recoil';
import { ClientStoredAIChatMessage } from '@/types/chat';
import { recoilPersist, PersistStorage } from 'recoil-persist';

const safePersistStorage: PersistStorage = {
   getItem: (key: string) => {
      if (typeof window !== 'undefined') {
         return localStorage.getItem(key);
      }
      return null;
   },
   setItem: (key: string, value: string) => {
      if (typeof window !== 'undefined') {
         localStorage.setItem(key, value);
      }
   },
};

// AI Chat Message 로컬 저장을 위한 persist 등록
export const { persistAtom: persistAIChatMessage } = recoilPersist({
   key: 'ai-chat-message-persist',
   storage: safePersistStorage,
});

// client 에서 저장되는 AI Chat Message 배열
export const clientStoredAIChatMessageState = atom<ClientStoredAIChatMessage>({
   key: 'clientStoredAIChatMessageState',
   default: [],
   effects_UNSTABLE: [persistAIChatMessage],
});
