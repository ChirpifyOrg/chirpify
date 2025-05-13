import { ScrollArea } from '@/components/ui/scroll-area';
import { memo, useEffect, useState } from 'react';

interface AIResponseProps {
   message?: string;
   persona?: string;
   emotion?: string;
}

export const AIResponse = memo(({ message, persona, emotion }: AIResponseProps) => {
   const defaultData = {
      message: '안녕하세요! 저는 영어 학습을 도와주는 AI 어시스턴트입니다. 함께 영어를 배워볼까요?',
      persona: 'Aru',
      emotion: 'concern',
   };

   const [displayedMessage, setDisplayedMessage] = useState('');

   useEffect(() => {
      if (message) {
         setDisplayedMessage(''); // 초기화
         let index = 0;

         const interval = setInterval(() => {
            if (index < message.length) {
               setDisplayedMessage(prev => prev + message[index]);
               index++;
            } else {
               clearInterval(interval);
            }
         }, 100); // 100ms 간격으로 글자 추가

         return () => {
            clearInterval(interval); // ✅ 새 message 들어오거나 컴포넌트 언마운트 시 기존 interval 제거
         };
      }
   }, [message]);

   return (
      <div className="absolute bottom-[80px] left-4 right-4">
         <div className="bg-black/50 backdrop-blur-sm rounded-xl p-4 text-white shadow-lg">
            {/* Persona Title */}
            <div className="mb-2 flex items-center gap-2">
               <span className="text-lg font-bold text-white">{persona || defaultData.persona}</span>
               <span className="text-sm text-white/60 italic">speaks with {emotion || defaultData.emotion}</span>
               <div className="ml-2 h-px flex-1 bg-white/20" />
            </div>

            <ScrollArea className="h-[100px]">
               <div className="text-base leading-relaxed">{displayedMessage || defaultData.message}</div>
            </ScrollArea>
         </div>
      </div>
   );
});
