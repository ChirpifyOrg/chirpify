import React from 'react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedHistory: string | null; // 선택된 히스토리 항목
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, selectedHistory }) => {
  if (!isOpen) return null; // 모달이 열리지 않으면 아무것도 렌더링하지 않음

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-2/3 h-[90vh] bg-gray-800 p-4 rounded-lg flex flex-col relative">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        <h4 className="text-lg pb-2 font-semibold">History Detail</h4>
        <p>{selectedHistory}</p> {/* 선택된 히스토리 항목 표시 */}
      </div>
    </div>
  );
};

export default HistoryModal;
