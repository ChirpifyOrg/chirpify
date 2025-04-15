'use server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/be/superbase/server';
import { ClientChatRequest } from '@/types/chat';
import { createChatRequest } from '@/be/application/chat/Dtos';
import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';

export async function POST(request: NextRequest) {
   const { roomId, message, nativeLanguage, isTrial }: ClientChatRequest = await request.json();
   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();
   const isLoggedIn = !error && data?.user != null;
   const testUser = { id: 'test-user-id', email: 'test@example.com' };

   if (error && !isTrial) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   const userId = isLoggedIn ? data?.user?.id : testUser.id;

   try {
      const useCase = ChatUseCaseFactory.getInstance().getUseCase(isLoggedIn, isTrial ?? false);
      const response = await useCase.processChat(
         createChatRequest({ message, nativeLanguage, roomId }, userId, isTrial),
      );
      return NextResponse.json(response, {
         headers: {
            'Content-Type': 'application/json',
         },
      });
   } catch (e) {
      return NextResponse.json({ e: 'Error' }, { status: 500 });
   }
}

export async function GET(req: NextRequest, { params }: { params: { roomId: string } }) {
   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();
   const isLoggedIn = !error && data?.user != null;

   const roomId = params.roomId;

   const { searchParams } = req.nextUrl;
   const startIndex = searchParams.get('startIndex') ? parseInt(searchParams.get('startIndex')!) : undefined;
   const endIndex = searchParams.get('endIndex') ? parseInt(searchParams.get('endIndex')!) : undefined;
   const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

   // 여기에 서비스 호출 (예: ChatUseCase 등)
   // const useCase = ChatUseCaseFactory.getInstance().getUseCase(isLoggedIn);
   // const result = await useCase.getChatSimpleFormatHistory({ roomId, startIndex, endIndex, limit });

   const dummyData = {
      roomId,
      startIndex,
      endIndex,
      limit,
      messages: ['message 1', 'message 2'],
   };

   return NextResponse.json(dummyData);
}
