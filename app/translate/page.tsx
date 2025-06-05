import { Metadata } from 'next';
import Translate from './Translate';
import { GetLastTranslateFeedbackUseCase } from '@/be/application/translate/GetLastTranslateFeedbackUseCase';
import { UnitOfWorkTranslateFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkTranslateFactory';
import { createClient } from '@/lib/be/superbase/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
   title: 'AI With Translate',
   description: 'AI Translate',
   openGraph: {
      title: 'AI 영어 번역기',
      description: '입력한 문장을 AI가 번역하고 수준별 피드백을 제공합니다.',
      type: 'website',
      url: 'https://chirpify-three.vercel.app/translate',
      images: ['/images/icon.png'],
   },
};
export default async function TranslatePage() {
   const superbase = await createClient();
   const { data, error } = await superbase.auth.getUser();
   const userId = data?.user?.id;
   if (!userId || error) {
      console.log(error);
      redirect('/sign-up');
   }

   const uow = UnitOfWorkTranslateFactory.create();
   const useCase = new GetLastTranslateFeedbackUseCase(uow);
   const history = await useCase.execute({ userId, limit: 10 });

   return (
      <>
         <Translate history={history.map(dto => dto.toJSON())} />
      </>
   );
}
