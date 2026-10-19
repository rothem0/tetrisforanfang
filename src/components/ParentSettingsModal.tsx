import React from 'react';
import { GameSettings } from '../types/tetris';
import { X, Volume2, VolumeX, Music, Mic, ShieldCheck, RotateCcw } from 'lucide-react';

interface ParentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
}

export const ParentSettingsModal: React.FC<ParentSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProgress,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-amber-950/40 backdrop-blur-xs select-none">
      <div className="bg-amber-50 border-4 border-amber-300 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-pop-sparkle">
        {/* Header */}
        <div className="p-4 bg-amber-200 border-b-2 border-amber-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚙️</span>
            <div>
              <h2 className="text-lg font-black text-amber-950">부모 안심 설정</h2>
              <p className="text-xs text-amber-800">아이의 연령에 맞게 게임을 조절해주세요</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-rose-100 text-slate-700 hover:text-rose-600 flex items-center justify-center border-2 border-amber-300 shadow-sm transition-transform active:scale-90"
            aria-label="닫기"
          >
            <X className="w-5 h-5 stroke-[3]" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Falling Speed */}
          <div>
            <label className="text-sm font-bold text-amber-950 mb-2 block">
              블록 떨어지는 속도
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'turtle', label: '🐢 거북이 (매우 느림)' },
                { id: 'slow', label: '🐥 병아리 (여유로움)' },
                { id: 'normal', label: '🐰 토끼 (보통)' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => onUpdateSettings({ speedLevel: item.id as GameSettings['speedLevel'] })}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer text-center ${
                    settings.speedLevel === item.id
                      ? 'bg-amber-400 border-amber-600 text-amber-950 shadow-sm'
                      : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggles */}
          <div className="space-y-2 pt-2 border-t border-amber-200">
            <label className="text-sm font-bold text-amber-950 block">소리 및 음성 설정</label>

            {/* Sound FX */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-200">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-amber-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <span className="text-sm font-bold text-slate-800">효과음 (통통 소리)</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* BGM */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-200">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-bold text-slate-800">오르골 자장가 배경음</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ bgmEnabled: !settings.bgmEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.bgmEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                    settings.bgmEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Voice Praise */}
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-amber-200">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-bold text-slate-800">칭찬 음성 ("참 잘했어요!")</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ voicePraiseEnabled: !settings.voicePraiseEnabled })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.voicePraiseEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                    settings.voicePraiseEnabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* No Game Over Mode */}
          <div className="p-3 bg-amber-100/70 rounded-xl border border-amber-300 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-black text-amber-950">게임 오버 없는 안심 모드</span>
              </div>
              <button
                onClick={() => onUpdateSettings({ noGameOver: !settings.noGameOver })}
                className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                  settings.noGameOver ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                    settings.noGameOver ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
            <p className="text-xs text-amber-800">
              블록이 천장에 닿아도 게임이 끝나지 않고, 요술 빗자루가 나타나 말끔히 정리해줍니다. (유아 추천)
            </p>
          </div>

          {/* Reset button */}
          <div className="pt-2 text-center">
            <button
              onClick={onResetProgress}
              className="text-xs text-rose-600 hover:text-rose-700 font-bold inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              스티커 및 기록 초기화하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
