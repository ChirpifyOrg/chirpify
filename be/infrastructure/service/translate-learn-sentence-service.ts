import { OpenAIChatService } from "./OpenAIChatService";
import { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";
import fs from 'fs';
import path from 'path';

export class TranslateLearnSentenceService {
  private chatService: OpenAIChatService;
  private promptTemplate: string;

  constructor(apiKey: string) {
    this.chatService = new OpenAIChatService(apiKey);
    // 프롬프트 템플릿 파일 읽기
    const templatePath = path.join(process.cwd(), 'be', 'prompt', 'translate-learn-sentence-prompt.txt');
    this.promptTemplate = fs.readFileSync(templatePath, 'utf8');
  }

  async generateLearningContent(level: number, selectedOptions: string[], language: string) {
    const prompt = `${this.promptTemplate}
    
    난이도: ${level}
    선택된 주제: ${selectedOptions.join(', ')}
    언어: ${language}
    
    위 프롬프트 템플릿에 따라 JSON 형식으로 영어 학습 문장을 생성해주세요.`;

    const request: ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Generate sentences in JSON format with non-duplicate language codes at a difficulty level using the provided prompts."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    };

    const response = await this.chatService.generateResponse(request);
    return JSON.parse(response.choices[0].message.content ?? '');
  }
}