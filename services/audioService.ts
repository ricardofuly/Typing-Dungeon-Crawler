let audioCtx: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    try {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.error("Web Audio API is not supported in this browser.", e);
      return null;
    }
  }
  return audioCtx;
};

const playSound = (type: OscillatorType, frequency: number, duration: number, volume: number = 0.5, startTimeOffset: number = 0) => {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  const now = ctx.currentTime + startTimeOffset;

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gainNode.gain.setValueAtTime(volume, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.start(now);
  oscillator.stop(now + duration);
};

export const audioService = {
  playCorrectCharSound: () => {
    playSound('sine', 880, 0.05, 0.15);
  },
  playMistakeSound: () => {
    playSound('square', 110, 0.2, 0.25);
  },
  playEnemyHitSound: () => {
    playSound('triangle', 150, 0.2, 0.35);
  },
  playDebuffSound: () => {
    playSound('sawtooth', 200, 0.4, 0.25);
  },
  playAbilitySound: () => {
    playSound('sawtooth', 880, 0.1, 0.3, 0);
    playSound('sawtooth', 659, 0.2, 0.3, 0.05);
    playSound('sawtooth', 440, 0.3, 0.4, 0.1);
  },
  playLevelUpSound: () => {
    playSound('triangle', 440, 0.1, 0.4, 0);
    playSound('triangle', 554.37, 0.1, 0.4, 0.1);
    playSound('triangle', 659.25, 0.1, 0.4, 0.2);
    playSound('triangle', 880, 0.2, 0.5, 0.3);
  },
  playBonusSound: () => {
    playSound('sine', 1046.50, 0.1, 0.3, 0);
    playSound('sine', 1318.51, 0.15, 0.3, 0.1);
  },
  playShopBuySound: () => {
    playSound('sine', 523.25, 0.1, 0.3, 0);
    playSound('sine', 1046.50, 0.1, 0.3, 0.1);
  },
  playVictorySound: () => {
    playSound('square', 587.33, 0.1, 0.3, 0);
    playSound('square', 698.46, 0.1, 0.3, 0.15);
    playSound('square', 880.00, 0.2, 0.3, 0.3);
  },
};