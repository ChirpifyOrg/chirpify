import { AIChatAPIResponse, ClientChatRequest } from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { ChatCompletion } from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

export class trialChatUseCase extends ChatUseCase<AIChatAPIResponse, ClientChatRequest, ChatCompletion> {
   protected formatResponse(originResponse: ChatCompletion): AIChatAPIResponse {
      throw new Error('Method not implemented.');
   }
   protected async requestValidate(request: ClientChatRequest): Promise<void> {
      // TODO:: trialChat 최대 횟수가 초과하였는지 확인
      const { message, nativeLanguage, roomId, isTrial } = request;
   }
   protected async formatRequest(
      request: ClientChatRequest,
      modelInfo: unknown,
   ): Promise<ChatCompletionCreateParamsBase> {}
}
