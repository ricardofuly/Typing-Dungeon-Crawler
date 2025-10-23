
import React from 'react';
import { Item, Language } from '../types';
import { t } from '../services/translations';

export interface ShopItem extends Item {
  price: number;
}

interface ShopScreenProps {
  language: Language;
  items: ShopItem[];
  playerGold: number;
  onBuy: (item: ShopItem) => void;
  onLeave: () => void;
}

export const ShopScreen: React.FC<ShopScreenProps> = ({ language, items, playerGold, onBuy, onLeave }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-8 flex flex-col items-center justify-center text-center bg-gray-800 bg-opacity-80 rounded-2xl shadow-2xl border-2 border-purple-500">
        <h1 className="text-5xl text-purple-300 mb-2">{t('merchantAppears', language)}</h1>
        <p className="text-lg text-gray-300 mb-6">{t('merchantGreeting', language)}</p>
        
        <div className="self-end mb-6 p-2 px-4 bg-gray-900 border border-yellow-500 rounded-md">
            <span className="text-xl text-yellow-400 font-bold">{t('yourGold', language, { gold: playerGold })}</span>
        </div>

        <div className="w-full flex flex-col gap-4 mb-8">
            {items.map((item) => (
                <div key={item.id} className="w-full flex items-center justify-between p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-md">
                    <div className="text-left">
                        <h3 className="text-2xl text-purple-400">{item.name}</h3>
                        <p className="text-gray-400">{item.description}</p>
                    </div>
                    <button
                        onClick={() => onBuy(item)}
                        disabled={playerGold < item.price}
                        className="px-6 py-2 text-xl bg-green-600 text-white rounded-lg shadow-md hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {t('buy', language, { price: item.price })}
                    </button>
                </div>
            ))}
            {items.length === 0 && (
                <p className="text-gray-400 text-lg">{t('shopSoldOut', language)}</p>
            )}
        </div>

        <button
            onClick={onLeave}
            className="px-8 py-4 text-2xl bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-500 transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-gray-400"
        >
            {t('continueJourney', language)}
      </button>
    </div>
  );
};