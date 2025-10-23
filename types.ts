

export enum GameState {
  LANGUAGE_SELECTION,
  MENU,
  BATTLE,
  LOOT,
  GAME_OVER,
  SHOP,
  CHARACTER_CREATION,
}

export enum Language {
  ENGLISH = 'English',
  PORTUGUESE = 'Portuguese',
}

export enum RoomType {
  NORMAL,
  ELITE,
  BOSS,
}

export type Debuff = {
  type: 'stun' | 'blind' | 'confusion';
  duration: number;
};

export interface Item {
  id: number;
  name: string;
  description: string;
  effect: (player: PlayerStats) => PlayerStats;
}

export interface PlayerAbility {
  name: string;
  description: string;
  cooldown: number; // in seconds
  effect: (app: any) => void; // A bit of a hack, but simplest for this structure
}

export interface PlayerStats {
  maxHealth: number;
  health: number;
  damage: number; // Damage per correct character
  damageReduction: number; // Percentage
  activeShields: number; // Number of damage instances to block
  gold: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

export interface Player extends PlayerStats {
  inventory: (Item | null)[];
  name: string;
  portrait: string;
  ability?: PlayerAbility;
  abilityCooldown: number;
}

export interface Enemy {
  name: string;
  maxHealth: number;
  health: number;
  damage: number;
  text: string;
  roomType: RoomType;
  portrait: string;
}