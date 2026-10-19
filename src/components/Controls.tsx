import React from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ArrowDown, Zap, Sparkles, Bomb, Undo2 } from 'lucide-react';

interface ControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onSoftDrop: () => void;
  onHardDrop: () => void;
  onMagicBroom: () => void;
  onStarBomb: () => void;
  onUndo: () => void;
  broomCount: number;
  bombCount: number;
  canUndo: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onRotate,
  onSoftDrop,
  onHardDrop,
  onMagicBroom,
  onStarBomb,
  onUndo,
  broomCount,
  bombCount,
  canUndo,
}) => {
  return (
    <div className="w-full max-w-md mx-auto space-y-3 select-none">
      {/* Magic Helpers Row (Broom, Bomb, Undo) */}
      <div className="grid grid-cols-3 gap-2 px-1">
        <button
          onClick={onMagicBroom}
          disabled={broomCount <= 0}
          className={`toy-btn flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-bold text-sm text-purple-900 border-2 transition-all ${
            broomCount > 0
              ? 'bg-purple-100 hover:bg-purple-200 border-purple-400 shadow-[0_4px_0_#C084FC] active:shadow-none'
              : 'bg-slate-100 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed shadow-none'
          }`}
          title="바닥 2줄을 깨끗이 청소해줘요!"
        >
          <Sparkles className="w-4 h-4 text-purple-600 animate-gentle-bounce" />
          <span>요술빗자루</span>
          <span className="bg-purple-300 text-purple-900 text-xs px-1.5 py-0.5 rounded-full font-black">
            {broomCount}
          </span>
        </button>

        <button
          onClick={onStarBomb}
          disabled={bombCount <= 0}
          className={`toy-btn flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-bold text-sm text-rose-900 border-2 transition-all ${
            bombCount > 0
              ? 'bg-rose-100 hover:bg-rose-200 border-rose-400 shadow-[0_4px_0_#FB7185] active:shadow-none'
              : 'bg-slate-100 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed shadow-none'
          }`}
          title="주변 블록을 팡팡 터뜨려요!"
        >
          <Bomb className="w-4 h-4 text-rose-600 animate-gentle-bounce" />
          <span>별빛폭탄</span>
          <span className="bg-rose-300 text-rose-900 text-xs px-1.5 py-0.5 rounded-full font-black">
            {bombCount}
          </span>
        </button>

        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={`toy-btn flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl font-bold text-sm border-2 transition-all ${
            canUndo
              ? 'bg-sky-100 hover:bg-sky-200 border-sky-400 text-sky-900 shadow-[0_4px_0_#38BDF8] active:shadow-none'
              : 'bg-slate-100 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed shadow-none'
          }`}
          title="방금 놓은 블록을 되돌려요!"
        >
          <Undo2 className="w-4 h-4 text-sky-600" />
          <span>되돌리기</span>
        </button>
      </div>

      {/* Main Direction & Action Pad */}
      <div className="grid grid-cols-4 gap-2">
        {/* Left */}
        <button
          onClick={onMoveLeft}
          className="toy-btn h-16 bg-blue-400 hover:bg-blue-500 text-white font-black text-xl rounded-2xl border-2 border-blue-600 shadow-[0_6px_0_#2563EB] flex flex-col items-center justify-center active:shadow-none"
          aria-label="왼쪽으로 이동"
        >
          <ArrowLeft className="w-7 h-7 stroke-[3]" />
          <span className="text-[11px] font-bold">왼쪽</span>
        </button>

        {/* Rotate */}
        <button
          onClick={onRotate}
          className="toy-btn h-16 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xl rounded-2xl border-2 border-amber-600 shadow-[0_6px_0_#D97706] flex flex-col items-center justify-center active:shadow-none"
          aria-label="블록 돌리기"
        >
          <RotateCw className="w-7 h-7 stroke-[3]" />
          <span className="text-[11px] font-bold">돌리기</span>
        </button>

        {/* Right */}
        <button
          onClick={onMoveRight}
          className="toy-btn h-16 bg-blue-400 hover:bg-blue-500 text-white font-black text-xl rounded-2xl border-2 border-blue-600 shadow-[0_6px_0_#2563EB] flex flex-col items-center justify-center active:shadow-none"
          aria-label="오른쪽으로 이동"
        >
          <ArrowRight className="w-7 h-7 stroke-[3]" />
          <span className="text-[11px] font-bold">오른쪽</span>
        </button>

        {/* Hard Drop (쿵!) */}
        <button
          onClick={onHardDrop}
          className="toy-btn h-16 bg-emerald-400 hover:bg-emerald-500 text-emerald-950 font-black text-xl rounded-2xl border-2 border-emerald-600 shadow-[0_6px_0_#059669] flex flex-col items-center justify-center active:shadow-none"
          aria-label="쿵! 바로 내리기"
        >
          <Zap className="w-7 h-7 stroke-[3] fill-current" />
          <span className="text-[11px] font-bold">쿵! 놓기</span>
        </button>
      </div>

      {/* Gentle Soft Drop Wide Bar */}
      <button
        onClick={onSoftDrop}
        className="toy-btn w-full py-3 bg-orange-300 hover:bg-orange-400 text-orange-950 font-extrabold text-base rounded-2xl border-2 border-orange-500 shadow-[0_5px_0_#EA580C] flex items-center justify-center gap-2 active:shadow-none"
        aria-label="천천히 내리기"
      >
        <ArrowDown className="w-5 h-5 stroke-[3]" />
        <span>살살 아래로 내리기</span>
      </button>
    </div>
  );
};
