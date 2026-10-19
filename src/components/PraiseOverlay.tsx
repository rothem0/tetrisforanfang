import React from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface PraiseOverlayProps {
  praiseText: string | null;
  newStickerAlert: string | null;
}

export const PraiseOverlay: React.FC<PraiseOverlayProps> = ({
  praiseText,
  newStickerAlert,
}) => {
  return (
    <div className="fixed inset-x-0 top-20 pointer-events-none z-40 flex flex-col items-center justify-center gap-2 select-none">
      {/* Line Clear Praise */}
      <AnimatePresence>
        {praiseText && (
          <motion.div
            key={praiseText}
            initial={{ scale: 0.3, y: 30, opacity: 0 }}
            animate={{ scale: 1.1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-white font-black text-xl sm:text-2xl shadow-2xl border-4 border-white flex items-center gap-3 drop-shadow-md"
          >
            <span className="text-3xl animate-bounce">⭐</span>
            <span>{praiseText}</span>
            <span className="text-3xl animate-bounce">🎉</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Sticker Alert */}
      <AnimatePresence>
        {newStickerAlert && (
          <motion.div
            key={newStickerAlert}
            initial={{ scale: 0.5, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.6, y: -20, opacity: 0 }}
            className="px-5 py-2.5 rounded-2xl bg-white border-3 border-amber-400 shadow-xl text-amber-950 font-black text-sm sm:text-base flex items-center gap-2"
          >
            <span className="text-2xl">🌟</span>
            <span>새로운 스티커 획득: <strong className="text-rose-600 font-extrabold">{newStickerAlert}</strong>!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
