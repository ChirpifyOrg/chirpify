'use client';
import { ChatContainer } from '@/components/chat/chat-container';
import { createAnonymousUser, trialRoomGetOrCreateWithSupaBaseAnonymousUser } from '@/app/actions';
import { useEffect, useState } from 'react';

export default function Home() {
   const modelName = 'aru';
   const isStreaming = true;
   const [currentRoomId, setRoomId] = useState<string | null>(null);
   useEffect(() => {
      const initRoom = async () => {
         try {
            const { sessionCreated } = await createAnonymousUser();

            // 세션이 새로 생성된 경우 → 다음 렌더 사이클에 다시 시도
            if (sessionCreated) {
               location.reload();
               return;
            }

            const result = await trialRoomGetOrCreateWithSupaBaseAnonymousUser({ modelName, isStreaming });

            if (!result.success) {
               console.error(result.error);
               // alert(result.error);
               return;
            }

            setRoomId(result.roomId);
         } catch (e) {
            alert(e);
            console.error('Error initializing anonymous room:', e);
         }
      };

      initRoom();
   }, []);
   return (
      <>
         <main className="flex-1 flex flex-col w-full items-center justify-center">
            <div className="w-full max-w-3xl px-2">
               <h1 className="text-3xl md:text-5xl font-bold pb-2 text-center break-words">
                  Chirpify, Learn English by <span style={{ color: '#0EF397' }}>Thinking</span>
               </h1>
               <h2
                  className="font-medium text-xl md:text-2xl mb-4 pb-4 text-center break-words"
                  style={{ color: '#7B7B7B' }}>
                  A new way to learn through exploration and active engagement.
               </h2>

               <h2 className="font-medium text-xl md:text-2xl mb-4 text-center break-words">
                  Try your first lesson for free!
               </h2>
            </div>
            {currentRoomId && (
               <div className="w-full max-w-5xl">
                  <ChatContainer persona={modelName} mode="trial" isStreaming={isStreaming} roomId={currentRoomId} />
               </div>
            )}
         </main>
      </>
   );
}
