import React from 'react';

const Header = () => {
  const mockData = {
    mainTitle: "영작할 수 있는 문장 (모국어) 이렇게 길어져도 스크롤이 생기고 높이를 벗어나지 않습니다",
  };

  return (
    <div className="chat-header h-[15vh] w-full flex items-center justify-center p-4">
      <div className="max-h-full w-[90%] overflow-y-auto">
        <div className="text-xl font-semibold text-center break-words">{mockData.mainTitle}</div>
      </div>
    </div>
  );
};

export default Header; 