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

  // Table seat coordinates around an oval
  const seatPositions: Record<Position, { top: string; left: string }> = {
    UTG: { top: '80%', left: '20%' },
    HJ: { top: '20%', left: '20%' },
    CO: { top: '10%', left: '50%' },
    BTN: { top: '20%', left: '80%' },
    SB: { top: '80%', left: '80%' },
    BB: { top: '90%', left: '50%' }
  };

  return (
    <div className="relative w-full max-w-xl h-64 bg-emerald-950/60 rounded-full border-8 border-emerald-900 shadow-2xl flex items-center justify-center p-4 overflow-hidden my-4">
      {/* Felt background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/40 via-emerald-950/80 to-emerald-950 pointer-events-none" />
      <div className="absolute inset-3 rounded-full border border-emerald-700/30 pointer-events-none" />

      {/* Table Center Info */}
      <div className="relative z-10 text-center px-4 py-2 bg-slate-950/80 rounded-xl border border-emerald-500/20 backdrop-blur-sm max-w-xs shadow-lg">
        <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">{spotName}</div>
        <div className="text-sm font-medium text-slate-200 mt-0.5">{facingAction}</div>
      </div>

      {/* Seats around the table */}
      {positions.map((pos) => {
        const isHero = pos === heroPosition;
        const isVillain = pos === villainPosition;
        const coords = seatPositions[pos];

        return (
          <div
            key={pos}
            style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)' }}
            className={`absolute flex flex-col items-center z-20 transition-all duration-300 ${
              isHero
                ? 'scale-110'
                : isVillain
                ? 'scale-105'
                : 'opacity-60 scale-95'
            }`}
          >
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 border ${
                isHero
                  ? 'bg-emerald-500 text-slate-950 border-emerald-300 ring-4 ring-emerald-500/30 animate-pulse'
                  : isVillain
                  ? 'bg-amber-500 text-slate-950 border-amber-300 ring-2 ring-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <span>{pos}</span>
              {isHero && <span className="text-[10px] bg-slate-950 text-emerald-400 px-1 rounded uppercase">Hero</span>}
              {isVillain && <span className="text-[10px] bg-slate-950 text-amber-400 px-1 rounded uppercase">Opener</span>}
            </div>

            {pos === 'BTN' && (
              <div className="mt-1 w-5 h-5 bg-white text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center shadow border border-slate-300">
                D
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
