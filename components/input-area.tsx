"use client";

import React, { useState, useRef } from 'react';

const InputArea: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const isComposingRef = useRef(false);

  const handleSend = async () => {
    const trimmedText = inputText.trim(); // 공백 제거
    if (trimmedText) { // 빈 문자열이 아닐 때만 전송
      const question = "사용자가 물어본 질문"; // 실제 질문으로 대체
      const answer = trimmedText; // 사용자가 입력한 텍스트를 답변으로 사용

      const response = await fetch('/api/translate/feedback', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              question,
              answer,
          }),
      });

      console.log(response);

      const result = await response.json();
      console.log(result); // 결과 처리
      setInputText(''); // 전송 후 입력 필드 초기화
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 한글 조합 중일 때는 Enter 키 처리를 건너뜁니다
    if (isComposingRef.current) {
      return;
    }

    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift + Enter: 줄바꿈
        // 기본 줄바꿈을 허용하므로 아무것도 하지 않음
      } else {
        // Enter: 전송
        e.preventDefault(); // 기본 동작 방지 (줄바꿈 방지)
        handleSend(); // 전송 처리 함수 호출
      }
    }
  };

  const handleCompositionStart = () => {
    isComposingRef.current = true;
  };

  const handleCompositionEnd = () => {
    isComposingRef.current = false;
  };

  return (
    <div className="flex items-center w-full border border-gray-600 rounded p-2">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown} // 키 입력 처리
        //한글 입력 시 끝 글자 재전송 오류에 대한 코드 (아래 2줄)
        onCompositionStart={handleCompositionStart} // 조합 시작 감지
        onCompositionEnd={handleCompositionEnd} // 조합 종료 감지
        placeholder="Type..."
        className="flex-1 bg-transparent outline-none resize-none min-h-[40px] max-h-[120px] overflow-y-auto align-middle py-2"
        rows={1}
      />
      <button
        onClick={handleSend} // 버튼 클릭 시 전송 처리
        className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 transition-colors"
      >
        ↵
      </button>
    </div>
  );
};

export default InputArea;