import React from 'react';

const ChatArea: React.FC = () => {

  const messages = [
    { id: 1, role: 'user', content: '안녕하세요' },
    { id: 2, role: 'assistant', content: '안녕하세요! 무엇을 도와드릴까요?' },

  ];

  return (
    <div className="flex-1 p-3 overflow-y-auto border-t border-gray-700 pt-1">
      <div className="space-y-4 p-3">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`p-5 rounded-lg ${
              message.role === 'assistant' ? 'bg-gray-800' : 'bg-gray-700'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatArea;