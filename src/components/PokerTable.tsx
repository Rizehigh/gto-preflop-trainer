import React from 'react';
import { Position, TableSize } from '../types/poker';
import { AmateurProfile } from '../data/amateurProfiles';
import { calculateEllipseSeatCoordinates, calculatePositionMathMetrics, getPositionsForTableSize } from '../utils/gtoMath';

interface PokerTableProps {
  heroPosition: Position;
  villainPosition?: Position;
  spotName: string;
  facingAction: string;
  tableSize?: TableSize;
  onTableSizeChange?: (size: TableSize) => void;
  onSelectSeat?: (position: Position) => void;
  compact?: boolean;
  amateurProfile?: AmateurProfile | null;
}

export const PokerTable: React.FC<PokerTableProps> = ({
  heroPosition,
  villainPosition,
  spotName,
  facingAction,
  tableSize = 6,
  onTableSizeChange,
  onSelectSeat,
  compact = false,
  amateurProfile
}) => {
  const positions = getPositionsForTableSize(tableSize);
  const seatCoords = calculateEllipseSeatCoordinates(tableSize);
  const heroMath = calculatePositionMathMetrics(heroPosition, tableSize);

  return (
    <div className="w-full flex flex-col items-center space-y-2">
      
      {/* Table Size Toggle Header */}
      <div className="flex items-center justify-between w-full max-w-xl md:max-w-2xl lg:max-w-3xl px-1">
        <div className="text-[11px] font-bold text-m3-onSurfaceVariant uppercase tracking-wider flex items-center gap-1.5">
          <span>Table Format:</span>
          <span className="text-amber-400 font-extrabold">{tableSize}-Max</span>
        </div>

        {onTableSizeChange && (
          <div className="flex items-center gap-1 bg-m3-surfaceContainerHigh p-0.5 rounded-m3-xs border border-m3-outlineVariant">
            {([6, 7, 8, 9, 10] as TableSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onTableSizeChange(size)}
                className={`px-2 py-0.5 text-[10px] font-extrabold rounded-m3-xs transition-colors ${
                  tableSize === size
                    ? 'bg-amber-500 text-zinc-950 shadow-sm'
                    : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceBright'
                }`}
              >
                {size}M
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Elliptical Felt Container */}
      <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl h-64 sm:h-72 md:h-80 lg:h-96 bg-m3-surfaceContainerLow rounded-m3-lg border-2 border-m3-outlineVariant shadow flex items-center justify-center p-4 overflow-hidden my-1">
        
        {/* Table Felt Ring */}
        <div className="absolute inset-4 border border-zinc-800 rounded-[80px] bg-zinc-950/40 pointer-events-none" />

        {/* Table Center Info */}
        <div className="relative z-10 text-center px-3 py-2 bg-m3-surfaceContainerHigh/90 border border-m3-outlineVariant/80 max-w-[210px] shadow-sm rounded-m3-xs backdrop-blur-sm">
          <div className="text-[11px] uppercase tracking-wider text-m3-primary font-black leading-tight">
            {spotName}
          </div>
          <div className="text-[11px] font-semibold text-m3-onSurface mt-0.5 leading-tight">
            {facingAction}
          </div>

          <div className="mt-1.5 pt-1.5 border-t border-m3-outlineVariant/60 grid grid-cols-2 gap-1 text-[10px] font-mono text-zinc-400">
            <div>Behind: <span className="text-amber-300 font-bold">{heroMath.playersBehind}</span></div>
            <div>GTO RFI: <span className="text-emerald-400 font-bold">{heroMath.gtoRfiFrequency}%</span></div>
          </div>
        </div>

        {/* Seats around table */}
        {positions.map((pos, idx) => {
          const isHero = pos === heroPosition;
          const isVillain = pos === villainPosition;
          const coords = seatCoords[idx];

          return (
            <div
              key={pos}
              style={{
                top: `${coords.y}%`,
                left: `${coords.x}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`absolute flex flex-col items-center z-20 transition-all duration-200 ${
                isHero ? 'scale-105 z-30' : isVillain ? 'scale-100 z-25' : 'opacity-70'
              }`}
            >
              <button
                onClick={() => onSelectSeat && onSelectSeat(pos)}
                title={`Click seat to inspect ${pos} strategy matrix`}
                className={`px-2.5 py-1 text-[11px] font-bold shadow flex items-center gap-1 border rounded-m3-xs transition-all hover:scale-110 focus:outline-none ${
                  isHero
                    ? 'bg-m3-primaryContainer text-m3-onPrimaryContainer border-amber-400 ring-2 ring-amber-400/50'
                    : isVillain
                    ? 'bg-red-950 text-red-200 border-red-500'
                    : 'bg-m3-surfaceContainerHighest text-m3-onSurfaceVariant border-m3-outlineVariant hover:border-amber-400 hover:text-white'
                }`}
              >
                <span>{pos}</span>
                {isHero && (
                  <span className="text-[9px] bg-amber-400 text-zinc-950 px-1 rounded-m3-xs uppercase font-extrabold">
                    Hero
                  </span>
                )}
                {isVillain && (
                  <span className={`text-[9px] px-1 rounded-m3-xs uppercase font-extrabold ${amateurProfile ? amateurProfile.badgeColor : 'bg-red-600 text-white'}`}>
                    {amateurProfile ? `${amateurProfile.avatar} ${amateurProfile.shortName}` : 'Villain'}
                  </span>
                )}
              </button>

              {pos === 'BTN' && (
                <div className="mt-0.5 w-3.5 h-3.5 bg-amber-400 text-black text-[9px] font-black rounded-m3-xs flex items-center justify-center shadow">
                  D
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};