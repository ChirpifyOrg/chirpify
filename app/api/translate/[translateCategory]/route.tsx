'use server';
import { NextRequest, NextResponse } from 'next/server';
import { GenerateFeedbackRequestDTO, GenerateSentenceRequestDTO, TranslateModelUseType } from '@/types/translate';
import { createClient } from '@/lib/be/superbase/server';
import { TranslateAIModelUseCaseFactory } from '@/be/application/translate/TranslateAIModelUseCaseFactory';
import { safeJsonStringify } from '@/lib/be/utils/json';
import { GetLastTranslateFeedbackUseCase } from '@/be/application/translate/GetLastTranslateFeedbackUseCase';
import { UnitOfWorkTranslateFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkTranslateFactory';

export async function GET() {
   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();

   const userId = data?.user?.id;
   if (!userId || error) {
      console.log(error);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
   }

   const uow = UnitOfWorkTranslateFactory.create();
   const useCase = new GetLastTranslateFeedbackUseCase(uow);
   useCase.execute({});
   return NextResponse.json(JSON.parse(safeJsonStringify(response)));
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
      return NextResponse.json(JSON.parse(safeJsonStringify(response)));
   } catch (error) {
      console.error('API Error:', error);
      const message = error instanceof Error ? error.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: message.includes('useType') ? 400 : 500 });
   }
}
