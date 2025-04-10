'use server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/be/superbase/server';
import { ClientChatRequest } from '@/types/chat';
import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';
import { createChatRequest } from '@/be/application/chat/Dtos';

export async function POST(request: Request) {
   const { roomId, message, nativeLanguage, isTrial }: ClientChatRequest = await request.json();
   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();
   const isLoggedIn = !error && data?.user != null;
   const testUser = { id: 'test-user-id', email: 'test@example.com' };

   if (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const userId = isLoggedIn ? data?.user?.id : testUser.id;

   const encoder = new TextEncoder();
   const stream = new ReadableStream({
      async start(controller) {
         // 콜백용 함수 선언
         // TODO : NDJSON 형식으로 Prompt단에서 변경이 필요.
         const cb = (data: string) => {
            controller.enqueue(encoder.encode(data));
         };
         const useCase = ChatUseCaseFactory.getInstance().getUseCase(isLoggedIn, isTrial ?? false);

         await useCase.processChatStreaming(
            createChatRequest({ message, nativeLanguage, roomId }, userId, isTrial),
            cb,
         );
         controller.close();
      },
   });

   return new Response(stream, {
      headers: {
         'Content-Type': 'application/json',
         'Transfer-Encoding': 'chunked', // 스트리밍 힌트 추가
      },
   });
}
