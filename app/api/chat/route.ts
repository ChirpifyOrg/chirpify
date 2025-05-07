import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';
import { createClient } from '@/lib/be/superbase/server';
import { toHttpError } from '@/lib/be/utils/error-http-mapper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
   try {
      const { modelId } = await request.json();

      const superbase = await createClient();
      const { data, error } = await superbase.auth.getUser();
      const isLoggedIn = !error && data?.user != null;

      const userId = data?.user?.id;
      const isTrial = data?.user?.is_anonymous ? true : false;
      if (!userId || error || isTrial) {
         console.log(error);
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const useCase = ChatUseCaseFactory.getInstance().getUseCase({ isLoggedIn, isTrial: false });
      const response = await useCase.getOrCreateRoom({ modelId, userId });
      return NextResponse.json(response, {
         headers: {
            'Content-Type': 'application/json',
         },
      });
   } catch (e) {
      const error = toHttpError(e);
      return NextResponse.json(error.body, { status: error.status });
   }
}
