
import React, { useState } from 'react';

interface DebugMenuProps {
  onClose: () => void;
  onJumpToLevel: (level: number) => void;
  onForceEncounter: (type: 'elite' | 'boss') => void;
  onAddGold: (amount: number) => void;
  onGiveItem: () => void;
  onHeal: () => void;
  onForceShop: () => void;
}

export const DebugMenu: React.FC<DebugMenuProps> = ({
  onClose,
  onJumpToLevel,
  onForceEncounter,
  onAddGold,
  onGiveItem,
  onHeal,
  onForceShop,
}) => {
  const [levelInput, setLevelInput] = useState('1');

  const handleJump = () => {
    const level = parseInt(levelInput, 10);
    if (!isNaN(level) && level > 0) {
      onJumpToLevel(level);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 border-2 border-red-500 rounded-lg shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-3xl text-red-400">Debug Menu</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xl bg-gray-600 text-white rounded-lg hover:bg-gray-500"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              value={levelInput}
              onChange={(e) => setLevelInput(e.target.value)}
              className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-white"
              placeholder="Enter level..."
            />
            <button onClick={handleJump} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 whitespace-nowrap">
              Go to Level
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => { onForceEncounter('elite'); onClose(); }} className="p-3 bg-purple-600 text-white rounded-lg hover:bg-purple-500">
              Fight Elite
            </button>
            <button onClick={() => { onForceEncounter('boss'); onClose(); }} className="p-3 bg-red-700 text-white rounded-lg hover:bg-red-600">
              Fight Boss
            </button>
            <button onClick={() => { onAddGold(1000); onClose(); }} className="p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-500">
              +1000 Gold
            </button>
            <button onClick={() => { onGiveItem(); onClose(); }} className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-500">
              Give Item
            </button>
            <button onClick={() => { onHeal(); onClose(); }} className="p-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500">
              Full Heal
            </button>
            <button onClick={() => { onForceShop(); onClose(); }} className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500">
              Force Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
