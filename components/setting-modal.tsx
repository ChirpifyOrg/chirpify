import { useTranslateStore } from '@/app/state/TranslateStore';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useStore } from 'zustand';

interface ModalProps {
   isOpen: boolean;
   onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
   const { selectOptions, setCurrentSelectOptions } = useStore(useTranslateStore);
   const [selectedOptions, setSelectedOptions] = useState<string[]>(selectOptions);

   // 모달 컨테이너에 대한 ref 생성
   const modalRef = useRef<HTMLDivElement>(null);

   // 옵션 목록 정의
   const options = ['축구', '야구', '농구', '배구', '탁구', '테니스', '회계', 'IT', '자전거', '비즈니스'];

   //  localStorage에서 옵션 로드
   const loadSavedOptions = () => {
      if (selectOptions.length > 0) {
         setSelectedOptions(selectOptions);
      }
   };

   useEffect(() => {
      loadSavedOptions();
   }, [selectOptions]);

   // 옵션 토글 함수
   const handleOptionToggle = useCallback((option: string) => {
      setSelectedOptions(prev => (prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option]));
   }, []);

   // 옵션 저장 함수
   const handleSave = useCallback(() => {
      setCurrentSelectOptions(selectedOptions);
      onClose();
   }, [selectedOptions, onClose]);

   // 모달이 열릴 때 포커스 이동
   useEffect(() => {
      if (isOpen && modalRef.current) {
         // 약간의 지연 후 모달에 포커스 설정
         setTimeout(() => {
            modalRef.current?.focus();
         }, 50);
      }
   }, [isOpen]);

   // 키보드 이벤트 핸들러
   useEffect(() => {
      if (!isOpen) return;

      const handleKeyDown = (event: KeyboardEvent) => {
         if (event.key === 'Escape') {
            onClose();
         }
         if (event.key === 'Enter') {
            handleSave();
         }
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
         window.removeEventListener('keydown', handleKeyDown);
      };
   }, [isOpen, onClose, handleSave]);

   // 모달이 닫혀있으면 아무것도 렌더링하지 않음
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
         <div
            ref={modalRef}
            className="w-2/3 h-[90vh] bg-gray-800 p-4 rounded-lg flex flex-col relative"
            onClick={e => e.stopPropagation()}
            tabIndex={-1} // 포커스를 받을 수 있도록 설정
         >
            {/* 닫기 버튼 */}
            <button
               type="button"
               onClick={onClose}
               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
               X
            </button>

            {/* 모달 제목 */}
            <h4 className="text-lg pb-2 font-semibold">Writing Theme</h4>

            {/* 옵션 그리드 */}
            <div className="grid grid-cols-5 gap-2">
               {options.map(option => (
                  <button
                     key={option}
                     type="button"
                     onClick={() => handleOptionToggle(option)}
                     className={`p-2 rounded transition-colors ${
                        selectedOptions.includes(option) ? 'bg-gray-400' : 'bg-gray-700'
                     }`}>
                     {option}
                  </button>
               ))}
            </div>

            {/* 저장 버튼 */}
            <div className="mt-auto">
               <button
                  type="button"
                  onClick={handleSave}
                  className="mt-4 px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition-colors">
                  Save
               </button>
            </div>
         </div>
      </div>
   );
};

export default Modal;
