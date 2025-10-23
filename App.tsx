

import React, { useState, useCallback, useEffect } from 'react';
import { GameState, Language, Player, Enemy, Item, RoomType, Debuff, PlayerAbility } from './types';
import { generateBattleText, generateMoreWords } from './services/geminiService';
import { t } from './services/translations';
import { LanguageSelectionScreen } from './components/LanguageSelectionScreen';
import { StartScreen } from './components/StartScreen';
import { BattleScreen } from './components/BattleScreen';
import { LootScreen } from './components/LootScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { DungeonMap } from './components/DungeonMap';
import { ShopScreen, ShopItem } from './components/ShopScreen';
import { WikiScreen } from './components/WikiScreen';
import { DebugMenu } from './components/DebugMenu';
import { CharacterCreationScreen } from './components/CharacterCreationScreen';
import { audioService } from './services/audioService';

const ALL_ITEMS: Item[] = [
    { id: 1, name: "Iron Gauntlets", description: "Increases max health by 20.", effect: p => ({...p, maxHealth: p.maxHealth + 20, health: p.health + 20 })},
    { id: 2, name: "Steel Plating", description: "Reduces damage taken by 10%.", effect: p => ({...p, damageReduction: p.damageReduction + 0.1 })},
    { id: 3, name: "Amulet of Shielding", description: "Grants 1 shield that blocks one instance of damage.", effect: p => ({...p, activeShields: p.activeShields + 1 })},
    { id: 4, name: "Heartstone", description: "Increases max health by 50.", effect: p => ({...p, maxHealth: p.maxHealth + 50, health: p.health + 50 })},
    { id: 5, name: "Shield of Deflection", description: "Reduces damage taken by 15%.", effect: p => ({...p, damageReduction: p.damageReduction + 0.15 })},
    { id: 6, name: "Tome of Warding", description: "Grants 2 shields that block damage.", effect: p => ({...p, activeShields: p.activeShields + 2 })},
    { id: 7, name: "Sharpening Stone", description: "Increases damage by 2.", effect: p => ({...p, damage: p.damage + 2 })},
    { id: 8, name: "Runic Bracers", description: "Increases damage by 4 and max health by 10.", effect: p => ({...p, damage: p.damage + 4, maxHealth: p.maxHealth + 10, health: p.health + 10 })},
    { id: 9, name: "Gloves of Haste", description: "Increases damage by 1.", effect: p => ({...p, damage: p.damage + 1 })},
];

const ABILITIES: { [key: string]: PlayerAbility } = {
    warrior: { name: t('warriorAbilityName', Language.ENGLISH), description: t('warriorAbilityDesc', Language.ENGLISH), cooldown: 20, effect: ({ setEnemy, enemy }) => {
        if (!enemy) return;
        const damage = Math.round(enemy.maxHealth * 0.25);
        setEnemy(e => e ? { ...e, health: Math.max(0, e.health - damage) } : null);
    }},
    mage: { name: t('mageAbilityName', Language.ENGLISH), description: t('mageAbilityDesc', Language.ENGLISH), cooldown: 25, effect: ({ enemy, userInput, handleCorrectChar, setUserInput }) => {
        if (!enemy) return;
        const charsToType = enemy.text.substring(userInput.length, userInput.length + 5);
        for (let i = 0; i < charsToType.length; i++) {
            handleCorrectChar();
        }
        setUserInput(prev => prev + charsToType);
    }},
    rogue: { name: t('rogueAbilityName', Language.ENGLISH), description: t('rogueAbilityDesc', Language.ENGLISH), cooldown: 18, effect: ({ setPlayer }) => {
        setPlayer(p => ({ ...p, activeShields: p.activeShields + 3 }));
    }},
    cleric: { name: t('clericAbilityName', Language.ENGLISH), description: t('clericAbilityDesc', Language.ENGLISH), cooldown: 30, effect: ({ setPlayer, player }) => {
        const healAmount = Math.round(player.maxHealth * 0.30);
        setPlayer(p => ({ ...p, health: Math.min(p.maxHealth, p.health + healAmount) }));
    }},
};

const PLAYER_PORTRAITS = [
    { id: 'warrior', name: 'Warrior', ability: { ...ABILITIES.warrior, name: t('warriorAbilityName', Language.ENGLISH), description: t('warriorAbilityDesc', Language.ENGLISH) } },
    { id: 'mage', name: 'Mage', ability: { ...ABILITIES.mage, name: t('mageAbilityName', Language.ENGLISH), description: t('mageAbilityDesc', Language.ENGLISH) } },
    { id: 'rogue', name: 'Rogue', ability: { ...ABILITIES.rogue, name: t('rogueAbilityName', Language.ENGLISH), description: t('rogueAbilityDesc', Language.ENGLISH) } },
    { id: 'cleric', name: 'Cleric', ability: { ...ABILITIES.cleric, name: t('clericAbilityName', Language.ENGLISH), description: t('clericAbilityDesc', Language.ENGLISH) } },
];

const NORMAL_ENEMY_DATA = [
    { name: "Goblin Scrivener", portrait: "goblin" },
    { name: "Orcish Lexicographer", portrait: "orc" },
    { name: "Undead Poet", portrait: "ghoul" },
    { name: "Grammar Ghoul", portrait: "ghoul" },
    { name: "Slime", portrait: "slime" },
    { name: "Giant Bat", portrait: "bat" },
    { name: "Skeleton Archer", portrait: "archer" },
    { name: "Dire Wolf", portrait: "wolf" },
];

const ELITE_PREFIXES = ["Dread", "Vicious", "Ancient", "Cursed"];
const BOSS_NAMES = [ "The Grand Lexicon", "Arch-Scribe Mor'gath", "The Silencer Knight", "Typomancer Zerul", "Lord of the Forgotten Texts" ];

const ENEMY_PORTRAITS = {
    ELITE: ['ogre', 'troll'],
    BOSS: ['dragon', 'lich'],
};

const INITIAL_PLAYER: Player = {
  name: 'Adventurer',
  portrait: 'warrior',
  maxHealth: 100,
  health: 100,
  damage: 4,
  damageReduction: 0,
  activeShields: 0,
  gold: 0,
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  inventory: [],
  ability: ABILITIES.warrior,
  abilityCooldown: 0,
};

const SAVE_GAME_KEY = 'typingDungeonSaveData';

function App() {
  const [gameState, setGameState] = useState<GameState>(GameState.LANGUAGE_SELECTION);
  const [language, setLanguage] = useState<Language>(Language.ENGLISH);
  const [player, setPlayer] = useState<Player>(INITIAL_PLAYER);
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [dungeonLevel, setDungeonLevel] = useState(1);
  const [loot, setLoot] = useState<Item | null>(null);
  const [goldDrop, setGoldDrop] = useState<number | null>(null);
  const [shopInventory, setShopInventory] = useState<ShopItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppendingText, setIsAppendingText] = useState(false);
  const [hasSaveData, setHasSaveData] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bonusNotification, setBonusNotification] = useState<string | null>(null);
  const [playerWasHit, setPlayerWasHit] = useState(false);
  const [isDamageBoosted, setIsDamageBoosted] = useState(false);
  const [isWikiOpen, setIsWikiOpen] = useState(false);
  const [isDebugMenuOpen, setIsDebugMenuOpen] = useState(false);
  const [playerDebuff, setPlayerDebuff] = useState<Debuff | null>(null);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    try {
      const savedData = localStorage.getItem(SAVE_GAME_KEY);
      if (savedData) {
        setHasSaveData(true);
      }
    } catch (error) {
      console.error("Could not check for saved game:", error);
      setHasSaveData(false);
    }
  }, []);

  useEffect(() => {
    if (gameState === GameState.BATTLE || gameState === GameState.LOOT || gameState === GameState.SHOP) {
      try {
        const { inventory, ...restOfPlayer } = player;
        const inventoryIds = inventory.map(item => item?.id).filter((id): id is number => id !== undefined);
        
        const dataToSave = {
          player: { ...restOfPlayer, inventory: inventoryIds, ability: undefined },
          dungeonLevel,
          language,
        };
        localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(dataToSave));
        setHasSaveData(true);
      } catch (error) {
        console.error("Failed to save game:", error);
      }
    }
  }, [player, dungeonLevel, language, gameState]);
  
  const clearSaveData = useCallback(() => {
    try {
      localStorage.removeItem(SAVE_GAME_KEY);
      setHasSaveData(false);
    } catch (error)      {
      console.error("Failed to clear save data:", error);
    }
  }, []);

  const handleEnemyAttack = useCallback(() => {
    if (!enemy || player.health <= 0 || playerDebuff) return;
    audioService.playEnemyHitSound();
    setPlayerWasHit(true);
    setTimeout(() => setPlayerWasHit(false), 300);

    // Apply Debuffs from Elites/Bosses
    if (enemy.roomType === RoomType.ELITE || enemy.roomType === RoomType.BOSS) {
        const debuffChance = enemy.roomType === RoomType.BOSS ? 0.4 : 0.25;
        if (Math.random() < debuffChance) {
            audioService.playDebuffSound();
            const debuffTypes: ('stun' | 'blind' | 'confusion')[] = ['stun', 'blind', 'confusion'];
            const debuffType = debuffTypes[Math.floor(Math.random() * debuffTypes.length)];
            
            let duration = 3000;
            if (debuffType === 'stun') duration = 1500;
            
            const newDebuff: Debuff = { type: debuffType, duration };
            setPlayerDebuff(newDebuff);
            
            let notificationKey: 'stunned' | 'blinded' | 'confused' = 'stunned';
            if (debuffType === 'blind') notificationKey = 'blinded';
            if (debuffType === 'confusion') notificationKey = 'confused';

            setBonusNotification(t(notificationKey, language));

            setTimeout(() => {
                setPlayerDebuff(null);
                setBonusNotification(current => 
                    (current === t(notificationKey, language)) ? null : current
                );
            }, duration);
        }
    }

    if (player.activeShields > 0) {
        setPlayer(prev => ({ ...prev, activeShields: prev.activeShields - 1 }));
        setBonusNotification("Shield Blocked!");
        setTimeout(() => setBonusNotification(null), 1500);
        return;
    }
    
    const damageTaken = Math.round(enemy.damage * (1 - player.damageReduction));
    const newHealth = player.health - damageTaken;

    setPlayer(prev => ({ ...prev, health: newHealth }));

    if (newHealth <= 0) {
        clearSaveData();
        setGameState(GameState.GAME_OVER);
    }
  }, [enemy, player, clearSaveData, language, playerDebuff]);

  useEffect(() => {
    if (gameState !== GameState.BATTLE || dungeonLevel < 5 || !enemy || enemy.health <= 0 || player.health <= 0) {
        return;
    }

    let attackInterval = Math.max(3000, 10000 - (dungeonLevel * 300));
    if (enemy.name.includes("Skeleton Archer")) {
        attackInterval *= 0.7; // 30% faster
    }

    const timer = setInterval(() => {
        handleEnemyAttack();
    }, attackInterval);

    return () => clearInterval(timer);
  }, [gameState, dungeonLevel, enemy, player.health, handleEnemyAttack]);

  // Debug menu listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            setIsDebugMenuOpen(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  const setupNewLevel = useCallback(async (lang: Language, level: number, forcedRoomType?: RoomType) => {
    setIsLoading(true);
    setUserInput('');
    const newText = await generateBattleText(lang, level);
    
    let roomType: RoomType;
    let enemyName = '';
    let healthMultiplier = 1.0;
    let damageMultiplier = 1.0;
    let portrait = 'goblin';

    if (forcedRoomType !== undefined) {
        roomType = forcedRoomType;
    } else if (level % 10 === 0) {
      roomType = RoomType.BOSS;
    } else if (level % 5 === 0) {
      roomType = RoomType.ELITE;
    } else {
      roomType = RoomType.NORMAL;
    }

    if (roomType === RoomType.BOSS) {
      enemyName = `${BOSS_NAMES[Math.floor((level/10 - 1)) % BOSS_NAMES.length]}`;
      healthMultiplier = 2.5;
      damageMultiplier = 1.5;
      portrait = ENEMY_PORTRAITS.BOSS[Math.floor(Math.random() * ENEMY_PORTRAITS.BOSS.length)];
    } else if (roomType === RoomType.ELITE) {
      const prefix = ELITE_PREFIXES[Math.floor(Math.random() * ELITE_PREFIXES.length)];
      const enemyData = NORMAL_ENEMY_DATA[Math.floor(Math.random() * NORMAL_ENEMY_DATA.length)];
      enemyName = `${prefix} ${enemyData.name}`;
      healthMultiplier = 1.5;
      damageMultiplier = 1.25;
      portrait = ENEMY_PORTRAITS.ELITE[Math.floor(Math.random() * ENEMY_PORTRAITS.ELITE.length)];
    } else {
      const enemyData = NORMAL_ENEMY_DATA[Math.floor(Math.random() * NORMAL_ENEMY_DATA.length)];
      enemyName = enemyData.name;
      portrait = enemyData.portrait;
    }

    const scaledHealth = Math.round((200 + (level * 50)) * healthMultiplier);
    const damage = Math.round((10 + level) * damageMultiplier);
    
    setEnemy({
      name: `${enemyName} Lvl ${level}`,
      maxHealth: scaledHealth,
      health: scaledHealth,
      damage: damage,
      text: newText,
      roomType: roomType,
      portrait: portrait,
    });
    setCombo(0);
    setPlayerDebuff(null);
    setPlayer(p => ({ ...p, abilityCooldown: 5 })); // Initial cooldown
    setGameState(GameState.BATTLE);
    setIsLoading(false);
  }, []);
  
  const handleLanguageSelect = useCallback((lang: Language) => {
    setLanguage(lang);
    
    // Update ability descriptions
    Object.keys(ABILITIES).forEach(key => {
        ABILITIES[key].name = t(`${key}AbilityName` as any, lang);
        ABILITIES[key].description = t(`${key}AbilityDesc` as any, lang);
    });
    PLAYER_PORTRAITS.forEach(p => {
        p.ability.name = t(`${p.id}AbilityName` as any, lang);
        p.ability.description = t(`${p.id}AbilityDesc` as any, lang);
    });

    setGameState(GameState.MENU);
  }, []);

  const handleStart = useCallback(() => {
    clearSaveData();
    setDungeonLevel(1);
    setPlayer({ ...INITIAL_PLAYER, inventory: [] });
    setGameState(GameState.CHARACTER_CREATION);
  }, [clearSaveData]);

  const handleCharacterCreationFinish = useCallback((name: string, portrait: string) => {
    setPlayer(prev => ({ ...prev, name, portrait, ability: ABILITIES[portrait] }));
    setupNewLevel(language, 1);
  }, [language, setupNewLevel]);
  
  const handleContinue = useCallback(() => {
    try {
      const savedDataJSON = localStorage.getItem(SAVE_GAME_KEY);
      if (!savedDataJSON) return;

      const savedData = JSON.parse(savedDataJSON);
      
      const inventory = savedData.player.inventory
        .map((id: number) => ALL_ITEMS.find(item => item.id === id))
        .filter((item): item is Item => !!item);

      const loadedPlayer: Player = { 
        ...INITIAL_PLAYER, 
        ...savedData.player, 
        inventory, 
        ability: ABILITIES[savedData.player.portrait] 
      };
      
      setPlayer(loadedPlayer);
      setDungeonLevel(savedData.dungeonLevel);
      setLanguage(savedData.language);
      
      setupNewLevel(savedData.language, savedData.dungeonLevel);
    } catch (error) {
      console.error("Failed to load game:", error);
      clearSaveData();
      setGameState(GameState.MENU);
    }
  }, [setupNewLevel, clearSaveData]);

  const handleRestart = useCallback(() => {
    clearSaveData();
    setGameState(GameState.LANGUAGE_SELECTION);
  }, [clearSaveData]);
  
  // FIX: Moved setupShop before handleWin to fix 'used before declaration' error.
  const setupShop = useCallback(() => {
    const availableItems = ALL_ITEMS.filter(item => !player.inventory.some(i => i?.id === item.id));
    const shopItems: ShopItem[] = [];
    const numShopItems = 3;
    for (let i = 0; i < numShopItems && availableItems.length > 0; i++) {
      const randIndex = Math.floor(Math.random() * availableItems.length);
      const selectedItem = availableItems.splice(randIndex, 1)[0];
      const price = 50 + (dungeonLevel * 10) + (selectedItem.id * 5);
      shopItems.push({ ...selectedItem, price: Math.round(price) });
    }
    setShopInventory(shopItems);
    setGameState(GameState.SHOP);
  }, [player.inventory, dungeonLevel]);

  const handleWin = useCallback(() => {
    if (gameState !== GameState.BATTLE) return;
    setUserInput('');
    audioService.playVictorySound();

    const roll = Math.random();
    const isAfterBoss = (dungeonLevel % 10 === 0);
    const shopChance = isAfterBoss ? 0.3 : 0.1; 
    const itemChance = isAfterBoss ? 0.6 : 0.4;

    if (roll < shopChance && dungeonLevel > 2) {
        setupShop();
    } else if (roll < shopChance + itemChance) {
      const availableItems = ALL_ITEMS.filter(item => !player.inventory.some(i => i?.id === item.id));
      const newItem = availableItems.length > 0 ? availableItems[Math.floor(Math.random() * availableItems.length)] : ALL_ITEMS[Math.floor(Math.random() * ALL_ITEMS.length)];
      setLoot(newItem);
      setGoldDrop(null);
      setGameState(GameState.LOOT);

    } else {
      const goldAmount = Math.round((20 + Math.random() * 10 + dungeonLevel * 5) * (isAfterBoss ? 2 : 1));
      setPlayer(p => ({ ...p, gold: p.gold + goldAmount }));
      setGoldDrop(goldAmount);
      setLoot(null);
      setGameState(GameState.LOOT);
    }
  }, [player.inventory, gameState, dungeonLevel, setupShop]);

  const handleCorrectChar = useCallback(() => {
    if (!enemy || enemy.health <= 0) return;
    audioService.playCorrectCharSound();

    const newXp = player.xp + 1;
    let updatedPlayerState = { ...player, xp: newXp };

    if (newXp >= player.xpToNextLevel) {
        audioService.playLevelUpSound();
        const newLevel = player.level + 1;
        const newMaxHealth = player.maxHealth + 10;
        const newDamage = player.damage + 0.5;
        const newXpToNextLevel = Math.round(100 * Math.pow(1.2, newLevel - 1));

        updatedPlayerState = {
            ...updatedPlayerState,
            level: newLevel,
            xp: 0,
            xpToNextLevel: newXpToNextLevel,
            maxHealth: newMaxHealth,
            health: newMaxHealth, // Full heal
            damage: newDamage,
        };
        
        setBonusNotification(`Level Up! LVL ${newLevel}`);
        setTimeout(() => setBonusNotification(null), 2000);
    }
    
    setPlayer(updatedPlayerState);

    const currentDamage = updatedPlayerState.damage * (isDamageBoosted ? 1.5 : 1);
    const newEnemyHealth = enemy.health - currentDamage;
    
    if (newEnemyHealth <= 0) {
      setEnemy(prev => prev ? { ...prev, health: 0 } : null);
      handleWin();
    } else {
      setEnemy(prev => prev ? { ...prev, health: newEnemyHealth } : null);
    }
  }, [enemy, player, handleWin, isDamageBoosted]);

  const handleMistake = useCallback(() => {
    audioService.playMistakeSound();
    setCombo(0);

    if (player.activeShields > 0) {
        setPlayer(prev => ({ ...prev, activeShields: prev.activeShields - 1 }));
        setBonusNotification("Shield Used!");
        setTimeout(() => setBonusNotification(null), 1500);
        return;
    }

    if (!enemy) return;
    const damageTaken = Math.round(enemy.damage * (1 - player.damageReduction));
    const newHealth = player.health - damageTaken;

    setPlayer(prev => ({...prev, health: newHealth}));

    if (newHealth <= 0) {
      clearSaveData();
      setGameState(GameState.GAME_OVER);
    }
  }, [enemy, player.damageReduction, player.health, player.activeShields, clearSaveData]);

  const handleWordCompleted = useCallback(() => {
    const newCombo = combo + 1;
    setCombo(newCombo);

    const baseBonusChance = 0.15; // 15%
    const comboBonus = Math.min(0.60, newCombo * 0.02); // +2% per combo, max 75% total
    const totalChance = baseBonusChance + comboBonus;

    if (Math.random() < totalChance) {
        audioService.playBonusSound();
        const bonusType = Math.floor(Math.random() * 3);
        switch (bonusType) {
            case 0: // Heal
                const healAmount = Math.max(5, Math.floor(player.maxHealth * 0.05));
                setPlayer(p => ({ ...p, health: Math.min(p.maxHealth, p.health + healAmount) }));
                setBonusNotification(`+${healAmount} ${t('health', language)}!`);
                break;
            case 1: // Damage Buff
                setIsDamageBoosted(true);
                setBonusNotification(`${t('damageUp', language)}!`);
                setTimeout(() => {
                    setIsDamageBoosted(false);
                }, 5000);
                break;
            case 2: // Shield
                setPlayer(p => ({ ...p, activeShields: p.activeShields + 1 }));
                setBonusNotification(`${t('shield', language)} Gained!`);
                break;
        }
        setTimeout(() => setBonusNotification(null), 1500);
    }
  }, [combo, player.maxHealth, language]);

    // Keydown handler for battle
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (gameState !== GameState.BATTLE || !enemy || enemy.health <= 0 || playerDebuff?.type === 'stun') return;
        
            if (event.key === 'Backspace') {
                setUserInput(prev => prev.slice(0, -1));
                return;
            }
        
            if (event.key.length > 1) return;
        
            const currentIndex = userInput.length;
            if (currentIndex >= enemy.text.length) return;
            
            const typedChar = event.key;
            const targetChar = enemy.text[currentIndex];
        
            setUserInput(prev => prev + typedChar);

            if (typedChar === targetChar) {
              handleCorrectChar();
              
              if (typedChar === ' ' && currentIndex > 0 && userInput[currentIndex - 1] !== ' ') {
                  handleWordCompleted();
              } else if (currentIndex + 1 === enemy.text.length) {
                  handleWordCompleted();
              }
            } else {
              handleMistake();
              document.getElementById('battle-screen')?.classList.add('animate-shake');
              setTimeout(() => {
                document.getElementById('battle-screen')?.classList.remove('animate-shake');
              }, 300);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, enemy, userInput, playerDebuff, handleCorrectChar, handleMistake, handleWordCompleted]);

    // Cooldown Timer
    useEffect(() => {
        if (gameState === GameState.BATTLE && player.abilityCooldown > 0) {
            const timer = setInterval(() => {
                setPlayer(p => ({ ...p, abilityCooldown: Math.max(0, p.abilityCooldown - 1) }));
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState, player.abilityCooldown]);

  const handleUseAbility = useCallback(() => {
    if (!player.ability || player.abilityCooldown > 0) return;
    audioService.playAbilitySound();

    const effectArgs = { setPlayer, setEnemy, enemy, player, userInput, handleCorrectChar, setUserInput };
    player.ability.effect(effectArgs);

    setPlayer(p => ({ ...p, abilityCooldown: p.ability?.cooldown || 20 }));

    if (enemy && enemy.health <= 0) {
        handleWin();
    }
  }, [player, enemy, userInput, handleCorrectChar, handleWin]);
  
  const handleTextCompleted = useCallback(async () => {
    if (!enemy || enemy.health <= 0 || isAppendingText) return;

    setIsAppendingText(true);
    const moreWords = await generateMoreWords(language, dungeonLevel);
    setEnemy(prev => {
        if (!prev) return null;
        return {
            ...prev,
            text: prev.text + ' ' + moreWords
        };
    });
    setIsAppendingText(false);
  }, [enemy, isAppendingText, language, dungeonLevel]);
  
  const proceedToNextLevel = useCallback((currentPlayerState: Player) => {
    const nextLevel = dungeonLevel + 1;
    setDungeonLevel(nextLevel);
    setupNewLevel(language, nextLevel);
    setPlayer(currentPlayerState);
  }, [dungeonLevel, language, setupNewLevel]);

  const handleLootContinue = useCallback((item: Item | null) => {
      let updatedPlayer = { ...player };
      if (item) {
        const newStats = item.effect(player);
        const { name, portrait, ...restOfPlayer } = player;
        updatedPlayer = {
            ...player,
            ...newStats,
            inventory: [...player.inventory, item]
        };
      }
      proceedToNextLevel(updatedPlayer);
  }, [player, proceedToNextLevel]);

  const handleBuyItem = useCallback((item: ShopItem) => {
    if (player.gold < item.price) return;
    audioService.playShopBuySound();
    
    const newStats = item.effect(player);
    const updatedPlayer = {
      ...player,
      ...newStats,
      gold: player.gold - item.price,
      inventory: [...player.inventory, item]
    };
    setPlayer(updatedPlayer);
    setShopInventory(prev => prev ? prev.filter(i => i.id !== item.id) : null);
  }, [player]);

  const handleShopLeave = useCallback(() => {
    setShopInventory(null);
    proceedToNextLevel(player);
  }, [player, proceedToNextLevel]);

  const handleOpenWiki = () => setIsWikiOpen(true);
  const handleCloseWiki = () => setIsWikiOpen(false);

  // --- DEBUG HANDLERS ---
  const handleDebugJumpToLevel = useCallback((level: number) => {
    setDungeonLevel(level);
    setupNewLevel(language, level);
  }, [language, setupNewLevel]);

  const handleDebugForceEncounter = useCallback((type: 'elite' | 'boss') => {
    const forcedType = type === 'elite' ? RoomType.ELITE : RoomType.BOSS;
    setupNewLevel(language, dungeonLevel, forcedType);
  }, [language, dungeonLevel, setupNewLevel]);

  const handleDebugAddGold = useCallback((amount: number) => {
    setPlayer(p => ({ ...p, gold: p.gold + amount }));
  }, []);

  const handleDebugGiveItem = useCallback(() => {
    const availableItems = ALL_ITEMS.filter(item => !player.inventory.some(i => i?.id === item.id));
    if (availableItems.length > 0) {
        const newItem = availableItems[Math.floor(Math.random() * availableItems.length)];
        const newStats = newItem.effect(player);
        const updatedPlayer = {
            ...player,
            ...newStats,
            inventory: [...player.inventory, newItem]
        };
        setPlayer(updatedPlayer);
    }
  }, [player]);

  const handleDebugHeal = useCallback(() => {
    setPlayer(p => ({ ...p, health: p.maxHealth }));
  }, []);
  
  const handleDebugForceShop = useCallback(() => {
    setupShop();
  }, [setupShop]);

  const renderGameState = () => {
    if (isLoading) {
      return (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-yellow-400"></div>
            <h2 className="text-4xl text-yellow-300 mt-8">The dungeon master is thinking...</h2>
            <p className="text-lg text-gray-400 mt-2">Crafting your next challenge.</p>
          </div>
      )
    }

    switch (gameState) {
      case GameState.LANGUAGE_SELECTION:
        return <LanguageSelectionScreen onSelectLanguage={handleLanguageSelect} />;
      case GameState.MENU:
        return <StartScreen language={language} onStart={handleStart} hasSaveData={hasSaveData} onContinue={handleContinue} onOpenWiki={handleOpenWiki} />;
      case GameState.CHARACTER_CREATION:
        return <CharacterCreationScreen language={language} playerPortraits={PLAYER_PORTRAITS} onFinish={handleCharacterCreationFinish} />;
      case GameState.BATTLE:
        return enemy && <BattleScreen 
                          language={language}
                          player={player} 
                          enemy={enemy} 
                          onTextCompleted={handleTextCompleted}
                          isAppendingText={isAppendingText}
                          combo={combo}
                          playerWasHit={playerWasHit}
                          bonusNotification={bonusNotification}
                          isPowerActive={isDamageBoosted || combo >= 10}
                          playerDebuff={playerDebuff}
                          userInput={userInput}
                          onUseAbility={handleUseAbility}
                        />;
      case GameState.LOOT:
        return <LootScreen language={language} item={loot} gold={goldDrop} onContinue={handleLootContinue} />;
      case GameState.SHOP:
        return shopInventory && <ShopScreen language={language} items={shopInventory} playerGold={player.gold} onBuy={handleBuyItem} onLeave={handleShopLeave} />;
      case GameState.GAME_OVER:
        return <GameOverScreen language={language} level={dungeonLevel} onRestart={handleRestart} />;
      default:
        return <LanguageSelectionScreen onSelectLanguage={handleLanguageSelect} />;
    }
  };

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-gray-900 bg-gradient-to-br from-gray-900 to-black">
      {(gameState === GameState.BATTLE || gameState === GameState.LOOT || gameState === GameState.SHOP) && <DungeonMap language={language} level={dungeonLevel} />}
      {renderGameState()}
      {isWikiOpen && <WikiScreen language={language} onClose={handleCloseWiki} />}
      {isDebugMenuOpen && <DebugMenu 
        onClose={() => setIsDebugMenuOpen(false)}
        onJumpToLevel={handleDebugJumpToLevel}
        onForceEncounter={handleDebugForceEncounter}
        onAddGold={handleDebugAddGold}
        onGiveItem={handleDebugGiveItem}
        onHeal={handleDebugHeal}
        onForceShop={handleDebugForceShop}
      />}
    </main>
  );
}

export default App;