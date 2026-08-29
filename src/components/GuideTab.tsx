import React from 'react';
import { BookOpen, Layers, Zap, Compass, Users, HelpCircle, Sparkles } from 'lucide-react';
import { GtoMathSection } from './GtoMathSection';
import { RangeQuizSection } from './RangeQuizSection';
import { MORPHOLOGY_MNEMONICS, MATRIX_ARROW_MNEMONIC } from '../data/shapeMnemonics';

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

      {/* Range Morphology Predictor Quiz */}
      <RangeQuizSection />

      {/* GTO Mathematics for 6 to 10 Max Tables */}
      <GtoMathSection />

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
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎯</span>
              <span>Diagonal Spine</span>
            </div>
            <div className="text-sm font-bold text-m3-onSurface mt-1">13 Pocket Pairs (AA – 22)</div>
            <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1">
              Runs top-left (AA) to bottom-right (22). Central diagonal arrowhead of the grid. (6 combos each).
            </p>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant">
            <div className="text-xs font-bold text-m3-primary uppercase tracking-wider flex items-center gap-1.5">
              <span>🦅</span>
              <span>Upper Suited Wing</span>
            </div>
            <div className="text-sm font-bold text-m3-onSurface mt-1">78 Suited Hands (e.g. AKs)</div>
            <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1">
              Marked with "s". +3-4% equity bonus + flush draws. Soars far out to top-right. (4 combos each).
            </p>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant">
            <div className="text-xs font-bold text-m3-onSurfaceVariant uppercase tracking-wider flex items-center gap-1.5">
              <span>🪵</span>
              <span>Lower Offsuit Stub</span>
            </div>
            <div className="text-sm font-bold text-m3-onSurface mt-1">78 Offsuit Hands (e.g. AKo)</div>
            <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1">
              Marked with "o". No flush equity & reverse implied odds. Shrinks close to diagonal. (12 combos each).
            </p>
          </div>
        </div>

        {/* 13x13 Arrowhead Mnemonic Memory Banner */}
        <div className="bg-amber-950/30 border border-amber-500/40 rounded-m3-xs p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Memory Mnemonic: The 13x13 GTO Arrowhead</span>
          </div>
          <p className="text-sm font-bold text-amber-200 italic font-mono leading-relaxed">
            {MATRIX_ARROW_MNEMONIC.mnemonicPhrase}
          </p>
          <p className="text-xs text-zinc-300 leading-relaxed font-medium">
            <strong>Why GTO ranges look like an Arrowhead:</strong> Suited hands (wings) stay playable far lower in rank than offsuit hands (stubs). When visualising opening ranges from UTG to BTN, picture a sharp spearhead expanding outwards along the diagonal spine!
          </p>
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
          <span>3. Hand Morphology & 4 Range Shapes (With Mnemonics)</span>
        </h3>
        <p className="text-xs text-m3-onSurfaceVariant leading-relaxed font-medium">
          GTO preflop ranges form 4 distinct visual patterns on the 13x13 grid. Memorize these shape mnemonics to instantly recognize optimal preflop strategies:
        </p>

        {/* 4 Range Shapes Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium">
          {Object.values(MORPHOLOGY_MNEMONICS).map((m) => (
            <div 
              key={m.id}
              className={`p-4 rounded-m3-xs border space-y-2 shadow-sm ${
                m.id === 'linear'
                  ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                  : m.id === 'polarized'
                  ? 'bg-red-950/40 border-red-500/50 text-red-200'
                  : m.id === 'condensed'
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-200'
                  : 'bg-purple-950/40 border-purple-500/50 text-purple-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-white">
                  <span className="text-base">{m.shapeIcon}</span>
                  <span>{m.name} ({m.shapeName})</span>
                </div>
              </div>

              <div className="p-2 rounded bg-black/40 font-mono font-bold text-[11.5px] italic border border-white/10 text-amber-300">
                {m.mnemonicPhrase}
              </div>

              <p className="text-[11.5px] leading-relaxed text-zinc-300">
                <strong className="text-white">Grid Pattern:</strong> {m.visualDescription}
              </p>

              <div className="pt-1.5 border-t border-white/10 text-[11px] text-zinc-400">
                <strong className="text-zinc-200">Key Takeaway:</strong> {m.keyTakeaway}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium pt-2">
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

      {/* Section 4: Opponent Exploitative Strategy */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-m3-onSurface flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <span>4. Opponent Exploitative Play & Opponent Archetypes</span>
        </h3>
        <p className="text-xs text-m3-onSurfaceVariant leading-relaxed font-medium">
          GTO equilibrium assumes opponents play perfectly. When facing real-world opponents who deviate heavily from GTO, maximum EV comes from <strong>exploitative play</strong>—intentionally adjusting your strategy to target their specific leaks.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-red-950/40 p-4 rounded-m3-xs border border-red-500/50 space-y-1.5">
            <div className="flex items-center gap-2 text-red-300 font-bold">
              <span className="text-base">💣</span>
              <span>Maniac (Super Aggressive)</span>
            </div>
            <p className="text-zinc-300 font-medium leading-relaxed">
              <strong>Tendency:</strong> Opens 50-70% of hands, 3-bets relentlessly with weak trash, never folds to aggression.<br/>
              <strong>Exploit:</strong> Tighten value range, eliminate light bluffs, trap with top pairs & strong broadways.
            </p>
          </div>

          <div className="bg-blue-950/40 p-4 rounded-m3-xs border border-blue-500/50 space-y-1.5">
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <span className="text-base">🦥</span>
              <span>Calling Station (Passive)</span>
            </div>
            <p className="text-zinc-300 font-medium leading-relaxed">
              <strong>Tendency:</strong> Over-calls opens & 3-bets with weak trash, almost never raises without absolute nuts.<br/>
              <strong>Exploit:</strong> Value bet larger & wider. Never bluff (bluffs torch money against stations).
            </p>
          </div>

          <div className="bg-amber-950/40 p-4 rounded-m3-xs border border-amber-500/50 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <span className="text-base">🐢</span>
              <span>Ultra Tight Nit</span>
            </div>
            <p className="text-zinc-300 font-medium leading-relaxed">
              <strong>Tendency:</strong> Plays top 5-10% of hands. Folds 85%+ to open raises and 3-bets.<br/>
              <strong>Exploit:</strong> Steal their blinds continuously and 3-bet bluff heavily. Fold marginal hands when they raise.
            </p>
          </div>

          <div className="bg-purple-950/40 p-4 rounded-m3-xs border border-purple-500/50 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-300 font-bold">
              <span className="text-base">🎲</span>
              <span>Wild / Unpredictable</span>
            </div>
            <p className="text-zinc-300 font-medium leading-relaxed">
              <strong>Tendency:</strong> Erratic play, overvalues suited cards and gutshots, random huge raises.<br/>
              <strong>Exploit:</strong> Play a clean linear strategy. Focus on high-card equity and postflop positioning.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};