'use server';
import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/be/superbase/server';
import { OpenAIChatService } from '@/be/infrastructure/service/OpenAIChatService';
import { env } from '@/lib/be/utils/env';
import { AuthenticationChatUseCase } from '@/be/application/chat/AuthenticationChatUseCase';

import { AIModelRepositoryImpl } from '@/be/infrastructure/repository/AIModel';
import { ChatRepositoryImpl } from '@/be/infrastructure/repository/Chat';
import { ClientChatRequest } from '@/types/chat';

export async function POST(request: Request) {
   const { roomId, message, nativeLanguage, isTrial }: ClientChatRequest = await request.json();
   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();
   const user = data?.user;
   const encoder = new TextEncoder();
   const stream = new ReadableStream({
      async start(controller) {
         // 콜백용 함수 선언
         const cb = (data: string) => {
            controller.enqueue(encoder.encode(data));
         };
         const service = new OpenAIChatService(env.openAPIKey);
         const chatRepository = new ChatRepositoryImpl();
         const aiModelRepository = new AIModelRepositoryImpl();
         const useCase = new AuthenticationChatUseCase(service, chatRepository, aiModelRepository);
         await useCase.processChatStreaming(
            {
               message,
               nativeLanguage,
               userId: '1',
               isTrial,
               roomId,
            },
            cb,
         );
         controller.close();
         // 추후 NDJSON 형식으로 변경시 아래 포멧처럼 구현할것.
         // const dataChunks = [
         //    { type: 'message', value: "Hello! I'm doing well, thank you!" },
         //    { type: 'evaluation', category: 'comprehension', value: 4 },
         //    { type: 'evaluation', category: 'grammar_accuracy', value: 4 },
         //    { type: 'evaluation', category: 'sentence_naturalness', value: 4 },
         //    { type: 'evaluation', category: 'vocabulary_naturalness', value: 4 },
         //    { type: 'total_score', value: 4 },
         //    { type: 'difficulty_level', value: 'Easy' },
         //    { type: 'emotion', value: 'Joy' },
         // ];
      },
   });

   return new Response(stream, {
      headers: {
         'Content-Type': 'application/json',
         'Transfer-Encoding': 'chunked', // 스트리밍 힌트 추가
      },
   });
}
