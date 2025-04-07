// TODO : LLM 서비스별 반환 팩토리로 코드 변경 필요.

// import { BaseChatService } from '@/be/infrastructure/service/base-chat-service';
// import { TrialChatService } from '@/be/infrastructure/service/OpenAIChatService';
// import { ChatService } from '@/be/domain/ApiResponseGenerator';
// import { User as SupabaseUser } from '@supabase/supabase-js';
// import { boolean } from 'zod';

// export class ChatServiceFactory {
//    private static instance: ChatServiceFactory;
//    private services: Map<string, ChatService<unknown>> = new Map();

//    private constructor() {}

//    public static getInstance(): ChatServiceFactory {
//       if (!ChatServiceFactory.instance) {
//          ChatServiceFactory.instance = new ChatServiceFactory();
//       }
//       return ChatServiceFactory.instance;
//    }

//    getService(isLoggedIn: boolean, isTrial: boolean): ChatService<unknown> {
//       const key = isLoggedIn ? 'default' : isTrial ? 'trial' : 'unauthorized';

//       // 이미 존재하는 서비스가 있다면 반환
//       const existingService = this.services.get(key);
//       if (existingService) {
//          return existingService;
//       }

//       // 새로운 서비스 생성
//       let service: ChatService<unknown>;
//       switch (key) {
//          case 'trial':
//             service = new TrialChatService();
//             break;
//          case 'default':
//             service = new BaseChatService();
//             break;
//          case 'unauthorized':
//             throw new Error('Unauthorized');
//          default:
//             throw new Error(`Unknown service key: ${key}`);
//       }

//       // 생성된 서비스를 저장하고 반환
//       this.services.set(key, service);
//       return service;
//    }
// }
