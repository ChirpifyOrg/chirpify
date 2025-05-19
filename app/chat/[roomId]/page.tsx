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

   const uow = UnitOfWorkChatFactory.create();

   const { modelChatRoomResponse, lastMessageResponse } = await uow.executeInTransaction(async () => {
      const modelChatRoomUseCase = new GetChatModelByChatRoomIdUseCase(uow);
      const modelChatRoomResponse = await modelChatRoomUseCase.execute(roomId);

      const lastMessageUseCase = new GetLastChatMessageUseCase(uow);
      const lastMessageResponse = await lastMessageUseCase.execute(roomId);

      // 트랜잭션 내에서 필요한 값 모두 반환
      return { modelChatRoomResponse, lastMessageResponse };
   });

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
