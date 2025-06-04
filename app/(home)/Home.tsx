'use client';
import { ChatContainer } from '@/components/chat/chat-container';
import { useEffect, useState } from 'react';

export default function Home() {
   const [currentRoomId, setRoomId] = useState<string | null>(null);
   const modelName = 'aru';
   const isStreaming = true;
   useEffect(() => {
      // setRoomId(roomId);
      fetch('/api/chat/trial')
         .then(e => e.json())
         .then(r => {
            setRoomId(r.roomId);
         });
      console.log('home effect');
   }, []);
   return (
      <>
         {currentRoomId && (
            <div className="w-full max-w-5xl">
               <ChatContainer persona={modelName} mode="trial" isStreaming={isStreaming} roomId={currentRoomId} />
            </div>
         )}
      </>
   );
}
