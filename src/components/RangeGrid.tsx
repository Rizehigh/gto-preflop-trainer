import React, { useState } from 'react';
import { ActionFrequencies, SpotDefinition } from '../types/poker';
import { RANKS, getMatrixHandNotation } from '../utils/pokerUtils';
import { HandDetailModal } from './HandDetailModal';

interface RangeGridProps {
  spot: SpotDefinition;
  highlightHand?: string; // e.g. "AKs"
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

  // Function to compute cell background color / gradient based on GTO action frequencies
  const getCellBgStyle = (freq?: ActionFrequencies) => {
    if (!freq) return { backgroundColor: '#1e293b' }; // fallback

    const r = freq.raise || 0;
    const c = freq.call || 0;
    const f = freq.fold || 0;

    if (r >= 0.95) return { backgroundColor: '#dc2626' }; // pure raise (red)
    if (c >= 0.95) return { backgroundColor: '#059669' }; // pure call (emerald)
    if (f >= 0.95) return { backgroundColor: '#1e293b' }; // pure fold (slate)

    // Multi-way gradient mix
    const rPct = Math.round(r * 100);
    const cPct = Math.round(c * 100);

    if (r > 0 && c > 0 && f > 0) {
      return {
        background: `linear-gradient(135deg, #dc2626 0% ${rPct}%, #059669 ${rPct}% ${rPct + cPct}%, #1e293b ${rPct + cPct}% 100%)`
      };
    } else if (r > 0 && c > 0) {
      return {
        background: `linear-gradient(135deg, #dc2626 0% ${rPct}%, #059669 ${rPct}% 100%)`
      };
    } else if (r > 0 && f > 0) {
      return {
        background: `linear-gradient(135deg, #dc2626 0% ${rPct}%, #1e293b ${rPct}% 100%)`
      };
    } else if (c > 0 && f > 0) {
      return {
        background: `linear-gradient(135deg, #059669 0% ${cPct}%, #1e293b ${cPct}% 100%)`
      };
    }

    return { backgroundColor: '#1e293b' };
  };

  // Helper for filter mode in Study View
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
        <h4 className="text-sm font-bold text-slate-300 mb-2 tracking-wide text-center uppercase flex items-center gap-2">
          <span>{title}</span>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">13x13 Matrix</span>
        </h4>
      )}

      {/* 13x13 Grid Container */}
      <div className="w-full overflow-x-auto pb-2 flex justify-center">
        <div className={`grid grid-cols-13 gap-0.5 p-2 bg-slate-950 rounded-xl border border-slate-800 shadow-xl max-w-full min-w-[320px] ${
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
              const isSuited = rIdx < cIdx;

              return (
                <button
                  key={notation}
                  onClick={() => setSelectedHand({ notation, freq })}
                  style={style}
                  className={`relative aspect-square flex flex-col items-center justify-center font-bold text-slate-100 transition-all rounded-[3px] group ${
                    compact ? 'text-[9px] p-0.5' : 'text-xs sm:text-sm p-1'
                  } ${
                    !matchesFilter ? 'opacity-20 grayscale' : 'hover:scale-105 hover:z-20 hover:ring-2 hover:ring-white shadow-sm'
                  } ${
                    isHighlighted
                      ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-950 z-30 animate-bounce scale-110 shadow-lg shadow-yellow-500/50 font-black'
                      : ''
                  }`}
                  title={`${notation} (${spot.name}): Raise ${Math.round((freq.raise||0)*100)}%, Call ${Math.round((freq.call||0)*100)}%, Fold ${Math.round((freq.fold||0)*100)}%`}
                >
                  <span className={`leading-none ${isPair ? 'text-amber-200 font-black' : isSuited ? 'text-slate-100' : 'text-slate-300'}`}>
                    {notation}
                  </span>

                  {/* Highlight marker ring if current hand */}
                  {isHighlighted && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500 border border-slate-950"></span>
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
        <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-red-400 shadow-sm" />
            <span>Raise / 3-Bet</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-emerald-400 shadow-sm" />
            <span>Call / Defend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-slate-800 border border-slate-600 shadow-sm" />
            <span>Fold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-600 via-emerald-600 to-slate-800 border border-slate-500 shadow-sm" />
            <span>Mixed Frequency</span>
          </div>
        </div>
      )}

      {/* Modal for Hand Click */}
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
