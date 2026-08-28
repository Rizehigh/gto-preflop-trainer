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
      <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-m3-primary">
            <BarChart3 className="w-4 h-4" />
            <span>Accuracy & Positional Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-m3-onSurface mt-1">Performance & Leak Detector</h2>
          <p className="text-xs text-m3-onSurfaceVariant mt-0.5">Track decision accuracy across positions, spots, and hand morphology types.</p>
        </div>

        <button
          onClick={onResetStats}
          className="px-4 py-2 bg-m3-surfaceContainerHigh hover:bg-m3-errorContainer hover:text-m3-onErrorContainer text-m3-onSurfaceVariant border border-m3-outlineVariant/40 rounded-m3-full text-xs font-medium flex items-center gap-2 transition-all shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Statistics</span>
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-semibold text-m3-onSurfaceVariant tracking-wider">Overall Accuracy</div>
          <div className="text-2xl font-bold text-m3-primary mt-1">{overallAccuracy}%</div>
          <div className="text-[10px] text-m3-onSurfaceVariant mt-0.5">{stats.correctAttempts} / {stats.totalAttempts} correct</div>
        </div>

        <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-semibold text-m3-onSurfaceVariant tracking-wider">Current Streak</div>
          <div className="text-2xl font-bold text-amber-300 mt-1 flex items-center justify-center gap-1">
            <Flame className="w-5 h-5 text-amber-400" />
            <span>{stats.streak}</span>
          </div>
          <div className="text-[10px] text-m3-onSurfaceVariant mt-0.5">Best Streak: {stats.bestStreak}</div>
        </div>

        <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-semibold text-m3-onSurfaceVariant tracking-wider">Total Hands</div>
          <div className="text-2xl font-bold text-m3-onSurface mt-1">{stats.totalAttempts}</div>
          <div className="text-[10px] text-m3-onSurfaceVariant mt-0.5">Decisions evaluated</div>
        </div>

        <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-4 shadow-sm text-center">
          <div className="text-xs uppercase font-semibold text-m3-onSurfaceVariant tracking-wider">Active Leaks</div>
          <div className="text-2xl font-bold text-m3-error mt-1">{leaks.length}</div>
          <div className="text-[10px] text-m3-onSurfaceVariant mt-0.5">Weak positions detected</div>
        </div>
      </div>

      {/* Leak Alert Box */}
      {leaks.length > 0 && (
        <div className="bg-m3-errorContainer/40 border border-m3-error/40 rounded-m3-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-m3-onErrorContainer font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Preflop Positional Leaks Identified</span>
          </div>
          <p className="text-xs text-m3-onSurface">
            Your decision accuracy drops below threshold in the following seat positions:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
            {leaks.map((leak) => (
              <div
                key={leak.position}
                className="bg-m3-surfaceContainerHigh border border-m3-outlineVariant/40 rounded-m3-lg p-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-m3-onSurface">{formatPositionLabel(leak.position)}</div>
                  <div className="text-xs text-m3-error font-semibold mt-0.5">{leak.accuracy}% Accuracy ({leak.total} hands)</div>
                </div>

                <button
                  onClick={() => onSelectLeakPosition(leak.position)}
                  className="px-3 py-1 bg-m3-errorContainer text-m3-onErrorContainer hover:bg-m3-errorContainer/80 rounded-m3-full text-xs font-medium transition-all shadow-sm flex items-center gap-1"
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
        <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
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
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-m3-onSurface flex items-center gap-2">
                      <span className="w-8 font-bold text-m3-primary">{pos}</span>
                      <span className="text-m3-onSurfaceVariant font-normal">({data.correct}/{data.total})</span>
                    </span>
                    <span className={isWeak ? 'text-m3-error font-bold' : 'text-m3-primary font-bold'}>
                      {acc}% {isWeak ? '⚠️ Leak' : ''}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-m3-surfaceContainerHighest rounded-m3-full overflow-hidden border border-m3-outlineVariant/20">
                    <div
                      style={{ width: `${acc}%` }}
                      className={`h-full rounded-m3-full transition-all duration-300 ${
                        isWeak ? 'bg-m3-error' : acc >= 80 ? 'bg-m3-primary' : 'bg-amber-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* By Morphology */}
        <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-semibold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-m3-primary" />
            <span>Accuracy by Hand Morphology</span>
          </h3>

          <div className="space-y-3">
            {(Object.keys(stats.byHandType) as HandCategoryType[]).map((cat) => {
              const data = stats.byHandType[cat];
              const acc = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-m3-onSurface">
                      {formatHandCategoryLabel(cat)} <span className="text-m3-onSurfaceVariant font-normal">({data.total})</span>
                    </span>
                    <span className="text-m3-primary font-bold">{acc}%</span>
                  </div>

                  <div className="h-2 w-full bg-m3-surfaceContainerHighest rounded-m3-full overflow-hidden border border-m3-outlineVariant/20">
                    <div
                      style={{ width: `${acc}%` }}
                      className="h-full bg-m3-secondaryContainer rounded-m3-full transition-all duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* History Log */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outlineVariant/40 rounded-m3-xl p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-semibold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-m3-primary" />
          <span>Hand History Log ({stats.attemptsHistory.length})</span>
        </h3>

        {stats.attemptsHistory.length === 0 ? (
          <p className="text-xs text-m3-onSurfaceVariant italic">No hands played yet. Start testing in the Trainer tab!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-m3-outlineVariant/30 text-m3-onSurfaceVariant font-semibold uppercase tracking-wider">
                  <th className="py-2 px-3">Spot</th>
                  <th className="py-2 px-3">Position</th>
                  <th className="py-2 px-3">Hand</th>
                  <th className="py-2 px-3">Your Pick</th>
                  <th className="py-2 px-3">GTO Optimal</th>
                  <th className="py-2 px-3">Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-m3-outlineVariant/20 font-medium">
                {stats.attemptsHistory.slice(0, 15).map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-m3-surfaceContainerHigh/40">
                    <td className="py-2.5 px-3 text-m3-onSurface">{attempt.spotName}</td>
                    <td className="py-2.5 px-3 text-m3-primary font-bold">{attempt.heroPosition}</td>
                    <td className="py-2.5 px-3 font-bold text-amber-300">{attempt.handNotation}</td>
                    <td className="py-2.5 px-3 uppercase text-m3-onSurface">{attempt.userAction}</td>
                    <td className="py-2.5 px-3 uppercase text-m3-onSurfaceVariant">{attempt.optimalAction}</td>
                    <td className="py-2.5 px-3">
                      {attempt.isCorrect ? (
                        <span className="px-2.5 py-0.5 bg-m3-primaryContainer text-m3-onPrimaryContainer border border-m3-primary/30 rounded-m3-full text-[11px] font-semibold">
                          Correct
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-m3-errorContainer text-m3-onErrorContainer border border-m3-error/30 rounded-m3-full text-[11px] font-semibold">
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
