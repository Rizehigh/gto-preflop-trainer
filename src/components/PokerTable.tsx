import React from 'react';
import { Position } from '../types/poker';

interface PokerTableProps {
  heroPosition: Position;
  villainPosition?: Position;
  spotName: string;
  facingAction: string;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  heroPosition,
  villainPosition,
  spotName,
  facingAction
}) => {
  const positions: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

  const seatPositions: Record<Position, { top: string; left: string }> = {
    UTG: { top: '80%', left: '20%' },
    HJ: { top: '20%', left: '20%' },
    CO: { top: '10%', left: '50%' },
    BTN: { top: '20%', left: '80%' },
    SB: { top: '80%', left: '80%' },
    BB: { top: '90%', left: '50%' }
  };

  return (
    <div className="relative w-full max-w-lg h-56 bg-m3-surfaceContainerLow rounded-m3-lg border-2 border-m3-outlineVariant shadow flex items-center justify-center p-4 overflow-hidden my-2">
      {/* Table Center Info */}
      <div className="relative z-10 text-center px-4 py-2 bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 max-w-xs shadow-sm rounded-m3-xs">
        <div className="text-[11px] uppercase tracking-wider text-m3-primary font-bold">{spotName}</div>
        <div className="text-xs font-semibold text-m3-onSurface mt-0.5">{facingAction}</div>
      </div>

      {/* Seats around table */}
      {positions.map((pos) => {
        const isHero = pos === heroPosition;
        const isVillain = pos === villainPosition;
        const coords = seatPositions[pos];

        return (
          <div
            key={pos}
            style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)' }}
            className={`absolute flex flex-col items-center z-20 transition-all duration-150 ${
              isHero ? 'scale-105' : isVillain ? 'scale-100' : 'opacity-60'
            }`}
          >
            <div
              className={`px-3 py-1 text-xs font-bold shadow flex items-center gap-1.5 border rounded-m3-xs ${
                isHero
                  ? 'bg-m3-primaryContainer text-m3-onPrimaryContainer border-m3-primary ring-2 ring-m3-primary/40'
                  : isVillain
                  ? 'bg-amber-950 text-amber-200 border-amber-500'
                  : 'bg-m3-surfaceContainerHighest text-m3-onSurfaceVariant border-m3-outlineVariant'
              }`}
            >
              <span>{pos}</span>
              {isHero && <span className="text-[9px] bg-m3-primary text-m3-onPrimary px-1 rounded-m3-xs uppercase font-extrabold">Hero</span>}
              {isVillain && <span className="text-[9px] bg-amber-500 text-black px-1 rounded-m3-xs uppercase font-extrabold">Opener</span>}
            </div>

            {pos === 'BTN' && (
              <div className="mt-1 w-4 h-4 bg-amber-400 text-black text-[9px] font-black rounded-m3-xs flex items-center justify-center shadow">
                D
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
