import React from 'react';
import { SpotDefinition } from '../types/poker';
import { calculatePositionMathMetrics } from '../utils/gtoMath';
import { Percent, Shield, Target, PieChart, Zap } from 'lucide-react';

interface GtoMathToolbarProps {
  spot: SpotDefinition;
  handNotation: string;
}

export const GtoMathToolbar: React.FC<GtoMathToolbarProps> = ({ spot, handNotation }) => {
  const math = calculatePositionMathMetrics(spot.heroPosition, 6);

  // Compute spot math estimates based on action category
  const isRfi = spot.category === 'rfi';
  const isFacingOpen = spot.category === 'facing_open';
  const isFacing3Bet = spot.category === 'facing_3bet' || spot.category === 'multiway_squeeze';

  // Math derivations
  let potOddsPct = 'N/A (Opener)';
  let mdfPct = '37.5% (RFI)';
  let eqRealization = '~100%';

  if (isRfi) {
    potOddsPct = 'N/A (Opener)';
    mdfPct = '37.5%';
  } else if (isFacingOpen) {
    potOddsPct = '38.5% (2.5bb call into 6.5bb)';
    mdfPct = '60.0%';
  } else if (isFacing3Bet) {
    potOddsPct = '31.2% (5.5bb call into 17.5bb)';
    mdfPct = '55.0%';
  }

  // Hand specific blocker & equity properties
  const isAce = handNotation.includes('A');
  const isKing = handNotation.includes('K');
  const isSuited = handNotation.endsWith('s');
  const isPair = handNotation.length === 2 && handNotation[0] === handNotation[1];

  if (isSuited) eqRealization = '112% (In-Pos)';
  else if (isPair) eqRealization = '95% (Pair)';
  else eqRealization = '82% (Offsuit)';

  const blockerText = isAce && isKing 
    ? 'Blocks 50% AA, KK, AK' 
    : isAce 
    ? 'Blocks 50% AA, AK, AQ' 
    : isKing 
    ? 'Blocks 50% KK, AK, KQ' 
    : isPair 
    ? 'Blocks Set Combos' 
    : 'No Major Blockers';

  return (
    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-xs p-3.5 space-y-3 shadow-sm text-xs mt-3 animate-fadeIn">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-m3-outlineVariant/80 pb-2">
        <div className="flex items-center gap-1.5 font-black text-amber-400 uppercase tracking-wider text-[11px] font-mono">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>GTO Math & Equity Intelligence</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-m3-onSurfaceVariant font-bold">EqR:</span>
          <span className="text-emerald-400 font-extrabold">{eqRealization}</span>
        </div>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left">
        
        {/* Metric 1: Pot Odds */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-2.5 space-y-1 shadow-xs overflow-hidden">
          <div className="text-[11px] font-bold text-m3-onSurfaceVariant flex items-center gap-1.5 truncate">
            <Percent className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Pot Odds</span>
          </div>
          <div className="text-xs font-bold text-m3-onSurface font-mono truncate" title={potOddsPct}>
            {potOddsPct}
          </div>
        </div>

        {/* Metric 2: MDF */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-2.5 space-y-1 shadow-xs overflow-hidden">
          <div className="text-[11px] font-bold text-m3-onSurfaceVariant flex items-center gap-1.5 truncate">
            <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">MDF</span>
          </div>
          <div className="text-xs font-bold text-emerald-400 font-mono truncate" title={mdfPct}>
            {mdfPct}
          </div>
        </div>

        {/* Metric 3: Blockers */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-2.5 space-y-1 shadow-xs overflow-hidden">
          <div className="text-[11px] font-bold text-m3-onSurfaceVariant flex items-center gap-1.5 truncate">
            <Target className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <span className="truncate">Blocker Power</span>
          </div>
          <div className="text-xs font-bold text-purple-300 font-mono truncate" title={blockerText}>
            {blockerText}
          </div>
        </div>

        {/* Metric 4: Premium Risk */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-2.5 space-y-1 shadow-xs overflow-hidden">
          <div className="text-[11px] font-bold text-m3-onSurfaceVariant flex items-center gap-1.5 truncate">
            <PieChart className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">Premium Risk</span>
          </div>
          <div className="text-xs font-bold text-amber-300 font-mono truncate">
            {(math.probabilityPremiumBehind * 100).toFixed(1)}% <span className="text-[10px] text-m3-onSurfaceVariant font-normal font-sans">({math.playersBehind} left)</span>
          </div>
        </div>

      </div>
    </div>
  );
};
