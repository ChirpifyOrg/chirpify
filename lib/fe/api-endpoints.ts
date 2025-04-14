import { ClientChatSimpleFormatHistoryRequest } from '@/types/chat';

const PREFIX_URL = '/api';
const ENDPOINTS = {
   getChatFeedBack: ({ roomId, messageId }: { roomId: string; messageId: string }) =>
      `/chat/${roomId}/message/${messageId}/feedback`,
   sendChatMessage: ({ roomId }: { roomId: string }) => `/chat/${roomId}/message`,
   sendChatMessageStream: ({ roomId }: { roomId: string }) => `/chat/${roomId}/message/stream`,
   getChatSimpleFormatHistory: ({ roomId, startIndex, endIndex, limit }: ClientChatSimpleFormatHistoryRequest) =>
      `/chat/${roomId}/message?${startIndex && `startIndex=${startIndex}`}
   ?${endIndex && `endIndex=${endIndex}`}
   ?${limit && `limit=${limit}`}`,
};

// PREFIX 추가를 위해 Proxy 객체 사용
// 타입 선언
type EndpointMap = typeof ENDPOINTS;
type EndpointFn = (...args: any[]) => string;

export const API_ENDPOINTS: {
   [K in keyof EndpointMap]: (...args: Parameters<EndpointMap[K]>) => string;
} = new Proxy(ENDPOINTS, {
   get(target, prop: keyof EndpointMap) {
      const fn = target[prop] as EndpointFn;

      return (...args: any[]) => {
         return PREFIX_URL + fn(...args);
      };
   },
});
