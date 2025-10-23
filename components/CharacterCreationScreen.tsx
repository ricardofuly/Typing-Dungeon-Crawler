import React, { useState } from 'react';
import { Language, PlayerAbility } from '../types';
import { generateCharacterNames } from '../services/geminiService';
import { t } from '../services/translations';

interface CharacterCreationScreenProps {
  language: Language;
  playerPortraits: { id: string; name: string; ability: PlayerAbility }[];
  onFinish: (name: string, portrait: string) => void;
}

export const CharacterCreationScreen: React.FC<CharacterCreationScreenProps> = ({ language, playerPortraits, onFinish }) => {
  const [name, setName] = useState('');
  const [selectedPortrait, setSelectedPortrait] = useState(playerPortraits[0].id);
  const [suggestedNames, setSuggestedNames] = useState<string[]>([]);
  const [isLoadingNames, setIsLoadingNames] = useState(false);

  const handleSuggestNames = async () => {
    setIsLoadingNames(true);
    const names = await generateCharacterNames(language);
    setSuggestedNames(names);
    setIsLoadingNames(false);
  };

  const handleStart = () => {
    if (name.trim() && selectedPortrait) {
      onFinish(name.trim(), selectedPortrait);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8 flex flex-col items-center justify-center text-center bg-gray-800 bg-opacity-70 rounded-2xl shadow-2xl border-2 border-gray-600">
      <h1 className="text-5xl text-yellow-300 mb-6">{t('createYourHero', language)}</h1>

      <div className="w-full max-w-md mb-6">
        <label htmlFor="char-name" className="text-xl text-gray-300 mb-2 block">{t('whatIsYourName', language)}</label>
        <div className="flex gap-2">
          <input
            id="char-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-gray-900 border-2 border-gray-600 rounded-md text-white text-lg focus:border-yellow-500 focus:outline-none"
            placeholder={t('enterYourName', language)}
          />
          <button
            onClick={handleSuggestNames}
            disabled={isLoadingNames}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-500 disabled:bg-gray-500 transition-colors"
          >
            {isLoadingNames ? '...' : t('suggest', language)}
          </button>
        </div>
        {suggestedNames.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 justify-center">
            {suggestedNames.map(suggestion => (
              <button key={suggestion} onClick={() => setName(suggestion)} className="text-sm bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600">
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full mb-8">
        <label className="text-xl text-gray-300 mb-3 block">{t('chooseYourPortrait', language)}</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {playerPortraits.map(portrait => (
            <div
              key={portrait.id}
              onClick={() => setSelectedPortrait(portrait.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${selectedPortrait === portrait.id ? 'bg-gray-700 border-yellow-500 scale-105 shadow-lg' : 'bg-gray-900 border-gray-700 hover:bg-gray-800'}`}
            >
              <div className={`w-full h-24 rounded-md flex items-center justify-center text-4xl font-bold ${portrait.id === 'cleric' ? 'text-gray-900' : 'text-white'} bg-${portrait.id}-color`}>
                {portrait.name.charAt(0)}
              </div>
              <h3 className="mt-3 text-center text-2xl text-white">{portrait.name}</h3>
              <div className="mt-2 pt-2 border-t border-gray-600 text-left">
                <p className="font-bold text-yellow-400 text-center">{portrait.ability.name}</p>
                <p className="text-sm text-gray-300 text-center">{portrait.ability.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
       <style>{`
        .bg-warrior-color { background-color: #993333; }
        .bg-mage-color { background-color: #336699; }
        .bg-rogue-color { background-color: #339966; }
        .bg-cleric-color { background-color: #ddddbb; }
      `}</style>

      <button
        onClick={handleStart}
        disabled={!name.trim()}
        className="w-full md:w-3/4 px-8 py-4 text-3xl bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-500 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400"
      >
        {t('beginAdventure', language)}
      </button>
    </div>
  );
};