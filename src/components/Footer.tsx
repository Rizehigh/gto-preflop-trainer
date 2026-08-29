import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-m3-surfaceContainerLow border-t border-m3-outlineVariant/60 py-4 px-4 text-center text-xs text-m3-onSurfaceVariant">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-medium">
        <div className="flex items-center gap-2">
          <span className="font-bold text-m3-onSurface">GTO Preflop & Morphology Trainer</span>
          <span>•</span>
          <span>6–10 Max 100BB GTO Solver & Range Morphology Engine</span>
        </div>

        <div className="flex items-center gap-3 text-m3-onSurfaceVariant text-[11px] font-semibold">
          <span>Shortcuts:</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant">1: Fold</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant">2: Call</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant">3: Raise</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant">H: Hint</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant">Space: Next</span>
        </div>
      </div>
    </footer>
  );
};
