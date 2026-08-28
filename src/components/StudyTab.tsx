import React, { useState } from 'react';
import { SPOT_DEFINITIONS } from '../data/gtoRanges';
import { SpotDefinition } from '../types/poker';
import { RangeGrid } from './RangeGrid';
import { getAll169Hands, getHandCombosCount, formatPositionLabel } from '../utils/pokerUtils';
import { Grid, Eye, Layers, Lightbulb, Compass, Filter } from 'lucide-react';

export const StudyTab: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<SpotDefinition>(SPOT_DEFINITIONS[0]);
  const [filterAction, setFilterAction] = useState<'all' | 'raise' | 'call' | 'mixed'>('all');

  // Compute total combos and percentages for the current spot
  const computeSpotStats = () => {
    let totalCombos = 0;
    let raiseCombos = 0;
    let callCombos = 0;
    let foldCombos = 0;

    const all169 = getAll169Hands();
    for (const hand of all169) {
      const combos = getHandCombosCount(hand);
      const freq = selectedSpot.ranges[hand] || { fold: 1, call: 0, raise: 0 };
      totalCombos += combos; // 1326 total combos in poker
      raiseCombos += combos * (freq.raise || 0);
      callCombos += combos * (freq.call || 0);
      foldCombos += combos * (freq.fold || 0);
    }

    const raisePct = Math.round((raiseCombos / 1326) * 100);
    const callPct = Math.round((callCombos / 1326) * 100);
    const foldPct = Math.round((foldCombos / 1326) * 100);
    const playPct = raisePct + callPct;

    return { raisePct, callPct, foldPct, playPct, raiseCombos: Math.round(raiseCombos), callCombos: Math.round(callCombos) };
  };

  const stats = computeSpotStats();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      
      {/* Top Header & Spot Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Grid className="w-4 h-4" />
              <span>Range Explorer & Study Mode</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100 mt-1">{selectedSpot.name}</h2>
            <p className="text-xs text-slate-400 mt-0.5">{selectedSpot.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-400">Select Spot:</label>
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const s = SPOT_DEFINITIONS.find(spot => spot.id === e.target.value);
                if (s) setSelectedSpot(s);
              }}
              className="bg-slate-950 text-slate-100 border border-slate-700 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-inner"
            >
              {SPOT_DEFINITIONS.map(spot => (
                <option key={spot.id} value={spot.id}>
                  {spot.name} ({spot.heroPosition})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats & Frequency Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Total Played Range</div>
            <div className="text-xl font-black text-emerald-400 mt-1">{stats.playPct}%</div>
            <div className="text-[10px] text-slate-500">{stats.raiseCombos + stats.callCombos} combos</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-red-900/40 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-red-400">Raise / 3-Bet</div>
            <div className="text-xl font-black text-red-400 mt-1">{stats.raisePct}%</div>
            <div className="text-[10px] text-slate-500">{stats.raiseCombos} combos</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-900/40 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Call / Defend</div>
            <div className="text-xl font-black text-emerald-300 mt-1">{stats.callPct}%</div>
            <div className="text-[10px] text-slate-500">{stats.callCombos} combos</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Fold Frequency</div>
            <div className="text-xl font-black text-slate-400 mt-1">{stats.foldPct}%</div>
            <div className="text-[10px] text-slate-500">{1326 - stats.raiseCombos - stats.callCombos} combos</div>
          </div>
        </div>
      </div>

      {/* Main Grid & Filter Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Highlight Action Filter:</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setFilterAction('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterAction === 'all' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Hands
            </button>

            <button
              onClick={() => setFilterAction('raise')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterAction === 'raise' ? 'bg-red-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Raises / 3-Bets
            </button>

            <button
              onClick={() => setFilterAction('call')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterAction === 'call' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Calls
            </button>

            <button
              onClick={() => setFilterAction('mixed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterAction === 'mixed' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Mixed Strategy
            </button>
          </div>
        </div>

        {/* The Interactive 13x13 Grid */}
        <RangeGrid
          spot={selectedSpot}
          title={`${selectedSpot.name} Range Grid Solution`}
          filterAction={filterAction}
          showLegend
        />

        <p className="text-xs text-slate-400 text-center italic">
          💡 Tip: Click any hand cell above to view its exact combo breakdown, action percentages, and hand morphology principles.
        </p>
      </div>

    </div>
  );
};
