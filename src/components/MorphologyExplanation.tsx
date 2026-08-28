import React from 'react';
import { ActionFrequencies, ActionType, Card, HandCategoryType } from '../types/poker';
import { getMorphologyInsightForHand } from '../data/morphologyData';
import { getHandCombosCount } from '../utils/pokerUtils';
import { CheckCircle2, XCircle, Lightbulb, Shield, Zap, Sparkles, Compass } from 'lucide-react';

interface MorphologyExplanationProps {
  isCorrect: boolean;
  userAction: ActionType;
  optimalAction: ActionType;
  message: string;
  handNotation: string;
  cards: Card[];
  handType: HandCategoryType;
  frequencies: ActionFrequencies;
  spotName: string;
  onNext: () => void;
}

export const MorphologyExplanation: React.FC<MorphologyExplanationProps> = ({
  isCorrect,
  userAction,
  optimalAction,
  message,
  handNotation,
  cards,
  handType,
  frequencies,
  spotName,
  onNext
}) => {
  const insight = getMorphologyInsightForHand(handNotation);
  const combos = getHandCombosCount(handNotation);

  const raisePct = Math.round((frequencies?.raise || 0) * 100);
  const callPct = Math.round((frequencies?.call || 0) * 100);
  const foldPct = Math.round((frequencies?.fold || 0) * 100);

  return (
    <div className="w-full max-w-xl bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-5 shadow-lg space-y-4 animate-fadeIn my-2">
      {/* Header Feedback Banner */}
      <div
        className={`p-4 rounded-m3-lg border flex items-center justify-between shadow-sm ${
          isCorrect
            ? 'bg-m3-primaryContainer/50 border-m3-primary/40 text-m3-onPrimaryContainer'
            : 'bg-m3-errorContainer/50 border-m3-error/40 text-m3-onErrorContainer'
        }`}
      >
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle2 className="w-7 h-7 text-m3-primary shrink-0" />
          ) : (
            <XCircle className="w-7 h-7 text-m3-error shrink-0" />
          )}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
              {isCorrect ? 'Correct Play' : 'GTO Inaccuracy'}
            </div>
            <div className="text-xs sm:text-sm font-semibold">{message}</div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-4 py-2 bg-m3-primary text-m3-onPrimary font-semibold rounded-m3-full shadow-sm hover:shadow-md transition-all shrink-0 text-xs flex items-center gap-1.5 active:scale-95"
        >
          <span>Next Hand</span>
          <span className="text-[10px] opacity-75 hidden sm:inline">(Space)</span>
        </button>
      </div>

      {/* Frequencies Bar */}
      <div className="bg-m3-surfaceContainerHigh p-3.5 rounded-m3-lg border border-m3-outlineVariant/30 space-y-2">
        <div className="flex justify-between items-center text-xs font-medium text-m3-onSurfaceVariant">
          <span>GTO Solution for {handNotation} ({combos} combos)</span>
          <span className="text-m3-primary font-semibold">{spotName}</span>
        </div>
        <div className="h-3 w-full bg-m3-surfaceContainerHighest rounded-m3-full overflow-hidden flex">
          {raisePct > 0 && <div style={{ width: `${raisePct}%` }} className="bg-red-500 text-[9px] font-semibold text-white flex items-center justify-center">{raisePct}%</div>}
          {callPct > 0 && <div style={{ width: `${callPct}%` }} className="bg-emerald-500 text-[9px] font-semibold text-m3-surface flex items-center justify-center">{callPct}%</div>}
          {foldPct > 0 && <div style={{ width: `${foldPct}%` }} className="bg-m3-outline text-[9px] font-semibold text-m3-surface flex items-center justify-center">{foldPct}%</div>}
        </div>
      </div>

      {/* Morphology Educational Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-m3-primary">
          <Lightbulb className="w-4 h-4 text-m3-primary" />
          <span>Hand Morphology & Strategic Concept</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-md border border-m3-outlineVariant/30 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-m3-onSurface">Core Concept</div>
              <div className="text-m3-onSurfaceVariant mt-0.5">{insight.concept}</div>
            </div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-md border border-m3-outlineVariant/30 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-m3-onSurface">Blocker Value</div>
              <div className="text-m3-onSurfaceVariant mt-0.5">{insight.blockerValue}</div>
            </div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-md border border-m3-outlineVariant/30 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-m3-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-m3-onSurface">Suitedness & Draw</div>
              <div className="text-m3-onSurfaceVariant mt-0.5">{insight.suitedness}</div>
            </div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-md border border-m3-outlineVariant/30 flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-m3-onSurface">Equity Realization</div>
              <div className="text-m3-primary mt-0.5 font-medium">{insight.equityRealization}</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-m3-surfaceContainerHigh border border-m3-outlineVariant/30 rounded-m3-md text-xs text-m3-onSurfaceVariant leading-relaxed italic">
          "{insight.explanation}"
        </div>
      </div>
    </div>
  );
};
