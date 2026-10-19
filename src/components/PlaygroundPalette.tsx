import React from 'react';
import { BlockType } from '../types/tetris';
import { BLOCK_METAS, TODDLER_SHAPES } from '../utils/shapes';

interface PlaygroundPaletteProps {
  onSelectBlock: (type: BlockType) => void;
  activeType?: BlockType;
}

export const PlaygroundPalette: React.FC<PlaygroundPaletteProps> = ({
  onSelectBlock,
  activeType,
}) => {
  return (
    <div className="bg-amber-100/90 rounded-2xl p-3 border-2 border-amber-300 shadow-sm">
      <div className="text-xs font-black text-amber-900 mb-2 flex items-center justify-between">
        <span>🎨 토이 상자에서 원하는 블록을 골라보세요:</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {TODDLER_SHAPES.map((type) => {
          const meta = BLOCK_METAS[type];
          const isSelected = activeType === type;

          return (
            <button
              key={type}
              onClick={() => onSelectBlock(type)}
              className={`toy-btn flex flex-col items-center justify-center min-w-[64px] h-[64px] p-1 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-amber-500 scale-105 shadow-[0_4px_0_#F59E0B]'
                  : 'bg-amber-50 hover:bg-white border-amber-200 shadow-xs'
              }`}
            >
              <span className="text-2xl filter drop-shadow-xs">{meta.emoji}</span>
              <span className="text-[10px] font-black text-slate-800 tracking-tight mt-0.5 line-clamp-1">
                {meta.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
