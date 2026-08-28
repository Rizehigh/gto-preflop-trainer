import React from 'react';
import { Volume2, VolumeX, Flame, Target, BookOpen, Grid, Dumbbell, BarChart3 } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

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
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('trainer')}>
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20 border border-emerald-400/40">
            ♠️
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>GTO Preflop</span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full">
                Beginner Edition
              </span>
            </h1>
            <p className="text-xs text-slate-400">Hand Morphology & Range Trainer</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onTabChange('trainer')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'trainer'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Trainer</span>
          </button>

          <button
            onClick={() => onTabChange('study')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'study'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Range Explorer</span>
          </button>

          <button
            onClick={() => onTabChange('analytics')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'analytics'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Leaks & Stats</span>
          </button>

          <button
            onClick={() => onTabChange('guide')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'guide'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guide</span>
          </button>
        </nav>

        {/* Right Stats & Audio Bar */}
        <div className="flex items-center gap-3">
          {/* Streak Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/40 border border-amber-500/30 rounded-lg text-xs font-bold text-amber-400">
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{streak} Streak</span>
          </div>

          {/* Accuracy Indicator */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>{accuracy}% Accuracy</span>
            <span className="text-[10px] text-slate-500">({totalHands})</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Mute Sounds' : 'Enable Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>

      </div>
    </header>
  );
};
