import React, { useMemo } from 'react';
import { HandCategoryType, Position, UserStats } from '../types/poker';
import { formatHandCategoryLabel, formatPositionLabel } from '../utils/pokerUtils';
import { BarChart3, AlertTriangle, ShieldCheck, RefreshCw, Flame, Target, ChevronRight, Zap, TrendingUp, Activity, PieChart, Crosshair } from 'lucide-react';

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

  // === ROLLING ACCURACY HISTOGRAM (last 50 hands, 5-hand windows) ===
  const rollingAccuracy = useMemo(() => {
    const history = stats.attemptsHistory;
    if (history.length < 5) return [];
    
    const windowSize = 5;
    const maxWindows = 20;
    const recentHistory = history.slice(-maxWindows * windowSize);
    const windows: { index: number; accuracy: number; label: string }[] = [];
    
    for (let i = 0; i <= recentHistory.length - windowSize; i += windowSize) {
      const chunk = recentHistory.slice(i, i + windowSize);
      const correct = chunk.filter(a => a.isCorrect).length;
      const acc = Math.round((correct / chunk.length) * 100);
      windows.push({
        index: windows.length,
        accuracy: acc,
        label: `${i + 1}-${i + windowSize}`
      });
    }
    return windows;
  }, [stats.attemptsHistory]);

  // === ACCURACY DISTRIBUTION HISTOGRAM (buckets: 0-20, 20-40, 40-60, 60-80, 80-100) ===
  const accuracyDistribution = useMemo(() => {
    const buckets = [
      { label: '0–20%', min: 0, max: 20, count: 0, color: 'bg-red-600' },
      { label: '20–40%', min: 20, max: 40, count: 0, color: 'bg-red-500' },
      { label: '40–60%', min: 40, max: 60, count: 0, color: 'bg-amber-500' },
      { label: '60–80%', min: 60, max: 80, count: 0, color: 'bg-amber-400' },
      { label: '80–100%', min: 80, max: 101, count: 0, color: 'bg-emerald-500' }
    ];

    // Bucket per-position accuracies
    positions.forEach(pos => {
      const data = stats.byPosition[pos];
      if (data.total > 0) {
        const acc = Math.round((data.correct / data.total) * 100);
        const bucket = buckets.find(b => acc >= b.min && acc < b.max);
        if (bucket) bucket.count++;
      }
    });

    // Also bucket per-hand-type accuracies
    (Object.keys(stats.byHandType) as HandCategoryType[]).forEach(cat => {
      const data = stats.byHandType[cat];
      if (data.total > 0) {
        const acc = Math.round((data.correct / data.total) * 100);
        const bucket = buckets.find(b => acc >= b.min && acc < b.max);
        if (bucket) bucket.count++;
      }
    });

    return buckets;
  }, [stats.byPosition, stats.byHandType]);

  // === ACTION TENDENCY ANALYSIS ===
  const actionTendency = useMemo(() => {
    const history = stats.attemptsHistory;
    if (history.length === 0) return null;

    let userFolds = 0, userCalls = 0, userRaises = 0;
    let optimalFolds = 0, optimalCalls = 0, optimalRaises = 0;

    history.forEach(a => {
      if (a.userAction === 'fold') userFolds++;
      else if (a.userAction === 'call') userCalls++;
      else if (a.userAction === 'raise') userRaises++;

      if (a.optimalAction === 'fold') optimalFolds++;
      else if (a.optimalAction === 'call') optimalCalls++;
      else if (a.optimalAction === 'raise') optimalRaises++;
    });

    const total = history.length;
    return {
      userFoldPct: Math.round((userFolds / total) * 100),
      userCallPct: Math.round((userCalls / total) * 100),
      userRaisePct: Math.round((userRaises / total) * 100),
      optFoldPct: Math.round((optimalFolds / total) * 100),
      optCallPct: Math.round((optimalCalls / total) * 100),
      optRaisePct: Math.round((optimalRaises / total) * 100),
      foldDelta: Math.round((userFolds / total) * 100) - Math.round((optimalFolds / total) * 100),
      callDelta: Math.round((userCalls / total) * 100) - Math.round((optimalCalls / total) * 100),
      raiseDelta: Math.round((userRaises / total) * 100) - Math.round((optimalRaises / total) * 100),
    };
  }, [stats.attemptsHistory]);

  // === SPOT CATEGORY BREAKDOWN ===
  const categoryBreakdown = useMemo(() => {
    const cats: { key: string; label: string; total: number; correct: number }[] = [
      { key: 'rfi', label: 'Open Raise (RFI)', total: stats.byCategory.rfi.total, correct: stats.byCategory.rfi.correct },
      { key: 'facing_open', label: 'Facing Open', total: stats.byCategory.facing_open.total, correct: stats.byCategory.facing_open.correct },
      { key: 'facing_3bet', label: 'Facing 3-Bet', total: stats.byCategory.facing_3bet.total, correct: stats.byCategory.facing_3bet.correct }
    ];
    return cats;
  }, [stats.byCategory]);

  const maxDistCount = Math.max(...accuracyDistribution.map(b => b.count), 1);
  const maxRolling = rollingAccuracy.length > 0 ? Math.max(...rollingAccuracy.map(w => w.accuracy), 1) : 100;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-5">
      
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

      {/* ============================================================= */}
      {/* ROLLING ACCURACY CHART + ACCURACY DISTRIBUTION HISTOGRAM ROW  */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Rolling Accuracy Line Chart (bar histogram) */}
        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-m3-primary" />
            <span>Rolling Accuracy (5-Hand Windows)</span>
          </h3>

          {rollingAccuracy.length === 0 ? (
            <p className="text-xs text-m3-onSurfaceVariant italic font-medium py-4">Play at least 5 hands to see your accuracy trend.</p>
          ) : (
            <div className="space-y-2">
              {/* Chart area */}
              <div className="flex items-end gap-1 h-36 bg-zinc-950 rounded-m3-xs p-3 border border-m3-outlineVariant">
                {rollingAccuracy.map((w) => {
                  const heightPct = (w.accuracy / 100) * 100;
                  const barColor = w.accuracy >= 80 ? 'bg-emerald-500' : w.accuracy >= 60 ? 'bg-amber-400' : w.accuracy >= 40 ? 'bg-amber-600' : 'bg-red-500';
                  return (
                    <div key={w.index} className="flex-1 flex flex-col items-center justify-end h-full gap-0.5" title={`Hands ${w.label}: ${w.accuracy}%`}>
                      <span className="text-[8px] font-bold text-m3-onSurfaceVariant">{w.accuracy}%</span>
                      <div 
                        className={`w-full rounded-t-sm ${barColor} transition-all duration-300`}
                        style={{ height: `${Math.max(heightPct, 3)}%` }}
                      />
                    </div>
                  );
                })}
              </div>
              {/* X-axis labels */}
              <div className="flex gap-1">
                {rollingAccuracy.map((w) => (
                  <div key={w.index} className="flex-1 text-center text-[7px] text-m3-onSurfaceVariant font-mono font-bold truncate">
                    {w.label}
                  </div>
                ))}
              </div>
              {/* Rolling trend summary */}
              {rollingAccuracy.length >= 2 && (
                <div className="text-[11px] text-m3-onSurfaceVariant font-medium flex items-center gap-1.5 pt-1 border-t border-m3-outlineVariant">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Trend: {rollingAccuracy[rollingAccuracy.length - 1].accuracy >= rollingAccuracy[0].accuracy 
                      ? <span className="text-emerald-400 font-bold">Improving ↑</span>
                      : <span className="text-red-400 font-bold">Declining ↓</span>
                    }
                    {' '}({rollingAccuracy[0].accuracy}% → {rollingAccuracy[rollingAccuracy.length - 1].accuracy}%)
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Accuracy Distribution Histogram */}
        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-m3-primary" />
            <span>Accuracy Distribution (Positions & Hand Types)</span>
          </h3>

          <div className="space-y-3">
            {accuracyDistribution.map((bucket) => (
              <div key={bucket.label} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-m3-onSurface font-mono">{bucket.label}</span>
                  <span className="text-m3-onSurfaceVariant">{bucket.count} {bucket.count === 1 ? 'category' : 'categories'}</span>
                </div>
                <div className="h-5 w-full bg-zinc-950 rounded-m3-xs overflow-hidden border border-m3-outlineVariant flex items-center">
                  <div
                    style={{ width: `${maxDistCount > 0 ? (bucket.count / maxDistCount) * 100 : 0}%` }}
                    className={`h-full ${bucket.color} rounded-m3-xs transition-all duration-300 flex items-center justify-end pr-1.5`}
                  >
                    {bucket.count > 0 && (
                      <span className="text-[9px] font-extrabold text-white drop-shadow">{bucket.count}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-m3-onSurfaceVariant font-medium pt-2 border-t border-m3-outlineVariant">
            Distribution of your accuracy across all 6 positions and 8 hand morphology types. More categories in the 80–100% bucket = closer to GTO equilibrium.
          </p>
        </div>
      </div>

      {/* ============================================================= */}
      {/* ACTION TENDENCY ANALYSIS + SPOT CATEGORY BREAKDOWN ROW        */}
      {/* ============================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Action Tendency: You vs GTO */}
        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-m3-primary" />
            <span>Action Tendency: You vs GTO</span>
          </h3>

          {!actionTendency ? (
            <p className="text-xs text-m3-onSurfaceVariant italic font-medium py-4">Play some hands to see your tendencies.</p>
          ) : (
            <div className="space-y-4">
              {/* Fold comparison */}
              {[
                { label: 'Fold', yours: actionTendency.userFoldPct, gto: actionTendency.optFoldPct, delta: actionTendency.foldDelta, color: 'bg-zinc-500', gtoColor: 'bg-zinc-400' },
                { label: 'Call', yours: actionTendency.userCallPct, gto: actionTendency.optCallPct, delta: actionTendency.callDelta, color: 'bg-emerald-500', gtoColor: 'bg-emerald-400' },
                { label: 'Raise', yours: actionTendency.userRaisePct, gto: actionTendency.optRaisePct, delta: actionTendency.raiseDelta, color: 'bg-red-500', gtoColor: 'bg-red-400' }
              ].map((row) => (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-m3-onSurface uppercase tracking-wider">{row.label}</span>
                    <span className={`font-mono text-[11px] ${
                      Math.abs(row.delta) <= 3 ? 'text-emerald-400' :
                      Math.abs(row.delta) <= 8 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {row.delta > 0 ? '+' : ''}{row.delta}% {Math.abs(row.delta) <= 3 ? '✓' : Math.abs(row.delta) <= 8 ? '~' : '⚠'}
                    </span>
                  </div>
                  
                  {/* Dual bar: yours vs GTO */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-m3-onSurfaceVariant font-bold w-8 shrink-0">You</span>
                      <div className="flex-1 h-3 bg-zinc-950 rounded-m3-xs overflow-hidden border border-m3-outlineVariant">
                        <div style={{ width: `${row.yours}%` }} className={`h-full ${row.color} rounded-m3-xs transition-all`} />
                      </div>
                      <span className="text-[10px] font-bold text-m3-onSurface w-8 text-right">{row.yours}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-m3-onSurfaceVariant font-bold w-8 shrink-0">GTO</span>
                      <div className="flex-1 h-3 bg-zinc-950 rounded-m3-xs overflow-hidden border border-m3-outlineVariant">
                        <div style={{ width: `${row.gto}%` }} className={`h-full ${row.gtoColor} rounded-m3-xs transition-all opacity-60`} />
                      </div>
                      <span className="text-[10px] font-bold text-m3-onSurfaceVariant w-8 text-right">{row.gto}%</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Summary insight */}
              <div className="text-[11px] text-m3-onSurfaceVariant font-medium border-t border-m3-outlineVariant pt-3 space-y-1">
                {actionTendency.foldDelta > 5 && <p className="text-red-400 font-bold">⚠ You are over-folding by {actionTendency.foldDelta}% — tighten less in marginal spots.</p>}
                {actionTendency.foldDelta < -5 && <p className="text-amber-400 font-bold">⚠ You are under-folding by {Math.abs(actionTendency.foldDelta)}% — you may be too loose.</p>}
                {actionTendency.raiseDelta > 5 && <p className="text-red-400 font-bold">⚠ Over-raising by {actionTendency.raiseDelta}% — consider flatting more medium hands.</p>}
                {actionTendency.raiseDelta < -5 && <p className="text-amber-400 font-bold">⚠ Under-raising by {Math.abs(actionTendency.raiseDelta)}% — value 3-bets may be missed.</p>}
                {Math.abs(actionTendency.foldDelta) <= 5 && Math.abs(actionTendency.callDelta) <= 5 && Math.abs(actionTendency.raiseDelta) <= 5 && (
                  <p className="text-emerald-400 font-bold">✓ Your action frequencies are well-calibrated to GTO equilibrium.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Spot Category Breakdown */}
        <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-m3-primary" />
            <span>Accuracy by Spot Category</span>
          </h3>

          <div className="space-y-4">
            {categoryBreakdown.map((cat) => {
              const acc = cat.total > 0 ? Math.round((cat.correct / cat.total) * 100) : 0;
              const isWeak = cat.total >= 3 && acc < 65;

              return (
                <div key={cat.key} className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-m3-onSurface">{cat.label}</span>
                    <span className={`${isWeak ? 'text-red-400' : acc >= 80 ? 'text-emerald-400' : 'text-amber-400'} font-mono`}>
                      {acc}% <span className="text-m3-onSurfaceVariant font-medium">({cat.correct}/{cat.total})</span>
                    </span>
                  </div>
                  <div className="h-4 w-full bg-zinc-950 rounded-m3-xs overflow-hidden border border-m3-outlineVariant">
                    <div
                      style={{ width: `${acc}%` }}
                      className={`h-full rounded-m3-xs transition-all duration-500 ${
                        isWeak ? 'bg-red-500' : acc >= 80 ? 'bg-emerald-500' : 'bg-amber-400'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Weakest category callout */}
          {(() => {
            const withData = categoryBreakdown.filter(c => c.total >= 3);
            if (withData.length === 0) return null;
            const weakest = withData.reduce((a, b) => {
              const accA = a.total > 0 ? a.correct / a.total : 1;
              const accB = b.total > 0 ? b.correct / b.total : 1;
              return accA < accB ? a : b;
            });
            const weakAcc = Math.round((weakest.correct / weakest.total) * 100);
            if (weakAcc >= 80) return (
              <div className="text-[11px] text-emerald-400 font-bold border-t border-m3-outlineVariant pt-3">
                ✓ All spot categories above 80% accuracy — strong equilibrium play.
              </div>
            );
            return (
              <div className="text-[11px] text-amber-400 font-bold border-t border-m3-outlineVariant pt-3">
                ⚠ Weakest category: <span className="text-red-400">{weakest.label}</span> at {weakAcc}% — prioritize studying these spots.
              </div>
            );
          })()}
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
                {stats.attemptsHistory.slice(0, 25).map((attempt) => (
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
