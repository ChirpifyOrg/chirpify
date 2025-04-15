// app/actions.js
'use server';

import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';
import { createClient } from '@/lib/be/superbase/server';
import { cookies } from 'next/headers';

export async function trailRoomCreateWithSupaBaseAnonymousUser(modelName = 'Aru') {
   const supabase = await createClient();
   let userId = null;
   let roomId = null;
   try {
      const isLoggedIn = (await supabase.auth.getUser()).data?.user ? true : false;
      if (isLoggedIn) {
         return { roomId, userId };
      }

      const { data, error } = await supabase.auth.signInAnonymously();
      if (error) {
         console.error('supabase anonymous create error', error);
         return;
      }
      userId = data.user?.id;

      const useCase = ChatUseCaseFactory.getInstance().getUseCase(isLoggedIn, true);
      const modelInfo = useCase.getLatestModelInfo({ name: modelName });
      const roomInfo = useCase.getOrCreateRoom({ userId, modelId: modelInfo.id });
      roomId = roomInfo.id;
   } catch (e) {
      console.error('error', e);
   }
   return { roomId, userId };
}

export async function trialRoomCreate() {
   // 필요한 로직 수행
   const roomId = generateRoomId(); // 룸 ID 생성 함수 (예시)

   // 쿠키 설정
   (await cookies()).set('roomId', roomId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24시간
      path: '/',
   });

   return roomId;
}

// 예시 함수: 실제 구현은 다를 수 있음
function generateRoomId() {
   return 'room_' + Math.random().toString(36).substring(2, 9);
}
