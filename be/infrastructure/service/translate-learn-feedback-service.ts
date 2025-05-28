import { OpenAIChatService } from './OpenAIChatService';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat/completions';
import fs from 'fs';
import path from 'path';

export class TranslateLearnFeedbackService {
   private chatService: OpenAIChatService;
   private promptTemplate: string;

   constructor(apiKey: string) {
      this.chatService = new OpenAIChatService(apiKey);
      // 프롬프트 템플릿 파일 읽기
      const templatePath = path.join(process.cwd(), 'be', 'prompt', 'translate-learn-feedback-prompt.txt');
      this.promptTemplate = fs.readFileSync(templatePath, 'utf8');
   }

   async generateFeedback(
      question: string,
      answer: string,
      level: number,
      selectedOptions: string[],
      language: string,
   ) {
      const prompt = `${this.promptTemplate}
    
    질문: ${question}
    유저의 답변: ${answer}
    학습 레벨: ${level}
    학습 옵션: ${selectedOptions}
    언어: ${language}
    위 정보를 기반으로 피드백을 생성해주세요.`;

      const request: ChatCompletionCreateParamsNonStreaming = {
         model: 'gpt-3.5-turbo',
         messages: [
            {
               role: 'system',
               content: 'You are a helpful English learning assistant following the provided prompt template.',
            },
            {
               role: 'user',
               content: prompt,
            },
         ],
         temperature: 0.7,
         max_tokens: 1000,
      };

      const response = await this.chatService.generateResponse(request);
      const jsonStr = response.choices[0].message.content ?? '';
      const cleanJson = jsonStr.replace(/```[\s\S]*?```/g, function (match) {
         // 코드 블록 안의 내용만 추출 (``` 제거)
         return match.replace(/```[\s]?(?:\w+)?[\s]?|```$/g, '');
      });
      const json = JSON.parse(cleanJson);
      return json;
   }
}
