import React, { useEffect } from 'react';
import TranslateEvaluationArea from './translate-evaluation-area';
import { GetLastTranslateFeedback } from '@/types/translate';

interface HistoryModalProps {
   isOpen: boolean;
   onClose: () => void;
   selectedHistory: GetLastTranslateFeedback | null; // 선택된 히스토리 항목
}

const HistoryModal = ({ isOpen, onClose, selectedHistory }: HistoryModalProps) => {
   useEffect(() => {
      console.log(selectedHistory);
      if (isOpen) {
         // ESC 키 이벤트 리스너 추가
         const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
               onClose(); // ESC 키가 눌리면 모달 닫기
            }
         };

         window.addEventListener('keydown', handleKeyDown);

         // 컴포넌트 언마운트 시 이벤트 리스너 제거
         return () => {
            window.removeEventListener('keydown', handleKeyDown);
         };
      }
   }, [isOpen, onClose]);

   if (!isOpen) return null; // 모달이 열리지 않으면 아무것도 렌더링하지 않음

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
         <div
            className="w-2/3 h-[80vh] bg-gray-800 p-4 rounded-lg flex flex-col relative"
            onClick={e => e.stopPropagation()} // 모달 내부 클릭 시 이벤트 전파 방지
         >
            <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
               X
            </button>
            <h4 className="text-lg pb-2 font-semibold">History Detail</h4>
            <p>Question : {selectedHistory?.sentence}</p>
            <TranslateEvaluationArea feedback={selectedHistory?.feedback ?? null} />
         </div>
      </div>
   );
};

export default HistoryModal;
