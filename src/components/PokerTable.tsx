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
    <div className="relative w-full max-w-lg h-56 bg-m3-surfaceContainerLow rounded-m3-full border-4 border-m3-outlineVariant/50 shadow-md flex items-center justify-center p-4 overflow-hidden my-2">
      {/* Table Center Info */}
      <div className="relative z-10 text-center px-4 py-2 bg-m3-surfaceContainerHigh/90 rounded-m3-lg border border-m3-outlineVariant/40 backdrop-blur-sm max-w-xs shadow-sm">
        <div className="text-[11px] uppercase tracking-wider text-m3-primary font-medium">{spotName}</div>
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
            className={`absolute flex flex-col items-center z-20 transition-all duration-200 ${
              isHero ? 'scale-105' : isVillain ? 'scale-100' : 'opacity-50 scale-90'
            }`}
          >
            <div
              className={`px-3 py-1 rounded-m3-full text-xs font-semibold shadow flex items-center gap-1.5 border ${
                isHero
                  ? 'bg-m3-primaryContainer text-m3-onPrimaryContainer border-m3-primary ring-2 ring-m3-primary/30'
                  : isVillain
                  ? 'bg-m3-tertiaryContainer text-m3-onTertiaryContainer border-m3-tertiary'
                  : 'bg-m3-surfaceContainerHighest text-m3-onSurfaceVariant border-m3-outlineVariant/40'
              }`}
            >
              <span>{pos}</span>
              {isHero && <span className="text-[9px] bg-m3-onPrimaryContainer text-m3-primaryContainer px-1 rounded-m3-xs uppercase font-bold">Hero</span>}
              {isVillain && <span className="text-[9px] bg-m3-onTertiaryContainer text-m3-tertiaryContainer px-1 rounded-m3-xs uppercase font-bold">Opener</span>}
            </div>

            {pos === 'BTN' && (
              <div className="mt-1 w-4 h-4 bg-m3-onSurface text-m3-surface text-[9px] font-black rounded-m3-full flex items-center justify-center shadow">
                D
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
