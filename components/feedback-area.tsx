import React from 'react';

const ChatArea: React.FC = () => {

  return (
    <div className="flex-1 p-3 overflow-y-auto border-t border-gray-700 pt-1">
      <div className="space-y-4 p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
      </div>
    </div>
  );
};

export default ChatArea;