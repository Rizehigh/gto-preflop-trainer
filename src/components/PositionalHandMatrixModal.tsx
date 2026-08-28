import React, { useState } from 'react';
import { ActionFrequencies, Position, SpotDefinition, TableSize } from '../types/poker';
import { SPOT_DEFINITIONS, getPositionRfiRange } from '../data/gtoRanges';
import { RANKS, classifyHandType, formatHandCategoryLabel } from '../utils/pokerUtils';
import { calculatePositionMathMetrics, getPositionsForTableSize } from '../utils/gtoMath';
import { X, Sparkles, UserCheck, PlayCircle, Layers, ArrowRight } from 'lucide-react';

interface PositionalHandMatrixModalProps {
  handNotation: string;
  tableSize: TableSize;
  currentHeroPosition: Position;
  onClose: () => void;
  onSelectPositionSpot?: (spot: SpotDefinition) => void;
}

export const PositionalHandMatrixModal: React.FC<PositionalHandMatrixModalProps> = ({
  handNotation: initialHandNotation,
  tableSize,
  currentHeroPosition,
  onClose,
  onSelectPositionSpot
}) => {
  const [selectedHand, setSelectedHand] = useState<string>(initialHandNotation);
  const positions = getPositionsForTableSize(tableSize);

  // Compute hand action for every position on the table
  const positionalBreakdown = positions.map((pos: Position) => {
    const rfiRange = getPositionRfiRange(pos);
    const freq: ActionFrequencies = rfiRange[selectedHand] || { raise: 0, call: 0, fold: 1 };
    const math = calculatePositionMathMetrics(pos, tableSize);

    // Find matching spot definition if available
    const matchingSpot = SPOT_DEFINITIONS.find(s => s.heroPosition === pos && s.category === 'rfi')
      || SPOT_DEFINITIONS.find(s => s.heroPosition === pos)
      || SPOT_DEFINITIONS[0];

    return {
      position: pos,
      freq,
      math,
      matchingSpot
    };
  });

  const handCategory = classifyHandType(selectedHand);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-950 border border-m3-outlineVariant rounded-m3-md w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-m3-surfaceContainerLow border-b border-m3-outlineVariant flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-zinc-950 font-black rounded-m3-xs flex items-center justify-center text-lg shadow">
              {selectedHand}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-m3-onSurface">Positional Strategy Matrix</h3>
                <span className="px-2 py-0.5 bg-amber-950 border border-amber-500 text-amber-300 text-[10px] font-bold rounded-m3-xs uppercase">
                  {formatHandCategoryLabel(handCategory)}
                </span>
              </div>
              <p className="text-xs text-m3-onSurfaceVariant font-medium">
                Compare how GTO plays <strong className="text-white font-mono">{selectedHand}</strong> from every seat at a {tableSize}-Max table.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh rounded-m3-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Hand Switcher Bar */}
        <div className="px-4 py-2 bg-zinc-900 border-b border-zinc-800 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <span className="text-zinc-400 font-bold text-[11px] shrink-0 uppercase tracking-wider">Quick Hand:</span>
          {['AA', 'KK', 'AKs', 'A5s', 'KQs', 'JTs', 'T9s', '87s', 'AQo', '22'].map((hand) => (
            <button
              key={hand}
              onClick={() => setSelectedHand(hand)}
              className={`px-2 py-1 rounded-m3-xs font-bold transition-all shrink-0 ${
                selectedHand === hand
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              {hand}
            </button>
          ))}
        </div>

        {/* Content Body: Grid of Table Seats */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {positionalBreakdown.map((item: any) => {
              const isCurrentHero = item.position === currentHeroPosition;
              const r = Math.round(item.freq.raise * 100);
              const c = Math.round(item.freq.call * 100);
              const f = Math.round(item.freq.fold * 100);

              const isPureRaise = r >= 95;
              const isPureFold = f >= 95;
              const isMixed = !isPureRaise && !isPureFold;

              return (
                <div
                  key={item.position}
                  className={`p-3.5 rounded-m3-xs border transition-all space-y-2.5 flex flex-col justify-between ${
                    isCurrentHero
                      ? 'bg-amber-950/40 border-amber-400/80 ring-1 ring-amber-400/40'
                      : 'bg-m3-surfaceContainerLow border-m3-outlineVariant hover:border-zinc-700'
                  }`}
                >
                  {/* Seat Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-amber-400 font-mono">{item.position}</span>
                      {isCurrentHero && (
                        <span className="px-1.5 py-0.5 bg-amber-400 text-zinc-950 text-[9px] font-extrabold rounded-m3-xs uppercase">
                          Active Seat
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-zinc-400 font-medium">
                      {item.math.playersBehind} behind
                    </span>
                  </div>

                  {/* Frequency Visualizer Bar */}
                  <div className="space-y-1">
                    <div className="h-3 w-full bg-zinc-900 rounded-m3-xs overflow-hidden border border-zinc-800 flex">
                      {r > 0 && <div style={{ width: `${r}%` }} className="bg-red-600 h-full" />}
                      {c > 0 && <div style={{ width: `${c}%` }} className="bg-emerald-600 h-full" />}
                      {f > 0 && <div style={{ width: `${f}%` }} className="bg-[#1f242e] h-full" />}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold">
                      {isPureRaise && <span className="text-red-400">Pure Raise (100%)</span>}
                      {isPureFold && <span className="text-zinc-400">Fold (100%)</span>}
                      {isMixed && (
                        <span className="text-amber-300 flex items-center gap-2 font-mono">
                          {r > 0 && <span>Raise {r}%</span>}
                          {c > 0 && <span>Call {c}%</span>}
                          {f > 0 && <span>Fold {f}%</span>}
                        </span>
                      )}
                      <span className="text-[10px] text-zinc-400 capitalize">{item.math.rangeStructure}</span>
                    </div>
                  </div>

                  {/* Action Button: Pretend Hero is in this position */}
                  {onSelectPositionSpot && (
                    <button
                      onClick={() => {
                        onSelectPositionSpot(item.matchingSpot);
                        onClose();
                      }}
                      className={`w-full py-1.5 px-2.5 rounded-m3-xs text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
                        isCurrentHero
                          ? 'bg-zinc-800 text-zinc-400 cursor-default'
                          : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{isCurrentHero ? 'Currently Playing Seat' : `Pretend Hero is ${item.position}`}</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-m3-surfaceContainerLow border-t border-m3-outlineVariant flex items-center justify-between text-xs text-m3-onSurfaceVariant">
          <span className="font-medium">
            Click any seat above to pretend you were folded in that position and test your GTO decision.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright text-m3-onSurface font-bold rounded-m3-xs border border-m3-outlineVariant"
          >
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
};
