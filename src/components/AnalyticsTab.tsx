import React from 'react';
import { HandCategoryType, Position, SpotCategory, UserStats } from '../types/poker';
import { formatHandCategoryLabel, formatPositionLabel } from '../utils/pokerUtils';
import { BarChart3, AlertTriangle, ShieldCheck, RefreshCw, Flame, Target, ChevronRight, Zap } from 'lucide-react';

interface AnalyticsTabProps {
  stats: UserStats;
  onResetStats: () => void;
  onSelectLeakPosition: (pos: Position) => void;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  stats,
  onResetStats,
  onSelectLeakPosition
}) => {
  const overallAccuracy = stats.totalAttempts > 0
    ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100)
    : 0;

  // Identify Leaks (<65% accuracy with >=3 attempts)
  const leaks: { position: Position; accuracy: number; total: number }[] = [];
  const positions: Position[] = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  
  positions.forEach((pos) => {
    const data = stats.byPosition[pos];
    if (data.total >= 3) {
      const acc = Math.round((data.correct / data.total) * 100);
      if (acc < 65) {
        leaks.push({ position: pos, accuracy: acc, total: data.total });
      }
    }
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <BarChart3 className="w-4 h-4" />
            <span>Accuracy & Leak Analysis</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mt-1">Preflop Performance Dashboard</h2>
          <p className="text-xs text-slate-400 mt-0.5">Track your GTO decision accuracy across positions, spots, and hand morphology types.</p>
        </div>

        <button
          onClick={onResetStats}
          className="px-3.5 py-2 bg-slate-800 hover:bg-red-950/60 hover:text-red-300 text-slate-400 border border-slate-700 hover:border-red-800 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Statistics</span>
        </button>
      </div>

      {/* Summary KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-center">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Overall Accuracy</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">{overallAccuracy}%</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{stats.correctAttempts} / {stats.totalAttempts} correct</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-center">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Current Streak</div>
          <div className="text-3xl font-black text-amber-400 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
            <span>{stats.streak}</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Best Streak: {stats.bestStreak}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-center">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Hands Played</div>
          <div className="text-3xl font-black text-slate-100 mt-1">{stats.totalAttempts}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">GTO preflop trials</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg text-center">
          <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">Active Leaks</div>
          <div className="text-3xl font-black text-red-400 mt-1">{leaks.length}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Weak positions detected</div>
        </div>
      </div>

      {/* Leak Alert Box */}
      {leaks.length > 0 && (
        <div className="bg-red-950/40 border border-red-500/40 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2.5 text-red-400 font-bold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>Preflop Leaks Detected!</span>
          </div>
          <p className="text-xs text-slate-300">
            Based on your decision history, your GTO accuracy drops significantly in the following positions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {leaks.map((leak) => (
              <div
                key={leak.position}
                className="bg-slate-950/80 border border-red-800/60 rounded-xl p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200">{formatPositionLabel(leak.position)}</div>
                  <div className="text-xs text-red-400 font-bold mt-0.5">{leak.accuracy}% Accuracy ({leak.total} hands)</div>
                </div>

                <button
                  onClick={() => onSelectLeakPosition(leak.position)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-all shadow flex items-center gap-1"
                >
                  <span>Practice</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Accuracy By Position */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Accuracy by Position</span>
          </h3>

          <div className="space-y-3">
            {positions.map((pos) => {
              const data = stats.byPosition[pos];
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              const isWeak = data.total >= 3 && acc < 65;

              return (
                <div key={pos} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-300 flex items-center gap-2">
                      <span className="w-8 font-bold text-emerald-400">{pos}</span>
                      <span className="text-slate-400 font-normal">({data.correct}/{data.total})</span>
                    </span>
                    <span className={isWeak ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {acc}% {isWeak ? '⚠️ Leak' : ''}
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${acc}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isWeak ? 'bg-red-500' : acc >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accuracy By Hand Morphology Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span>Accuracy by Hand Morphology</span>
          </h3>

          <div className="space-y-3">
            {(Object.keys(stats.byHandType) as HandCategoryType[]).map((cat) => {
              const data = stats.byHandType[cat];
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-300">
                      {formatHandCategoryLabel(cat)} <span className="text-slate-500 font-normal">({data.total})</span>
                    </span>
                    <span className="text-emerald-400 font-bold">{acc}%</span>
                  </div>

                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${acc}%` }}
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* History Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Recent Hand History ({stats.attemptsHistory.length})</span>
        </h3>

        {stats.attemptsHistory.length === 0 ? (
          <p className="text-xs text-slate-500 italic">No hands played yet. Start testing yourself in the Trainer tab!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-2 px-3">Spot</th>
                  <th className="py-2 px-3">Position</th>
                  <th className="py-2 px-3">Hand</th>
                  <th className="py-2 px-3">Your Pick</th>
                  <th className="py-2 px-3">GTO Optimal</th>
                  <th className="py-2 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {stats.attemptsHistory.slice(0, 15).map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-950/40">
                    <td className="py-2.5 px-3 text-slate-300">{attempt.spotName}</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">{attempt.heroPosition}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{attempt.handNotation}</td>
                    <td className="py-2.5 px-3 uppercase text-slate-200">{attempt.userAction}</td>
                    <td className="py-2.5 px-3 uppercase text-slate-400">{attempt.optimalAction}</td>
                    <td className="py-2.5 px-3">
                      {attempt.isCorrect ? (
                        <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-bold">
                          Correct
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 rounded font-bold">
                          Mistake
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
