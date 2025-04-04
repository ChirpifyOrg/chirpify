"use client";

import React, { useState, useEffect } from 'react';
import Modal from './setting-modal'; // 모달 컴포넌트 임포트

const Settings: React.FC = () => {
  const [difficulty, setDifficulty] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedDifficulty = localStorage.getItem('difficulty');
    if (savedDifficulty) {
      setDifficulty(Number(savedDifficulty));
    } else {
      localStorage.setItem('difficulty', '1');
    }
  }, []);

  const handleSearchClick = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
              onChange={(e) => {
                const newDifficulty = Number(e.target.value);
                setDifficulty(newDifficulty);
                localStorage.setItem('difficulty', newDifficulty.toString());
              }}
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
          <button 
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
            onClick={handleSearchClick}
          >
            Search
          </button>
        </div>
        <div className="flex gap-2 w-fit">
          <button className="p-2 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition-colors">
            Generate a sentence
          </button>
        </div>
      </div>

      {/* 모달 컴포넌트 사용 */}
      <Modal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Settings;