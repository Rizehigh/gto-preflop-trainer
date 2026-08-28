import React from 'react';
import { HandCategoryType, Position, UserStats } from '../types/poker';
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
    <div className="w-full max-w-6xl mx-auto space-y-5">
      
      {/* Top Header Card */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-m3-primary">
            <BarChart3 className="w-4 h-4" />
            <span>Accuracy & Positional Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-m3-onSurface mt-1">Performance & Leak Detector</h2>
          <p className="text-xs text-m3-onSurfaceVariant font-medium mt-0.5">Track decision accuracy across positions, spots, and hand morphology types.</p>
        </div>

        <button
          onClick={onResetStats}
          className="px-4 py-2 bg-m3-surfaceContainerHigh hover:bg-red-950 hover:text-red-200 hover:border-red-500 text-m3-onSurface border border-m3-outlineVariant rounded-m3-xs text-xs font-bold flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Statistics</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-bold text-m3-onSurfaceVariant tracking-wider">Overall Accuracy</div>
          <div className="text-2xl font-black text-m3-primary mt-1">{overallAccuracy}%</div>
          <div className="text-[10px] text-m3-onSurfaceVariant font-medium mt-0.5">{stats.correctAttempts} / {stats.totalAttempts} correct</div>
        </div>

        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-bold text-m3-onSurfaceVariant tracking-wider">Current Streak</div>
          <div className="text-2xl font-black text-amber-300 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>{stats.streak}</span>
          </div>
          <div className="text-[10px] text-m3-onSurfaceVariant font-medium mt-0.5">Best Streak: {stats.bestStreak}</div>
        </div>

        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-bold text-m3-onSurfaceVariant tracking-wider">Total Hands</div>
          <div className="text-2xl font-black text-m3-onSurface mt-1">{stats.totalAttempts}</div>
          <div className="text-[10px] text-m3-onSurfaceVariant font-medium mt-0.5">Decisions evaluated</div>
        </div>

        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-bold text-m3-onSurfaceVariant tracking-wider">Active Leaks</div>
          <div className="text-2xl font-black text-red-400 mt-1">{leaks.length}</div>
          <div className="text-[10px] text-m3-onSurfaceVariant font-medium mt-0.5">Weak positions detected</div>
        </div>
      </div>

      {/* Leak Alert Box */}
      {leaks.length > 0 && (
        <div className="bg-red-950/70 border border-red-500 rounded-m3-md p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-red-200 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>Preflop Positional Leaks Identified</span>
          </div>
          <p className="text-xs text-red-100 font-medium">
            Your decision accuracy drops below threshold in the following seat positions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {leaks.map((leak) => (
              <div
                key={leak.position}
                className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-m3-onSurface">{formatPositionLabel(leak.position)}</div>
                  <div className="text-xs text-red-400 font-bold mt-0.5">{leak.accuracy}% Accuracy ({leak.total} hands)</div>
                </div>

                <button
                  onClick={() => onSelectLeakPosition(leak.position)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-m3-xs text-xs font-bold transition-all shadow flex items-center gap-1"
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* By Position */}
        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-m3-primary" />
            <span>Accuracy by Position</span>
          </h3>

          <div className="space-y-3">
            {positions.map((pos) => {
              const data = stats.byPosition[pos];
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
              const isWeak = data.total >= 3 && acc < 65;

              return (
                <div key={pos} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-m3-onSurface flex items-center gap-2">
                      <span className="w-8 text-m3-primary">{pos}</span>
                      <span className="text-m3-onSurfaceVariant font-medium">({data.correct}/{data.total})</span>
                    </span>
                    <span className={isWeak ? 'text-red-400' : 'text-m3-primary'}>
                      {acc}% {isWeak ? '⚠️ Leak' : ''}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-m3-surfaceContainerHighest rounded-m3-xs overflow-hidden border border-m3-outlineVariant">
                    <div
                      style={{ width: `${acc}%` }}
                      className={`h-full rounded-m3-xs transition-all duration-300 ${
                        isWeak ? 'bg-red-500' : acc >= 80 ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Morphology */}
        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-m3-primary" />
            <span>Accuracy by Hand Morphology</span>
          </h3>

          <div className="space-y-3">
            {(Object.keys(stats.byHandType) as HandCategoryType[]).map((cat) => {
              const data = stats.byHandType[cat];
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-m3-onSurface">
                      {formatHandCategoryLabel(cat)} <span className="text-m3-onSurfaceVariant font-medium">({data.total})</span>
                    </span>
                    <span className="text-m3-primary">{acc}%</span>
                  </div>

                  <div className="h-2 w-full bg-m3-surfaceContainerHighest rounded-m3-xs overflow-hidden border border-m3-outlineVariant">
                    <div
                      style={{ width: `${acc}%` }}
                      className="h-full bg-m3-primary rounded-m3-xs transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* History Log */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-m3-primary" />
          <span>Hand History Log ({stats.attemptsHistory.length})</span>
        </h3>

        {stats.attemptsHistory.length === 0 ? (
          <p className="text-xs text-m3-onSurfaceVariant italic font-medium">No hands played yet. Start testing in the Trainer tab!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-m3-outlineVariant text-m3-onSurfaceVariant font-bold uppercase tracking-wider">
                  <th className="py-2 px-3">Spot</th>
                  <th className="py-2 px-3">Position</th>
                  <th className="py-2 px-3">Hand</th>
                  <th className="py-2 px-3">Your Pick</th>
                  <th className="py-2 px-3">GTO Optimal</th>
                  <th className="py-2 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-m3-outlineVariant/50 font-semibold">
                {stats.attemptsHistory.slice(0, 15).map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-m3-surfaceContainerHigh">
                    <td className="py-2.5 px-3 text-m3-onSurface">{attempt.spotName}</td>
                    <td className="py-2.5 px-3 text-m3-primary font-bold">{attempt.heroPosition}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{attempt.handNotation}</td>
                    <td className="py-2.5 px-3 uppercase text-m3-onSurface">{attempt.userAction}</td>
                    <td className="py-2.5 px-3 uppercase text-m3-onSurfaceVariant">{attempt.optimalAction}</td>
                    <td className="py-2.5 px-3">
                      {attempt.isCorrect ? (
                        <span className="px-2.5 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-500 rounded-m3-xs text-[11px] font-bold">
                          Correct
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-red-950 text-red-300 border border-red-500 rounded-m3-xs text-[11px] font-bold">
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
