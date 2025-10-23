

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Enemy, RoomType, Language, Debuff, PlayerAbility } from '../types';
import { HealthBar } from './HealthBar';
import { t } from '../services/translations';

interface BattleScreenProps {
  language: Language;
  player: Player;
  enemy: Enemy;
  onTextCompleted: () => void;
  isAppendingText: boolean;
  combo: number;
  playerWasHit: boolean;
  bonusNotification: string | null;
  isPowerActive: boolean;
  playerDebuff: Debuff | null;
  userInput: string;
  onUseAbility: () => void;
}

const scrambleWord = (word: string): string => {
    if (word.length < 3) return word;
    const arr = word.split('');
    const punc = '.,?!';
    // Find a swappable range excluding punctuation
    let start = 0;
    let end = arr.length - 1;
    while(punc.includes(arr[start]) && start < end) start++;
    while(punc.includes(arr[end]) && end > start) end--;
    
    if (end - start < 1) return word;

    let i = Math.floor(Math.random() * (end - start + 1)) + start;
    let j = Math.floor(Math.random() * (end - start + 1)) + start;
    
    [arr[i], arr[j]] = [arr[j], arr[i]];
    return arr.join('');
};

interface TypingTextProps {
  targetText: string;
  userInput: string;
  activeMechanic: { type: 'scramble' | 'fade', targets: number[] } | null;
  isPowerActive: boolean;
  isBlinded: boolean;
  isConfused: boolean;
}

const TypingText: React.FC<TypingTextProps> = ({ targetText, userInput, activeMechanic, isPowerActive, isBlinded, isConfused }) => {
  const words = targetText.split(/(\s+)/);

  let charIndex = 0;
  return (
    <div className={`relative text-2xl lg:text-3xl font-mono p-4 md:p-6 border-2 border-gray-600 bg-black bg-opacity-40 rounded-lg shadow-lg leading-relaxed tracking-wider select-none transition-transform duration-200 ${isConfused ? 'animate-wiggle' : ''}`}>
      {words.map((word, wordIndex) => {
        let isAffected = activeMechanic && activeMechanic.targets.includes(wordIndex);
        let displayedWord = word;
        let wordClassName = '';
        
        if (isAffected) {
            if (activeMechanic?.type === 'scramble') {
                displayedWord = scrambleWord(word);
            }
            if (activeMechanic?.type === 'fade') {
                wordClassName = 'animate-fade-text';
            }
        }

        return (
          <span key={wordIndex} className={wordClassName}>
            {displayedWord.split('').map((char, charInWordIndex) => {
              const myIndex = charIndex;
              charIndex++;

              let colorClass = 'text-gray-500';
              let characterToDisplay = char;

              if (myIndex >= userInput.length && isBlinded) {
                  characterToDisplay = '#';
                  colorClass = 'text-gray-600';
              } else if (myIndex < userInput.length) {
                const isCorrect = targetText[myIndex] === userInput[myIndex];
                if (isCorrect) {
                    colorClass = isPowerActive ? 'text-orange-400' : 'text-green-400';
                } else {
                    colorClass = 'text-red-500 bg-red-900 bg-opacity-50';
                }
              }

              if (myIndex === userInput.length) {
                return <span key={myIndex} className={`transition-colors duration-150 ${isPowerActive ? 'text-orange-300 border-orange-300' : 'text-yellow-300 border-yellow-300'} animate-pulse border-b-2`}>{isBlinded ? '#' : targetText[myIndex]}</span>;
              }
              return <span key={myIndex} className={`transition-colors duration-150 ${colorClass}`}>{characterToDisplay}</span>;
            })}
          </span>
        );
      })}
    </div>
  );
};

const PORTRAIT_STYLES: { [key: string]: string } = {
    // Player
    'warrior': 'bg-red-800 border-red-500',
    'mage': 'bg-blue-800 border-blue-500',
    'rogue': 'bg-green-800 border-green-500',
    'cleric': 'bg-yellow-200 border-yellow-500 text-gray-800',
    // Enemies
    'goblin': 'bg-lime-700 border-lime-400',
    'orc': 'bg-green-900 border-green-600',
    'skeleton': 'bg-gray-400 border-gray-200',
    'ghoul': 'bg-indigo-900 border-indigo-600',
    'ogre': 'bg-amber-800 border-amber-500',
    'troll': 'bg-teal-800 border-teal-500',
    'dragon': 'bg-red-900 border-red-500',
    'lich': 'bg-purple-900 border-purple-500',
    'slime': 'bg-green-600 border-green-400',
    'bat': 'bg-neutral-800 border-neutral-600',
    'archer': 'bg-stone-600 border-stone-400',
    'wolf': 'bg-slate-800 border-slate-500',
    'default': 'bg-gray-700 border-gray-500',
};

const Portrait: React.FC<{ type: string | undefined, name: string }> = ({ type = 'default', name }) => {
    const style = PORTRAIT_STYLES[type] || PORTRAIT_STYLES['default'];
    return (
        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full border-4 shadow-lg flex-shrink-0 flex items-center justify-center text-4xl font-bold ${style}`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};


export const BattleScreen: React.FC<BattleScreenProps> = ({ 
    language, player, enemy, onTextCompleted, isAppendingText,
    combo, playerWasHit, bonusNotification, isPowerActive, playerDebuff,
    userInput, onUseAbility
}) => {
  const [activeMechanic, setActiveMechanic] = useState<{ type: 'scramble' | 'fade', targets: number[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const comboRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userInput.length === enemy.text.length && enemy.health > 0) {
      onTextCompleted();
    }
  }, [userInput, enemy.text, enemy.health, onTextCompleted]);
  
  // Boss mechanics handler
  useEffect(() => {
    if (enemy.roomType !== RoomType.BOSS || enemy.health <= 0) {
      return;
    }

    const triggerMechanic = () => {
        if(document.hidden) return; // Don't run mechanics if tab is not active
        const words = enemy.text.split(/(\s+)/);
        const mechanicType = Math.random() > 0.5 ? 'scramble' : 'fade';
        const targetCount = Math.max(1, Math.floor(words.length / 8));
        const targets: number[] = [];

        let attempts = 0;
        while(targets.length < targetCount && attempts < 50) {
            const randIndex = Math.floor(Math.random() * words.length);
            if (!targets.includes(randIndex) && words[randIndex].trim().length > 2) {
                targets.push(randIndex);
            }
            attempts++;
        }

        setActiveMechanic({ type: mechanicType, targets });

        setTimeout(() => {
            setActiveMechanic(null);
        }, 3000);
    };

    const interval = setInterval(triggerMechanic, 7000);

    return () => clearInterval(interval);
  }, [enemy.text, enemy.roomType, enemy.health]);

  // Confusion debuff handler
  useEffect(() => {
    if (playerDebuff?.type === 'confusion') {
        const words = enemy.text.split(/(\s+)/);
        const targetCount = Math.max(2, Math.floor(words.length / 6));
        const targets: number[] = [];
        let attempts = 0;
        while(targets.length < targetCount && attempts < 50) {
            const randIndex = Math.floor(Math.random() * words.length);
            if (!targets.includes(randIndex) && words[randIndex].trim().length > 2) {
                targets.push(randIndex);
            }
            attempts++;
        }

        setActiveMechanic({ type: 'scramble', targets });

        const timer = setTimeout(() => {
            setActiveMechanic(null);
        }, playerDebuff.duration);
        return () => clearTimeout(timer);
    }
  }, [playerDebuff, enemy.text]);


  // Animate combo counter
  useEffect(() => {
      if (combo > 0 && comboRef.current) {
          comboRef.current.classList.add('animate-ping-once');
          setTimeout(() => {
              comboRef.current?.classList.remove('animate-ping-once');
          }, 300);
      }
  }, [combo]);
  
  useEffect(() => {
      inputRef.current?.focus();
  },[]);


  return (
    <div id="battle-screen" className={`w-full max-w-5xl mx-auto p-4 md:p-8 flex flex-col gap-8 items-center transition-all duration-200 ${playerWasHit ? 'bg-red-900 bg-opacity-30' : ''}`}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes ping-once {
            0% { transform: scale(1.5); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-ping-once {
            animation: ping-once 0.3s cubic-bezier(0, 0, 0.2, 1);
        }
        @keyframes fade-in-out {
            0%, 100% { opacity: 0; transform: translateY(20px); }
            10%, 90% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
            animation: fade-in-out 1.5s ease-in-out;
        }
        @keyframes fade-text-anim {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.1; }
        }
        .animate-fade-text {
            animation: fade-text-anim 1.5s ease-in-out infinite;
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-0.5deg); }
          50% { transform: rotate(0.5deg); }
        }
        .animate-wiggle {
          animation: wiggle 0.15s ease-in-out infinite;
        }
        @keyframes glow {
            0%, 100% { box-shadow: 0 0 8px #fef08a, inset 0 0 5px #fef08a; }
            50% { box-shadow: 0 0 16px #fef08a, inset 0 0 8px #fef08a; }
        }
        .animate-glow {
            animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
      
      <input ref={inputRef} type="text" className="absolute opacity-0 w-0 h-0" value={userInput} onChange={() => {}} />

      {bonusNotification && (
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 bg-black bg-opacity-70 border-2 border-yellow-400 rounded-lg shadow-lg animate-fade-in-out">
              <h3 className="text-3xl font-bold text-yellow-300">{bonusNotification}</h3>
          </div>
      )}

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start relative">
        {combo > 1 && (
            <div ref={comboRef} className="absolute top-0 right-0 -mt-4 -mr-4 z-10 flex flex-col items-center p-3 bg-orange-500 rounded-full shadow-lg border-2 border-white">
                <span className="text-3xl font-bold text-white leading-none">{combo}</span>
                <span className="text-xs text-white uppercase tracking-widest leading-none">{t('combo', language)}</span>
            </div>
        )}
        
        <div className="md:col-span-1 flex items-center gap-4 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-xl">
           <Portrait type={enemy.portrait} name={enemy.name} />
           <div className="w-full flex flex-col items-center gap-2">
            <h2 className="text-xl md:text-2xl text-red-400 text-center break-words">{enemy.name}</h2>
            <HealthBar currentValue={enemy.health} maxValue={enemy.maxHealth} label={t('health', language)} />
           </div>
        </div>
        <div className="md:col-span-2 flex items-center gap-4 p-4 bg-gray-800 border-2 border-gray-700 rounded-lg shadow-xl">
           <Portrait type={player.portrait} name={player.name} />
           <div className="w-full flex flex-col gap-2">
             <div className="w-full flex justify-between items-center flex-wrap gap-2">
               <h2 className="text-xl md:text-2xl text-cyan-400">{player.name} Lvl {player.level}</h2>
               <div className="p-2 px-3 bg-gray-900 border border-yellow-500 rounded-md shadow-inner">
                  <span className="text-xl text-yellow-400 font-bold">{player.gold}g</span>
              </div>
             </div>
             <HealthBar currentValue={player.health} maxValue={player.maxHealth} label={t('health', language)} />
             <HealthBar currentValue={player.xp} maxValue={player.xpToNextLevel} label={t('xp', language)} barColorClass="bg-blue-500" />
           </div>
        </div>
      </div>
      
      <div className="w-full text-center relative flex flex-col md:flex-row items-center gap-4">
        <div className="w-full">
            <h3 className="text-2xl text-yellow-300 mb-4">{t('typeToAttack', language)}</h3>
            <TypingText 
              targetText={enemy.text} 
              userInput={userInput}
              activeMechanic={activeMechanic}
              isPowerActive={isPowerActive}
              isBlinded={playerDebuff?.type === 'blind'}
              isConfused={playerDebuff?.type === 'confusion'}
            />
            {playerDebuff?.type === 'stun' && (
              <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center rounded-lg border-2 border-red-500 z-10">
                <h2 className="text-5xl font-bold text-red-500 animate-pulse">{t('stunned', language)}</h2>
              </div>
            )}
            {isAppendingText && (
                <div className="flex items-center justify-center mt-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                    <p className="ml-3 text-gray-400">{t('moreWords', language)}</p>
                </div>
            )}
            {player.activeShields > 0 && 
                <p className="text-sm mt-2 text-cyan-300">
                    {t('activeShields', language)} {player.activeShields}
                </p>
            }
        </div>
        {player.ability && (
            <div className="flex-shrink-0 w-full md:w-48 mt-4 md:mt-0">
                <button 
                    onClick={onUseAbility}
                    disabled={player.abilityCooldown > 0}
                    className={`w-full h-24 md:h-32 p-3 text-white rounded-lg border-2 transition-all duration-200 ${player.abilityCooldown <= 0 ? 'bg-yellow-600 border-yellow-400 hover:bg-yellow-500 animate-glow' : 'bg-gray-700 border-gray-600 cursor-not-allowed'}`}
                >
                    <p className="font-bold text-xl">{player.ability.name}</p>
                    {player.abilityCooldown > 0 ? (
                        <p className="text-2xl font-mono">{player.abilityCooldown}s</p>
                    ) : (
                        <p className="text-2xl text-yellow-200 animate-pulse">{t('abilityReady', language)}</p>
                    )}
                </button>
            </div>
        )}
      </div>

    </div>
  );
};