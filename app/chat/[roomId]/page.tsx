import { Metadata } from 'next';
import { ChatContainer } from '@/components/chat/chat-container';
import { GetChatModelByChatRoomIdUseCase } from '@/be/application/chat/GetChatModelByChatRoomIdUseCase';
import { UnitOfWorkChatFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkChatFactory';

export const metadata: Metadata = {
   title: 'AI With Chat',
   description: 'AI Chatting',
};
const ChatPage = async ({ params }: { params: Promise<{ roomId: string }> }) => {
   const { roomId } = await params;

   const useCase = new GetChatModelByChatRoomIdUseCase(UnitOfWorkChatFactory.create());
   const response = await useCase.execute(roomId);
   if (!response) {
      throw new Error('잘못된 room 소유자 입니다.');
   }
   const { model } = response;
   if (!model?.persona) {
      throw new Error('잘못된 페르소나 입니다.');
   }
   return (
      <>
         <main className=" w-full ">
            <ChatContainer persona={model.persona} mode="trial" isStreaming={true} roomId={roomId} />
         </main>
      </>
   );
};
export default ChatPage;
