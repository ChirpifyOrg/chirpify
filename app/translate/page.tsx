'use client';
import React, { useState } from 'react';
import NativeLanguageArea from '@/components/native-language-area';
import FeedbackArea from '@/components/feedback-area';
import InputArea from '@/components/input-area';
import Settings from '@/components/settings';
import History from '@/components/history';

const Layout: React.FC = () => {
   const [mainTitle, setMainTitle] = useState<string>('');
   const [feedback, setFeedback] = useState<object | null>(null);
   console.log(feedback);
   return (
      <div className="flex w-full md:w-10/12 sd:w-full m-1 h-90vh bg-gray-900 text-white">
         {/* 왼쪽 채팅 영역 */}
         <div className="sm:w-full md:w-4/5 flex flex-col border-r border-gray-700">
            <NativeLanguageArea sentence={mainTitle} />
            <FeedbackArea />
            <InputArea sentence={mainTitle} setFeedback={setFeedback} setMainTitle={setMainTitle} />
         </div>

         {/* 오른쪽 설정 영역 */}
         <div className="w-full sm:w-full md:w-1/5 space-y-3 flex flex-col" style={{ overflowX: 'auto' }}>
            <div className="w-full p-3 ">
               <Settings setMainTitle={setMainTitle} />
            </div>
            <div className="w-full p-3 flex-1 overflow-y-auto">
               <History />
            </div>
         </div>
      </div>
   );
};

export default Layout;
