import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-m3-surfaceContainerLow border-t border-m3-outlineVariant/30 py-4 px-4 text-center text-xs text-m3-onSurfaceVariant">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-m3-onSurface">GTO Preflop & Morphology Trainer</span>
          <span>•</span>
          <span>Material Design 3 Architecture</span>
        </div>

        <div className="flex items-center gap-3 text-m3-onSurfaceVariant text-[11px]">
          <span>Shortcuts:</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant/30">1: Fold</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant/30">2: Call</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant/30">3: Raise</span>
          <span className="bg-m3-surfaceContainerHigh px-2 py-0.5 rounded-m3-xs font-mono text-m3-primary border border-m3-outlineVariant/30">Space: Next</span>
        </div>
      </div>
    </footer>
  );
};
