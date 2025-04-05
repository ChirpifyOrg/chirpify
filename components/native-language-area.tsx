"use client"

import React from 'react';

interface HeaderProps {
  sentence: string;
}

const Header: React.FC<HeaderProps> = ({ sentence }) => {
  return (
    <div className="chat-header h-[15vh] w-full flex items-center justify-center p-4">
      <div className="max-h-full w-[90%] overflow-y-auto">
        <div className="text-xl font-semibold text-center break-words">{sentence}</div>
      </div>
    </div>
  );
};

export default Header; 