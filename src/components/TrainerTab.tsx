import React, { useState, useEffect, useCallback } from 'react';
import { ActionType, Card, HandAttempt, Position, SpotDefinition } from '../types/poker';
import { SPOT_DEFINITIONS } from '../data/gtoRanges';
import { classifyHandType, dealCardsForNotation, evaluateUserAction, formatPositionLabel, getAll169Hands, getMorphologyStructureMeta } from '../utils/pokerUtils';
import { sounds } from '../utils/soundEffects';
import { PokerTable } from './PokerTable';
import { PlayingCard } from './PlayingCard';
import { MorphologyExplanation } from './MorphologyExplanation';
import { RangeGrid } from './RangeGrid';
import { Filter, RefreshCw, ShieldAlert, Lock, Eye, GraduationCap, Lightbulb } from 'lucide-react';

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
  const [showHint, setShowHint] = useState<boolean>(false);

  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    isMixed: boolean;
    optimalAction: ActionType;
    message: string;
  } | null>(null);

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
    setShowHint(false);

    sounds.playCardDeal();
  }, [selectedSpotId, selectedCategory, leakPosition]);

  useEffect(() => {
    generateNewHand();
  }, [generateNewHand]);

  const handleActionPick = (action: ActionType) => {
    if (userAction !== null) return;

    const freq = currentSpot.ranges[handNotation] || { fold: 1, call: 0, raise: 0 };
    const evalResult = evaluateUserAction(action, freq);
    
    setUserAction(action);
    setEvaluation(evalResult);

    if (evalResult.isCorrect) {
      sounds.playCorrect();
    } else {
      sounds.playIncorrect();
    }

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;

      if (e.key === 'h' || e.key === 'H') {
        setShowHint((prev) => !prev);
      }

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
  const morphologyMeta = getMorphologyStructureMeta(currentSpot.morphologyStructure);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-5">
      
      {/* Controls Header */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline p-4 rounded-m3-md flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-m3-onSurfaceVariant uppercase tracking-wider">
            <Filter className="w-4 h-4 text-m3-primary" />
            <span>Spot Selector</span>
          </div>

          <select
            value={selectedSpotId}
            onChange={(e) => {
              setSelectedSpotId(e.target.value);
              setSelectedCategory('all');
            }}
            className="bg-m3-surfaceContainerHigh text-m3-onSurface border border-m3-outlineVariant rounded-m3-xs px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-m3-primary"
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
            className="bg-m3-surfaceContainerHigh text-m3-onSurface border border-m3-outlineVariant rounded-m3-xs px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-m3-primary"
          >
            <option value="all">All Spot Categories</option>
            <option value="rfi">Open Raise (RFI)</option>
            <option value="facing_open">Facing Open Raise</option>
            <option value="facing_3bet">Facing 3-Bet</option>
          </select>

          {leakPosition && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-950 border border-amber-500 rounded-m3-xs text-xs font-bold text-amber-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Targeting Leak: {leakPosition}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHint((prev) => !prev)}
            className={`px-3 py-1.5 font-bold rounded-m3-xs text-xs flex items-center gap-1.5 transition-colors border shadow-sm ${
              showHint
                ? 'bg-amber-500 text-zinc-950 border-amber-400 font-extrabold'
                : 'bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright text-m3-onSurface border-m3-outlineVariant'
            }`}
            title="Toggle GTO Solution Hint (Key H)"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Hide Hint (H)' : 'Peek Hint (H)'}</span>
          </button>

          <button
            onClick={generateNewHand}
            className="px-4 py-1.5 bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright text-m3-onSurface font-bold rounded-m3-xs text-xs flex items-center gap-2 transition-colors border border-m3-outlineVariant shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-m3-primary" />
            <span>New Hand</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column: Poker Table & Action Controls */}
        <div className="lg:col-span-6 flex flex-col items-center bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm relative">
          
          <PokerTable
            heroPosition={currentSpot.heroPosition}
            villainPosition={currentSpot.villainPosition}
            spotName={currentSpot.name}
            facingAction={currentSpot.facingAction}
          />

          <div className="my-5 flex items-center justify-center gap-4">
            {dealtCards.map((card, idx) => (
              <PlayingCard key={idx} card={card} size="lg" animated />
            ))}
          </div>

          <div className="mb-5 flex flex-col items-center gap-1">
            <span className="text-xl font-black tracking-tight text-m3-onSurface bg-m3-surfaceContainerHigh px-4 py-1 rounded-m3-xs border border-m3-outline">
              {handNotation}
            </span>
            <span className="text-xs text-m3-onSurfaceVariant font-bold">
              Hero: {formatPositionLabel(currentSpot.heroPosition)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-3">
            <div className="text-xs font-bold text-m3-onSurfaceVariant text-center uppercase tracking-wider mb-2">
              Select Optimal Play
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* FOLD BUTTON */}
              <button
                onClick={() => handleActionPick('fold')}
                disabled={userAction !== null}
                className={`py-3 px-4 rounded-m3-xs font-black text-xs transition-all flex flex-col items-center justify-center border shadow ${
                  userAction === 'fold'
                    ? 'bg-zinc-700 border-white text-white ring-2 ring-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-600'
                }`}
              >
                <span>FOLD</span>
                <span className="text-[10px] text-zinc-400 font-normal mt-0.5">(Key 1)</span>
              </button>

              {/* CALL BUTTON */}
              <button
                onClick={() => handleActionPick('call')}
                disabled={userAction !== null || !currentSpot.allowedActions.includes('call')}
                className={`py-3 px-4 rounded-m3-xs font-black text-xs transition-all flex flex-col items-center justify-center border shadow ${
                  !currentSpot.allowedActions.includes('call')
                    ? 'bg-zinc-900 text-zinc-600 border-zinc-800 opacity-40 cursor-not-allowed'
                    : userAction === 'call'
                    ? 'bg-emerald-600 border-white text-white ring-2 ring-white'
                    : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500'
                }`}
              >
                <span>CALL</span>
                <span className="text-[10px] text-emerald-200 font-normal mt-0.5">(Key 2)</span>
              </button>

              {/* RAISE BUTTON */}
              <button
                onClick={() => handleActionPick('raise')}
                disabled={userAction !== null}
                className={`py-3 px-4 rounded-m3-xs font-black text-xs transition-all flex flex-col items-center justify-center border shadow ${
                  userAction === 'raise'
                    ? 'bg-red-600 border-white text-white ring-2 ring-white'
                    : 'bg-red-700 hover:bg-red-600 text-white border-red-500'
                }`}
              >
                <span>{currentSpot.raiseLabel.split(' ')[0]}</span>
                <span className="text-[10px] text-red-200 font-normal mt-0.5">(Key 3)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Solution Grid & Morphology Feedback */}
        <div className="lg:col-span-6 space-y-4 flex flex-col items-center w-full">
          {userAction === null && !showHint ? (
            /* Pre-Decision Locked State */
            <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 text-center space-y-4 shadow">
              <div className="w-12 h-12 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs flex items-center justify-center mx-auto text-m3-primary shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-sm font-bold text-m3-onSurface">GTO Solution Matrix Locked</h3>
                <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                  Make your play or press <strong className="text-amber-400 font-mono">H</strong> for a GTO solution hint.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 rounded-m3-xs text-xs flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Reveal GTO Hint (Key H)</span>
                </button>
              </div>

              <div className="bg-m3-surfaceContainerHigh p-4 rounded-m3-xs border border-m3-outlineVariant text-left space-y-2.5">
                <div className="text-xs font-bold text-m3-primary flex items-center gap-1.5 uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>How to Learn Preflop GTO</span>
                </div>

                <ul className="text-xs text-m3-onSurfaceVariant space-y-1.5 font-medium list-disc list-inside">
                  <li><strong className="text-m3-onSurface">Test Decision:</strong> Choose Fold, Call, or Raise for Hero.</li>
                  <li><strong className="text-m3-onSurface">Range Morphology:</strong> Classify ranges into Linear, Polarized, Condensed, or Mixed structures.</li>
                  <li><strong className="text-m3-onSurface">Hint Shortcut:</strong> Press <kbd className="px-1 py-0.5 bg-zinc-800 text-amber-400 rounded font-mono text-[10px]">H</kbd> anytime to peek at the GTO solution matrix.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Unlocked Solution Grid & Morphology Breakdown */
            <>
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

              <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow overflow-hidden space-y-3">
                {/* Range Morphology Structure Header */}
                <div className={`p-3 rounded-m3-xs border flex flex-col gap-1 ${morphologyMeta.badgeBg} ${morphologyMeta.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-m3-onSurface">
                      Spot Range Morphology
                    </span>
                    <span className={`px-2.5 py-0.5 font-black text-xs uppercase tracking-wide border rounded-m3-xs ${morphologyMeta.textColor} ${morphologyMeta.borderColor}`}>
                      {morphologyMeta.label}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-zinc-300 leading-snug mt-0.5">
                    {currentSpot.morphologyDescription}
                  </p>
                </div>

                <RangeGrid
                  spot={currentSpot}
                  highlightHand={handNotation}
                  title={`GTO Matrix: ${currentSpot.name}`}
                  showLegend
                />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
