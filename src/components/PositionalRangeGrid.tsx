import React, { useState, useMemo } from 'react';
import { ActionFrequencies, Position, SpotDefinition, TableSize } from '../types/poker';
import { SPOT_DEFINITIONS, getPositionRfiRange } from '../data/gtoRanges';
import { RANKS, getMatrixHandNotation, getMorphologyStructureMeta } from '../utils/pokerUtils';
import { calculatePositionMathMetrics, getPositionsForTableSize } from '../utils/gtoMath';
import { X, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';

interface PositionalRangeGridProps {
  handNotation: string;
  tableSize: TableSize;
  currentHeroPosition: Position;
  onClose: () => void;
  onSelectPositionSpot?: (spot: SpotDefinition) => void;
}

export const PositionalRangeGrid: React.FC<PositionalRangeGridProps> = ({
  handNotation,
  tableSize,
  currentHeroPosition,
  onClose,
  onSelectPositionSpot
}) => {
  const positions = getPositionsForTableSize(tableSize);
  const [selectedPosition, setSelectedPosition] = useState<Position>(currentHeroPosition);

  // Get the RFI range for a position
  const getPositionRange = (pos: Position): Record<string, ActionFrequencies> => {
    return getPositionRfiRange(pos);
  };

  // Get the spot definition for a position
  const getSpotForPosition = (pos: Position): SpotDefinition => {
    const matchingSpot = SPOT_DEFINITIONS.find(s => s.heroPosition === pos && s.category === 'rfi')
      || SPOT_DEFINITIONS.find(s => s.heroPosition === pos)
      || SPOT_DEFINITIONS[0];
    return matchingSpot;
  };

  const currentSpot = useMemo(() => getSpotForPosition(selectedPosition), [selectedPosition]);
  const currentMath = useMemo(() => calculatePositionMathMetrics(selectedPosition, tableSize), [selectedPosition, tableSize]);
  const currentRanges = useMemo(() => getPositionRange(selectedPosition), [selectedPosition]);
  const currentStructure = currentSpot.morphologyStructure || 'linear';
  const currentDescription = currentSpot.morphologyDescription || 'RFI range structure.';
  const structureMeta = getMorphologyStructureMeta(currentStructure);

  // Cell background style generator (same as RangeGrid)
  const getCellBgStyle = (freq?: ActionFrequencies) => {
    if (!freq) return { backgroundColor: '#18181b' };

    const r = freq.raise || 0;
    const c = freq.call || 0;
    const f = freq.fold || 0;

    if (r >= 0.95) return { backgroundColor: '#dc2626' };
    if (c >= 0.95) return { backgroundColor: '#059669' };
    if (f >= 0.95) return { backgroundColor: '#1f242e' };

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

  const handlePositionSelect = (pos: Position) => {
    setSelectedPosition(pos);
  };

  // Navigate to previous/next position
  const currentIndex = positions.indexOf(selectedPosition);
  const handlePrev = () => {
    if (currentIndex > 0) handlePositionSelect(positions[currentIndex - 1]);
  };
  const handleNext = () => {
    if (currentIndex < positions.length - 1) handlePositionSelect(positions[currentIndex + 1]);
  };

  return (
    <div className="flex flex-col w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md shadow-sm overflow-hidden animate-fadeIn space-y-0">
      
      {/* Header */}
      <div className="p-3 bg-m3-surfaceContainerHigh border-b border-m3-outlineVariant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-m3-onSurface">Position Inspector</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHighest rounded-m3-xs transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Hand Display & Position Selector */}
      <div className="px-3 py-2.5 border-b border-m3-outlineVariant/50 bg-m3-surfaceContainer/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black font-mono text-amber-400 bg-m3-surfaceContainerHigh px-2.5 py-1 rounded-m3-xs border border-m3-outline">
              {handNotation}
            </span>
            <span className="text-xs text-m3-onSurfaceVariant font-medium">
              RFI Strategy ({tableSize}-Max)
            </span>
          </div>
        </div>

        {/* Position Buttons */}
        <div className="flex flex-wrap gap-1.5">
          {positions.map((pos) => {
            const isCurrentHero = pos === currentHeroPosition;
            const isSelected = pos === selectedPosition;

            return (
              <button
                key={pos}
                onClick={() => handlePositionSelect(pos)}
                className={`px-2.5 py-1 text-xs font-bold rounded-m3-xs transition-all border ${isSelected
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm font-extrabold'
                  : isCurrentHero
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 hover:bg-amber-900/60'
                    : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {pos}
              </button>
            );
          })}
        </div>
      </div>

      {/* Position Info & GTO Math */}
      <div className="px-3 py-2 border-b border-m3-outlineVariant/50 space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-amber-400 font-mono">{selectedPosition}</span>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-m3-xs border uppercase tracking-wider ${structureMeta.badgeBg} ${structureMeta.textColor} ${structureMeta.borderColor}`}>
              {structureMeta.label}
            </span>
          </div>
          <span className="text-xs text-amber-300 font-bold font-mono">
            {currentMath?.gtoRfiFrequency}% GTO RFI
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-0.5">
          <span>{currentMath?.playersBehind} players behind</span>
          <span>Risk behind: <strong className="text-red-400">{currentMath?.probabilityPremiumBehind}%</strong></span>
        </div>

        <p className="text-[11px] text-zinc-400 font-medium leading-snug pt-0.5">
          {currentDescription}
        </p>
      </div>

      {/* 13x13 Grid Matrix Container */}
      <div className="p-3 flex-1">
        <div className="w-full bg-zinc-950 p-2 rounded-m3-md border border-m3-outlineVariant shadow-inner overflow-hidden">
          <div className="grid grid-cols-13 gap-0.5 sm:gap-1">
            {RANKS.map((r1, rowIndex) =>
              RANKS.map((r2, colIndex) => {
                const notation = getMatrixHandNotation(rowIndex, colIndex);
                const freq = currentRanges[notation];
                const isCurrentHand = handNotation === notation;
                const bgStyle = getCellBgStyle(freq);

                return (
                  <button
                    key={notation}
                    style={bgStyle}
                    className={`aspect-square flex items-center justify-center rounded-m3-xs text-[8px] sm:text-[10px] md:text-xs font-bold text-white transition-all transform hover:scale-110 hover:z-30 hover:shadow-lg focus:outline-none relative overflow-hidden ${
                      isCurrentHand ? 'ring-2 ring-amber-400 ring-offset-1 ring-offset-black scale-105 z-20 font-black' : ''
                    }`}
                    title={`${notation}: Raise ${Math.round((freq?.raise || 0) * 100)}%, Call ${Math.round((freq?.call || 0) * 100)}%, Fold ${Math.round((freq?.fold || 0) * 100)}%`}
                  >
                    <span className="drop-shadow-sm font-mono tracking-tighter">{notation}</span>
                    {isCurrentHand && (
                      <span className="absolute inset-0 border border-amber-400 animate-pulse rounded-m3-xs pointer-events-none" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[10px] font-semibold text-m3-onSurfaceVariant mt-2.5">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-sm border border-red-400" />
            <span>Raise</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-emerald-600 rounded-sm border border-emerald-400" />
            <span>Call</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-zinc-800 rounded-sm border border-zinc-700" />
            <span>Fold</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 bg-gradient-to-r from-red-600 to-emerald-600 rounded-sm" />
            <span>Mixed</span>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="px-3 py-2 bg-m3-surfaceContainerHigh border-t border-m3-outlineVariant flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`px-2 py-1 rounded-m3-xs transition-colors flex items-center gap-1 text-xs font-bold ${currentIndex === 0 ? 'text-zinc-600 cursor-not-allowed' : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHighest'}`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <span className="text-xs text-zinc-400 font-mono font-bold">
          {selectedPosition} ({currentIndex + 1} / {positions.length})
        </span>

        <button
          onClick={handleNext}
          disabled={currentIndex === positions.length - 1}
          className={`px-2 py-1 rounded-m3-xs transition-colors flex items-center gap-1 text-xs font-bold ${currentIndex === positions.length - 1 ? 'text-zinc-600 cursor-not-allowed' : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHighest'}`}
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
