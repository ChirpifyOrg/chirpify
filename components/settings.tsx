'use client';

import React, { useState } from 'react';
import Modal from './setting-modal'; // 모달 컴포넌트 임포트
import { useTranslateStore } from '@/app/state/TranslateStore';
import { useStore } from 'zustand';
import { API_ENDPOINTS } from '@/lib/fe/api-endpoints';

const Settings = () => {
   const {
      currentLevel,
      setCurrentLevel,
      setCurrentSentents,
      setCurrentSententsId,
      selectOptions,
      setCurrentEvaluation,
   } = useStore(useTranslateStore);
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

   const handleSearchClick = () => {
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
   };
   const generateSentence = async (_event: React.MouseEvent) => {
      // API 호출
      const response = await fetch(API_ENDPOINTS.getGenerateSentence(), {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({
            level: Number(currentLevel),
            selectedOptions: selectOptions,
            language: 'ko',
         }),
      });

      if (response.ok) {
         try {
            const result = await response.json();

            // result가 문자열이면 다시 한 번 파싱
            const finalResult = typeof result === 'string' ? JSON.parse(result) : result;

            if (finalResult && finalResult.sentence) {
               setCurrentSentents(finalResult.sentence);
               setCurrentSententsId(Number.parseInt(finalResult.sentenceId));
               setCurrentEvaluation(null);
            } else {
               console.error('No sentence in response');
            }
         } catch (error) {
            console.error('JSON 파싱 오류:', error);
         }
      } else {
         console.error('API 호출 실패:', response.statusText);
      }
   };

   return (
      <div className="bg-gray-800 p-4 rounded-lg">
         <h3 className="text-lg font-semibold mb-4">Setting</h3>

         <div className="space-y-4">
            <div className="space-y-2">
               <label className="block">난이도</label>
               <div className="flex items-center gap-4">
                  <input
                     type="range"
                     min="1"
                     max="5"
                     value={currentLevel}
                     onChange={e => {
                        const newLevel = Number(e.target.value);
                        setCurrentLevel(newLevel);
                     }}
                     className="w-full"
                  />
                  <span className="text-sm">{currentLevel}</span>
               </div>
               <div className="flex justify-between text-xs text-gray-500 px-0.5">
                  <span>쉬움</span>
                  <span>어려움</span>
               </div>
            </div>
            <div className="flex-1">대화 주제</div>
            <div className="flex gap-2">
               <button
                  className="w-full px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                  onClick={handleSearchClick}>
                  Search
               </button>
            </div>
            <div className="flex gap-2 w-fit">
               <button
                  className="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition-colors"
                  onClick={generateSentence}>
                  Generate a sentence
               </button>
            </div>
         </div>

         {/* 모달 컴포넌트 사용 */}
         <Modal isOpen={isModalOpen} onClose={closeModal} />
      </div>
   );
};

export default Settings;
