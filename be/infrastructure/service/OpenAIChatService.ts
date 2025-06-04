import { ApiResponseGenerator } from '@/be/application/ApiResponseGenerator';
import OpenAI from 'openai';
import { ChatCompletion } from 'openai/resources';
import {
   ChatCompletionChunk,
   ChatCompletionCreateParamsBase,
   ChatCompletionCreateParamsNonStreaming,
   ChatCompletionCreateParamsStreaming,
} from 'openai/resources/chat/completions';
export class OpenAIChatService
   implements ApiResponseGenerator<ChatCompletionCreateParamsBase, ChatCompletion, ChatCompletionChunk>
{
   private client: OpenAI;
   constructor(apiKey: string) {
      this.client = new OpenAI({ apiKey });
   }
   async generateResponse(request: ChatCompletionCreateParamsNonStreaming): Promise<ChatCompletion> {
      const completion = await this.client.chat.completions.create(request);
      if (!completion.choices[0].message.content) {
         throw new Error('No content generated');
      }
      return completion;
   }
   async generateResponseStream(
      request: ChatCompletionCreateParamsStreaming,
   ): Promise<AsyncIterable<ChatCompletionChunk>> {
      const completion = await this.client.chat.completions.create(request);
      return (async function* () {
         for await (const chunk of completion) {
            yield chunk;
         }
      })();
   }
}
