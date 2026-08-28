import React from 'react';
import { ActionFrequencies } from '../types/poker';
import { getMorphologyInsightForHand } from '../data/morphologyData';
import { classifyHandType, formatHandCategoryLabel, getHandCombosCount } from '../utils/pokerUtils';
import { X, Sparkles, BookOpen, Layers } from 'lucide-react';

interface HandDetailModalProps {
  notation: string;
  frequencies: ActionFrequencies;
  spotName: string;
  onClose: () => void;
}

export const HandDetailModal: React.FC<HandDetailModalProps> = ({
  notation,
  frequencies,
  spotName,
  onClose
}) => {
  const handType = classifyHandType(notation);
  const insight = getMorphologyInsightForHand(notation);
  const combos = getHandCombosCount(notation);

  const raisePct = Math.round((frequencies?.raise || 0) * 100);
  const callPct = Math.round((frequencies?.call || 0) * 100);
  const foldPct = Math.round((frequencies?.fold || 0) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-m3-surfaceContainerHigh border border-m3-outlineVariant/40 rounded-m3-xl shadow-2xl overflow-hidden p-6 text-m3-onSurface">
        
        {/* M3 Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-m3-onSurfaceVariant hover:text-m3-onSurface bg-m3-surfaceContainerHighest hover:bg-m3-surfaceBright rounded-m3-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-m3-outlineVariant/30 pb-4 mb-4">
          <div className="w-14 h-14 bg-m3-primaryContainer text-m3-onPrimaryContainer border border-m3-primary/40 rounded-m3-md flex items-center justify-center text-2xl font-bold shadow-sm">
            {notation}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-m3-primary font-medium">{spotName}</div>
            <h3 className="text-lg font-semibold text-m3-onSurface">{notation} Breakdown</h3>
            <p className="text-xs text-m3-onSurfaceVariant">{formatHandCategoryLabel(handType)} • {combos} Combinations</p>
          </div>
        </div>

        {/* Action Frequencies Bar */}
        <div className="mb-5 bg-m3-surfaceContainerLow p-4 rounded-m3-lg border border-m3-outlineVariant/30">
          <div className="text-xs font-medium text-m3-onSurfaceVariant mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-m3-primary" />
            GTO Action Frequencies
          </div>
          
          <div className="h-3 w-full bg-m3-surfaceContainerHighest rounded-m3-full overflow-hidden flex mb-3">
            {raisePct > 0 && <div style={{ width: `${raisePct}%` }} className="bg-red-500 text-[9px] font-semibold text-white flex items-center justify-center">{raisePct}%</div>}
            {callPct > 0 && <div style={{ width: `${callPct}%` }} className="bg-emerald-500 text-[9px] font-semibold text-m3-surface flex items-center justify-center">{callPct}%</div>}
            {foldPct > 0 && <div style={{ width: `${foldPct}%` }} className="bg-m3-outline text-[9px] font-semibold text-m3-surface flex items-center justify-center">{foldPct}%</div>}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-medium">
            <div className="p-2 bg-m3-pokerRaiseContainer/40 border border-m3-pokerRaiseContainer rounded-m3-sm text-m3-pokerRaise">
              Raise: {raisePct}%
            </div>
            <div className="p-2 bg-m3-primaryContainer/40 border border-m3-primaryContainer rounded-m3-sm text-m3-onPrimaryContainer">
              Call: {callPct}%
            </div>
            <div className="p-2 bg-m3-surfaceContainerHighest border border-m3-outlineVariant/40 rounded-m3-sm text-m3-onSurfaceVariant">
              Fold: {foldPct}%
            </div>
          </div>
        </div>

        {/* Morphology Educational Section */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-m3-onSurfaceVariant flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-m3-primary" />
            Hand Morphology Analysis
          </div>

          <div className="bg-m3-surfaceContainerLow p-3.5 rounded-m3-lg border border-m3-outlineVariant/30 space-y-2 text-xs">
            <div className="flex justify-between items-start border-b border-m3-outlineVariant/20 pb-1.5">
              <span className="text-m3-onSurfaceVariant font-medium">Concept:</span>
              <span className="text-m3-onSurface font-medium text-right">{insight.concept}</span>
            </div>
            <div className="flex justify-between items-start border-b border-m3-outlineVariant/20 pb-1.5">
              <span className="text-m3-onSurfaceVariant font-medium">Blockers:</span>
              <span className="text-m3-onSurface text-right max-w-[240px]">{insight.blockerValue}</span>
            </div>
            <div className="flex justify-between items-start border-b border-m3-outlineVariant/20 pb-1.5">
              <span className="text-m3-onSurfaceVariant font-medium">Suitedness:</span>
              <span className="text-m3-onSurface text-right max-w-[240px]">{insight.suitedness}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-m3-onSurfaceVariant font-medium">Realization:</span>
              <span className="text-m3-primary font-medium text-right">{insight.equityRealization}</span>
            </div>
          </div>

          <div className="p-3 bg-m3-primaryContainer/30 border border-m3-primary/30 rounded-m3-lg text-xs text-m3-onSurfaceVariant leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-m3-primary shrink-0 mt-0.5" />
            <span>{insight.explanation}</span>
          </div>
        </div>

        {/* M3 Action Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-m3-secondaryContainer text-m3-onSecondaryContainer hover:bg-m3-secondaryContainer/80 font-medium rounded-m3-full transition-colors text-xs"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
};
