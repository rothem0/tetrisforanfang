import React, { useRef } from 'react';
import { CellData, CurrentPiece } from '../types/tetris';
import { BlockCell } from './BlockCell';

interface BoardProps {
  grid: CellData[][];
  currentPiece: CurrentPiece | null;
  ghostY: number;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onRotate: () => void;
  onDrop: () => void;
  isBroomActive?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  grid,
  currentPiece,
  ghostY,
  onMoveLeft,
  onMoveRight,
  onRotate,
  onDrop,
  isBroomActive = false,
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 8;

  // Touch gesture handling
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    // If swipe distance is very small -> Tap -> Rotate!
    if (absX < 15 && absY < 15) {
      onRotate();
    } else if (absX > absY && absX > 25) {
      // Horizontal swipe
      if (dx > 0) onMoveRight();
      else onMoveLeft();
    } else if (dy > 30) {
      // Swipe down -> Drop!
      onDrop();
    }
    touchStartRef.current = null;
  };

  // Build combined display grid
  const displayGrid: {
    cell: CellData;
    isGhost: boolean;
    isCurrent: boolean;
    status: 'falling' | 'landed' | 'clearing';
  }[][] = grid.map((row) =>
    row.map((cell) => ({
      cell: { ...cell },
      isGhost: false,
      isCurrent: false,
      status: cell.clearing ? 'clearing' : 'landed',
    }))
  );

  // Overlay ghost piece
  if (currentPiece && ghostY !== currentPiece.y) {
    currentPiece.matrix.forEach((rArr, r) => {
      rArr.forEach((val, c) => {
        if (val !== 0) {
          const gy = ghostY + r;
          const gx = currentPiece.x + c;
          if (gy >= 0 && gy < rows && gx >= 0 && gx < cols && !displayGrid[gy][gx].cell.filled) {
            displayGrid[gy][gx].isGhost = true;
          }
        }
      });
    });
  }

  // Overlay current active piece
  if (currentPiece) {
    currentPiece.matrix.forEach((rArr, r) => {
      rArr.forEach((val, c) => {
        if (val !== 0) {
          const py = currentPiece.y + r;
          const px = currentPiece.x + c;
          if (py >= 0 && py < rows && px >= 0 && px < cols) {
            displayGrid[py][px] = {
              cell: {
                filled: true,
                type: currentPiece.type,
                color: currentPiece.color,
                borderColor: currentPiece.borderColor,
                highlightColor: currentPiece.highlightColor,
                name: currentPiece.name,
              },
              isGhost: false,
              isCurrent: true,
              status: 'falling',
            };
          }
        }
      });
    });
  }

  return (
    <div
      className="relative rounded-3xl p-3 bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-300 shadow-xl overflow-hidden select-none cursor-pointer"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        // Desktop click inside board rotates piece
        if ((e.target as HTMLElement).tagName !== 'BUTTON') {
          onRotate();
        }
      }}
      title="터치하거나 클릭하면 블록이 돌아요!"
    >
      {/* Magic Broom Animation Overlay */}
      {isBroomActive && (
        <div className="absolute inset-0 bg-yellow-300/40 z-30 flex items-center justify-center backdrop-blur-xs animate-pop-sparkle pointer-events-none">
          <div className="text-center">
            <div className="text-6xl animate-bounce">🧹✨</div>
            <p className="text-amber-950 font-black text-xl mt-2 drop-shadow-sm">
              요술 빗자루 쓱싹쓱싹!
            </p>
          </div>
        </div>
      )}

      {/* Grid container */}
      <div
        className="grid gap-1.5 p-2 bg-amber-50/80 rounded-2xl border-2 border-amber-200 shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        {displayGrid.map((row, rIdx) =>
          row.map((item, cIdx) => (
            <div key={`${rIdx}-${cIdx}`} className="aspect-square flex items-center justify-center">
              <BlockCell
                cell={item.cell}
                isGhost={item.isGhost}
                isCurrent={item.isCurrent}
                status={item.status}
              />
            </div>
          ))
        )}
      </div>

      {/* Playful hint at bottom of board */}
      <div className="mt-2 text-center text-xs text-amber-800/80 font-bold tracking-wide">
        블록을 톡! 누르면 뱅글뱅글 돌아가요 🔄
      </div>
    </div>
  );
};
