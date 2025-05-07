import { Metadata } from 'next';
import { ChatContainer } from '@/components/chat/chat-container';

export const metadata: Metadata = {
   title: 'AI With Chat',
   description: 'AI Chatting',
};
const ChatPage = async ({ params }: { params: Promise<{ roomId: string }> }) => {
   const { roomId } = await params;

   return (
      <>
         <main className=" w-full ">
            <ChatContainer persona={'Aru'} mode="trial" isStreaming={true} roomId={roomId} />
         </main>
      </>
   );
};
export default ChatPage;
