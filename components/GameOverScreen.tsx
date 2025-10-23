
import React from 'react';
import { Language } from '../types';
import { t } from '../services/translations';

interface GameOverScreenProps {
  language: Language;
  level: number;
  onRestart: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({ language, level, onRestart }) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 flex flex-col items-center justify-center text-center bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl border-2 border-red-700">
      <h1 className="text-7xl text-red-600 mb-4">{t('youDied', language)}</h1>
      <p className="text-2xl text-gray-300 mb-8">{t('reachedLevel', language, { level })}</p>
      <button
        onClick={onRestart}
        className="px-8 py-4 text-3xl bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-500 transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400"
      >
        {t('tryAgain', language)}
      </button>
    </div>
  );
};