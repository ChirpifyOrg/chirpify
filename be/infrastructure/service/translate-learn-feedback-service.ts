import { OpenAIChatService } from "./OpenAIChatService";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import fs from 'fs';
import path from 'path';

export class TranslateLearnFeedbackService {
  private chatService: OpenAIChatService;
  private promptTemplate: string;

  constructor(apiKey: string) {
    this.chatService = new OpenAIChatService(apiKey);
    // 프롬프트 템플릿 파일 읽기
    const templatePath = path.join(process.cwd(), 'be', 'prompt', 'translate-learn-feedback.prompt.txt');
    this.promptTemplate = fs.readFileSync(templatePath, 'utf8');
  }

  async generateFeedback(question: string, answer: string) {
    const prompt = `${this.promptTemplate}
    
    질문: ${question}
    유저의 답변: ${answer}
    
    위 프롬프트 템플릿에 따라 영어 학습 문장을 생성해주세요.`;

    const request: ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful English learning assistant following the provided prompt template."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    };

    const response = await this.chatService.generateResponse(request);
    return response.choices[0].message.content;
  }
}