import React, { useState } from 'react';
import { SPOT_DEFINITIONS } from '../data/gtoRanges';
import { SpotDefinition } from '../types/poker';
import { RangeGrid } from './RangeGrid';
import { getAll169Hands, getHandCombosCount } from '../utils/pokerUtils';
import { AMATEUR_PROFILES, AmateurArchetypeId, getAmateurVillainRange } from '../data/amateurProfiles';
import { Grid, Filter, Users, User, Zap } from 'lucide-react';

export const StudyTab: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<SpotDefinition>(SPOT_DEFINITIONS[0]);
  const [filterAction, setFilterAction] = useState<'all' | 'raise' | 'call' | 'mixed'>('all');
  const [viewMode, setViewMode] = useState<'hero' | 'villain_gto' | AmateurArchetypeId>('hero');

  // Compute spot definition to pass to RangeGrid based on viewMode
  const getActiveSpotDefinition = (): SpotDefinition => {
    if (viewMode === 'hero') return selectedSpot;

    if (viewMode === 'villain_gto') {
      if (!selectedSpot.villainRange) return selectedSpot;
      return {
        ...selectedSpot,
        name: `${selectedSpot.name} (Villain GTO Range)`,
        ranges: selectedSpot.villainRange,
        morphologyStructure: selectedSpot.villainMorphologyStructure || selectedSpot.morphologyStructure,
        morphologyDescription: selectedSpot.villainMorphologyDescription || selectedSpot.morphologyDescription
      };
    }

    // Amateur archetype
    const amateurRange = getAmateurVillainRange(selectedSpot, viewMode);
    const profile = AMATEUR_PROFILES[viewMode];
    return {
      ...selectedSpot,
      name: `${selectedSpot.name} (${profile.avatar} ${profile.shortName} Range)`,
      ranges: amateurRange,
      morphologyDescription: `Distorted amateur range for ${profile.name}: ${profile.tagline}`
    };
  };

  const activeSpot = getActiveSpotDefinition();

  const computeSpotStats = () => {
    let raiseCombos = 0;
    let callCombos = 0;
    let foldCombos = 0;

    const all169 = getAll169Hands();
    for (const hand of all169) {
      const combos = getHandCombosCount(hand);
      const freq = activeSpot.ranges[hand] || { fold: 1, call: 0, raise: 0 };
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
  const allPositions = ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as const;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5">
      
      {/* Top Header Card */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-m3-primary">
              <Grid className="w-4 h-4" />
              <span>Range Explorer & Study Mode</span>
            </div>
            <h2 className="text-xl font-bold text-m3-onSurface mt-1">{activeSpot.name}</h2>
            <p className="text-xs text-m3-onSurfaceVariant font-medium mt-0.5">{selectedSpot.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-m3-onSurfaceVariant">Select Spot:</label>
            <select
              value={selectedSpot.id}
              onChange={(e) => {
                const s = SPOT_DEFINITIONS.find(spot => spot.id === e.target.value);
                if (s) setSelectedSpot(s);
              }}
              className="bg-m3-surfaceContainerHigh text-m3-onSurface border border-m3-outlineVariant rounded-m3-xs px-3.5 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-m3-primary"
            >
              {SPOT_DEFINITIONS.map(spot => (
                <option key={spot.id} value={spot.id}>
                  {spot.name} ({spot.heroPosition})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Switcher: Hero GTO vs Villain GTO vs Amateur Archetypes */}
        <div className="pt-2 border-t border-m3-outlineVariant flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-m3-onSurfaceVariant uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span>Range View:</span>
          </span>

          <button
            onClick={() => setViewMode('hero')}
            className={`px-3 py-1 rounded-m3-xs text-xs font-bold transition-all border ${
              viewMode === 'hero'
                ? 'bg-m3-primary text-m3-onPrimary border-amber-400 shadow-sm'
                : 'bg-m3-surfaceContainerHigh text-m3-onSurface border-m3-outlineVariant hover:bg-m3-surfaceBright'
            }`}
          >
            Hero GTO Range
          </button>

          {selectedSpot.villainRange && (
            <button
              onClick={() => setViewMode('villain_gto')}
              className={`px-3 py-1 rounded-m3-xs text-xs font-bold transition-all border ${
                viewMode === 'villain_gto'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                  : 'bg-m3-surfaceContainerHigh text-m3-onSurface border-m3-outlineVariant hover:bg-m3-surfaceBright'
              }`}
            >
              Villain GTO Range
            </button>
          )}

          <div className="h-4 w-px bg-m3-outlineVariant mx-1 hidden sm:block" />

          {/* Amateur Archetypes */}
          <button
            onClick={() => setViewMode('maniac')}
            className={`px-2.5 py-1 rounded-m3-xs text-xs font-bold transition-all border ${
              viewMode === 'maniac'
                ? 'bg-red-600 text-white border-red-400 shadow-sm'
                : 'bg-m3-surfaceContainerHigh text-red-300 border-red-900/60 hover:bg-red-950/40'
            }`}
          >
            💣 Maniac
          </button>

          <button
            onClick={() => setViewMode('calling_station')}
            className={`px-2.5 py-1 rounded-m3-xs text-xs font-bold transition-all border ${
              viewMode === 'calling_station'
                ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                : 'bg-m3-surfaceContainerHigh text-blue-300 border-blue-900/60 hover:bg-blue-950/40'
            }`}
          >
            🦥 Calling Station
          </button>

          <button
            onClick={() => setViewMode('nit')}
            className={`px-2.5 py-1 rounded-m3-xs text-xs font-bold transition-all border ${
              viewMode === 'nit'
                ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                : 'bg-m3-surfaceContainerHigh text-amber-300 border-amber-900/60 hover:bg-amber-950/40'
            }`}
          >
            🐢 Nit
          </button>

          <button
            onClick={() => setViewMode('wild')}
            className={`px-2.5 py-1 rounded-m3-xs text-xs font-bold transition-all border ${
              viewMode === 'wild'
                ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                : 'bg-m3-surfaceContainerHigh text-purple-300 border-purple-900/60 hover:bg-purple-950/40'
            }`}
          >
            🎲 Wild
          </button>
        </div>

        {/* Stats Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-xs border border-m3-outlineVariant text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-m3-onSurfaceVariant">Total Played</div>
            <div className="text-xl font-black text-m3-primary mt-0.5">{stats.playPct}%</div>
            <div className="text-[10px] text-m3-onSurfaceVariant">{stats.raiseCombos + stats.callCombos} combos</div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-xs border border-m3-outlineVariant text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-red-400">Raise / 3-Bet</div>
            <div className="text-xl font-black text-red-400 mt-0.5">{stats.raisePct}%</div>
            <div className="text-[10px] text-m3-onSurfaceVariant">{stats.raiseCombos} combos</div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-xs border border-m3-outlineVariant text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Call / Defend</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{stats.callPct}%</div>
            <div className="text-[10px] text-m3-onSurfaceVariant">{stats.callCombos} combos</div>
          </div>

          <div className="bg-m3-surfaceContainerHigh p-3 rounded-m3-xs border border-m3-outlineVariant text-center">
            <div className="text-[10px] uppercase font-bold tracking-wider text-zinc-400">Fold</div>
            <div className="text-xl font-black text-zinc-300 mt-0.5">{stats.foldPct}%</div>
            <div className="text-[10px] text-m3-onSurfaceVariant">{1326 - stats.raiseCombos - stats.callCombos} combos</div>
          </div>
        </div>
      </div>

      {/* Main Grid Card */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm space-y-5">
        
        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-m3-outlineVariant pb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-m3-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-m3-onSurface">Action Highlight Filter:</span>
          </div>

          <div className="flex items-center p-1 bg-m3-surfaceContainerHighest rounded-m3-xs border border-m3-outlineVariant">
            <button
              onClick={() => setFilterAction('all')}
              className={`px-3 py-1 rounded-m3-xs text-xs font-bold transition-all ${
                filterAction === 'all' ? 'bg-m3-primary text-m3-onPrimary' : 'text-m3-onSurfaceVariant hover:text-m3-onSurface'
              }`}
            >
              All Hands
            </button>

            <button
              onClick={() => setFilterAction('raise')}
              className={`px-3 py-1 rounded-m3-xs text-xs font-bold transition-all ${
                filterAction === 'raise' ? 'bg-red-600 text-white' : 'text-m3-onSurfaceVariant hover:text-m3-onSurface'
              }`}
            >
              Raises
            </button>

            <button
              onClick={() => setFilterAction('call')}
              className={`px-3 py-1 rounded-m3-xs text-xs font-bold transition-all ${
                filterAction === 'call' ? 'bg-emerald-600 text-white' : 'text-m3-onSurfaceVariant hover:text-m3-onSurface'
              }`}
            >
              Calls
            </button>

            <button
              onClick={() => setFilterAction('mixed')}
              className={`px-3 py-1 rounded-m3-xs text-xs font-bold transition-all ${
                filterAction === 'mixed' ? 'bg-amber-500 text-black' : 'text-m3-onSurfaceVariant hover:text-m3-onSurface'
              }`}
            >
              Mixed
            </button>
          </div>
        </div>

        <RangeGrid
          spot={activeSpot}
          title={`${activeSpot.name} Range Matrix`}
          filterAction={filterAction}
          showLegend
        />

        <p className="text-xs text-m3-onSurfaceVariant text-center italic font-medium">
          💡 Click any matrix hand cell to inspect combo counts, frequency distribution, and morphology notes.
        </p>
      </div>

    </div>
  );
};
