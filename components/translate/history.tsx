'use client';
import React, { useState } from 'react';
import HistoryModal from './history-modal';
import { GetLastTranslateFeedback } from '@/types/translate';

interface HistoryProps {
   history: GetLastTranslateFeedback[] | null;
}
const History = ({ history }: HistoryProps) => {
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [selectedHistory, setSelectedHistory] = useState<GetLastTranslateFeedback | null>(null);

   const closeModal = () => {
      setIsModalOpen(false);
      setSelectedHistory(null);
   };
   return (
      <div className="bg-gray-800 p-4 rounded-lg h-full flex flex-col">
         <h3 className="text-lg font-semibold mb-4">History</h3>
         <div className="space-y-2 overflow-y-auto scrollbar-hide flex-1">
            {history?.map(row => {
               const { id, sentence } = row;
               return (
                  <div
                     key={id}
                     onClick={() => {
                        setSelectedHistory(row);
                        setIsModalOpen(true);
                     }}
                     className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition-colors">
                     {sentence}
                  </div>
               );
            })}
         </div>

         <HistoryModal isOpen={isModalOpen} onClose={closeModal} selectedHistory={selectedHistory} />
      </div>
   );
};

export default History;
