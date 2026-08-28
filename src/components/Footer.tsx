import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-400">GTO Preflop & Morphology Trainer</span>
          <span>•</span>
          <span>6-Max 100BB GTO Solution Engine</span>
        </div>

        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span>Keyboard Shortcuts:</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-emerald-400">1: Fold</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-emerald-400">2: Call</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-emerald-400">3: Raise</span>
          <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono text-emerald-400">Space: Next Hand</span>
        </div>
      </div>
    </footer>
  );
};
