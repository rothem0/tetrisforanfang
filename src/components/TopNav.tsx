import React from 'react';
import { GameMode } from '../types/tetris';

interface TopNavProps {
  currentMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  onOpenStickers: () => void;
  onOpenSettings: () => void;
  stickerCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentMode,
  onSelectMode,
  onOpenStickers,
  onOpenSettings,
  stickerCount,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 md:gap-8 px-4 sm:px-6 py-3 bg-amber-100/90 border-b-2 border-amber-200 backdrop-blur-xs select-none">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-2xl animate-gentle-bounce">🧸</span>
        <span className="text-lg sm:text-xl font-black text-amber-950 tracking-tight whitespace-nowrap shrink-0">
          토이 블록 테트리스
        </span>
      </div>

      {/* Zone 2: Navigation Links / Game Modes */}
      <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-1">
        <button
          onClick={() => onSelectMode('TODDLER')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            currentMode === 'TODDLER'
              ? 'bg-amber-400 text-amber-950 shadow-xs border border-amber-500 font-black'
              : 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-200/60'
          }`}
        >
          🐣 아기 모드
        </button>

        <button
          onClick={() => onSelectMode('KIDS_CLASSIC')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            currentMode === 'KIDS_CLASSIC'
              ? 'bg-amber-400 text-amber-950 shadow-xs border border-amber-500 font-black'
              : 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-200/60'
          }`}
        >
          🦁 어린이 모드
        </button>

        <button
          onClick={() => onSelectMode('PLAYGROUND')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            currentMode === 'PLAYGROUND'
              ? 'bg-amber-400 text-amber-950 shadow-xs border border-amber-500 font-black'
              : 'text-amber-900/80 hover:text-amber-950 hover:bg-amber-200/60'
          }`}
        >
          🎨 자유 놀이터
        </button>

        <button
          onClick={onOpenStickers}
          className="px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all whitespace-nowrap shrink-0 text-amber-900/80 hover:text-amber-950 hover:bg-amber-200/60 flex items-center gap-1 cursor-pointer"
        >
          <span>📖 스티커북</span>
          <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {stickerCount}
          </span>
        </button>
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center shrink-0">
        <button
          onClick={onOpenSettings}
          className="px-3.5 py-2 text-xs sm:text-sm font-black text-amber-950 bg-white hover:bg-amber-50 rounded-xl border-2 border-amber-300 shadow-xs transition-transform active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <span>설정</span>
          <span className="text-sm">⚙️</span>
        </button>
      </div>
    </header>
  );
};
