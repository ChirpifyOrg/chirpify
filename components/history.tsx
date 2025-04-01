import React from 'react';

const History: React.FC = () => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4">History</h3>
      <div className="space-y-2 overflow-y-auto flex-1">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i}
            className="p-3 bg-gray-700 rounded hover:bg-gray-600 cursor-pointer transition-colors"
          >
            I'm busy because worked ....
          </div>
        ))}
      </div>
    </div>
  );
};

export default History; 