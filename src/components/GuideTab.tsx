import React from 'react';
import { BookOpen, Layers, ShieldCheck, Zap, Compass, HelpCircle } from 'lucide-react';

export const GuideTab: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 text-slate-200">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <BookOpen className="w-4 h-4" />
          <span>Beginner Guide & Poker 101</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100">Mastering GTO Preflop & Hand Morphology</h2>
        <p className="text-xs text-slate-400">
          Learn the foundational principles of preflop range construction, poker table positioning, and hand characteristics.
        </p>
      </div>

      {/* Section 1: The 13x13 Preflop Matrix Explained */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>1. How to Read the 13x13 Preflop Matrix</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Every preflop spot in Texas Hold'em is mapped on a 13x13 grid containing all 169 starting hand categories (representing 1,326 total 2-card combinations).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30">
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Diagonal Cells</div>
            <div className="text-sm font-bold text-slate-100 mt-1">13 Pocket Pairs (AA – 22)</div>
            <p className="text-xs text-slate-400 mt-1">
              Runs top-left (AA) to bottom-right (22). Each pair has 6 suit combinations.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Upper Right Triangle</div>
            <div className="text-sm font-bold text-slate-100 mt-1">78 Suited Hands (e.g. AKs)</div>
            <p className="text-xs text-slate-400 mt-1">
              Marked with an "s". Higher rank card is listed first. Each suited hand has 4 combinations.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-700">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lower Left Triangle</div>
            <div className="text-sm font-bold text-slate-100 mt-1">78 Offsuit Hands (e.g. AKo)</div>
            <p className="text-xs text-slate-400 mt-1">
              Marked with an "o". Offsuit hands have different suits. Each offsuit hand has 12 combinations.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Position Advantage */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Compass className="w-5 h-5 text-emerald-400" />
          <span>2. Why Position Dictates Opening Ranges</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          In 6-Max poker, position is power. Acting last postflop gives you huge strategic advantages: more information on opponent checks/bets, pot control, and equity realization.
        </p>

        <div className="space-y-3">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-emerald-400">Under The Gun (UTG)</span>
              <span className="text-slate-400 block text-[11px]">First to act preflop. Must play tight (~15% range) because 5 players act behind.</span>
            </div>
            <span className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded font-bold border border-slate-700">Tightest</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-emerald-400">Button (BTN)</span>
              <span className="text-slate-400 block text-[11px]">Best seat at the table. Opens wide (~44% range) and acts last on every postflop street.</span>
            </div>
            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 rounded font-bold border border-emerald-800">Widest</span>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-emerald-400">Big Blind (BB)</span>
              <span className="text-slate-400 block text-[11px]">Already posted 1 BB. Defends wide against opens due to discounted call odds.</span>
            </div>
            <span className="px-2.5 py-1 bg-blue-950 text-blue-300 rounded font-bold border border-blue-800">Defensive</span>
          </div>
        </div>
      </div>

      {/* Section 3: Hand Morphology Principles */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-emerald-400" />
          <span>3. Core Principles of Hand Morphology</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-amber-400 text-sm">High Card Domination</h4>
            <p className="text-slate-300 leading-relaxed">
              High cards (A, K, Q) win pots when both players miss or hit top pair. Hands like AK dominate AQ, AJ, and KQ.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-emerald-400 text-sm">Suitedness & Barrel Power</h4>
            <p className="text-slate-300 leading-relaxed">
              Suited hands gain ~3-4% raw equity, but more importantly, flopping flush draws lets you continue betting aggressively across flop, turn, and river.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-blue-400 text-sm">Ace Blockers & 3-Bet Bluffs</h4>
            <p className="text-slate-300 leading-relaxed">
              Holding an Ace (like A5s or A4s) reduces the chances your opponent holds AA or AK by 50%! That makes them perfect 3-bet bluff candidates.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-purple-400 text-sm">Connectivity & Implied Odds</h4>
            <p className="text-slate-300 leading-relaxed">
              Sequential hands (like 87s or JTs) make sneaky straights that stack opponents holding overpairs (AA/KK).
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
