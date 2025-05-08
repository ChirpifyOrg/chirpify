'use server';
import { NextResponse } from 'next/server';
import { toHttpError } from '@/lib/be/utils/error-http-mapper';
import { UnitOfWorkChatFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkChatFactory';
import { GetChatModelListUseCase } from '@/be/application/chat/GetChatModelListUseCase';

export async function GET() {
   try {
      const useCase = new GetChatModelListUseCase(UnitOfWorkChatFactory.create());
      const responseData = await useCase.execute();
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
