import React, { useState, useEffect } from 'react';
import { AppTab, Navbar } from './components/Navbar';
import { TrainerTab } from './components/TrainerTab';
import { StudyTab } from './components/StudyTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { GuideTab } from './components/GuideTab';
import { Footer } from './components/Footer';
import { HandAttempt, HandCategoryType, Position, SpotCategory, UserStats } from './types/poker';
import { sounds } from './utils/soundEffects';

const INITIAL_STATS: UserStats = {
  totalAttempts: 0,
  correctAttempts: 0,
  streak: 0,
  bestStreak: 0,
  byPosition: {
    UTG: { total: 0, correct: 0 },
    HJ: { total: 0, correct: 0 },
    CO: { total: 0, correct: 0 },
    BTN: { total: 0, correct: 0 },
    SB: { total: 0, correct: 0 },
    BB: { total: 0, correct: 0 }
  },
  byCategory: {
    rfi: { total: 0, correct: 0 },
    facing_open: { total: 0, correct: 0 },
    facing_3bet: { total: 0, correct: 0 }
  },
  byHandType: {
    pair: { total: 0, correct: 0 },
    suited_broadway: { total: 0, correct: 0 },
    suited_connector: { total: 0, correct: 0 },
    suited_gapper: { total: 0, correct: 0 },
    suited_wheel: { total: 0, correct: 0 },
    offsuit_broadway: { total: 0, correct: 0 },
    offsuit_trash: { total: 0, correct: 0 },
    suited_trash: { total: 0, correct: 0 }
  },
  attemptsHistory: []
};

export function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('trainer');
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gto_preflop_stats');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse saved stats', e);
        }
      }
    }
    return INITIAL_STATS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [leakPosition, setLeakPosition] = useState<Position | null>(null);

  // Persist stats to localStorage
  useEffect(() => {
    localStorage.setItem('gto_preflop_stats', JSON.stringify(stats));
  }, [stats]);

  const handleRecordAttempt = (attempt: HandAttempt) => {
    setStats((prev) => {
      const newTotal = prev.totalAttempts + 1;
      const newCorrect = prev.correctAttempts + (attempt.isCorrect ? 1 : 0);
      const newStreak = attempt.isCorrect ? prev.streak + 1 : 0;
      const newBestStreak = Math.max(prev.bestStreak, newStreak);

      const posData = prev.byPosition[attempt.heroPosition] || { total: 0, correct: 0 };
      const updatedByPos = {
        ...prev.byPosition,
        [attempt.heroPosition]: {
          total: posData.total + 1,
          correct: posData.correct + (attempt.isCorrect ? 1 : 0)
        }
      };

      const catData = prev.byCategory[attempt.category] || { total: 0, correct: 0 };
      const updatedByCat = {
        ...prev.byCategory,
        [attempt.category]: {
          total: catData.total + 1,
          correct: catData.correct + (attempt.isCorrect ? 1 : 0)
        }
      };

      const typeData = prev.byHandType[attempt.handType] || { total: 0, correct: 0 };
      const updatedByType = {
        ...prev.byHandType,
        [attempt.handType]: {
          total: typeData.total + 1,
          correct: typeData.correct + (attempt.isCorrect ? 1 : 0)
        }
      };

      return {
        totalAttempts: newTotal,
        correctAttempts: newCorrect,
        streak: newStreak,
        bestStreak: newBestStreak,
        byPosition: updatedByPos,
        byCategory: updatedByCat,
        byHandType: updatedByType,
        attemptsHistory: [attempt, ...prev.attemptsHistory].slice(0, 50)
      };
    });
  };

  const handleResetStats = () => {
    if (confirm('Are you sure you want to reset all training statistics and leak history?')) {
      setStats(INITIAL_STATS);
      localStorage.removeItem('gto_preflop_stats');
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.setEnabled(next);
  };

  const handleSelectLeakPosition = (pos: Position) => {
    setLeakPosition(pos);
    setCurrentTab('trainer');
  };

  const accuracyPct = stats.totalAttempts > 0
    ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-500 selection:text-slate-950">
      <div>
        <Navbar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            if (tab !== 'trainer') setLeakPosition(null);
          }}
          streak={stats.streak}
          accuracy={accuracyPct}
          totalHands={stats.totalAttempts}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />

        <main className="max-w-7xl mx-auto px-4 py-6">
          {currentTab === 'trainer' && (
            <TrainerTab
              onRecordAttempt={handleRecordAttempt}
              leakPosition={leakPosition}
            />
          )}

          {currentTab === 'study' && <StudyTab />}

          {currentTab === 'analytics' && (
            <AnalyticsTab
              stats={stats}
              onResetStats={handleResetStats}
              onSelectLeakPosition={handleSelectLeakPosition}
            />
          )}

          {currentTab === 'guide' && <GuideTab />}
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
