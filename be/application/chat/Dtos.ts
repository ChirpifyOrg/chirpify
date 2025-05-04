import { AuthenticatedClientChatReuqest, ClientChatRequest } from '@/types/chat';

// 채팅 요청 타입에 따라 타입 분기
export function createChatRequest(
   base: Omit<ClientChatRequest, 'isTrial'>,
   userId: string,
   isTrial?: boolean,
): AuthenticatedClientChatReuqest;

export function createChatRequest(
   base: Omit<ClientChatRequest, 'isTrial'>,
   userId: undefined,
   isTrial?: boolean,
): ClientChatRequest;

export function createChatRequest(
   base: Omit<ClientChatRequest, 'isTrial'>,
   userId: string | undefined,
   isTrial?: boolean,
): ClientChatRequest | AuthenticatedClientChatReuqest {
   if (userId) {
      return { ...base, userId, isTrial };
   } else {
      return { ...base, isTrial };
   }
}
