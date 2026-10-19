import React, { useState } from 'react';
import { Sticker } from '../types/tetris';
import { toddlerAudio } from '../utils/audio';
import { X, Award, Sparkles, Heart } from 'lucide-react';

interface StickerBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  stickers: Sticker[];
}

export const StickerBookModal: React.FC<StickerBookModalProps> = ({
  isOpen,
  onClose,
  stickers,
}) => {
  const [selectedSticker, setSelectedSticker] = useState<Sticker | null>(null);
  const [stampedList, setStampedList] = useState<{ id: string; emoji: string; x: number; y: number }[]>([]);

  if (!isOpen) return null;

  const unlockedCount = stickers.filter((s) => s.unlocked).length;

  const handleStickerClick = (sticker: Sticker) => {
    toddlerAudio.playSqueakSound();
    setSelectedSticker(sticker);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedSticker || !selectedSticker.unlocked) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    toddlerAudio.playSqueakSound();
    setStampedList((prev) => [
      ...prev.slice(-15), // keep last 15
      { id: `${Date.now()}-${Math.random()}`, emoji: selectedSticker.emoji, x, y },
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs select-none">
      <div className="bg-amber-50 border-4 border-amber-300 rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-pop-sparkle">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-200 via-yellow-200 to-amber-200 border-b-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl animate-bounce">📖</span>
            <div>
              <h2 className="text-xl font-black text-amber-950 flex items-center gap-2">
                내 칭찬 스티커북
                <Sparkles className="w-5 h-5 text-amber-600 fill-amber-500" />
              </h2>
              <p className="text-xs text-amber-800 font-bold">
                {stickers.length}개 중 <span className="text-rose-600 font-black">{unlockedCount}개</span> 모았어요!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white hover:bg-rose-100 text-slate-700 hover:text-rose-600 flex items-center justify-center border-2 border-amber-300 shadow-sm transition-transform active:scale-90"
            aria-label="닫기"
          >
            <X className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Sticker Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {stickers.map((s) => (
              <button
                key={s.id}
                onClick={() => handleStickerClick(s)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center border-2 transition-all cursor-pointer ${
                  s.unlocked
                    ? 'bg-white hover:bg-amber-100 border-amber-300 shadow-[0_4px_0_#FCD34D] active:scale-95'
                    : 'bg-amber-100/50 border-amber-200 opacity-50 grayscale'
                }`}
              >
                <div className="text-4xl mb-1 filter drop-shadow-xs">
                  {s.unlocked ? s.emoji : '🔒'}
                </div>
                <div className="text-xs font-black text-slate-800 line-clamp-1">{s.name}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{s.desc}</div>
              </button>
            ))}
          </div>

          {/* Sticker Playboard Canvas */}
          <div className="mt-4 pt-4 border-t-2 border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-amber-900 flex items-center gap-1">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                스티커 쾅쾅 자유 도화지
              </span>
              <span className="text-xs text-amber-700">
                {selectedSticker && selectedSticker.unlocked
                  ? `"${selectedSticker.name}" 선택됨 (바닥을 콕 눌러보세요!)`
                  : '위에서 스티커를 골라보세요'}
              </span>
            </div>

            <div
              onClick={handleCanvasClick}
              className="relative h-36 bg-gradient-to-br from-sky-50 to-pink-50 border-2 border-dashed border-amber-300 rounded-2xl overflow-hidden cursor-crosshair shadow-inner flex items-center justify-center"
            >
              {stampedList.length === 0 && (
                <p className="text-xs text-amber-600/70 font-bold select-none text-center">
                  스티커를 선택하고 도화지를 콕 콕 누르면<br />귀여운 도장이 찍혀요! 🎨
                </p>
              )}
              {stampedList.map((stamp) => (
                <span
                  key={stamp.id}
                  className="absolute text-3xl select-none -translate-x-1/2 -translate-y-1/2 animate-gentle-bounce pointer-events-none"
                  style={{ left: stamp.x, top: stamp.y }}
                >
                  {stamp.emoji}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-amber-100 border-t-2 border-amber-200 text-center">
          <p className="text-xs font-bold text-amber-900">
            블록을 맞추고 신나게 놀수록 더 많은 스티커가 열려요! 🌟
          </p>
        </div>
      </div>
    </div>
  );
};
