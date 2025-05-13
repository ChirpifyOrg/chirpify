import { Metadata } from 'next';
import { ChatContainer } from '@/components/chat/chat-container';
import { GetChatModelByChatRoomIdUseCase } from '@/be/application/chat/GetChatModelByChatRoomIdUseCase';
import { UnitOfWorkChatFactory } from '@/be/infrastructure/repository/uow/factory/UnitOfWorkChatFactory';
import { GetLastChatMessageUseCase } from '@/be/application/chat/GetLastChatMessageUseCase';

export const metadata: Metadata = {
   title: 'AI With Chat',
   description: 'AI Chatting',
};
const ChatPage = async ({ params }: { params: Promise<{ roomId: string }> }) => {
   const { roomId } = await params;

   const modelChatRoomUseCase = new GetChatModelByChatRoomIdUseCase(UnitOfWorkChatFactory.create());
   const modelChatRoomResponse = await modelChatRoomUseCase.execute(roomId);
   const lastMessageUseCase = new GetLastChatMessageUseCase(UnitOfWorkChatFactory.create());
   const lastMessageResponse = await lastMessageUseCase.execute(roomId);

   if (!modelChatRoomResponse) {
      throw new Error('잘못된 room 소유자 입니다.');
   }
   const { model } = modelChatRoomResponse;
   if (!model?.persona) {
      throw new Error('잘못된 페르소나 입니다.');
   }
   return (
      <>
         <main className="max-w-6xl  w-full ">
            <ChatContainer
               persona={model.persona}
               lastMessage={lastMessageResponse ?? undefined}
               mode="trial"
               isStreaming={true}
               roomId={roomId}
            />
         </main>
      </>
   );
};
export default ChatPage;
