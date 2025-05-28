'use client';
import React, { useState } from 'react';
import HistoryModal from './history-modal';

const History: React.FC = () => {
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [selectedHistory, setSelectedHistory] = useState<string | null>(null);

   const handleCardClick = (index: number) => {
      setSelectedHistory(`I'm busy because worked .... ${index + 1}`);
      setIsModalOpen(true);
   };

   const closeModal = () => {
      setIsModalOpen(false);
      setSelectedHistory(null);
   };

   return (
      <div className="bg-gray-800 p-4 rounded-lg h-full flex flex-col">
         <h3 className="text-lg font-semibold mb-4">History</h3>
         <div className="space-y-2 overflow-y-auto scrollbar-hide flex-1">
            {[...Array(7)].map((_, i) => (
               <div
                  key={i}
                  onClick={() => handleCardClick(i)}
                  className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition-colors">
                  I'm busy because worked ....
               </div>
            ))}
         </div>

         <HistoryModal isOpen={isModalOpen} onClose={closeModal} selectedHistory={selectedHistory} />
      </div>
   );
};

export default History;
