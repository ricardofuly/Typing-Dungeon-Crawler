
import React from 'react';
import { Language } from '../types';
import { t } from '../services/translations';

interface DungeonMapProps {
  language: Language;
  level: number;
}

const MAP_LENGTH = 10;

export const DungeonMap: React.FC<DungeonMapProps> = ({ language, level }) => {
  const currentLevelOnMap = (level - 1) % MAP_LENGTH;
  const currentFloor = Math.floor((level - 1) / MAP_LENGTH) + 1;
  
  return (
    <div className="w-full max-w-xl mx-auto mb-6 p-3 bg-black bg-opacity-40 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-center text-sm uppercase tracking-widest text-gray-400 mb-3">
        {t('dungeonFloor', language, { floor: currentFloor })}
      </h3>
      <div className="flex justify-center items-center gap-2 md:gap-3">
        {Array.from({ length: MAP_LENGTH }).map((_, index) => {
          let stateClass = 'bg-gray-800 border-gray-700';
          let icon = null;

          const isBossRoom = index === MAP_LENGTH - 1;
          const isEliteRoom = index === Math.floor(MAP_LENGTH / 2) - 1;

          if (isBossRoom) {
            stateClass = 'border-red-700';
            icon = '💀';
          } else if (isEliteRoom) {
            stateClass = 'border-purple-700';
            icon = '⭐';
          }

          if (index < currentLevelOnMap) {
            stateClass += isBossRoom ? ' bg-red-900' : isEliteRoom ? ' bg-purple-900' : ' bg-yellow-900';
          } else if (index === currentLevelOnMap) {
            stateClass += isBossRoom ? ' bg-red-500 border-red-300 scale-125 animate-pulse' : isEliteRoom ? ' bg-purple-500 border-purple-300 scale-110 animate-pulse' : ' bg-yellow-500 border-yellow-300 scale-110 animate-pulse';
          } else {
             stateClass += ' bg-gray-800';
          }

          return (
            <div key={index} className={`w-6 h-6 md:w-7 md:h-7 rounded-full border-2 transition-all duration-500 flex items-center justify-center text-xs text-white ${stateClass}`}>
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};