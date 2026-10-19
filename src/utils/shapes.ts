import { BlockMeta, BlockType, CurrentPiece, CellData } from '../types/tetris';

export const BLOCK_METAS: Record<BlockType, BlockMeta> = {
  I: {
    type: 'I',
    name: '하늘곰',
    emoji: '🐻',
    color: '#38BDF8', // Sky 400
    borderColor: '#0284C7',
    highlightColor: '#BAE6FD',
    eyeType: 'happy',
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  O: {
    type: 'O',
    name: '노랑병아리',
    emoji: '🐥',
    color: '#FACC15', // Yellow 400
    borderColor: '#CA8A04',
    highlightColor: '#FEF08A',
    eyeType: 'round',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  T: {
    type: 'T',
    name: '보라토끼',
    emoji: '🐰',
    color: '#C084FC', // Purple 400
    borderColor: '#9333EA',
    highlightColor: '#E9D5FF',
    eyeType: 'sparkle',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  S: {
    type: 'S',
    name: '초록개구리',
    emoji: '🐸',
    color: '#4ADE80', // Green 400
    borderColor: '#16A34A',
    highlightColor: '#BBF7D0',
    eyeType: 'round',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
  },
  Z: {
    type: 'Z',
    name: '딸기멍멍이',
    emoji: '🐶',
    color: '#FB7185', // Rose 400
    borderColor: '#E11D48',
    highlightColor: '#FECDD3',
    eyeType: 'happy',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  },
  J: {
    type: 'J',
    name: '파랑고래',
    emoji: '🐳',
    color: '#60A5FA', // Blue 400
    borderColor: '#2563EB',
    highlightColor: '#BFDBFE',
    eyeType: 'round',
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  L: {
    type: 'L',
    name: '주황여우',
    emoji: '🦊',
    color: '#FB923C', // Orange 400
    borderColor: '#EA580C',
    highlightColor: '#FED7AA',
    eyeType: 'sparkle',
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
  },
  STAR: {
    type: 'STAR',
    name: '아기별 (1칸)',
    emoji: '⭐',
    color: '#FBBF24', // Amber 400
    borderColor: '#D97706',
    highlightColor: '#FDE68A',
    eyeType: 'star',
    shape: [
      [1],
    ],
  },
  DOMINO: {
    type: 'DOMINO',
    name: '땅콩 (2칸)',
    emoji: '🥜',
    color: '#A3E635', // Lime 400
    borderColor: '#65A30D',
    highlightColor: '#D9F99D',
    eyeType: 'round',
    shape: [
      [1, 1],
    ],
  },
  TRIO: {
    type: 'TRIO',
    name: '아기기차 (3칸)',
    emoji: '🚂',
    color: '#2DD4BF', // Teal 400
    borderColor: '#0D9488',
    highlightColor: '#99F6E4',
    eyeType: 'happy',
    shape: [
      [1, 1, 1],
    ],
  },
  RAINBOW: {
    type: 'RAINBOW',
    name: '무지개 마법',
    emoji: '🌈',
    color: '#F472B6', // Pink 400
    borderColor: '#DB2777',
    highlightColor: '#FCE7F3',
    eyeType: 'sparkle',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  BOMB: {
    type: 'BOMB',
    name: '별빛 폭탄',
    emoji: '💣',
    color: '#F43F5E', // Rose 500
    borderColor: '#BE123C',
    highlightColor: '#FFE4E6',
    eyeType: 'sparkle',
    shape: [
      [1],
    ],
  },
};

export const TODDLER_SHAPES: BlockType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'STAR', 'DOMINO', 'TRIO'];
export const KIDS_CLASSIC_SHAPES: BlockType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L', 'STAR', 'BOMB'];

export function getRandomPiece(allowedTypes: BlockType[], startCol: number = 3): CurrentPiece {
  const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
  const meta = BLOCK_METAS[type];
  const matrix = meta.shape.map(row => [...row]);
  
  // Calculate center x
  const x = Math.max(0, startCol - Math.floor(matrix[0].length / 2));
  
  return {
    type,
    matrix,
    x,
    y: 0,
    color: meta.color,
    borderColor: meta.borderColor,
    highlightColor: meta.highlightColor,
    name: meta.name,
  };
}

export function rotateMatrix(matrix: number[][]): number[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: number[][] = [];
  
  for (let c = 0; c < cols; c++) {
    const newRow: number[] = [];
    for (let r = rows - 1; r >= 0; r--) {
      newRow.push(matrix[r][c]);
    }
    rotated.push(newRow);
  }
  return rotated;
}

export function checkCollision(
  matrix: number[][],
  pos: { x: number; y: number },
  grid: CellData[][]
): boolean {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== 0) {
        const newX = pos.x + c;
        const newY = pos.y + r;

        // Wall collisions
        if (newX < 0 || newX >= cols) return true;
        // Floor collision
        if (newY >= rows) return true;
        // Occupied cell collision
        if (newY >= 0 && grid[newY][newX].filled) {
          return true;
        }
      }
    }
  }
  return false;
}

export function getGhostY(
  piece: CurrentPiece,
  grid: CellData[][]
): number {
  let ghostY = piece.y;
  while (!checkCollision(piece.matrix, { x: piece.x, y: ghostY + 1 }, grid)) {
    ghostY++;
  }
  return ghostY;
}
