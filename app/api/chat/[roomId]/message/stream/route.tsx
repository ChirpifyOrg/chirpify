'use server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/be/superbase/server';
import { ClientChatRequest } from '@/types/chat';
import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';
import { createChatRequest } from '@/be/application/chat/Dtos';

export async function POST(request: Request) {
   const { roomId } = params;
   const { message, nativeLanguage }: ClientChatRequest = await request.json();
   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();
   const isLoggedIn = !error && data?.user != null;

   const userId = data?.user?.id;
   if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   const isTrial = data?.user?.is_anonymous ? true : false;

   const encoder = new TextEncoder();
   const stream = new ReadableStream({
      async start(controller) {
         // 콜백용 함수 선언
         // TODO : NDJSON 형식으로 Prompt단에서 변경이 필요.
         const cb = (data: string) => {
            controller.enqueue(encoder.encode(data));
         };
         const useCase = ChatUseCaseFactory.getInstance().getUseCase(isLoggedIn, isTrial);

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
