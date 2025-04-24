import { ClientChatRequest } from '@/types/chat';
import { ChatUseCase } from './ChatUseCase';
import { AuthenticationChatUseCase } from './AuthenticationChatUseCase';
import { OpenAIChatService } from '@/be/infrastructure/service/OpenAIChatService';
import { env } from '@/lib/be/utils/env';
import { TrialChatUseCase } from './TrialChatUseCase';
import { UnitOfWorkChat } from '@/be/infrastructure/repository/prisma/chat/\bIUnitWorkChat';
import { prisma } from '@/lib/be/prisma';

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
      let key;
      if (isLoggedIn) {
         if (isTrial) key = 'trial';
         else key = 'default';
      } else {
         key = 'unauthorized';
      }

      // 이미 존재하는 서비스가 있다면 반환
      const existingService = this.usecases.get(key);
      if (existingService) {
         return existingService;
      }

      // 새로운 서비스 생성
      let useCase: ChatUseCase<unknown, ClientChatRequest, unknown>;

      // PrismaClient 인스턴스를 생성합니다.

      // ✅ UoW 팩토리 메서드 사용
      const unitOfWork = UnitOfWorkChat.create(prisma);

      switch (key) {
         case 'default':
            useCase = new AuthenticationChatUseCase(new OpenAIChatService(env.openAPIKey), unitOfWork);
            break;
         case 'trial':
            useCase = new TrialChatUseCase(new OpenAIChatService(env.openAPIKey), unitOfWork);
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
