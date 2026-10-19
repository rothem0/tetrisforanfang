import React from 'react';
import { CellData } from '../types/tetris';

interface BlockCellProps {
  cell?: CellData;
  isGhost?: boolean;
  isCurrent?: boolean;
  size?: number; // pixel size or null for responsive
  status?: 'falling' | 'landed' | 'clearing';
}

export const BlockCell: React.FC<BlockCellProps> = ({
  cell,
  isGhost = false,
  size,
  status = 'landed',
}) => {
  if (!cell || !cell.filled) {
    return (
      <div
        className="w-full h-full rounded-md border border-amber-950/[0.04] bg-white/40 backdrop-blur-[1px] transition-colors"
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      />
    );
  }

  // Ghost block preview
  if (isGhost) {
    return (
      <div
        className="w-full h-full rounded-lg border-2 border-dashed border-amber-400/60 bg-amber-200/20 flex items-center justify-center select-none"
        style={size ? { width: `${size}px`, height: `${size}px` } : undefined}
      >
        <span className="text-[10px] text-amber-500 font-bold opacity-75">· ◡ ·</span>
      </div>
    );
  }

  const { color = '#38BDF8', borderColor = '#0284C7', highlightColor = '#BAE6FD', type, clearing } = cell;

  const isSpecial = type === 'STAR' || type === 'BOMB' || type === 'RAINBOW';

  return (
    <div
      className={`relative w-full h-full rounded-lg select-none flex items-center justify-center transition-all ${
        clearing ? 'scale-125 rotate-6 brightness-125 z-10' : ''
      }`}
      style={{
        backgroundColor: color,
        borderWidth: '2.5px',
        borderStyle: 'solid',
        borderColor: borderColor,
        boxShadow: `inset 0 3px 0 ${highlightColor}, 0 2px 4px rgba(0,0,0,0.12)`,
        ...(size ? { width: `${size}px`, height: `${size}px` } : {}),
      }}
    >
      {/* 3D Toy shine glare */}
      <div className="absolute top-1 left-1 w-2.5 h-1.5 bg-white/60 rounded-full -rotate-12 pointer-events-none" />

      {/* Special Block Face or Symbol */}
      {type === 'BOMB' ? (
        <span className="text-base select-none animate-gentle-bounce">💣</span>
      ) : type === 'STAR' ? (
        <div className="flex flex-col items-center">
          <span className="text-sm select-none text-amber-900 font-extrabold animate-gentle-bounce">⭐</span>
        </div>
      ) : type === 'RAINBOW' ? (
        <span className="text-sm select-none">🌈</span>
      ) : (
        /* Cute Kawaii Face */
        <div className="flex flex-col items-center justify-center pointer-events-none scale-90">
          {/* Eyes with blushing cheeks */}
          <div className="flex items-center gap-1.5 relative">
            {/* Left Cheek */}
            <div className="absolute -left-1.5 top-1.5 w-1.5 h-1 bg-rose-400/60 rounded-full" />
            {/* Left Eye */}
            {clearing ? (
              <span className="text-[11px] leading-none text-slate-900 font-black">★</span>
            ) : status === 'falling' ? (
              <div className="w-2 h-2.5 bg-slate-900 rounded-full relative flex items-start justify-end p-0.5">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            ) : (
              <div className="w-2 h-2 bg-slate-900 rounded-full relative flex items-start justify-end p-0.5">
                <div className="w-0.5 h-0.5 bg-white rounded-full" />
              </div>
            )}

            {/* Right Eye */}
            {clearing ? (
              <span className="text-[11px] leading-none text-slate-900 font-black">★</span>
            ) : status === 'falling' ? (
              <div className="w-2 h-2.5 bg-slate-900 rounded-full relative flex items-start justify-end p-0.5">
                <div className="w-1 h-1 bg-white rounded-full" />
              </div>
            ) : (
              <div className="w-2 h-2 bg-slate-900 rounded-full relative flex items-start justify-end p-0.5">
                <div className="w-0.5 h-0.5 bg-white rounded-full" />
              </div>
            )}
            {/* Right Cheek */}
            <div className="absolute -right-1.5 top-1.5 w-1.5 h-1 bg-rose-400/60 rounded-full" />
          </div>

          {/* Sweet Mouth */}
          <div className="mt-0.5 text-[8px] leading-none text-slate-900/80 font-bold">
            {clearing ? 'o' : status === 'falling' ? 'o' : '◡'}
          </div>
        </div>
      )}
    </div>
  );
};
