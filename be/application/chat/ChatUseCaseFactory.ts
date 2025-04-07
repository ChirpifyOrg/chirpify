import { ClientChatRequest } from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { AuthenticationChatUseCase } from './AuthenticationChatUseCase';
import { TrailChatUseCase } from './TrailChatUseCase';
import { ChatRepositoryImpl } from '@/be/infrastructure/repository/ChatRepository';
import { TrailChatRepositoryImpl } from '@/be/infrastructure/repository/TrailChatRepository';
import { OpenAIChatService } from '@/be/infrastructure/service/OpenAIChatService';
import { AIModelRepositoryImpl } from '@/be/infrastructure/repository/AIModelRepository';
import { env } from '@/lib/be/utils/env';

export class ChatUseCaseFactory {
   private static instance: ChatUseCaseFactory;
   private usecases: Map<string, ChatUseCase<unknown, ClientChatRequest, unknown>> = new Map();

   private constructor() {}

   public static getInstance(): ChatUseCaseFactory {
      if (!ChatUseCaseFactory.instance) {
         ChatUseCaseFactory.instance = new ChatUseCaseFactory();
      }
      return ChatUseCaseFactory.instance;
   }

   getUseCase(isLoggedIn: boolean, isTrial: boolean): ChatUseCase<unknown, ClientChatRequest, unknown> {
      const key = isLoggedIn ? 'default' : isTrial ? 'trial' : 'unauthorized';

      // 이미 존재하는 서비스가 있다면 반환
      const existingService = this.usecases.get(key);
      if (existingService) {
         return existingService;
      }

      // 새로운 서비스 생성
      let useCase: ChatUseCase<unknown, ClientChatRequest, unknown>;

      switch (key) {
         case 'default':
            useCase = new AuthenticationChatUseCase(
               new OpenAIChatService(env.openAPIKey),
               new ChatRepositoryImpl(),
               new AIModelRepositoryImpl(),
            );
            break;
         case 'trial':
            useCase = new TrailChatUseCase(
               new OpenAIChatService(env.openAPIKey),
               new TrailChatRepositoryImpl(),
               new AIModelRepositoryImpl(),
            );
            break;
         case 'unauthorized':
            throw new Error('Unauthorized');
         default:
            throw new Error(`Unknown service key: ${key}`);
      }

      // 생성된 서비스를 저장하고 반환
      this.usecases.set(key, useCase);
      return useCase;
   }
}
