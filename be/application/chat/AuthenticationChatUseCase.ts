import {
   AIChatAPIResponse,
   AIChatAPIResponseSchema,
   AuthenticatedClientChatReuqest,
   ClientChatRequest,
} from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletion as GPTChatFormat } from 'openai/resources';
/**
 * @description : 로그인 된 사용자 유즈케이스
 */
export class AuthenticationChatUseCase extends ChatUseCase<
   AIChatAPIResponse,
   AuthenticatedClientChatReuqest,
   GPTChatFormat
> {
   protected formatResponse(originResponse: GPTChatFormat): AIChatAPIResponse {
      try {
         const response = JSON.parse(originResponse.choices[0].message.content ?? '');
         console.log(response);
         const validatedResponse = AIChatAPIResponseSchema.parse(response);
         return validatedResponse;
      } catch (e) {
         throw new Error('Method not implemented.');
      }
   }
   protected async requestValidate(request: ClientChatRequest): Promise<void> {
      // TODO : 여기서 방의 소유권을 확인하는 절차 작성.
   }
}
