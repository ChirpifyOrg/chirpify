'use server';
import { NextRequest, NextResponse } from 'next/server';
import { GenerateFeedbackRequestDTO, GenerateSentenceRequestDTO, TranslateModelUseType } from '@/types/translate';
import { createClient } from '@/lib/be/superbase/server';
import { TranslateAIModelUseCaseFactory } from '@/be/application/translate/TranslateAIModelUseCaseFactory';
import { safeJsonStringify } from '@/lib/be/utils/json';
import { UnitOfWorkTranslateFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkTranslateFactory';
import { GetLastTranslateFeedbackUseCase } from '@/be/application/translate/GetLastTranslateFeedbackUseCase';

export async function GET(request: NextRequest, { params }: { params: Promise<{ translateCategory: string }> }) {
   const { searchParams } = new URL(request.url);
   const { translateCategory } = await params;
   if (translateCategory !== 'feedback') {
      return NextResponse.json({ error: 'Invalid translate category' }, { status: 400 });
   }

   const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();
   const userId = data?.user?.id;
   if (!userId || error) {
      console.log(error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }
   const uow = UnitOfWorkTranslateFactory.create();
   const useCase = new GetLastTranslateFeedbackUseCase(uow);
   const response = await useCase.execute({ userId, limit });
   return NextResponse.json(response, { status: 200 });
}
export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ translateCategory: TranslateModelUseType }> },
) {
   try {
      const { level, selectedOptions, sentenceId, question, answer, language } = await request.json();
      const { translateCategory } = await params;

      const superbase = await createClient();
      const { data, error } = await superbase.auth.getUser();

      const userId = data?.user?.id;
      if (!userId || error) {
         console.log(error);
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const useCase = TranslateAIModelUseCaseFactory.getInstance().getUseCase(translateCategory);

      let response;

      switch (translateCategory) {
         case 'feedback': {
            const feedbackRequest: GenerateFeedbackRequestDTO = {
               sentenceId,
               userId,
               question,
               answer,
               level,
               selectedOptions,
               language,
            };
            response = await useCase.execute(feedbackRequest);
            break;
         }
         case 'sentence': {
            const sentenceRequest: GenerateSentenceRequestDTO = {
               userId,
               level,
               selectedOptions,
               language,
            };
            response = await useCase.execute(sentenceRequest);
            break;
         }
      }
      const json = JSON.parse(safeJsonStringify(response));
      return NextResponse.json(json, { status: 200 });
   } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: message.includes('useType') ? 400 : 500 });
   }
}
