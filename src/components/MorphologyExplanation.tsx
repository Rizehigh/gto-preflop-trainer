import React from 'react';
import { ActionFrequencies, ActionType, Card, HandCategoryType } from '../types/poker';
import { getMorphologyInsightForHand } from '../data/morphologyData';
import { getHandCombosCount } from '../utils/pokerUtils';
import { OpponentProfile, ExploitResult } from '../data/opponentProfiles';
import { CheckCircle2, XCircle, Lightbulb, Shield, Zap, Sparkles, Compass, Target, AlertTriangle } from 'lucide-react';

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
  opponentProfile?: OpponentProfile | null;
  exploitResult?: ExploitResult | null;
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
  onNext,
  opponentProfile,
  exploitResult
}) => {
  const insight = getMorphologyInsightForHand(handNotation);
  const combos = getHandCombosCount(handNotation);

  const raisePct = Math.round((frequencies?.raise || 0) * 100);
  const callPct = Math.round((frequencies?.call || 0) * 100);
  const foldPct = Math.round((frequencies?.fold || 0) * 100);

  return (
    <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 sm:p-5 shadow-lg space-y-4 animate-fadeIn">
      {/* Header Feedback Banner */}
      <div
        className={`p-4 rounded-m3-sm border flex items-center justify-between shadow-sm ${
          isCorrect
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-100'
            : 'bg-red-950/90 border-red-500 text-red-100'
        }`}
      >
        <div className="flex items-center gap-3">
          {isCorrect ? (
            <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
          ) : (
            <XCircle className="w-7 h-7 text-red-400 shrink-0" />
          )}
          <div>
            <div className="text-sm uppercase tracking-wider font-extrabold text-white flex items-center gap-1.5">
              <span>{isCorrect ? 'Correct Play' : 'Suboptimal Play'}</span>
              {opponentProfile && (
                <span className={`px-1.5 py-0.5 rounded text-sm ${opponentProfile.badgeColor}`}>
                  {opponentProfile.avatar} vs {opponentProfile.shortName}
                </span>
              )}
            </div>
            <div className="text-sm sm:text-sm font-semibold">{message}</div>
          </div>
        </div>

        <button
          onClick={onNext}
          className="px-4 py-2 bg-m3-primary hover:bg-amber-300 text-m3-onPrimary font-extrabold rounded-m3-xs shadow transition-all shrink-0 text-sm flex items-center gap-1.5 active:scale-95"
        >
          <span>Next Hand</span>
          <span className="text-sm opacity-80 hidden sm:inline">(Space)</span>
        </button>
      </div>

      {/* Exploitative Strategy Card (when in Exploitative Mode) */}
      {opponentProfile && exploitResult && (
        <div className={`p-4 rounded-m3-sm border space-y-2 text-sm ${opponentProfile.bgColor} ${opponentProfile.borderColor}`}>
          <div className="flex items-center justify-between font-bold border-b pb-2 border-white/10">
            <div className="flex items-center gap-2 text-white">
              <Target className="w-4 h-4 text-amber-400" />
              <span>Exploitative Strategy vs {opponentProfile.name}</span>
            </div>
            <span className={`px-2 py-0.5 rounded font-extrabold text-sm ${opponentProfile.badgeColor}`}>
              Optimal Exploit: {exploitResult.optimalExploitAction.toUpperCase()}
            </span>
          </div>

          <div className="space-y-1.5 font-medium text-zinc-200">
            <p><strong className="text-amber-300">Exploit Analysis:</strong> {exploitResult.exploitReasoning}</p>
            <p><strong className="text-emerald-300">EV Difference:</strong> {exploitResult.evDifferenceNote}</p>
          </div>
        </div>
      )}

      {/* Frequencies Bar */}
      <div className="bg-m3-surfaceContainerHigh p-3.5 rounded-m3-sm border border-m3-outlineVariant space-y-2">
        <div className="flex justify-between items-center text-sm font-bold text-m3-onSurfaceVariant">
          <span>GTO Baseline Solution for {handNotation} ({combos} combos)</span>
          <span className="text-m3-primary">{spotName}</span>
        </div>
        <div className="h-4 w-full bg-m3-surfaceContainerHighest rounded-m3-xs overflow-hidden flex border border-m3-outlineVariant">
          {raisePct > 0 && <div style={{ width: `${raisePct}%` }} className="bg-red-600 text-sm font-bold text-white flex items-center justify-center">{raisePct}%</div>}
          {callPct > 0 && <div style={{ width: `${callPct}%` }} className="bg-emerald-600 text-sm font-bold text-white flex items-center justify-center">{callPct}%</div>}
          {foldPct > 0 && <div style={{ width: `${foldPct}%` }} className="bg-zinc-700 text-sm font-bold text-zinc-200 flex items-center justify-center">{foldPct}%</div>}
        </div>
      </div>

      {/* Morphology Educational Grid */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-m3-primary">
          <Lightbulb className="w-4 h-4 text-m3-primary" />
          <span>Hand Morphology & Strategic Concept</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-sm border border-m3-outlineVariant flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-m3-onSurface">Core Concept</div>
              <div className="text-m3-onSurfaceVariant mt-0.5 font-medium">{insight.concept}</div>
            </div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-sm border border-m3-outlineVariant flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-m3-onSurface">Blocker Value</div>
              <div className="text-m3-onSurfaceVariant mt-0.5 font-medium">{insight.blockerValue}</div>
            </div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-sm border border-m3-outlineVariant flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-m3-primary shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-m3-onSurface">Suitedness & Draw</div>
              <div className="text-m3-onSurfaceVariant mt-0.5 font-medium">{insight.suitedness}</div>
            </div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-sm border border-m3-outlineVariant flex items-start gap-2.5">
            <Compass className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-m3-onSurface">Equity Realization</div>
              <div className="text-m3-primary font-bold mt-0.5">{insight.equityRealization}</div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-sm text-sm text-m3-onSurfaceVariant leading-relaxed italic">
          "{insight.explanation}"
        </div>
      </div>
    </div>
  );
};