import { Metadata } from 'next';
import { ChatModelList } from './chat_model_list';
import { GetChatModelListUseCase } from '@/be/application/chat/GetChatModelListUseCase';
import { UnitOfWorkChatFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkChatFactory';
export const metadata: Metadata = {
   title: 'AI With Chat List',
   description: 'AI Chatting Selection Model Page',
};

const ChatPage = async () => {
   const useCase = new GetChatModelListUseCase(UnitOfWorkChatFactory.create());
   const responseData = await useCase.execute();

   console.log(responseData);

   return (
      <>
         <div>Model Select</div>
         <main className="flex-1 px-3 flex flex-col w-full items-start justify-start">
            <ChatModelList data={responseData ?? []} />
         </main>
      </>
   );
};
export default ChatPage;
