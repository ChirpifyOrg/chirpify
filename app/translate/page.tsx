import React from 'react';
import NativeLanguageArea from '../../components/NativeLanguageArea';
import ChatArea from '../../components/ChatArea';
import InputArea from '../../components/InputArea';
import Settings from '../../components/Settings';
import History from '../../components/History';

const Layout: React.FC = () => {
  return (
    <div className="flex w-10/12 m-1 h-90vh bg-gray-900 text-white">
      {/* 왼쪽 채팅 영역 */}
      <div className="flex-[2] flex flex-col border-r border-gray-700">
        <NativeLanguageArea />
        <ChatArea />
        <InputArea />
      </div>

      {/* 오른쪽 설정 영역 */}
      <div className="flex-1 p-3 space-y-5 flex flex-col">
        <Settings />
        <div className="flex-1 overflow-y-auto">
          <History />
        </div>
      </div>
    </div>
  );
};

export default Layout;
