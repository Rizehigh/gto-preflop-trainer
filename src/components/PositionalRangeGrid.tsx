import React, { useState } from 'react';
import { ActionFrequencies, Position, SpotDefinition, TableSize } from '../types/poker';
import { SPOT_DEFINITIONS, getPositionRfiRange } from '../data/gtoRanges';
import { RANKS, getMatrixHandNotation } from '../utils/pokerUtils';
import { calculatePositionMathMetrics, getPositionsForTableSize } from '../utils/gtoMath';
import { X, UserCheck, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

  // Get the range for the selected position
  const getRangeForPosition = (pos: Position): ActionFrequencies => {
    const rfiRange = getPositionRfiRange(pos);
    return rfiRange[handNotation] || { raise: 0, call: 0, fold: 1 };
  };

  // Get the spot definition for a position
  const getSpotForPosition = (pos: Position): SpotDefinition => {
    const matchingSpot = SPOT_DEFINITIONS.find(s => s.heroPosition === pos && s.category === 'rfi')
      || SPOT_DEFINITIONS.find(s => s.heroPosition === pos)
      || SPOT_DEFINITIONS[0];
    return matchingSpot;
  };

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

  const currentRange = selectedPosition ? getRangeForPosition(selectedPosition) : null;
  const currentMath = selectedPosition ? calculatePositionMathMetrics(selectedPosition, tableSize) : null;
  const currentSpot = selectedPosition ? getSpotForPosition(selectedPosition) : null;

  const handlePositionClick = (pos: Position) => {
    setSelectedPosition(pos);
    if (onSelectPositionSpot) {
      const spot = getSpotForPosition(pos);
      onSelectPositionSpot(spot);
    }
  };

  return (
    <div className="hidden lg:flex flex-col w-80 xl:w-96 bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md shadow-lg overflow-hidden animate-fadeIn">
      
      {/* Header */}
      <div className="p-3 bg-m3-surfaceContainerHigh border-b border-m3-outlineVariant flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-bold text-m3-onSurface">Position Inspector</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHighest rounded-m3-xs transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-1 text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHighest rounded-m3-xs transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Hand Display */}
          <div className="px-3 py-2 border-b border-m3-outlineVariant/50 bg-m3-surfaceContainer/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black font-mono text-amber-400 bg-m3-surfaceContainerHigh px-2.5 py-1 rounded-m3-xs border border-m3-outline">
                  {handNotation}
                </span>
                <span className="text-xs text-m3-onSurfaceVariant font-medium">
                  RFI Strategy
                </span>
              </div>
            </div>
          </div>

          {/* Position Buttons */}
          <div className="px-3 py-2 border-b border-m3-outlineVariant/50">
            <div className="flex flex-wrap gap-1.5">
              {positions.map((pos) => {
                const freq = getRangeForPosition(pos);
                const r = Math.round((freq.raise || 0) * 100);
                const isCurrentHero = pos === currentHeroPosition;
                const isSelected = pos === selectedPosition;

                return (
                  <button
                    key={pos}
                    onClick={() => handlePositionClick(pos)}
                    className={`px-2 py-1 text-xs font-bold rounded-m3-xs transition-all border ${isSelected
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-sm'
                      : isCurrentHero
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                        : r > 50
                          ? 'bg-red-950/60 text-red-300 border-red-500/40 hover:bg-red-900/60'
                          : r > 0
                            ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                            : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:bg-zinc-800'
                    }`}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 13x13 Mini Grid */}
          {selectedPosition && currentRange && (
            <div className="p-3 flex-1 overflow-auto">
              <div className="text-xs font-bold text-m3-onSurfaceVariant mb-2">
                {selectedPosition} RFI Range
                <span className="ml-2 text-[10px] text-zinc-500 font-normal">
                  ({currentMath?.playersBehind} behind)
                </span>
              </div>

              {/* Mini 13x13 Grid */}
              <div className="grid grid-cols-13 gap-[1px] bg-zinc-800 p-1 rounded-m3-xs">
                {RANKS.map((r1, rowIndex) =>
                  RANKS.map((r2, colIndex) => {
                    const notation = getMatrixHandNotation(rowIndex, colIndex);
                    const freq = getRangeForPosition(selectedPosition);
                    const isCurrentHand = handNotation === notation;
                    const bgStyle = getCellBgStyle(freq);

                    return (
                      <div
                        key={notation}
                        style={bgStyle}
                        className={`aspect-square flex items-center justify-center text-[7px] font-bold text-white relative overflow-hidden ${isCurrentHand ? 'ring-1 ring-amber-400 ring-offset-0 ring-offset-black' : ''}`}
                        title={`${notation}: Raise ${Math.round((freq?.raise || 0) * 100)}%`}
                      >
                        {isCurrentHand && (
                          <span className="absolute inset-0 bg-amber-400/20 animate-pulse" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 mt-2 text-[9px] text-m3-onSurfaceVariant">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-600 rounded-sm" />
                  <span>Raise</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-600 rounded-sm" />
                  <span>Call</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-zinc-800 rounded-sm border border-zinc-700" />
                  <span>Fold</span>
                </div>
              </div>
            </div>
          )}

          {!selectedPosition && (
            <div className="p-4 text-center text-xs text-m3-onSurfaceVariant">
              <p>Click a position above to see its full RFI range.</p>
              <p className="mt-1 text-[10px] text-zinc-500">
                The highlighted cell shows where {handNotation} falls in the range.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
