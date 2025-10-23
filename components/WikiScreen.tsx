import React from 'react';
import { Language } from '../types';
import { t } from '../services/translations';

interface WikiScreenProps {
  language: Language;
  onClose: () => void;
}

const WikiSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-2xl text-yellow-300 border-b-2 border-yellow-700 pb-1 mb-3">{title}</h3>
    <div className="text-gray-300 space-y-2">{children}</div>
  </div>
);

export const WikiScreen: React.FC<WikiScreenProps> = ({ language, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[90vh] bg-gray-800 border-2 border-yellow-500 rounded-lg shadow-2xl flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h1 className="text-4xl text-yellow-400">{t('dungeonGuide', language)}</h1>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xl bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-500 transform hover:scale-105 transition-all duration-300"
          >
            &times;
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <WikiSection title={t('coreCombatTitle', language)}>
            <p>{t('coreCombatP1', language)}</p>
            <p><strong>Damage Enemy:</strong> {t('coreCombatP2', language)}</p>
            <p><strong>Take Damage:</strong> {t('coreCombatP3', language)}</p>
          </WikiSection>

          <WikiSection title={t('classAbilitiesTitle', language)}>
            <p>Each class has a unique ability with a cooldown, usable once per battle after it's ready.</p>
            <ul className="list-disc list-inside ml-4 space-y-2 mt-2">
                <li><strong>Warrior - {t('warriorAbilityName', language)}:</strong> {t('warriorAbilityDesc', language)}</li>
                <li><strong>Mage - {t('mageAbilityName', language)}:</strong> {t('mageAbilityDesc', language)}</li>
                <li><strong>Rogue - {t('rogueAbilityName', language)}:</strong> {t('rogueAbilityDesc', language)}</li>
                <li><strong>Cleric - {t('clericAbilityName', language)}:</strong> {t('clericAbilityDesc', language)}</li>
            </ul>
          </WikiSection>

          <WikiSection title={t('combosBonusesTitle', language)}>
            <p>{t('combosBonusesP1', language)}</p>
            <p>{t('combosBonusesP2', language)}</p>
            <ul className="list-disc list-inside ml-4">
              <li><strong><span className="text-green-400">{t('heal', language)}:</span></strong> Restores a small amount of health.</li>
              <li><strong><span className="text-orange-400">{t('damageUp', language)}:</span></strong> Temporarily increases your damage per character for 5 seconds.</li>
              <li><strong><span className="text-cyan-400">{t('shield', language)}:</span></strong> Grants a shield that blocks the next instance of damage, from any source.</li>
            </ul>
          </WikiSection>
          
          <WikiSection title={t('dungeonDangersTitle', language)}>
             <p>As you go deeper, you'll encounter tougher foes in special rooms, marked on your minimap:</p>
             <p><strong>⭐ Elite Rooms (Every 5th Level):</strong> Contain a powerful Elite enemy with more health and damage. A true test of your skills.</p>
             <p><strong>💀 Boss Rooms (Every 10th Level):</strong> The final room of each floor holds a formidable Boss with unique, disruptive mechanics.</p>
          </WikiSection>

          <WikiSection title={t('bossMechanicsTitle', language)}>
             <p>Bosses will try to break your focus with special attacks:</p>
             <ul className="list-disc list-inside ml-4">
              <li><strong>Scrambled Words:</strong> The letters of some words will be visually mixed up. You must type the original, correct word to proceed.</li>
              <li><strong>Fading Words:</strong> Words will flicker and fade in and out of view, testing your memory.</li>
            </ul>
          </WikiSection>

           <WikiSection title={t('lootShopsTitle', language)}>
             <p>After each battle, you'll be rewarded. You might find:</p>
             <ul className="list-disc list-inside ml-4">
              <li><strong>Gold:</strong> The most common reward, used for purchasing items.</li>
              <li><strong>Items:</strong> Powerful artifacts that permanently boost your stats.</li>
              <li><strong>A Shop (Rare):</strong> Occasionally, a merchant will appear, allowing you to spend your gold on a selection of powerful items.</li>
            </ul>
          </WikiSection>
        </div>
      </div>
    </div>
  );
};