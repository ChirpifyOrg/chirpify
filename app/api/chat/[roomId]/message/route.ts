'use server';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/be/superbase/server';
import { ClientChatRequest } from '@/types/chat';
import { createChatRequest } from '@/be/application/chat/Dtos';
import { ChatUseCaseFactory } from '@/be/application/chat/ChatUseCaseFactory';
import { toHttpError } from '@/lib/be/utils/error-http-mapper';

export async function POST(request: Request, { params }: { params: Promise<{ roomId: string }> }) {
   try {
      const { roomId } = await params;
      const { message, nativeLanguage }: ClientChatRequest = await request.json();

      const superbase = await createClient();
      const { data, error } = await superbase.auth.getUser();
      const isLoggedIn = !error && data?.user != null;

      const userId = data?.user?.id;
      if (!userId || error) {
         console.log(error);
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const isTrial = data?.user?.is_anonymous ? true : false;

      const useCase = ChatUseCaseFactory.getInstance().getUseCase({ isLoggedIn, isTrial });
      const response = await useCase.processChat(
         createChatRequest({ message, nativeLanguage, roomId }, userId, isTrial),
      );
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
export async function GET(request: NextRequest, { params }: { params: Promise<{ roomId: string }> }) {
   try {
      const { roomId } = await params;
      const superbase = await createClient();
      const { data, error } = await superbase.auth.getUser();
      const isLoggedIn = !error && data?.user != null;
      const userId = data?.user?.id;
      if (!userId) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const isTrial = data?.user?.is_anonymous ? true : false;
      const useCase = ChatUseCaseFactory.getInstance().getUseCase({ isLoggedIn, isTrial });
      const { searchParams } = request.nextUrl;
      const startIndex = searchParams.get('startIndex') ? searchParams.get('startIndex')! : undefined;
      const endIndex = searchParams.get('endIndex') ? searchParams.get('endIndex')! : undefined;
      const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

      const responseData = await useCase.getHistory({ roomId, startIndex, endIndex, limit });
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
