import React from 'react';
import { BookOpen, Layers, Zap, Compass } from 'lucide-react';

export const GuideTab: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-5 text-m3-onSurface">
      
      {/* Header Banner */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-m3-primary">
          <BookOpen className="w-4 h-4" />
          <span>Beginner Guide & Poker 101</span>
        </div>
        <h2 className="text-xl font-bold text-m3-onSurface">Mastering GTO Preflop & Hand Morphology</h2>
        <p className="text-xs text-m3-onSurfaceVariant font-medium">
          Learn foundational principles of preflop range construction, positioning, and hand characteristics.
        </p>
      </div>

      {/* Section 1: Matrix Reading */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-m3-onSurface flex items-center gap-2">
          <Layers className="w-4 h-4 text-m3-primary" />
          <span>1. How to Read the 13x13 Preflop Matrix</span>
        </h3>
        <p className="text-xs text-m3-onSurfaceVariant leading-relaxed font-medium">
          Every preflop spot is mapped on a 13x13 grid containing all 169 starting hand categories (representing 1,326 total combinations).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Diagonal Cells</div>
            <div className="text-sm font-bold text-m3-onSurface mt-1">13 Pocket Pairs (AA – 22)</div>
            <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1">
              Runs top-left (AA) to bottom-right (22). Each pair has 6 suit combinations.
            </p>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant">
            <div className="text-xs font-bold text-m3-primary uppercase tracking-wider">Upper Right Triangle</div>
            <div className="text-sm font-bold text-m3-onSurface mt-1">78 Suited Hands (e.g. AKs)</div>
            <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1">
              Marked with "s". Each suited hand has 4 combinations.
            </p>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant">
            <div className="text-xs font-bold text-m3-onSurfaceVariant uppercase tracking-wider">Lower Left Triangle</div>
            <div className="text-sm font-bold text-m3-onSurface mt-1">78 Offsuit Hands (e.g. AKo)</div>
            <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1">
              Marked with "o". Each offsuit hand has 12 combinations.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Position */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-m3-onSurface flex items-center gap-2">
          <Compass className="w-4 h-4 text-m3-primary" />
          <span>2. Position Dictates Opening Ranges</span>
        </h3>
        <p className="text-xs text-m3-onSurfaceVariant leading-relaxed font-medium">
          In 6-Max poker, position is power. Acting last postflop provides pot control, more information, and higher equity realization.
        </p>

        <div className="space-y-3 font-medium">
          <div className="bg-m3-surfaceContainerHigh p-3.5 rounded-m3-xs border border-m3-outlineVariant flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-m3-primary">Under The Gun (UTG)</span>
              <span className="text-m3-onSurfaceVariant block text-[11px]">First to act preflop. Must play tight (~15% range) because 5 players act behind.</span>
            </div>
            <span className="px-3 py-1 bg-m3-surfaceContainerHighest text-m3-onSurface font-bold rounded-m3-xs">Tightest</span>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3.5 rounded-m3-xs border border-m3-outlineVariant flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-m3-primary">Button (BTN)</span>
              <span className="text-m3-onSurfaceVariant block text-[11px]">Best seat at the table. Opens wide (~44% range) and acts last on every postflop street.</span>
            </div>
            <span className="px-3 py-1 bg-amber-950 text-amber-300 font-bold rounded-m3-xs border border-amber-500">Widest</span>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3.5 rounded-m3-xs border border-m3-outlineVariant flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-m3-primary">Big Blind (BB)</span>
              <span className="text-m3-onSurfaceVariant block text-[11px]">Already posted 1 BB. Defends wide against opens due to discounted call odds.</span>
            </div>
            <span className="px-3 py-1 bg-emerald-950 text-emerald-300 font-bold rounded-m3-xs border border-emerald-500">Defensive</span>
          </div>
        </div>
      </div>

      {/* Section 3: Morphology */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-m3-onSurface flex items-center gap-2">
          <Zap className="w-4 h-4 text-m3-primary" />
          <span>3. Core Principles of Hand Morphology</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant space-y-1.5">
            <h4 className="font-bold text-amber-300 text-xs">High Card Domination</h4>
            <p className="text-m3-onSurfaceVariant leading-relaxed">
              High cards (A, K, Q) win pots when both players miss or hit top pair. Hands like AK dominate AQ, AJ, and KQ.
            </p>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant space-y-1.5">
            <h4 className="font-bold text-m3-primary text-xs">Suitedness & Barrel Power</h4>
            <p className="text-m3-onSurfaceVariant leading-relaxed">
              Suited hands gain ~3-4% raw equity, but more importantly, flopping flush draws lets you continue betting aggressively.
            </p>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant space-y-1.5">
            <h4 className="font-bold text-emerald-300 text-xs">Ace Blockers & 3-Bet Bluffs</h4>
            <p className="text-m3-onSurfaceVariant leading-relaxed">
              Holding an Ace (like A5s or A4s) reduces the chances your opponent holds AA or AK by 50%! Perfect for 3-bet bluffs.
            </p>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant space-y-1.5">
            <h4 className="font-bold text-purple-300 text-xs">Connectivity & Implied Odds</h4>
            <p className="text-m3-onSurfaceVariant leading-relaxed">
              Sequential hands (like 87s or JTs) make sneaky straights that stack opponents holding overpairs (AA/KK).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
