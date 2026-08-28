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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-m3-surfaceContainerHigh border border-m3-outline rounded-m3-md shadow-2xl overflow-hidden p-6 text-m3-onSurface">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-m3-onSurfaceVariant hover:text-m3-onSurface bg-m3-surfaceContainerHighest hover:bg-m3-surfaceBright rounded-m3-xs transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-m3-outlineVariant pb-4 mb-4">
          <div className="w-14 h-14 bg-m3-primaryContainer text-m3-onPrimaryContainer border border-m3-primary rounded-m3-sm flex items-center justify-center text-2xl font-bold shadow-sm">
            {notation}
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-m3-primary font-bold">{spotName}</div>
            <h3 className="text-lg font-bold text-m3-onSurface">{notation} Breakdown</h3>
            <p className="text-xs text-m3-onSurfaceVariant font-medium">{formatHandCategoryLabel(handType)} • {combos} Combinations</p>
          </div>
        </div>

        {/* Action Frequencies Bar */}
        <div className="mb-5 bg-m3-surfaceContainerLow p-4 rounded-m3-sm border border-m3-outlineVariant">
          <div className="text-xs font-bold text-m3-onSurfaceVariant mb-2 flex items-center gap-1.5 uppercase tracking-wide">
            <Layers className="w-3.5 h-3.5 text-m3-primary" />
            GTO Action Frequencies
          </div>
          
          <div className="h-4 w-full bg-m3-surfaceContainerHighest rounded-m3-xs overflow-hidden flex mb-3 border border-m3-outlineVariant">
            {raisePct > 0 && <div style={{ width: `${raisePct}%` }} className="bg-red-600 text-[10px] font-bold text-white flex items-center justify-center">{raisePct}%</div>}
            {callPct > 0 && <div style={{ width: `${callPct}%` }} className="bg-emerald-600 text-[10px] font-bold text-white flex items-center justify-center">{callPct}%</div>}
            {foldPct > 0 && <div style={{ width: `${foldPct}%` }} className="bg-zinc-700 text-[10px] font-bold text-zinc-200 flex items-center justify-center">{foldPct}%</div>}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div className="p-2 bg-red-950/80 border border-red-500/60 rounded-m3-xs text-red-200">
              Raise: {raisePct}%
            </div>
            <div className="p-2 bg-emerald-950/80 border border-emerald-500/60 rounded-m3-xs text-emerald-200">
              Call: {callPct}%
            </div>
            <div className="p-2 bg-zinc-800 border border-zinc-600 rounded-m3-xs text-zinc-300">
              Fold: {foldPct}%
            </div>
          </div>
        </div>

        {/* Morphology Educational Section */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-m3-onSurfaceVariant flex items-center gap-1.5 uppercase tracking-wide">
            <BookOpen className="w-3.5 h-3.5 text-m3-primary" />
            Hand Morphology Analysis
          </div>

          <div className="bg-m3-surfaceContainerLow p-3.5 rounded-m3-sm border border-m3-outlineVariant space-y-2 text-xs font-medium">
            <div className="flex justify-between items-start border-b border-m3-outlineVariant/40 pb-1.5">
              <span className="text-m3-onSurfaceVariant">Concept:</span>
              <span className="text-m3-onSurface font-bold text-right">{insight.concept}</span>
            </div>
            <div className="flex justify-between items-start border-b border-m3-outlineVariant/40 pb-1.5">
              <span className="text-m3-onSurfaceVariant">Blockers:</span>
              <span className="text-m3-onSurface text-right max-w-[240px]">{insight.blockerValue}</span>
            </div>
            <div className="flex justify-between items-start border-b border-m3-outlineVariant/40 pb-1.5">
              <span className="text-m3-onSurfaceVariant">Suitedness:</span>
              <span className="text-m3-onSurface text-right max-w-[240px]">{insight.suitedness}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-m3-onSurfaceVariant">Realization:</span>
              <span className="text-m3-primary font-bold text-right">{insight.equityRealization}</span>
            </div>
          </div>

          <div className="p-3 bg-m3-surfaceContainerLow border border-m3-outlineVariant rounded-m3-sm text-xs text-m3-onSurfaceVariant leading-relaxed flex items-start gap-2 italic">
            <Sparkles className="w-4 h-4 text-m3-primary shrink-0 mt-0.5" />
            <span>"{insight.explanation}"</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-5 w-full py-2 bg-m3-surfaceContainerHighest hover:bg-m3-surfaceBright text-m3-onSurface font-semibold border border-m3-outlineVariant rounded-m3-xs transition-colors text-xs"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
};
