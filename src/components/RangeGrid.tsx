import React, { useState } from 'react';
import { ActionFrequencies, SpotDefinition } from '../types/poker';
import { RANKS, getMatrixHandNotation, getMorphologyStructureMeta } from '../utils/pokerUtils';
import { HandDetailModal } from './HandDetailModal';
import { User, ShieldAlert } from 'lucide-react';

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
  const [viewTarget, setViewTarget] = useState<'hero' | 'villain'>('hero');
  const [selectedHand, setSelectedHand] = useState<{ notation: string; freq: ActionFrequencies } | null>(null);

  const activeRanges = (viewTarget === 'villain' && spot.villainRange) ? spot.villainRange : spot.ranges;
  const activeStructure = (viewTarget === 'villain' && spot.villainMorphologyStructure) 
    ? spot.villainMorphologyStructure 
    : spot.morphologyStructure;
  const activeDescription = (viewTarget === 'villain' && spot.villainMorphologyDescription)
    ? spot.villainMorphologyDescription
    : spot.morphologyDescription;

  const structureMeta = getMorphologyStructureMeta(activeStructure);

  const getCellBgStyle = (freq?: ActionFrequencies) => {
    if (!freq) return { backgroundColor: '#18181b' };

    const r = freq.raise || 0;
    const c = freq.call || 0;
    const f = freq.fold || 0;

    if (r >= 0.95) return { backgroundColor: '#dc2626' }; // Pure Raise (Red)
    if (c >= 0.95) return { backgroundColor: '#059669' }; // Pure Call (Emerald)
    if (f >= 0.95) return { backgroundColor: '#1f242e' }; // Pure Fold (Dark Charcoal)

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
    if (!freq || filterAction === 'all') return true;
    const r = freq.raise || 0;
    const c = freq.call || 0;
    const f = freq.fold || 0;

    if (filterAction === 'raise') return r > 0.1;
    if (filterAction === 'call') return c > 0.1;
    if (filterAction === 'mixed') return (r > 0.05 && r < 0.95) || (c > 0.05 && c < 0.95);
    return true;
  };

  return (
    <div className="w-full flex flex-col items-center space-y-3">
      
      {/* Header and Hero vs Villain View Toggle */}
      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          {title && <h3 className="text-sm font-bold text-m3-onSurface">{title}</h3>}
          
          {/* Morphology Badge */}
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-m3-xs border uppercase tracking-wider ${structureMeta.badgeBg} ${structureMeta.textColor} ${structureMeta.borderColor}`}>
              {structureMeta.label}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium">
              {activeDescription}
            </span>
          </div>
        </div>

        {/* Hero vs Opponent Range Selector Toggle */}
        {spot.villainRange && (
          <div className="flex items-center gap-1 bg-m3-surfaceContainerHigh p-1 rounded-m3-xs border border-m3-outlineVariant shrink-0">
            <button
              onClick={() => setViewTarget('hero')}
              className={`px-2.5 py-1 text-xs font-bold rounded-m3-xs flex items-center gap-1.5 transition-colors ${
                viewTarget === 'hero'
                  ? 'bg-amber-500 text-zinc-950 font-extrabold shadow-sm'
                  : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceBright'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Hero ({spot.heroPosition})</span>
            </button>

            <button
              onClick={() => setViewTarget('villain')}
              className={`px-2.5 py-1 text-xs font-bold rounded-m3-xs flex items-center gap-1.5 transition-colors ${
                viewTarget === 'villain'
                  ? 'bg-red-600 text-white font-extrabold shadow-sm'
                  : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceBright'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Opponent ({spot.villainPosition})</span>
            </button>
          </div>
        )}
      </div>

      {/* 13x13 Grid Matrix Container */}
      <div className="w-full max-w-md bg-zinc-950 p-2 sm:p-3 rounded-m3-md border border-m3-outlineVariant shadow-inner overflow-hidden">
        <div className="grid grid-cols-13 gap-0.5 sm:gap-1">
          {RANKS.map((r1, rowIndex) =>
            RANKS.map((r2, colIndex) => {
              const notation = getMatrixHandNotation(rowIndex, colIndex);
              const freq = activeRanges[notation];
              const isCurrent = highlightHand === notation;
              const matchesFilter = isHandVisibleInFilter(freq);
              const bgStyle = getCellBgStyle(freq);

              return (
                <button
                  key={notation}
                  onClick={() => setSelectedHand({ notation, freq })}
                  style={bgStyle}
                  className={`aspect-square flex items-center justify-center rounded-m3-xs text-[9px] sm:text-[11px] font-bold text-white transition-all transform hover:scale-110 hover:z-30 hover:shadow-lg focus:outline-none relative overflow-hidden ${
                    !matchesFilter ? 'opacity-20' : 'opacity-100'
                  } ${
                    isCurrent
                      ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black scale-105 z-20 font-black'
                      : ''
                  }`}
                  title={`${notation}: Raise ${Math.round((freq?.raise || 0) * 100)}%, Call ${Math.round((freq?.call || 0) * 100)}%, Fold ${Math.round((freq?.fold || 0) * 100)}%`}
                >
                  <span className="drop-shadow-sm font-mono tracking-tighter">{notation}</span>

                  {isCurrent && (
                    <span className="absolute inset-0 border border-amber-400 animate-pulse rounded-m3-xs pointer-events-none" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-m3-onSurfaceVariant pt-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-red-600 rounded-m3-xs border border-red-400 shadow-sm" />
            <span>Raise ({spot.raiseLabel})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-emerald-600 rounded-m3-xs border border-emerald-400 shadow-sm" />
            <span>Call / Defend</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-[#1f242e] rounded-m3-xs border border-zinc-700 shadow-sm" />
            <span>Fold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 bg-gradient-to-r from-red-600 to-emerald-600 rounded-m3-xs shadow-sm" />
            <span>Mixed Strategy</span>
          </div>
        </div>
      )}

      {/* Hand Detail Modal on Cell Click */}
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
