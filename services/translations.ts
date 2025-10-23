import { Language } from '../types';

type Translations = {
  [key: string]: {
    [Language.ENGLISH]: string;
    [Language.PORTUGUESE]: string;
  };
};

const translations: Translations = {
  // LanguageSelectionScreen
  selectLanguage: {
    [Language.ENGLISH]: 'Select Language',
    [Language.PORTUGUESE]: 'Selecione o Idioma',
  },
  // StartScreen
  continueAdventure: {
    [Language.ENGLISH]: 'Continue Adventure',
    [Language.PORTUGUESE]: 'Continuar Aventura',
  },
  orStartNewGame: {
    [Language.ENGLISH]: 'Or start a new game:',
    [Language.PORTUGUESE]: 'Ou inicie um novo jogo:',
  },
  startNewGame: {
    [Language.ENGLISH]: 'Start New Game',
    [Language.PORTUGUESE]: 'Iniciar Novo Jogo',
  },
  gameDescription: {
    [Language.ENGLISH]: 'Your words are your weapons. Type to survive. Every mistake will cost you.',
    [Language.PORTUGUESE]: 'Suas palavras são suas armas. Digite para sobreviver. Cada erro lhe custará.',
  },
  guide: {
    [Language.ENGLISH]: 'Guide',
    [Language.PORTUGUESE]: 'Guia',
  },
  // CharacterCreationScreen
  createYourHero: {
    [Language.ENGLISH]: 'Create Your Hero',
    [Language.PORTUGUESE]: 'Crie Seu Herói',
  },
  whatIsYourName: {
    [Language.ENGLISH]: 'What is your name?',
    [Language.PORTUGUESE]: 'Qual é o seu nome?',
  },
  enterYourName: {
    [Language.ENGLISH]: 'Enter your name...',
    [Language.PORTUGUESE]: 'Digite seu nome...',
  },
  suggest: {
    [Language.ENGLISH]: 'Suggest',
    [Language.PORTUGUESE]: 'Sugerir',
  },
  chooseYourPortrait: {
    [Language.ENGLISH]: 'Choose your Class:',
    [Language.PORTUGUESE]: 'Escolha sua Classe:',
  },
  beginAdventure: {
    [Language.ENGLISH]: 'Begin Adventure',
    [Language.PORTUGUESE]: 'Começar Aventura',
  },
  warriorAbilityName: {
    [Language.ENGLISH]: 'Overpower',
    [Language.PORTUGUESE]: 'Superar',
  },
  warriorAbilityDesc: {
    [Language.ENGLISH]: 'Instantly deal 25% of the enemy\'s max health as damage.',
    [Language.PORTUGUESE]: 'Causa dano instantâneo igual a 25% da vida máxima do inimigo.',
  },
  mageAbilityName: {
    [Language.ENGLISH]: 'Spellscribe',
    [Language.PORTUGUESE]: 'Mago da Escrita',
  },
  mageAbilityDesc: {
    [Language.ENGLISH]: 'Magically types the next 5 characters for you.',
    [Language.PORTUGUESE]: 'Digite magicamente os próximos 5 caracteres para você.',
  },
  rogueAbilityName: {
    [Language.ENGLISH]: 'Evasion',
    [Language.PORTUGUESE]: 'Evasão',
  },
  rogueAbilityDesc: {
    [Language.ENGLISH]: 'Instantly gain 3 shields that block incoming damage.',
    [Language.PORTUGUESE]: 'Ganha instantaneamente 3 escudos que bloqueiam dano.',
  },
  clericAbilityName: {
    [Language.ENGLISH]: 'Divine Grace',
    [Language.PORTUGUESE]: 'Graça Divina',
  },
  clericAbilityDesc: {
    [Language.ENGLISH]: 'Heal for 30% of your maximum health.',
    [Language.PORTUGUESE]: 'Cura 30% da sua vida máxima.',
  },
  // BattleScreen
  typeToAttack: {
      [Language.ENGLISH]: 'Type the text to attack!',
      [Language.PORTUGUESE]: 'Digite o texto para atacar!',
  },
  moreWords: {
      [Language.ENGLISH]: 'More words are appearing...',
      [Language.PORTUGUESE]: 'Mais palavras estão aparecendo...',
  },
  activeShields: {
      [Language.ENGLISH]: 'Active Shields:',
      [Language.PORTUGUESE]: 'Escudos Ativos:',
  },
  health: {
      [Language.ENGLISH]: 'Health',
      [Language.PORTUGUESE]: 'Vida',
  },
  combo: {
    [Language.ENGLISH]: 'Combo',
    [Language.PORTUGUESE]: 'Combo',
  },
  stunned: {
    [Language.ENGLISH]: 'Stunned!',
    [Language.PORTUGUESE]: 'Atordoado!',
  },
  blinded: {
    [Language.ENGLISH]: 'Blinded!',
    [Language.PORTUGUESE]: 'Cego!',
  },
  confused: {
    [Language.ENGLISH]: 'Confused!',
    [Language.PORTUGUESE]: 'Confuso!',
  },
  xp: {
    [Language.ENGLISH]: 'XP',
    [Language.PORTUGUESE]: 'XP',
  },
  abilityReady: {
    [Language.ENGLISH]: 'Ready!',
    [Language.PORTUGUESE]: 'Pronto!',
  },
  abilityCooldown: {
    [Language.ENGLISH]: 'Cooldown: {seconds}s',
    [Language.PORTUGUESE]: 'Recarga: {seconds}s',
  },
  // LootScreen
  victory: {
    [Language.ENGLISH]: 'Victory!',
    [Language.PORTUGUESE]: 'Vitória!',
  },
  plunder: {
    [Language.ENGLISH]: 'Plunder!',
    [Language.PORTUGUESE]: 'Saque!',
  },
  foundItem: {
    [Language.ENGLISH]: 'You found an item. It will be added to your build.',
    [Language.PORTUGUESE]: 'Você encontrou um item. Ele será adicionado à sua build.',
  },
  foundGold: {
    [Language.ENGLISH]: 'You defeated the enemy and found some gold.',
    [Language.PORTUGUESE]: 'Você derrotou o inimigo e encontrou um pouco de ouro.',
  },
  ventureDeeper: {
    [Language.ENGLISH]: 'Venture Deeper',
    [Language.PORTUGUESE]: 'Aventure-se Mais Fundo',
  },
  // GameOverScreen
  youDied: {
    [Language.ENGLISH]: 'You Died',
    [Language.PORTUGUESE]: 'Você Morreu',
  },
  reachedLevel: {
    [Language.ENGLISH]: 'You reached dungeon level {level}.',
    [Language.PORTUGUESE]: 'Você alcançou o nível {level} da masmorra.',
  },
  tryAgain: {
    [Language.ENGLISH]: 'Try Again',
    [Language.PORTUGUESE]: 'Tentar Novamente',
  },
  // ShopScreen
  merchantAppears: {
    [Language.ENGLISH]: 'A Merchant Appears',
    [Language.PORTUGUESE]: 'Um Mercador Aparece',
  },
  merchantGreeting: {
    [Language.ENGLISH]: '"Greetings, traveler. Care to browse my wares?"',
    [Language.PORTUGUESE]: '"Saudações, viajante. Gostaria de ver minhas mercadorias?"',
  },
  yourGold: {
    [Language.ENGLISH]: 'Your Gold: {gold}',
    [Language.PORTUGUESE]: 'Seu Ouro: {gold}',
  },
  buy: {
    [Language.ENGLISH]: 'Buy ({price}g)',
    [Language.PORTUGUESE]: 'Comprar ({price}g)',
  },
  continueJourney: {
    [Language.ENGLISH]: 'Continue Your Journey',
    [Language.PORTUGUESE]: 'Continue Sua Jornada',
  },
  shopSoldOut: {
    [Language.ENGLISH]: '"It seems I have nothing left to offer you, for now."',
    [Language.PORTUGUESE]: '"Parece que não tenho mais nada a lhe oferecer, por enquanto."',
  },
  // DungeonMap
  dungeonFloor: {
    [Language.ENGLISH]: 'Dungeon Floor {floor}',
    [Language.PORTUGUESE]: 'Andar da Masmorra {floor}',
  },
  // WikiScreen
  dungeonGuide: {
    [Language.ENGLISH]: 'Dungeon Guide',
    [Language.PORTUGUESE]: 'Guia da Masmorra',
  },
  coreCombatTitle: {
    [Language.ENGLISH]: '⚔️ Core Combat',
    [Language.PORTUGUESE]: '⚔️ Combate Principal',
  },
  coreCombatP1: {
    [Language.ENGLISH]: 'Your goal is to defeat enemies by correctly typing the text on screen.',
    [Language.PORTUGUESE]: 'Seu objetivo é derrotar inimigos digitando corretamente o texto na tela.',
  },
  coreCombatP2: {
    [Language.ENGLISH]: 'Each correct character you type deals damage to the enemy.',
    [Language.PORTUGUESE]: 'Cada caractere correto que você digita causa dano ao inimigo.',
  },
  coreCombatP3: {
    [Language.ENGLISH]: 'Every typing mistake you make will cause you to take damage. Starting from Level 5, enemies will also attack you periodically!',
    [Language.PORTUGUESE]: 'Cada erro de digitação fará com que você sofra dano. A partir do Nível 5, os inimigos também o atacarão periodicamente!',
  },
  combosBonusesTitle: {
    [Language.ENGLISH]: '✨ Combos & Bonuses',
    [Language.PORTUGUESE]: '✨ Combos & Bônus',
  },
  combosBonusesP1: {
    [Language.ENGLISH]: 'Typing words without making a mistake increases your Combo counter.',
    [Language.PORTUGUESE]: 'Digitar palavras sem cometer erros aumenta seu contador de Combo.',
  },
  combosBonusesP2: {
    [Language.ENGLISH]: 'The higher your combo, the higher your chance of receiving a random bonus when you complete a word:',
    [Language.PORTUGUESE]: 'Quanto maior seu combo, maior a chance de receber um bônus aleatório ao completar uma palavra:',
  },
  heal: {
    [Language.ENGLISH]: 'Heal',
    [Language.PORTUGUESE]: 'Cura',
  },
  damageUp: {
    [Language.ENGLISH]: 'Damage Up',
    [Language.PORTUGUESE]: 'Dano Aumentado',
  },
  shield: {
    [Language.ENGLISH]: 'Shield',
    [Language.PORTUGUESE]: 'Escudo',
  },
  dungeonDangersTitle: {
    [Language.ENGLISH]: '☠️ Dungeon Dangers',
    [Language.PORTUGUESE]: '☠️ Perigos da Masmorra',
  },
  bossMechanicsTitle: {
    [Language.ENGLISH]: '😵 Boss Mechanics',
    [Language.PORTUGUESE]: '😵 Mecânicas de Chefe',
  },
  lootShopsTitle: {
    [Language.ENGLISH]: '💰 Loot & Shops',
    [Language.PORTUGUESE]: '💰 Saque & Lojas',
  },
  classAbilitiesTitle: {
    [Language.ENGLISH]: '🔮 Class Abilities',
    [Language.PORTUGUESE]: '🔮 Habilidades de Classe',
  },
};

export const t = (key: keyof typeof translations, lang: Language, replacements?: Record<string, string | number>): string => {
  if (!translations[key]) {
    console.warn(`Translation key "${key}" not found.`);
    return key;
  }
  let str = translations[key][lang] || translations[key][Language.ENGLISH];
  if (replacements) {
    Object.keys(replacements).forEach(rKey => {
      // FIX: The value for replacement can be a number, but String.prototype.replace expects a string. Convert the value to a string.
      str = str.replace(`{${rKey}}`, String(replacements[rKey]));
    });
  }
  return str;
};