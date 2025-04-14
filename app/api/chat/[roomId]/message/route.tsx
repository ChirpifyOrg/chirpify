'use server';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/be/superbase/server';
import { ClientChatRequest } from '@/types/chat';
import { createChatRequest } from '@/be/application/chat/Dtos';
import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';

export async function POST(request: Request) {
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
   } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
}
