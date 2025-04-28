// app/actions.js
'use server';

import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';
import { createClient } from '@/lib/be/superbase/server';
import { cookies } from 'next/headers';

export async function createAnonymousUser(): Promise<{ sessionCreated: boolean }> {
   const supabase = await createClient();
   const { data: userData } = await supabase.auth.getUser();
   const isLoggedIn = !!userData?.user;

   if (isLoggedIn) return { sessionCreated: false };

   const { error } = await supabase.auth.signInAnonymously();
   if (error) {
      console.error('익명 사용자 생성 실패:', error.message);
      throw new Error('익명 사용자 생성 실패');
   }

   return { sessionCreated: true };
}
type TrialRoomResult = { success: true; roomId: string; userId: string } | { success: false; error: string };
interface trialRoomGetOrCreateWithSupaBaseAnonymousUserProps {
   modelName: string;
   isStreaming: boolean;
}
export async function trialRoomGetOrCreateWithSupaBaseAnonymousUser({
   modelName,
   isStreaming,
}: trialRoomGetOrCreateWithSupaBaseAnonymousUserProps): Promise<TrialRoomResult> {
   try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
         return { success: false, error: '사용자 정보를 가져오지 못했습니다.' };
      }

      const user = data?.user;
      const isLoggedIn = !!user;

      if (!isLoggedIn || !user?.is_anonymous) {
         return { success: false, error: '익명 사용자만 사용할 수 있습니다.' };
      }

      const userId = user.id;
      const useCase = ChatUseCaseFactory.getInstance().getUseCase(isLoggedIn, true);
      const modelInfo = await useCase.getLatestModelInfo({ name: modelName, isStreaming });

      if (!modelInfo?.id) {
         return { success: false, error: '모델 정보를 가져올 수 없습니다.' };
      }

      const roomInfo = await useCase.getOrCreateRoom({ userId, modelId: modelInfo.id });
      if (!roomInfo?.id) {
         return { success: false, error: '방을 생성하지 못하였습니다.' };
      }

      return { success: true, roomId: roomInfo.id, userId };
   } catch (e) {
      console.error('Unhandled error', e);
      return { success: false, error: '알 수 없는 에러가 발생했습니다.' };
   }
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
