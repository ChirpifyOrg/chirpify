'use server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/be/superbase/server';
import { toHttpError } from '@/lib/be/utils/error-http-mapper';
import { UnitOfWorkChatFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkChatFactory';
import { GetChatModelListUseCase } from '@/be/application/chat/GetChatModelListUseCase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
   try {
      const superbase = await createClient();
      const { data, error } = await superbase.auth.getUser();

      const userId = data?.user?.id;
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const useCase = new GetChatModelListUseCase(UnitOfWorkChatFactory.create());
      const responseData = useCase.execute();
      return NextResponse.json(responseData, {
         headers: {
            'Content-Type': 'application/json',
         },
      });
   } catch (e) {
      const error = toHttpError(e);
      return NextResponse.json(error.body, { status: error.status });
   }
}
