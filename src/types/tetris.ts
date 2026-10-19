export type GameMode = 'TODDLER' | 'KIDS_CLASSIC' | 'PLAYGROUND';

export type BlockType = 
  | 'I' // 하늘곰
  | 'O' // 노랑병아리
  | 'T' // 보라토끼
  | 'S' // 개구리
  | 'Z' // 멍멍이
  | 'J' // 파랑고래
  | 'L' // 주황여우
  | 'STAR' // 아기별 (1칸)
  | 'DOMINO' // 땅콩 (2칸)
  | 'TRIO' // 아기기차 (3칸)
  | 'RAINBOW' // 무지개 마법
  | 'BOMB'; // 별빛 폭탄

export interface BlockMeta {
  type: BlockType;
  name: string;
  emoji: string;
  color: string; // Tailwind or Hex
  borderColor: string;
  highlightColor: string;
  eyeType: 'round' | 'sparkle' | 'sleepy' | 'happy' | 'star';
  shape: number[][]; // 2D matrix
}

export interface CellData {
  filled: boolean;
  type?: BlockType;
  color?: string;
  borderColor?: string;
  highlightColor?: string;
  name?: string;
  clearing?: boolean;
}

export interface CurrentPiece {
  type: BlockType;
  matrix: number[][];
  x: number;
  y: number;
  color: string;
  borderColor: string;
  highlightColor: string;
  name: string;
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'animal' | 'toy' | 'magic';
}

export interface GameSettings {
  soundEnabled: boolean;
  bgmEnabled: boolean;
  voicePraiseEnabled: boolean;
  speedLevel: 'turtle' | 'slow' | 'normal'; // 1200ms, 850ms, 600ms
  noGameOver: boolean; // Magic broom auto-rescues child
  gridSize: 'standard' | 'large';
}
