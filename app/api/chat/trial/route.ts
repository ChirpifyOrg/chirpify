import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';
import { createClient } from '@/lib/be/superbase/server';
import { toHttpError } from '@/lib/be/utils/error-http-mapper';
import { ForbiddenError } from '@/lib/be/utils/errors';
import { User } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
   try {
      let user: User | null = null;
      const superbase = await createClient();
      const { data, error } = await superbase.auth.getUser();
      const isLoggedIn = !error && data?.user != null;
      if (!isLoggedIn) {
         const anonResult = await superbase.auth.signInAnonymously();
         if (anonResult.error) {
            const e = toHttpError(error);
            return NextResponse.json(e.body, { status: e.status });
         }
         user = anonResult?.data?.user;
      } else {
         user = data.user;
      }
      if (!user?.is_anonymous) {
         const e = toHttpError(new ForbiddenError());
         return NextResponse.json(e.body, { status: e.status });
      }
      const userId = user?.id;
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const useCase = ChatUseCaseFactory.getInstance().getUseCase({ isLoggedIn: true, isTrial: true });
      const modelInfo = await useCase.getLatestModelInfo({ name: 'aru', isStreaming: true });
      if (!modelInfo) {
         return NextResponse.json({ error: '모델 정보를 가져오지 못하였습니다.' }, { status: 404 });
      }
      const roomInfo = await useCase.getOrCreateRoom({ userId, modelId: modelInfo.id });
      if (!roomInfo?.id) {
         return NextResponse.json({ error: '방을 생성하지 못하였습니다.' }, { status: 500 });
      }
      return NextResponse.json(
         {
            roomId: roomInfo.id,
         },
         {
            headers: {
               'Content-Type': 'application/json',
            },
         },
      );
   } catch (e) {
      const error = toHttpError(e);
      return NextResponse.json(error.body, { status: error.status });
   }
}
