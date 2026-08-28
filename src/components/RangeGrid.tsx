import React, { useState } from 'react';
import { ActionFrequencies, SpotDefinition } from '../types/poker';
import { RANKS, getMatrixHandNotation } from '../utils/pokerUtils';
import { HandDetailModal } from './HandDetailModal';

interface RangeGridProps {
  spot: SpotDefinition;
  highlightHand?: string;
  title?: string;
  showLegend?: boolean;
  filterAction?: 'all' | 'raise' | 'call' | 'mixed';
  compact?: boolean;
}

export const RangeGrid: React.FC<RangeGridProps> = ({
  spot,
  highlightHand,
  title,
  showLegend = true,
  filterAction = 'all',
  compact = false
}) => {
  const [selectedHand, setSelectedHand] = useState<{ notation: string; freq: ActionFrequencies } | null>(null);

  const getCellBgStyle = (freq?: ActionFrequencies) => {
    if (!freq) return { backgroundColor: '#18181b' };

    const r = freq.raise || 0;
    const c = freq.call || 0;
    const f = freq.fold || 0;

    if (r >= 0.95) return { backgroundColor: '#dc2626' }; // Pure Raise (Red)
    if (c >= 0.95) return { backgroundColor: '#059669' }; // Pure Call (Emerald)
    if (f >= 0.95) return { backgroundColor: '#1f242e' }; // Pure Fold (Dark Charcoal Container)

    const rPct = Math.round(r * 100);
    const cPct = Math.round(c * 100);

    if (r > 0 && c > 0 && f > 0) {
      return {
        background: `linear-gradient(135deg, #dc2626 0% ${rPct}%, #059669 ${rPct}% ${rPct + cPct}%, #1f242e ${rPct + cPct}% 100%)`
      };
    } else if (r > 0 && c > 0) {
      return {
        background: `linear-gradient(135deg, #dc2626 0% ${rPct}%, #059669 ${rPct}% 100%)`
      };
    } else if (r > 0 && f > 0) {
      return {
        background: `linear-gradient(135deg, #dc2626 0% ${rPct}%, #1f242e ${rPct}% 100%)`
      };
    } else if (c > 0 && f > 0) {
      return {
        background: `linear-gradient(135deg, #059669 0% ${cPct}%, #1f242e ${cPct}% 100%)`
      };
    }

    return { backgroundColor: '#1f242e' };
  };

  const isHandVisibleInFilter = (freq?: ActionFrequencies) => {
    if (filterAction === 'all' || !freq) return true;
    if (filterAction === 'raise') return (freq.raise || 0) > 0.15;
    if (filterAction === 'call') return (freq.call || 0) > 0.15;
    if (filterAction === 'mixed') {
      const opt = Math.max(freq.raise || 0, freq.call || 0, freq.fold || 0);
      return opt < 0.85 && opt > 0.15;
    }
    return true;
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {title && (
        <h4 className="text-xs font-bold text-m3-onSurfaceVariant mb-2 tracking-wide text-center uppercase flex items-center gap-2">
          <span>{title}</span>
          <span className="text-[10px] bg-m3-surfaceContainerHigh text-m3-onSurface px-2 py-0.5 border border-m3-outlineVariant font-mono">13x13</span>
        </h4>
      )}

      {/* 13x13 Grid Container */}
      <div className="w-full overflow-x-auto pb-2 flex justify-center">
        <div className={`grid grid-cols-13 gap-0.5 p-1.5 bg-m3-surfaceContainerLow rounded-m3-sm border border-m3-outlineVariant shadow max-w-full min-w-[320px] ${
          compact ? 'max-w-md' : 'max-w-xl'
        }`}>
          {RANKS.map((rowRank, rIdx) =>
            RANKS.map((colRank, cIdx) => {
              const notation = getMatrixHandNotation(rIdx, cIdx);
              const freq = spot.ranges[notation] || { fold: 1, call: 0, raise: 0 };
              const isHighlighted = highlightHand === notation;
              const matchesFilter = isHandVisibleInFilter(freq);

              const style = getCellBgStyle(freq);
              const isPair = rIdx === cIdx;

              return (
                <button
                  key={notation}
                  onClick={() => setSelectedHand({ notation, freq })}
                  style={style}
                  className={`relative aspect-square flex flex-col items-center justify-center font-bold text-white transition-all rounded-m3-xs ${
                    compact ? 'text-[9px] p-0.5' : 'text-xs p-1'
                  } ${
                    !matchesFilter ? 'opacity-20 grayscale' : 'hover:scale-105 hover:z-20 hover:ring-2 hover:ring-m3-primary shadow-sm'
                  } ${
                    isHighlighted
                      ? 'ring-4 ring-amber-400 z-30 animate-bounce scale-110 shadow-md font-extrabold'
                      : ''
                  }`}
                  title={`${notation} (${spot.name}): Raise ${Math.round((freq.raise||0)*100)}%, Call ${Math.round((freq.call||0)*100)}%, Fold ${Math.round((freq.fold||0)*100)}%`}
                >
                  <span className={`leading-none ${isPair ? 'text-amber-300 font-extrabold' : 'text-white'}`}>
                    {notation}
                  </span>

                  {isHighlighted && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex h-2.5 w-2.5 bg-amber-500 border border-black"></span>
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Legend Footer */}
      {showLegend && (
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-m3-onSurfaceVariant">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs">
            <span className="w-2.5 h-2.5 bg-red-600 border border-red-400" />
            <span className="text-red-300">Raise / 3-Bet</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs">
            <span className="w-2.5 h-2.5 bg-emerald-600 border border-emerald-400" />
            <span className="text-emerald-300">Call / Defend</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs">
            <span className="w-2.5 h-2.5 bg-zinc-700 border border-zinc-500" />
            <span className="text-zinc-300">Fold</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs">
            <span className="w-2.5 h-2.5 bg-gradient-to-r from-red-600 via-emerald-600 to-zinc-700 border border-zinc-500" />
            <span className="text-amber-300">Mixed Strategy</span>
          </div>
        </div>
      )}

      {selectedHand && (
        <HandDetailModal
          notation={selectedHand.notation}
          frequencies={selectedHand.freq}
          spotName={spot.name}
          onClose={() => setSelectedHand(null)}
        />
      )}
    </div>
  );
};
