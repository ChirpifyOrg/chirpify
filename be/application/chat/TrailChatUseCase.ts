import { AIChatAPIResponse, ClientChatRequest } from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletion } from 'openai/resources';

export class TrailChatUseCase extends ChatUseCase<AIChatAPIResponse, ClientChatRequest, ChatCompletion> {
   protected formatResponse(originResponse: ChatCompletion): AIChatAPIResponse {
      throw new Error('Method not implemented.');
   }
   protected async requestValidate(request: ClientChatRequest): Promise<void> {
      // TODO:: TrailChat 최대 횟수가 초과하였는지 확인
   }
}
