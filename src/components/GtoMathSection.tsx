import React, { useState } from 'react';
import { Position, TableSize } from '../types/poker';
import { calculatePositionMathMetrics, getPositionsForTableSize } from '../utils/gtoMath';
import { Calculator, ShieldAlert, Cpu, Layers, Sigma, TrendingDown } from 'lucide-react';

export const GtoMathSection: React.FC = () => {
  const [selectedTableSize, setSelectedTableSize] = useState<TableSize>(9);
  const positions = getPositionsForTableSize(selectedTableSize);

  return (
    <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 space-y-6 shadow">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-m3-outlineVariant pb-4">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-m3-primary flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-400" />
            <span>GTO Preflop Mathematics & Range Scaling</span>
          </div>
          <h2 className="text-lg font-bold text-m3-onSurface mt-0.5">
            Full Ring (6-Max to 10-Max) Mathematical Foundations
          </h2>
        </div>

        {/* Table Size Toggle */}
        <div className="flex items-center gap-1 bg-m3-surfaceContainerHigh p-1 rounded-m3-xs border border-m3-outlineVariant">
          {([6, 7, 8, 9, 10] as TableSize[]).map((size) => (
            <button
              key={size}
              onClick={() => setSelectedTableSize(size)}
              className={`px-3 py-1 text-xs font-extrabold rounded-m3-xs transition-colors ${
                selectedTableSize === size
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceBright'
              }`}
            >
              {size}-Max
            </button>
          ))}
        </div>
      </div>

      {/* Core Mathematical Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Principle 1 */}
        <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sigma className="w-4 h-4 text-amber-400" />
            <span>1. Card Removal & Probability</span>
          </div>
          <p className="text-xs text-m3-onSurfaceVariant font-medium leading-relaxed">
            As player count increases from 6 to 10, the probability of at least one opponent behind holding a top premium hand (AA, KK, QQ, AK) scales exponentially:
          </p>
          <div className="bg-zinc-950/80 p-2.5 rounded-m3-xs border border-zinc-800 font-mono text-[11px] text-amber-300">
            P(Premium Behind) = 1 - (1 - 0.048)^N
          </div>
        </div>

        {/* Principle 2 */}
        <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>2. Exponential RFI Decay</span>
          </div>
          <p className="text-xs text-m3-onSurfaceVariant font-medium leading-relaxed">
            Opening range frequency ($RFI%$) decays geometrically from BTN (~46%) down to 10-Max UTG (~7.5%) due to positional disadvantage & 3-bet vulnerability:
          </p>
          <div className="bg-zinc-950/80 p-2.5 rounded-m3-xs border border-zinc-800 font-mono text-[11px] text-emerald-300">
            RFI(k) ≈ 46% × (0.75)^(Seats to BTN)
          </div>
        </div>

        {/* Principle 3 */}
        <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>3. Strategic Range Morphology</span>
          </div>
          <p className="text-xs text-m3-onSurfaceVariant font-medium leading-relaxed">
            Early position opens require <strong className="text-white">Linear Ranges</strong> (pure strength), 3-bets require <strong className="text-white">Polarized Ranges</strong>, and BB defends require <strong className="text-white">Condensed Ranges</strong>.
          </p>
          <div className="bg-zinc-950/80 p-2.5 rounded-m3-xs border border-zinc-800 font-mono text-[11px] text-purple-300">
            Linear → Polarized → Condensed
          </div>
        </div>

      </div>

      {/* Position Scaling Matrix Table for Selected Table Size */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center justify-between">
          <span>Mathematical Position Metrics ({selectedTableSize}-Max Table)</span>
          <span className="text-amber-400 font-mono text-[11px]">{positions.length} Active Positions</span>
        </div>

        <div className="overflow-x-auto border border-m3-outlineVariant rounded-m3-xs">
          <table className="w-full text-left text-xs font-medium">
            <thead className="bg-m3-surfaceContainerHigh text-m3-onSurface font-bold uppercase text-[10px] tracking-wider border-b border-m3-outlineVariant">
              <tr>
                <th className="py-2.5 px-3">Position</th>
                <th className="py-2.5 px-3">Distance to BTN</th>
                <th className="py-2.5 px-3">Players Behind</th>
                <th className="py-2.5 px-3">Risk of Premium Behind</th>
                <th className="py-2.5 px-3">GTO RFI Frequency %</th>
                <th className="py-2.5 px-3">Morphology Structure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-m3-outlineVariant/50 bg-m3-surfaceContainerLow">
              {positions.map((pos) => {
                const metrics = calculatePositionMathMetrics(pos, selectedTableSize);
                return (
                  <tr key={pos} className="hover:bg-m3-surfaceContainerHigh/60 transition-colors">
                    <td className="py-2 px-3 font-extrabold text-amber-300 font-mono">{pos}</td>
                    <td className="py-2 px-3 text-zinc-300">{metrics.seatsToBtn} seats</td>
                    <td className="py-2 px-3 text-zinc-300">{metrics.playersBehind} opponents</td>
                    <td className="py-2 px-3">
                      <span className="font-mono text-red-300 font-bold">{metrics.probabilityPremiumBehind}%</span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-zinc-800 rounded-m3-xs overflow-hidden">
                          <div style={{ width: `${Math.min(100, metrics.gtoRfiFrequency * 2)}%` }} className="h-full bg-emerald-500" />
                        </div>
                        <span className="font-mono text-emerald-300 font-bold">{metrics.gtoRfiFrequency}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3">
                      <span className="capitalize font-bold text-xs px-2 py-0.5 rounded-m3-xs bg-zinc-800 border border-zinc-700 text-amber-200">
                        {metrics.rangeStructure}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
