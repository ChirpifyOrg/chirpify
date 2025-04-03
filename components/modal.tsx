import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]); // 선택된 옵션 상태

  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 localStorage에서 선택된 옵션 불러오기
      const savedOptions = localStorage.getItem('selectedOptions');
      if (savedOptions) {
        setSelectedOptions(JSON.parse(savedOptions));
      }

      // ESC 키 이벤트 리스너 추가
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  const handleOptionToggle = (option: string) => {
    setSelectedOptions((prev) => 
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  const handleSave = () => {
    // 선택된 옵션을 localStorage에 저장
    localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
    onClose(); // 모달 닫기
  };

  // 버튼 이름 배열 수정
  const options = ['축구', '야구', '농구', '배구', '탁구', '테니스', '회계',
    'IT', '자전거','비즈니스'
  ];

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
        <h4 className="text-lg pb-2 font-semibold">Writing Theme</h4>
        <div className="grid grid-cols-5 gap-2"> {/* 5개씩 배치 */}
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionToggle(option)}
              className={`p-2 rounded transition-colors ${
                selectedOptions.includes(option) ? 'bg-gray-400' : 'bg-gray-700'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="mt-auto"> {/* 하단에 고정 */}
          <button 
            onClick={handleSave} // Save 버튼 클릭 시 handleSave 호출
            className="mt-4 px-4 py-2 bg-gray-500 rounded hover:bg-gray-600 transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;