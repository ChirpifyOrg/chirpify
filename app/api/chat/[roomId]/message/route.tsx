'use server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/be/superbase/server';
import { ClientChatRequest } from '@/types/chat';
import { OpenAIChatService } from '@/be/infrastructure/service/OpenAIChatService';
import { ChatRepositoryImpl } from '@/be/infrastructure/repository/ChatRepository';
import { AIModelRepositoryImpl } from '@/be/infrastructure/repository/AIModelRepository';
import { AuthenticationChatUseCase } from '@/be/application/chat/AuthenticationChatUseCase';
import { env } from '@/lib/be/utils/env';

export async function POST(request: Request) {
   const superbase = await createClient();
   const { roomId, message, nativeLanguage, isTrial }: ClientChatRequest = await request.json();
   const { data } = await superbase.auth.getUser();
   //    const user = data?.user;
   try {
      const service = new OpenAIChatService(env.openAPIKey);
      const chatRepository = new ChatRepositoryImpl();
      const aiModelRepository = new AIModelRepositoryImpl();
      const useCase = new AuthenticationChatUseCase(service, chatRepository, aiModelRepository);
      const response = await useCase.processChat({
         message,
         nativeLanguage,
         userId: '1',
         isTrial,
         roomId,
      });

      return NextResponse.json(response, {
         headers: {
            'Content-Type': 'application/json',
         },
      });
   } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
}
