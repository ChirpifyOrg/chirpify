"use client";

import React, { useState } from 'react';

const InputArea: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');

  return (
    <div className="flex mx-2 my-2 py-2 gap-2 p-3 bg-gray-800 rounded-lg">
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Type..."
        className="flex-1 bg-transparent outline-none resize-none min-h-[40px] max-h-[120px] overflow-y-auto"
        rows={1}
      />
      <button className="px-4 py-2 border border-gray-600 rounded hover:bg-gray-700 transition-colors">
        ↵
      </button>
    </div>
  );
};

export default InputArea; 