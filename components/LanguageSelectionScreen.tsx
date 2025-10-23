import React from 'react';
import { Language } from '../types';
import { t } from '../services/translations';

interface LanguageSelectionScreenProps {
  onSelectLanguage: (language: Language) => void;
}

export const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({ onSelectLanguage }) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 flex flex-col items-center justify-center text-center bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl border-2 border-gray-600">
      <h1 className="text-4xl md:text-5xl text-yellow-300 mb-8">
        {t('selectLanguage', Language.ENGLISH)} / {t('selectLanguage', Language.PORTUGUESE)}
      </h1>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={() => onSelectLanguage(Language.ENGLISH)}
          className="px-8 py-4 text-3xl bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          English
        </button>
        <button
          onClick={() => onSelectLanguage(Language.PORTUGUESE)}
          className="px-8 py-4 text-3xl bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400"
        >
          Português
        </button>
      </div>
    </div>
  );
};