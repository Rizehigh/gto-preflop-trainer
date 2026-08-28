import React from 'react';
import { ActionFrequencies } from '../types/poker';
import { getMorphologyInsightForHand } from '../data/morphologyData';
import { classifyHandType, formatHandCategoryLabel, getHandCombosCount } from '../utils/pokerUtils';
import { X, Sparkles, BookOpen, Layers, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 border-b border-slate-800 pb-4 mb-4">
          <div className="w-16 h-16 bg-slate-800 border-2 border-emerald-500/50 rounded-xl flex items-center justify-center text-3xl font-black text-emerald-400 shadow-inner">
            {notation}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">{spotName}</div>
            <h3 className="text-xl font-bold text-slate-100">{notation} Breakdown</h3>
            <p className="text-xs text-slate-400">{formatHandCategoryLabel(handType)} • {combos} Combinations</p>
          </div>
        </div>

        {/* Action Frequencies Bar */}
        <div className="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" />
            GTO Action Frequencies
          </div>
          
          <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden flex mb-3">
            {raisePct > 0 && (
              <div
                style={{ width: `${raisePct}%` }}
                className="bg-red-500 text-[10px] font-bold text-white flex items-center justify-center"
              >
                {raisePct > 15 ? `${raisePct}%` : ''}
              </div>
            )}
            {callPct > 0 && (
              <div
                style={{ width: `${callPct}%` }}
                className="bg-emerald-500 text-[10px] font-bold text-slate-950 flex items-center justify-center"
              >
                {callPct > 15 ? `${callPct}%` : ''}
              </div>
            )}
            {foldPct > 0 && (
              <div
                style={{ width: `${foldPct}%` }}
                className="bg-slate-700 text-[10px] font-bold text-slate-300 flex items-center justify-center"
              >
                {foldPct > 15 ? `${foldPct}%` : ''}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
            <div className="p-2 bg-red-950/40 border border-red-800/40 rounded-lg text-red-300">
              Raise: {raisePct}%
            </div>
            <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded-lg text-emerald-300">
              Call: {callPct}%
            </div>
            <div className="p-2 bg-slate-800/60 border border-slate-700/50 rounded-lg text-slate-300">
              Fold: {foldPct}%
            </div>
          </div>
        </div>

        {/* Morphology Educational Section */}
        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Hand Morphology Analysis
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between items-start border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 font-medium">Concept:</span>
              <span className="text-slate-200 font-semibold text-right">{insight.concept}</span>
            </div>
            <div className="flex justify-between items-start border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 font-medium">Blocker Value:</span>
              <span className="text-slate-200 font-medium text-right max-w-[240px]">{insight.blockerValue}</span>
            </div>
            <div className="flex justify-between items-start border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 font-medium">Suitedness & Draw:</span>
              <span className="text-slate-200 font-medium text-right max-w-[240px]">{insight.suitedness}</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-slate-400 font-medium">Equity Realization:</span>
              <span className="text-emerald-400 font-medium text-right">{insight.equityRealization}</span>
            </div>
          </div>

          <div className="p-3 bg-emerald-950/30 border border-emerald-500/20 rounded-xl text-xs text-slate-300 leading-relaxed flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{insight.explanation}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-sm"
        >
          Close Breakdown
        </button>
      </div>
    </div>
  );
};
