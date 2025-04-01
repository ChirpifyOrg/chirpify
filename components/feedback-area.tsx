import React from 'react';

const ChatArea: React.FC = () => {
  const messages = [
    { 
      id: 1, 
      role: 'user', 
      content: '안녕하세요. 반갑습니다. 오늘도 좋은 하루 되세요.' 
    },
    { 
      id: 2, 
      role: 'assistant', 
      content: '안녕하세요! 무엇을 도와드릴까요? 오늘도 좋은 하루 되세요.' 
    },
  ];

  return (
    <div className="flex-1 p-3 overflow-y-auto border-t border-gray-700 pt-1">
      <div className="space-y-4 p-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className="text-white"
          >
            {message.content.split('.').filter(sentence => sentence.trim()).map((sentence, index) => (
              <div key={index}>{sentence.trim() + '.'}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatArea;