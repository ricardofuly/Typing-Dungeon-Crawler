import React from 'react';
import { Language } from '../types';
import { t } from '../services/translations';

interface StartScreenProps {
  language: Language;
  onStart: () => void;
  hasSaveData: boolean;
  onContinue: () => void;
  onOpenWiki: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ language, onStart, hasSaveData, onContinue, onOpenWiki }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 flex flex-col items-center justify-center text-center bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl border-2 border-gray-600 relative">
      <button 
        onClick={onOpenWiki}
        className="absolute top-2 right-2 px-4 py-2 text-xl bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-600 transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
      >
        ? {t('guide', language)}
      </button>
      <h1 className="text-6xl md:text-7xl text-red-500 mb-4 tracking-wider">Typing Dungeon</h1>
      <p className="text-lg text-gray-300 mb-8 max-w-md">
        {t('gameDescription', language)}
      </p>
      
      {hasSaveData && (
        <div className="w-full flex flex-col items-center mb-6">
          <button
            onClick={onContinue}
            className="w-full md:w-3/4 px-8 py-4 text-3xl bg-yellow-600 text-white rounded-lg shadow-lg hover:bg-yellow-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-400"
          >
            {t('continueAdventure', language)}
          </button>
          <p className="mt-4 text-gray-400">{t('orStartNewGame', language)}</p>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={onStart}
          className="px-8 py-4 text-3xl bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          {t('startNewGame', language)}
        </button>
      </div>
    </div>
  );
};