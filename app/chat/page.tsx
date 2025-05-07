import { Metadata } from 'next';
import { ChatModelList } from './chat_model_list';
import { env } from '@/lib/be/utils/env';
export const metadata: Metadata = {
   title: 'AI With Chat List',
   description: 'AI Chatting Selection Model Page',
};

const ChatPage = async () => {
   const fetchData = await fetch(`http://${env.nextPublicDomain}/api/chat/models`);
   const data = await fetchData.json();

   return (
      <>
         <div className="w-full max-w-3xl px-2 mt-3">
            <h1 className="text-3xl md:text-5xl font-bold pb-2 text-center break-words">
               Chirpify, Start Learning with the Right <span style={{ color: '#0EF397' }}> AI</span>
            </h1>

            <h2
               className="font-medium text-xl md:text-2xl mb-4 pb-4 text-center break-words"
               style={{ color: '#7B7B7B' }}>
               Choose a chat model to guide your journey in English.
            </h2>
         </div>
         <main className="grid gap-4 mt-3 px-3 w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <ChatModelList data={data ?? []} />
         </main>
      </>
   );
};
export default ChatPage;
