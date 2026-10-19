import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { GameMode, CellData, CurrentPiece, BlockType, Sticker, GameSettings } from './types/tetris';
import { BLOCK_METAS, TODDLER_SHAPES, KIDS_CLASSIC_SHAPES, getRandomPiece, rotateMatrix, checkCollision, getGhostY } from './utils/shapes';
import { toddlerAudio } from './utils/audio';
import { TopNav } from './components/TopNav';
import { Board } from './components/Board';
import { Controls } from './components/Controls';
import { BlockCell } from './components/BlockCell';
import { StickerBookModal } from './components/StickerBookModal';
import { ParentSettingsModal } from './components/ParentSettingsModal';
import { PlaygroundPalette } from './components/PlaygroundPalette';
import { PraiseOverlay } from './components/PraiseOverlay';
import { RotateCcw, Play, Pause, Sparkles, Trophy, Star, Heart } from 'lucide-react';

const INITIAL_STICKERS: Sticker[] = [
  { id: 'first_block', name: '아기별 첫 걸음', emoji: '🐣', desc: '첫 번째 블록을 놓았어요!', unlocked: false, category: 'toy' },
  { id: 'first_line', name: '줄 맞추기 챔피언', emoji: '🌟', desc: '한 줄을 예쁘게 채웠어요!', unlocked: false, category: 'magic' },
  { id: 'double_clear', name: '로켓 더블 팡팡', emoji: '🚀', desc: '두 줄을 한 번에 맞췄어요!', unlocked: false, category: 'magic' },
  { id: 'magic_broom', name: '요술 빗자루 마법사', emoji: '🧹', desc: '바닥을 말끔히 청소했어요!', unlocked: false, category: 'magic' },
  { id: 'bomb_blast', name: '별빛 폭탄 펑펑', emoji: '💣', desc: '폭탄으로 블록을 터뜨렸어요!', unlocked: false, category: 'magic' },
  { id: 'baby_bear', name: '하늘곰 친구', emoji: '🐻', desc: '하늘곰 블록 5번 놓기!', unlocked: false, category: 'animal' },
  { id: 'yellow_chick', name: '노랑 병아리 친구', emoji: '🐥', desc: '노랑 병아리 블록 5번 놓기!', unlocked: false, category: 'animal' },
  { id: 'score_100', name: '100점 슈퍼스타', emoji: '🏆', desc: '100점 달성!', unlocked: false, category: 'toy' },
  { id: 'ten_lines', name: '블록 박사님', emoji: '👑', desc: '총 10줄을 지웠어요!', unlocked: false, category: 'toy' },
  { id: 'playground_fan', name: '자유 건축가', emoji: '🏰', desc: '자유 놀이터에서 멋진 집 짓기!', unlocked: false, category: 'toy' },
  { id: 'rainbow_magic', name: '무지개 요정', emoji: '🌈', desc: '무지개 블록을 놓았어요!', unlocked: false, category: 'magic' },
  { id: 'kind_toddler', name: '블록 천재 어린이', emoji: '💖', desc: '즐겁게 블록 놀이를 했어요!', unlocked: true, category: 'animal' }, // starter gift
];

const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  bgmEnabled: false,
  voicePraiseEnabled: true,
  speedLevel: 'turtle',
  noGameOver: true,
  gridSize: 'standard',
};

const MODE_CONFIG = {
  TODDLER: { rows: 12, cols: 8, shapes: TODDLER_SHAPES },
  KIDS_CLASSIC: { rows: 16, cols: 10, shapes: KIDS_CLASSIC_SHAPES },
  PLAYGROUND: { rows: 12, cols: 8, shapes: TODDLER_SHAPES },
};

export default function App() {
  const [mode, setMode] = useState<GameMode>('TODDLER');
  const [grid, setGrid] = useState<CellData[][]>(() => createEmptyGrid(MODE_CONFIG.TODDLER.rows, MODE_CONFIG.TODDLER.cols));
  const [currentPiece, setCurrentPiece] = useState<CurrentPiece | null>(null);
  const [nextPiece, setNextPiece] = useState<CurrentPiece | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  
  // Game stats
  const [score, setScore] = useState<number>(0);
  const [lines, setLines] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);

  // Magic Tools
  const [broomCount, setBroomCount] = useState<number>(3);
  const [bombCount, setBombCount] = useState<number>(2);
  const [isBroomActive, setIsBroomActive] = useState<boolean>(false);
  const [undoGrid, setUndoGrid] = useState<CellData[][] | null>(null);

  // Modals & UI states
  const [isStickerOpen, setIsStickerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [praiseText, setPraiseText] = useState<string | null>(null);
  const [newStickerAlert, setNewStickerAlert] = useState<string | null>(null);

  // Saved Settings & Stickers
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem('toddler_tetris_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [stickers, setStickers] = useState<Sticker[]>(() => {
    try {
      const saved = localStorage.getItem('toddler_tetris_stickers');
      return saved ? JSON.parse(saved) : INITIAL_STICKERS;
    } catch {
      return INITIAL_STICKERS;
    }
  });

  // Track counts for sticker unlocks
  const statsTracker = useRef({ bearCount: 0, chickCount: 0, totalLines: 0 });

  function createEmptyGrid(rows: number, cols: number): CellData[][] {
    return Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ({ filled: false }))
    );
  }

  // Trigger sound wrappers respecting settings
  const playSfx = useCallback((action: () => void) => {
    if (settings.soundEnabled) {
      action();
    }
  }, [settings.soundEnabled]);

  // Unlock sticker helper
  const unlockSticker = useCallback((id: string) => {
    setStickers((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target && !target.unlocked) {
        const updated = prev.map((s) =>
          s.id === id ? { ...s, unlocked: true, unlockedAt: new Date().toLocaleDateString('ko-KR') } : s
        );
        try {
          localStorage.setItem('toddler_tetris_stickers', JSON.stringify(updated));
        } catch {}
        setNewStickerAlert(target.name);
        playSfx(() => toddlerAudio.playStickerUnlockSound());
        setTimeout(() => setNewStickerAlert(null), 3500);
        return updated;
      }
      return prev;
    });
  }, [playSfx]);

  // Give cheerful praise
  const triggerPraise = useCallback((text?: string) => {
    const list = ['참 잘했어요! ⭐', '우와 멋져요! 🎈', '대단해요! 🚀', '팡팡 최고예요! 🎉', '슈퍼스타! ✨'];
    const chosen = text || list[Math.floor(Math.random() * list.length)];
    setPraiseText(chosen);
    if (settings.voicePraiseEnabled) {
      toddlerAudio.speakPraise(chosen.replace(/[^가-힣\s!]/g, ''));
    }
    setTimeout(() => setPraiseText(null), 2200);
  }, [settings.voicePraiseEnabled]);

  // Initialize new game
  const initGame = useCallback((targetMode = mode) => {
    const config = MODE_CONFIG[targetMode];
    const newGrid = createEmptyGrid(config.rows, config.cols);
    setGrid(newGrid);
    setUndoGrid(null);
    setIsGameOver(false);
    setIsPlaying(true);
    setScore(0);
    setLines(0);
    setCombo(0);
    setBroomCount(3);
    setBombCount(2);

    const first = getRandomPiece(config.shapes, Math.floor(config.cols / 2));
    const next = getRandomPiece(config.shapes, Math.floor(config.cols / 2));
    setCurrentPiece(first);
    setNextPiece(next);
  }, [mode]);

  // Reset or Switch Mode
  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    initGame(newMode);
    if (newMode === 'PLAYGROUND') {
      unlockSticker('playground_fan');
    }
  };

  // Start game on mount
  useEffect(() => {
    initGame(mode);
  }, []);

  // Sync BGM
  useEffect(() => {
    if (settings.bgmEnabled && isPlaying && !isGameOver) {
      toddlerAudio.startBGM();
    } else {
      toddlerAudio.stopBGM();
    }
    return () => toddlerAudio.stopBGM();
  }, [settings.bgmEnabled, isPlaying, isGameOver]);

  // Save settings
  const updateSettings = (newSet: Partial<GameSettings>) => {
    setSettings((prev) => {
      const merged = { ...prev, ...newSet };
      try {
        localStorage.setItem('toddler_tetris_settings', JSON.stringify(merged));
      } catch {}
      return merged;
    });
  };

  const handleResetProgress = () => {
    setStickers(INITIAL_STICKERS);
    try {
      localStorage.removeItem('toddler_tetris_stickers');
    } catch {}
    initGame(mode);
    setIsSettingsOpen(false);
  };

  // Line Clear Checker
  const checkLines = useCallback((boardGrid: CellData[][]) => {
    const fullRowIndices: number[] = [];
    boardGrid.forEach((row, idx) => {
      if (row.every((cell) => cell.filled)) {
        fullRowIndices.push(idx);
      }
    });

    if (fullRowIndices.length === 0) {
      setCombo(0);
      return boardGrid;
    }

    // Celebratory effects
    confetti({
      particleCount: 40 * fullRowIndices.length,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#FACC15', '#38BDF8', '#4ADE80', '#FB7185', '#C084FC'],
    });

    playSfx(() => toddlerAudio.playLineClearSound(fullRowIndices.length));
    triggerPraise(fullRowIndices.length > 1 ? '더블 팡팡 대단해요! 🚀' : '참 잘했어요! ⭐');

    // Unlock stickers
    unlockSticker('first_line');
    if (fullRowIndices.length >= 2) unlockSticker('double_clear');
    statsTracker.current.totalLines += fullRowIndices.length;
    if (statsTracker.current.totalLines >= 10) unlockSticker('ten_lines');

    // Update lines and score
    setLines((prev) => prev + fullRowIndices.length);
    setScore((prev) => {
      const newScore = prev + fullRowIndices.length * 20 * (combo + 1);
      if (newScore >= 100) unlockSticker('score_100');
      return newScore;
    });
    setCombo((prev) => prev + 1);

    // Refill broom helper every 4 lines cleared
    if ((lines + fullRowIndices.length) % 4 === 0) {
      setBroomCount((prev) => Math.min(prev + 1, 5));
    }

    // Build new grid with removed lines
    const remainingRows = boardGrid.filter((_, idx) => !fullRowIndices.includes(idx));
    const emptyRowsCount = fullRowIndices.length;
    const cols = boardGrid[0].length;
    const newEmptyRows = Array.from({ length: emptyRowsCount }, () =>
      Array.from({ length: cols }, () => ({ filled: false }))
    );

    return [...newEmptyRows, ...remainingRows];
  }, [combo, lines, playSfx, triggerPraise, unlockSticker]);

  // Lock current piece into grid
  const lockPiece = useCallback((pieceToLock: CurrentPiece) => {
    // Save current grid for Undo
    setUndoGrid(grid.map((r) => r.map((c) => ({ ...c }))));

    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
    const rows = newGrid.length;
    const cols = newGrid[0].length;

    // Check if it's a BOMB
    if (pieceToLock.type === 'BOMB') {
      playSfx(() => toddlerAudio.playBombSound());
      unlockSticker('bomb_blast');
      triggerPraise('별빛 폭탄 펑펑! 💣');
      confetti({ particleCount: 30, spread: 60, colors: ['#F43F5E', '#FBBF24'] });

      // Clear 3x3 surrounding cells
      const targetY = pieceToLock.y;
      const targetX = pieceToLock.x;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const cy = targetY + dy;
          const cx = targetX + dx;
          if (cy >= 0 && cy < rows && cx >= 0 && cx < cols) {
            newGrid[cy][cx] = { filled: false };
          }
        }
      }
    } else {
      // Normal block locking
      playSfx(() => toddlerAudio.playDropSound());
      unlockSticker('first_block');

      if (pieceToLock.type === 'I') {
        statsTracker.current.bearCount++;
        if (statsTracker.current.bearCount >= 5) unlockSticker('baby_bear');
      } else if (pieceToLock.type === 'O') {
        statsTracker.current.chickCount++;
        if (statsTracker.current.chickCount >= 5) unlockSticker('yellow_chick');
      } else if (pieceToLock.type === 'RAINBOW') {
        unlockSticker('rainbow_magic');
      }

      pieceToLock.matrix.forEach((rArr, r) => {
        rArr.forEach((val, c) => {
          if (val !== 0) {
            const py = pieceToLock.y + r;
            const px = pieceToLock.x + c;
            if (py >= 0 && py < rows && px >= 0 && px < cols) {
              newGrid[py][px] = {
                filled: true,
                type: pieceToLock.type,
                color: pieceToLock.color,
                borderColor: pieceToLock.borderColor,
                highlightColor: pieceToLock.highlightColor,
                name: pieceToLock.name,
              };
            }
          }
        });
      });
    }

    // Check line clears
    const postClearGrid = checkLines(newGrid);
    setGrid(postClearGrid);

    // Check Game Over condition (top 2 rows filled)
    const isTopOverflow = postClearGrid[0].some((c) => c.filled) || postClearGrid[1].some((c) => c.filled);

    if (isTopOverflow) {
      if (settings.noGameOver) {
        // Automatic rescue with Magic Broom!
        setIsBroomActive(true);
        playSfx(() => toddlerAudio.playBroomSound());
        triggerPraise('괜찮아요! 요술 빗자루 쓱싹! 🧹');
        setTimeout(() => {
          setGrid((current) => {
            const cleared = current.map((row, rIdx) =>
              rIdx < 5 ? row.map(() => ({ filled: false })) : row
            );
            return cleared;
          });
          setIsBroomActive(false);
        }, 600);
      } else {
        setIsGameOver(true);
        setIsPlaying(false);
        return;
      }
    }

    // Spawn next piece
    const allowed = MODE_CONFIG[mode].shapes;
    const centerCol = Math.floor(cols / 2);
    const spawnedPiece = nextPiece || getRandomPiece(allowed, centerCol);
    const futureNext = getRandomPiece(allowed, centerCol);

    setCurrentPiece(spawnedPiece);
    setNextPiece(futureNext);
  }, [grid, mode, nextPiece, settings.noGameOver, checkLines, playSfx, triggerPraise, unlockSticker]);

  // Movement actions
  const handleMoveLeft = useCallback(() => {
    if (!currentPiece || !isPlaying || isGameOver) return;
    if (!checkCollision(currentPiece.matrix, { x: currentPiece.x - 1, y: currentPiece.y }, grid)) {
      setCurrentPiece((p) => p && { ...p, x: p.x - 1 });
      playSfx(() => toddlerAudio.playMoveSound(currentPiece.x - 1));
    }
  }, [currentPiece, isPlaying, isGameOver, grid, playSfx]);

  const handleMoveRight = useCallback(() => {
    if (!currentPiece || !isPlaying || isGameOver) return;
    if (!checkCollision(currentPiece.matrix, { x: currentPiece.x + 1, y: currentPiece.y }, grid)) {
      setCurrentPiece((p) => p && { ...p, x: p.x + 1 });
      playSfx(() => toddlerAudio.playMoveSound(currentPiece.x + 1));
    }
  }, [currentPiece, isPlaying, isGameOver, grid, playSfx]);

  const handleRotate = useCallback(() => {
    if (!currentPiece || !isPlaying || isGameOver) return;
    const rotated = rotateMatrix(currentPiece.matrix);
    // Wall kick left/right attempt
    let validX = currentPiece.x;
    if (checkCollision(rotated, { x: validX, y: currentPiece.y }, grid)) {
      if (!checkCollision(rotated, { x: validX - 1, y: currentPiece.y }, grid)) {
        validX = validX - 1;
      } else if (!checkCollision(rotated, { x: validX + 1, y: currentPiece.y }, grid)) {
        validX = validX + 1;
      } else {
        return; // cannot rotate
      }
    }

    setCurrentPiece((p) => p && { ...p, matrix: rotated, x: validX });
    playSfx(() => toddlerAudio.playRotateSound());
  }, [currentPiece, isPlaying, isGameOver, grid, playSfx]);

  const handleSoftDrop = useCallback(() => {
    if (!currentPiece || !isPlaying || isGameOver) return;
    if (!checkCollision(currentPiece.matrix, { x: currentPiece.x, y: currentPiece.y + 1 }, grid)) {
      setCurrentPiece((p) => p && { ...p, y: p.y + 1 });
    } else {
      lockPiece(currentPiece);
    }
  }, [currentPiece, isPlaying, isGameOver, grid, lockPiece]);

  const handleHardDrop = useCallback(() => {
    if (!currentPiece || !isPlaying || isGameOver) return;
    const ghostY = getGhostY(currentPiece, grid);
    const droppedPiece = { ...currentPiece, y: ghostY };
    lockPiece(droppedPiece);
  }, [currentPiece, grid, isPlaying, isGameOver, lockPiece]);

  // Magic Broom Helper (Cleans bottom 2 rows)
  const handleMagicBroom = useCallback(() => {
    if (broomCount <= 0 || !isPlaying) return;
    setBroomCount((prev) => prev - 1);
    setIsBroomActive(true);
    playSfx(() => toddlerAudio.playBroomSound());
    triggerPraise('요술 빗자루 청소 완료! 🧹✨');
    unlockSticker('magic_broom');

    setTimeout(() => {
      setGrid((prev) => {
        const rows = prev.length;
        const cols = prev[0].length;
        const remaining = prev.slice(0, rows - 2);
        const newEmpty = Array.from({ length: 2 }, () =>
          Array.from({ length: cols }, () => ({ filled: false }))
        );
        return [...newEmpty, ...remaining];
      });
      setIsBroomActive(false);
    }, 400);
  }, [broomCount, isPlaying, playSfx, triggerPraise, unlockSticker]);

  // Star Bomb Helper (Spawns a bomb as current piece)
  const handleStarBomb = useCallback(() => {
    if (bombCount <= 0 || !isPlaying) return;
    setBombCount((prev) => prev - 1);
    const bombMeta = BLOCK_METAS.BOMB;
    const centerCol = Math.floor(grid[0].length / 2);
    setCurrentPiece({
      type: 'BOMB',
      matrix: bombMeta.shape,
      x: centerCol,
      y: 0,
      color: bombMeta.color,
      borderColor: bombMeta.borderColor,
      highlightColor: bombMeta.highlightColor,
      name: bombMeta.name,
    });
    playSfx(() => toddlerAudio.playRotateSound());
    triggerPraise('별빛 폭탄이 나타났어요! 💣');
  }, [bombCount, grid, isPlaying, playSfx, triggerPraise]);

  // Undo Helper
  const handleUndo = useCallback(() => {
    if (!undoGrid) return;
    setGrid(undoGrid);
    setUndoGrid(null);
    playSfx(() => toddlerAudio.playRotateSound());
    triggerPraise('방금 놓은 블록을 되돌렸어요! ↩️');
  }, [undoGrid, playSfx, triggerPraise]);

  // Free Playground Block Selection
  const handleSelectPlaygroundBlock = (type: BlockType) => {
    const meta = BLOCK_METAS[type];
    const centerCol = Math.floor(grid[0].length / 2);
    setCurrentPiece({
      type,
      matrix: meta.shape.map((r) => [...r]),
      x: centerCol,
      y: 0,
      color: meta.color,
      borderColor: meta.borderColor,
      highlightColor: meta.highlightColor,
      name: meta.name,
    });
    playSfx(() => toddlerAudio.playRotateSound());
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isStickerOpen || isSettingsOpen) return;
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleMoveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleMoveRight();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'x':
        case 'X':
          e.preventDefault();
          handleRotate();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleSoftDrop();
          break;
        case ' ':
          e.preventDefault();
          handleHardDrop();
          break;
        case 'b':
        case 'B':
          handleMagicBroom();
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStickerOpen, isSettingsOpen, handleMoveLeft, handleMoveRight, handleRotate, handleSoftDrop, handleHardDrop, handleMagicBroom]);

  // Main Game Gravity Loop
  useEffect(() => {
    if (!isPlaying || isGameOver || !currentPiece) return;
    // Speed based on settings
    const speedMs =
      mode === 'PLAYGROUND'
        ? null // No auto gravity in playground
        : settings.speedLevel === 'turtle'
        ? 1300
        : settings.speedLevel === 'slow'
        ? 950
        : 650;

    if (!speedMs) return;

    const timer = setInterval(() => {
      handleSoftDrop();
    }, speedMs);

    return () => clearInterval(timer);
  }, [isPlaying, isGameOver, currentPiece, settings.speedLevel, mode, handleSoftDrop]);

  const ghostY = currentPiece ? getGhostY(currentPiece, grid) : 0;
  const unlockedStickersCount = stickers.filter((s) => s.unlocked).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50/30 to-amber-100 flex flex-col font-['Jua',sans-serif]">
      {/* Top Bar Navigation */}
      <TopNav
        currentMode={mode}
        onSelectMode={handleSelectMode}
        onOpenStickers={() => setIsStickerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        stickerCount={unlockedStickersCount}
      />

      {/* Floating Animated Celebrations */}
      <PraiseOverlay praiseText={praiseText} newStickerAlert={newStickerAlert} />

      {/* Main Game Arena */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5 flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
          
          {/* Left Info Column (Mascot & Next Block) */}
          <div className="lg:col-span-3 space-y-3 order-2 lg:order-1">
            {/* Friendly Mascot Card */}
            <div className="bg-white/90 rounded-2xl p-4 border-2 border-amber-300 shadow-sm flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl shadow-inner animate-gentle-bounce">
                {currentPiece?.type === 'I' ? '🐻' : currentPiece?.type === 'O' ? '🐥' : currentPiece?.type === 'T' ? '🐰' : '🧸'}
              </div>
              <div>
                <span className="text-xs text-amber-800 font-bold block">지금 움직이는 블록</span>
                <span className="text-base font-black text-amber-950">
                  {currentPiece ? currentPiece.name : '놀이 시작!'}
                </span>
              </div>
            </div>

            {/* Next Piece Card */}
            <div className="bg-white/90 rounded-2xl p-4 border-2 border-amber-300 shadow-sm">
              <span className="text-xs text-amber-800 font-bold block mb-2">다음에 나올 블록 🎁</span>
              <div className="h-20 flex items-center justify-center bg-amber-50/70 rounded-xl border border-amber-200">
                {nextPiece ? (
                  <div
                    className="grid gap-1"
                    style={{
                      gridTemplateColumns: `repeat(${nextPiece.matrix[0].length}, 20px)`,
                    }}
                  >
                    {nextPiece.matrix.map((row, r) =>
                      row.map((val, c) => (
                        <div key={`${r}-${c}`} className="w-5 h-5">
                          {val !== 0 && (
                            <BlockCell
                              cell={{
                                filled: true,
                                type: nextPiece.type,
                                color: nextPiece.color,
                                borderColor: nextPiece.borderColor,
                                highlightColor: nextPiece.highlightColor,
                              }}
                              size={20}
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">준비 중</span>
                )}
              </div>
            </div>

            {/* Score & Lines Pill-free metrics */}
            <div className="bg-amber-100/80 rounded-2xl p-4 border-2 border-amber-200 space-y-2 text-amber-950">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  별빛 점수
                </span>
                <span className="text-xl font-black tabular-nums">{score}점</span>
              </div>
              <div className="flex items-center justify-between border-t border-amber-200 pt-1.5">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-600" />
                  완성한 줄
                </span>
                <span className="text-lg font-black tabular-nums">{lines}줄</span>
              </div>
              {combo > 1 && (
                <div className="text-xs text-rose-600 font-black animate-pulse text-center">
                  🔥 {combo}연속 콤보 파워!
                </div>
              )}
            </div>

            {/* Pause / Play / Restart actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-700" /> : <Play className="w-4 h-4 text-emerald-600" />}
                <span>{isPlaying ? '잠깐 멈춤' : '계속 하기'}</span>
              </button>
              <button
                onClick={() => initGame(mode)}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-amber-100 border-2 border-amber-300 text-amber-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="새로 시작"
              >
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span>다시 시작</span>
              </button>
            </div>
          </div>

          {/* Center Column: Game Board */}
          <div className="lg:col-span-5 flex flex-col items-center order-1 lg:order-2">
            <div className="w-full max-w-[340px] sm:max-w-[380px]">
              <Board
                grid={grid}
                currentPiece={currentPiece}
                ghostY={ghostY}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
                onRotate={handleRotate}
                onDrop={handleHardDrop}
                isBroomActive={isBroomActive}
              />
            </div>
          </div>

          {/* Right Column: Controls & Sandbox Palette */}
          <div className="lg:col-span-4 space-y-3 order-3">
            {mode === 'PLAYGROUND' && (
              <PlaygroundPalette
                onSelectBlock={handleSelectPlaygroundBlock}
                activeType={currentPiece?.type}
              />
            )}

            <div className="bg-amber-100/60 rounded-3xl p-3 border-2 border-amber-200 shadow-sm">
              <Controls
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
                onRotate={handleRotate}
                onSoftDrop={handleSoftDrop}
                onHardDrop={handleHardDrop}
                onMagicBroom={handleMagicBroom}
                onStarBomb={handleStarBomb}
                onUndo={handleUndo}
                broomCount={broomCount}
                bombCount={bombCount}
                canUndo={!!undoGrid}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Game Over Modal (Kids Classic Mode only) */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs select-none">
          <div className="bg-white border-4 border-amber-400 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-pop-sparkle space-y-4">
            <div className="text-6xl animate-gentle-bounce">🧸🎉</div>
            <div>
              <h2 className="text-2xl font-black text-amber-950">정말 멋졌어요!</h2>
              <p className="text-sm text-amber-800 font-bold mt-1">
                오늘도 블록을 높이높이 예쁘게 쌓았어요!
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-2xl text-amber-950 font-black text-lg">
              점수: <span className="text-rose-600">{score}점</span> ({lines}줄 완성)
            </div>
            <button
              onClick={() => initGame(mode)}
              className="toy-btn w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-lg rounded-2xl border-2 border-amber-600 shadow-[0_5px_0_#D97706] cursor-pointer"
            >
              한 번 더 신나게 놀기! 🔄
            </button>
          </div>
        </div>
      )}

      {/* Sticker Book Modal */}
      <StickerBookModal
        isOpen={isStickerOpen}
        onClose={() => setIsStickerOpen(false)}
        stickers={stickers}
      />

      {/* Parent Settings Modal */}
      <ParentSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetProgress={handleResetProgress}
      />
    </div>
  );
}
