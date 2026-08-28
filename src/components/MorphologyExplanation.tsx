import React from 'react';
import { ActionFrequencies, ActionType, Card, HandCategoryType } from '../types/poker';
import { getMorphologyInsightForHand } from '../data/morphologyData';
import { formatHandCategoryLabel, getHandCombosCount } from '../utils/pokerUtils';
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
    <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl p-5 shadow-2xl space-y-4 animate-fadeIn my-4">
      {/* Header Feedback Banner */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between shadow-md ${
          isCorrect
            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
            : 'bg-red-950/60 border-red-500/40 text-red-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-red-400 shrink-0" />
          )}
          <div>
            <div className="text-xs uppercase tracking-wider font-bold opacity-80">
              {isCorrect ? 'Correct Decision!' : 'GTO Inaccuracy'}
            </div>
            <div className="text-sm sm:text-base font-bold">{message}</div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg transition-transform hover:scale-105 shadow-md shrink-0 text-sm flex items-center gap-1.5"
        >
          <span>Next Hand</span>
          <span className="text-xs opacity-75 hidden sm:inline">(Space)</span>
        </button>
      </div>

      {/* Frequencies Bar */}
      <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>GTO Range Solution for {handNotation} ({combos} combos)</span>
          <span className="text-emerald-400 font-bold">{spotName}</span>
        </div>
        <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
          {raisePct > 0 && <div style={{ width: `${raisePct}%` }} className="bg-red-500 text-[9px] font-bold text-white flex items-center justify-center">{raisePct}%</div>}
          {callPct > 0 && <div style={{ width: `${callPct}%` }} className="bg-emerald-500 text-[9px] font-bold text-slate-950 flex items-center justify-center">{callPct}%</div>}
          {foldPct > 0 && <div style={{ width: `${foldPct}%` }} className="bg-slate-700 text-[9px] font-bold text-slate-300 flex items-center justify-center">{foldPct}%</div>}
        </div>
      </div>

      {/* Morphology Educational Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <span>Hand Morphology & Why This Play Works</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Concept</div>
              <div className="text-slate-400 mt-0.5">{insight.concept}</div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Blockers & High Card</div>
              <div className="text-slate-400 mt-0.5">{insight.blockerValue}</div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Suitedness & Connectivity</div>
              <div className="text-slate-400 mt-0.5">{insight.suitedness}</div>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-slate-200">Equity Realization</div>
              <div className="text-emerald-400 mt-0.5">{insight.equityRealization}</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 leading-relaxed italic">
          "{insight.explanation}"
        </div>
      </div>
    </div>
  );
};
