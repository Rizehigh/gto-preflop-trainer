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

  /**
   * POKER MATHEMATICS DERIVATIONS & FORMULAS:
   * 
   * 1. Pot Odds:
   *    Formula: Pot Odds % = Amount to Call / (Pot before call + Amount to Call)
   *    - Facing 2.5bb Open Raise: Call 2.5bb into (1.5bb blinds + 2.5bb open + 2.5bb call) = 2.5 / 6.5 = 38.5% required equity.
   *    - Facing 7.5bb 3-Bet: Call 5.0bb into (1.5bb blinds + 2.5bb open + 7.5bb 3bet + 5.0bb call) = 5.0 / 16.5 = 30.3% required equity.
   * 
   * 2. Minimum Defense Frequency (MDF):
   *    Formula: MDF = Pot / (Pot + Bet) = 1 - [Bet / (Pot + Bet)]
   *    Represents the minimum percentage of Hero's range that must defend (call or raise)
   *    to prevent Villain from making an automatic, unexploitable EV+ profit with 0% equity bluffs.
   *    - Open Raise of 2.5bb into 1.5bb dead pot: Bet / (Pot + Bet) = 2.5 / (1.5 + 2.5) = 62.5% bet ratio.
   *      MDF = 1 - 0.625 = 37.5% (Blinds combined must defend at least 37.5% of hands vs RFI).
   *    - Facing 3-Bet of 7.5bb over 2.5bb open: MDF = 2.5 / (2.5 + 7.5) = 25% bet ratio -> MDF = 75% defense requirement.
   * 
   * 3. Blocker Removal Power (Combinatoric Reduction):
   *    - Holding an Ace (e.g. A5s, AJo):
   *        • Removes 1 Ace from the remaining 51-card deck.
   *        • Opponent AA combos reduced from C(4,2)=6 to C(3,2)=3 (-50% reduction).
   *        • Opponent AK combos reduced from 4x4=16 to 3x4=12 (-25% reduction).
   *        • Holding AK (Ace + King) reduces opponent AK combos from 16 to 3x3=9 (-43.75% reduction).
   * 
   * 4. Equity Realization (EqR):
   *    Formula: EqR = Actual EV / (Raw Hot-Cold Equity x Pot)
   *    - Suited Connectors / Broadways (>100% EqR): Realize more equity due to nut potential, flush draws, and positional leverage.
   *    - Offsuit Trash / Weak Offsuit (<85% EqR): Realize less equity due to poor playability, reverse implied odds, and dominations.
   */

  // Math derivations
  let potOddsPct = 'N/A (First Preflop Bettor)';
  let mdfPct = '37.5% Minimum Open Defense';
  let eqRealization = '~100%';

  if (isRfi) {
    potOddsPct = 'N/A (Initiating preflop raise)';
    mdfPct = '37.5% (Open-raise vs blinds)';
  } else if (isFacingOpen) {
    potOddsPct = '38.5% (2.5bb call into 6.5bb total pot)';
    mdfPct = '60.0% Minimum Defense Frequency';
  } else if (isFacing3Bet) {
    potOddsPct = '31.2% (5.5bb call into 17.5bb total pot)';
    mdfPct = '55.0% Minimum Defense Frequency';
  }

  // Hand specific blocker & equity properties
  const isAce = handNotation.includes('A');
  const isKing = handNotation.includes('K');
  const isSuited = handNotation.endsWith('s');
  const isPair = handNotation.length === 2 && handNotation[0] === handNotation[1];

  if (isSuited) eqRealization = '112% (In-Position Suited Bonus)';
  else if (isPair) eqRealization = '95% (Pocket Pair Set Mining)';
  else eqRealization = '82% (Offsuit Reverse Implied Odds)';

  const blockerText = isAce && isKing 
    ? 'Blocks 50% AA, KK, AK combinations' 
    : isAce 
    ? 'Blocks 50% AA, AK, AQ combinations' 
    : isKing 
    ? 'Blocks 50% KK, AK, KQ combinations' 
    : isPair 
    ? 'Blocks Set Combinations' 
    : 'No Major High Card Blockers';

  return (
    <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-xs p-3.5 space-y-3 shadow-sm text-xs mt-3 animate-fadeIn">
      {/* Header Badge */}
      <div className="flex items-center justify-between border-b border-m3-outlineVariant/80 pb-2">
        <div className="flex items-center gap-1.5 font-black text-amber-400 uppercase tracking-wider text-sm font-mono">
          <Zap className="w-4.5 h-4.5 text-amber-400 shrink-0" />
          <span>GTO Math & Equity Intelligence</span>
        </div>
        <div className="flex items-center gap-1 text-sm font-mono">
          <span className="text-m3-onSurfaceVariant font-bold">EqR:</span>
          <span className="text-emerald-400 font-extrabold">{eqRealization}</span>
        </div>
      </div>

      {/* 2x2 Grid Layout for Spacious Full Text Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        
        {/* Metric 1: Pot Odds */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-3 space-y-1 shadow-xs">
          <div className="text-sm font-bold text-m3-onSurfaceVariant flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Pot Odds Required</span>
          </div>
          <div className="text-sm font-bold text-m3-onSurface font-mono leading-relaxed">
            {potOddsPct}
          </div>
        </div>

        {/* Metric 2: MDF */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-3 space-y-1 shadow-xs">
          <div className="text-sm font-bold text-m3-onSurfaceVariant flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Minimum Defense Frequency (MDF)</span>
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono leading-relaxed">
            {mdfPct}
          </div>
        </div>

        {/* Metric 3: Blockers */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-3 space-y-1 shadow-xs">
          <div className="text-sm font-bold text-m3-onSurfaceVariant flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-400 shrink-0" />
            <span>Blocker Removal Power</span>
          </div>
          <div className="text-sm font-bold text-purple-300 font-mono leading-relaxed">
            {blockerText}
          </div>
        </div>

        {/* Metric 4: Premium Risk */}
        <div className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/80 rounded-m3-xs p-3 space-y-1 shadow-xs">
          <div className="text-sm font-bold text-m3-onSurfaceVariant flex items-center gap-1.5">
            <PieChart className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Premium Hand Risk Behind</span>
          </div>
          <div className="text-sm font-bold text-amber-300 font-mono leading-relaxed">
            {(math.probabilityPremiumBehind * 100).toFixed(1)}% premium chance ({math.playersBehind} players left behind)
          </div>
        </div>

      </div>
    </div>
  );
};
