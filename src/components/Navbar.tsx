import React from 'react';
import { Volume2, VolumeX, Flame, Target, BookOpen, Grid, Dumbbell, BarChart3 } from 'lucide-react';

export type AppTab = 'trainer' | 'study' | 'analytics' | 'guide';

interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  streak: number;
  accuracy: number;
  totalHands: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  streak,
  accuracy,
  totalHands,
  soundEnabled,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-m3-surfaceContainerLow/90 backdrop-blur-md border-b border-m3-outlineVariant/40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo & M3 Header */}
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => onTabChange('trainer')}>
          <div className="w-10 h-10 bg-m3-primaryContainer text-m3-onPrimaryContainer rounded-m3-md flex items-center justify-center font-bold text-xl shadow-sm border border-m3-outlineVariant/30">
            ♠️
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight text-m3-onSurface flex items-center gap-2">
              <span>GTO Preflop</span>
              <span className="text-[11px] font-medium px-2 py-0.5 bg-m3-secondaryContainer text-m3-onSecondaryContainer rounded-m3-full border border-m3-outlineVariant/40">
                Material 3
              </span>
            </h1>
            <p className="text-xs text-m3-onSurfaceVariant">Hand Morphology & Range Trainer</p>
          </div>
        </div>

        {/* M3 Segmented Navigation Bar */}
        <nav className="flex items-center p-1 bg-m3-surfaceContainerHighest/70 rounded-m3-full border border-m3-outlineVariant/30 shadow-inner">
          <button
            onClick={() => onTabChange('trainer')}
            className={`px-4 py-1.5 rounded-m3-full text-xs font-medium transition-all flex items-center gap-2 ${
              currentTab === 'trainer'
                ? 'bg-m3-secondaryContainer text-m3-onSecondaryContainer shadow-sm font-semibold'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh/50'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Trainer</span>
          </button>

          <button
            onClick={() => onTabChange('study')}
            className={`px-4 py-1.5 rounded-m3-full text-xs font-medium transition-all flex items-center gap-2 ${
              currentTab === 'study'
                ? 'bg-m3-secondaryContainer text-m3-onSecondaryContainer shadow-sm font-semibold'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh/50'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Explorer</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`px-4 py-1.5 rounded-m3-full text-xs font-medium transition-all flex items-center gap-2 ${
              currentTab === 'analytics'
                ? 'bg-m3-secondaryContainer text-m3-onSecondaryContainer shadow-sm font-semibold'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh/50'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Leaks & Stats</span>
          </button>

          <button
            onClick={() => onTabChange('guide')}
            className={`px-4 py-1.5 rounded-m3-full text-xs font-medium transition-all flex items-center gap-2 ${
              currentTab === 'guide'
                ? 'bg-m3-secondaryContainer text-m3-onSecondaryContainer shadow-sm font-semibold'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </nav>

        {/* Right M3 Status Chips & Actions */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-m3-surfaceContainerHigh border border-m3-outlineVariant/40 rounded-m3-full text-xs font-medium text-amber-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>{streak} Streak</span>
          </div>

          <div className="px-3 py-1 bg-m3-surfaceContainerHigh border border-m3-outlineVariant/40 rounded-m3-full text-xs font-medium text-m3-onSurface flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-m3-primary" />
            <span>{accuracy}% ({totalHands})</span>
          </div>

          <button
            onClick={onToggleSound}
            className="p-2 bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright text-m3-onSurfaceVariant hover:text-m3-onSurface rounded-m3-full border border-m3-outlineVariant/40 transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-m3-primary" /> : <VolumeX className="w-4 h-4 text-m3-outline" />}
          </button>
        </div>

      </div>
    </header>
  );
};
