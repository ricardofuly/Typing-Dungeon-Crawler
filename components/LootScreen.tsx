
import React from 'react';
import { Item, Language } from '../types';
import { t } from '../services/translations';

interface LootScreenProps {
  language: Language;
  item: Item | null;
  gold: number | null;
  onContinue: (item: Item | null) => void;
}

export const LootScreen: React.FC<LootScreenProps> = ({ language, item, gold, onContinue }) => {
  return (
    <div className="w-full max-w-md mx-auto p-8 flex flex-col items-center justify-center text-center bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl border-2 border-yellow-400">
      <h1 className="text-5xl text-yellow-300 mb-4">{item ? t('victory', language) : t('plunder', language)}</h1>
      
      {item && (
        <>
          <p className="text-lg text-gray-300 mb-8">{t('foundItem', language)}</p>
          <div className="w-full p-6 border-2 border-purple-500 bg-gray-900 rounded-lg shadow-lg mb-8 transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-3xl text-purple-400 mb-2">{item.name}</h2>
            <p className="text-gray-300">{item.description}</p>
          </div>
        </>
      )}

      {gold && (
        <>
          <p className="text-lg text-gray-300 mb-8">{t('foundGold', language)}</p>
           <div className="w-full p-6 border-2 border-yellow-600 bg-gray-900 rounded-lg shadow-lg mb-8">
            <h2 className="text-4xl text-yellow-400 font-bold tracking-wider">{gold} Gold</h2>
          </div>
        </>
      )}


      <button
        onClick={() => onContinue(item)}
        className="px-8 py-4 text-2xl bg-yellow-500 text-gray-900 rounded-lg shadow-lg hover:bg-yellow-400 transform hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-300"
      >
        {t('ventureDeeper', language)}
      </button>
    </div>
  );
};