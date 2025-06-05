'use client';
import React, { useEffect } from 'react';
import NativeLanguageArea from '@/components/native-language-area';
import InputArea from '@/components/translate/input-area';
import Settings from '@/components/translate/settings';

import { useStore } from 'zustand';
import { useTranslateStore } from '../../state/TranslateStore';
import TranslateEvaluationArea from '@/components/translate/translate-evaluation-area';
import History from '@/components/translate/history';
import { GetLastTranslateFeedback } from '@/types/translate';

interface TranslateProps {
   history: GetLastTranslateFeedback[];
}
const Translate = ({ history }: TranslateProps) => {
   const { currentSentents, currentLevel, currentFeedback, setCurrentFeedback, setHistories, histories } =
      useStore(useTranslateStore);
   useEffect(() => {
      setHistories(history);
   }, []);
   return (
      <div className="flex w-full md:w-10/12 sd:w-full m-1  max-h-[90dvh] h-[90dvh]  bg-gray-900 text-white">
         {/* 왼쪽 채팅 영역 */}
         <div className="sm:w-full md:w-4/5 flex flex-col border-r border-gray-700">
            <NativeLanguageArea sentence={currentSentents} />
            <TranslateEvaluationArea feedback={currentFeedback} />
            <InputArea setFeedback={setCurrentFeedback} level={currentLevel} />
         </div>

         {/* 오른쪽 설정 영역 */}
         <div className="w-full sm:w-full md:w-1/5 space-y-3 flex flex-col" style={{ overflowX: 'auto' }}>
            <div className="w-full p-3 ">
               <Settings />
            </div>
            <div className="w-full p-3 flex-1 overflow-y-auto">
               <History history={histories} />
            </div>
         </div>
      </div>
   );
};

export default Translate;
