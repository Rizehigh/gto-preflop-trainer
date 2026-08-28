import React from 'react';
import { Volume2, VolumeX, Flame, Target, BookOpen, BarChart3, Layers, Spade } from 'lucide-react';

export type AppTab = 'trainer' | 'study' | 'analytics' | 'guide';

export interface NavbarProps {
  currentTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  streak: number;
  accuracy: number;
  totalHands?: number;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  streak,
  accuracy,
  soundEnabled = true,
  onToggleSound
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-m3-surfaceContainerLow/95 border-b border-m3-outlineVariant/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-m3-primary text-m3-onPrimary rounded-m3-sm flex items-center justify-center font-bold shadow">
            <Spade className="w-6 h-6 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold text-m3-onSurface tracking-tight leading-tight">
              GTO Preflop Trainer
            </h1>
            <span className="text-[11px] font-bold text-m3-primary tracking-wide uppercase">
              6-Max 100BB Preflop Strategy
            </span>
          </div>
        </div>

        {/* Tab Navigation Buttons */}
        <nav className="hidden md:flex items-center gap-1 bg-m3-surfaceContainer p-1 rounded-m3-sm border border-m3-outlineVariant/50">
          <button
            onClick={() => onTabChange('trainer')}
            className={`px-4 py-1.5 rounded-m3-xs text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === 'trainer'
                ? 'bg-m3-primary text-m3-onPrimary shadow-sm'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Trainer</span>
          </button>

          <button
            onClick={() => onTabChange('study')}
            className={`px-4 py-1.5 rounded-m3-xs text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === 'study'
                ? 'bg-m3-primary text-m3-onPrimary shadow-sm'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Range Matrix</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`px-4 py-1.5 rounded-m3-xs text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === 'analytics'
                ? 'bg-m3-primary text-m3-onPrimary shadow-sm'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytics & Leaks</span>
          </button>

          <button
            onClick={() => onTabChange('guide')}
            className={`px-4 py-1.5 rounded-m3-xs text-xs font-bold flex items-center gap-2 transition-all ${
              currentTab === 'guide'
                ? 'bg-m3-primary text-m3-onPrimary shadow-sm'
                : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceContainerHigh'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guide</span>
          </button>
        </nav>

        {/* Right Stats & Audio */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/80 border border-amber-500/50 rounded-m3-xs text-xs font-bold text-amber-300">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{streak} Streak</span>
            </div>

            <div className="px-3 py-1 bg-m3-surfaceContainerHigh border border-m3-outlineVariant/60 rounded-m3-xs text-xs font-bold text-m3-onSurface">
              Accuracy: <span className="text-m3-primary">{accuracy}%</span>
            </div>
          </div>

          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="p-2 text-m3-onSurfaceVariant hover:text-m3-onSurface bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright rounded-m3-xs border border-m3-outlineVariant/50 transition-colors"
              title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-m3-primary" /> : <VolumeX className="w-4 h-4 text-m3-onSurfaceVariant" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden border-t border-m3-outlineVariant/40 bg-m3-surfaceContainer font-bold text-xs">
        <button
          onClick={() => onTabChange('trainer')}
          className={`flex-1 py-2 text-center ${currentTab === 'trainer' ? 'bg-m3-primary text-m3-onPrimary' : 'text-m3-onSurfaceVariant'}`}
        >
          Trainer
        </button>
        <button
          onClick={() => onTabChange('study')}
          className={`flex-1 py-2 text-center ${currentTab === 'study' ? 'bg-m3-primary text-m3-onPrimary' : 'text-m3-onSurfaceVariant'}`}
        >
          Matrix
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex-1 py-2 text-center ${currentTab === 'analytics' ? 'bg-m3-primary text-m3-onPrimary' : 'text-m3-onSurfaceVariant'}`}
        >
          Leaks
        </button>
        <button
          onClick={() => onTabChange('guide')}
          className={`flex-1 py-2 text-center ${currentTab === 'guide' ? 'bg-m3-primary text-m3-onPrimary' : 'text-m3-onSurfaceVariant'}`}
        >
          Guide
        </button>
      </div>
    </header>
  );
};
