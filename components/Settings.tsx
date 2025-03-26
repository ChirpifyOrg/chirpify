"use client";

import React, { useState } from 'react';

const Settings: React.FC = () => {
  const [difficulty, setDifficulty] = useState<number>(2);

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Setting</h3>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block">난이도</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full"
            />
            <span className="text-sm">{difficulty}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 px-0.5">
            <span>쉬움</span>
            <span>어려움</span>
          </div>
        </div>
        <div className="flex-1">대화 주제</div>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors">
            Search
          </button>
        </div>
        <div className="flex gap-2">
        <button className="flex-1 px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors ml-auto">
        Generate a sentence
          </button>
          </div>
      </div>
    </div>
  );
};

export default Settings; 