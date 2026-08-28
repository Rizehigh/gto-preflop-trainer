import React, { useState, useEffect, useCallback } from 'react';
import { ActionType, Card, HandAttempt, Position, SpotCategory, SpotDefinition } from '../types/poker';
import { SPOT_DEFINITIONS, getSpotById } from '../data/gtoRanges';
import { classifyHandType, dealCardsForNotation, evaluateUserAction, formatPositionLabel, getAll169Hands, getOptimalAction } from '../utils/pokerUtils';
import { sounds } from '../utils/soundEffects';
import { PokerTable } from './PokerTable';
import { PlayingCard } from './PlayingCard';
import { MorphologyExplanation } from './MorphologyExplanation';
import { RangeGrid } from './RangeGrid';
import { Filter, RefreshCw, Sparkles, Layers, ShieldAlert } from 'lucide-react';

interface TrainerTabProps {
  onRecordAttempt: (attempt: HandAttempt) => void;
  leakPosition?: Position | null;
}

export const TrainerTab: React.FC<TrainerTabProps> = ({ onRecordAttempt, leakPosition }) => {
  const [selectedSpotId, setSelectedSpotId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentSpot, setCurrentSpot] = useState<SpotDefinition>(SPOT_DEFINITIONS[0]);
  
  const [handNotation, setHandNotation] = useState<string>('AKs');
  const [dealtCards, setDealtCards] = useState<Card[]>([]);
  const [userAction, setUserAction] = useState<ActionType | null>(null);
  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    isMixed: boolean;
    optimalAction: ActionType;
    message: string;
  } | null>(null);

  // Generate a fresh random hand spot
  const generateNewHand = useCallback(() => {
    let availableSpots = SPOT_DEFINITIONS;

    if (leakPosition) {
      availableSpots = SPOT_DEFINITIONS.filter(s => s.heroPosition === leakPosition);
      if (availableSpots.length === 0) availableSpots = SPOT_DEFINITIONS;
    } else if (selectedSpotId !== 'all') {
      availableSpots = SPOT_DEFINITIONS.filter(s => s.id === selectedSpotId);
    } else if (selectedCategory !== 'all') {
      availableSpots = SPOT_DEFINITIONS.filter(s => s.category === selectedCategory);
    }

    const randomSpot = availableSpots[Math.floor(Math.random() * availableSpots.length)];
    setCurrentSpot(randomSpot);

    const all169 = getAll169Hands();
    const randomNotation = all169[Math.floor(Math.random() * all169.length)];
    setHandNotation(randomNotation);

    const cards = dealCardsForNotation(randomNotation);
    setDealtCards(cards);

    setUserAction(null);
    setEvaluation(null);

    sounds.playCardDeal();
  }, [selectedSpotId, selectedCategory, leakPosition]);

  // Initial hand generation on mount
  useEffect(() => {
    generateNewHand();
  }, [generateNewHand]);

  // Handle user pick
  const handleActionPick = (action: ActionType) => {
    if (userAction !== null) return; // already answered

    const freq = currentSpot.ranges[handNotation] || { fold: 1, call: 0, raise: 0 };
    const evalResult = evaluateUserAction(action, freq);
    
    setUserAction(action);
    setEvaluation(evalResult);

    if (evalResult.isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }

    // Record attempt for stats tracking
    const handType = classifyHandType(handNotation);
    const attempt: HandAttempt = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      spotId: currentSpot.id,
      spotName: currentSpot.name,
      heroPosition: currentSpot.heroPosition,
      category: currentSpot.category,
      handNotation,
      cards: dealtCards,
      handType,
      userAction: action,
      optimalAction: evalResult.optimalAction,
      isCorrect: evalResult.isCorrect,
      frequencies: freq
    };

    onRecordAttempt(attempt);
  };

  // Keyboard shortcut listener (1: Fold, 2: Call, 3: Raise, Space: Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (userAction === null) {
        if (e.key === '1') handleActionPick('fold');
        if (e.key === '2' && currentSpot.allowedActions.includes('call')) handleActionPick('call');
        if (e.key === '3') handleActionPick('raise');
      } else {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          generateNewHand();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userAction, currentSpot, generateNewHand]);

  const freq = currentSpot.ranges[handNotation] || { fold: 1, call: 0, raise: 0 };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Controls & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-emerald-400" />
            <span>Spot Selector</span>
          </div>

          <select
            value={selectedSpotId}
            onChange={(e) => {
              setSelectedSpotId(e.target.value);
              setSelectedCategory('all');
            }}
            className="bg-slate-950 text-slate-100 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">🎲 All Spots (Random)</option>
            {SPOT_DEFINITIONS.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.heroPosition})</option>
            ))}
          </select>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSpotId('all');
            }}
            className="bg-slate-950 text-slate-100 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Spot Types</option>
            <option value="rfi">Open Raise (RFI)</option>
            <option value="facing_open">Facing Open Raise</option>
            <option value="facing_3bet">Facing 3-Bet</option>
          </select>

          {leakPosition && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs font-bold text-amber-300 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Targeting Leak: {leakPosition}</span>
            </div>
          )}
        </div>

        <button
          onClick={generateNewHand}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-2 transition-colors border border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>New Random Hand</span>
        </button>
      </div>

      {/* Main Trainer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Hand Deal & Action Buttons */}
        <div className="lg:col-span-6 flex flex-col items-center bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          
          {/* Poker Table Visualizer */}
          <PokerTable
            heroPosition={currentSpot.heroPosition}
            villainPosition={currentSpot.villainPosition}
            spotName={currentSpot.name}
            facingAction={currentSpot.facingAction}
          />

          {/* Cards Display */}
          <div className="my-6 flex items-center justify-center gap-4">
            {dealtCards.map((card, idx) => (
              <PlayingCard key={idx} card={card} size="lg" animated />
            ))}
          </div>

          {/* Hand Category Badge */}
          <div className="mb-6 flex flex-col items-center gap-1">
            <span className="text-2xl font-black tracking-tight text-white bg-slate-950 px-4 py-1 rounded-xl border border-slate-800 shadow-inner">
              {handNotation}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Hero: {formatPositionLabel(currentSpot.heroPosition)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-3">
            <div className="text-xs font-semibold text-slate-400 text-center uppercase tracking-wider mb-2">
              Select Your Action
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* FOLD BUTTON */}
              <button
                onClick={() => handleActionPick('fold')}
                disabled={userAction !== null}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center shadow-lg border ${
                  userAction === 'fold'
                    ? 'bg-slate-700 border-white ring-4 ring-slate-500/40 text-white scale-105'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-500'
                } ${userAction !== null ? 'opacity-80' : ''}`}
              >
                <span>FOLD</span>
                <span className="text-[10px] text-slate-400 font-normal mt-0.5">(Key 1)</span>
              </button>

              {/* CALL BUTTON (Only enabled if spot allows call) */}
              <button
                onClick={() => handleActionPick('call')}
                disabled={userAction !== null || !currentSpot.allowedActions.includes('call')}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center shadow-lg border ${
                  !currentSpot.allowedActions.includes('call')
                    ? 'bg-slate-950 text-slate-600 border-slate-800 opacity-40 cursor-not-allowed'
                    : userAction === 'call'
                    ? 'bg-emerald-600 border-white ring-4 ring-emerald-500/40 text-white scale-105'
                    : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border-emerald-800/60 hover:border-emerald-500'
                }`}
              >
                <span>CALL</span>
                <span className="text-[10px] opacity-75 font-normal mt-0.5">(Key 2)</span>
              </button>

              {/* RAISE BUTTON */}
              <button
                onClick={() => handleActionPick('raise')}
                disabled={userAction !== null}
                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all flex flex-col items-center justify-center shadow-lg border ${
                  userAction === 'raise'
                    ? 'bg-red-600 border-white ring-4 ring-red-500/40 text-white scale-105'
                    : 'bg-red-950/60 hover:bg-red-900/80 text-red-300 border-red-800/60 hover:border-red-500'
                } ${userAction !== null ? 'opacity-80' : ''}`}
              >
                <span>{currentSpot.raiseLabel.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75 font-normal mt-0.5">(Key 3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive 13x13 Grid Matrix Solution & Post-Guess Feedback */}
        <div className="lg:col-span-6 space-y-4 flex flex-col items-center">
          
          {/* Post-Guess Educational Feedback */}
          {evaluation && (
            <MorphologyExplanation
              isCorrect={evaluation.isCorrect}
              userAction={userAction!}
              optimalAction={evaluation.optimalAction}
              message={evaluation.message}
              handNotation={handNotation}
              cards={dealtCards}
              handType={classifyHandType(handNotation)}
              frequencies={freq}
              spotName={currentSpot.name}
              onNext={generateNewHand}
            />
          )}

          {/* 13x13 Solution Grid Matrix */}
          <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
            <RangeGrid
              spot={currentSpot}
              highlightHand={handNotation}
              title={`GTO Solution Grid: ${currentSpot.name}`}
              showLegend
            />
          </div>
        </div>

      </div>
    </div>
  );
};
