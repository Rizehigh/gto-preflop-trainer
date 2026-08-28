import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActionType, Card, HandAttempt, Position, SpotDefinition, TableSize } from '../types/poker';
import { SPOT_DEFINITIONS } from '../data/gtoRanges';
import { classifyHandType, dealCardsForNotation, evaluateUserAction, formatPositionLabel, getAll169Hands, getMorphologyStructureMeta } from '../utils/pokerUtils';
import { sounds } from '../utils/soundEffects';
import { PokerTable } from './PokerTable';
import { PlayingCard } from './PlayingCard';
import { MorphologyExplanation } from './MorphologyExplanation';
import { RangeGrid } from './RangeGrid';
import { PositionalHandMatrixModal } from './PositionalHandMatrixModal';
import { Filter, RefreshCw, ShieldAlert, Lock, Eye, GraduationCap, Lightbulb, Users, UserCheck, HelpCircle, Info, X } from 'lucide-react';

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
  const [tableSize, setTableSize] = useState<TableSize>(6);
  const [showPositionalMatrix, setShowPositionalMatrix] = useState<boolean>(false);
  const [showCallDisabledInfo, setShowCallDisabledInfo] = useState<boolean>(false);
  const [isCallHovered, setIsCallHovered] = useState<boolean>(false);
  const [showRangeMatrix, setShowRangeMatrix] = useState<boolean>(false);

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
    setShowCallDisabledInfo(false);
    setIsCallHovered(false);

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
        if (e.key === '2') {
          if (currentSpot.allowedActions.includes('call')) {
            handleActionPick('call');
          } else {
            setShowCallDisabledInfo((prev) => !prev);
          }
        }
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
    <div className="w-full max-w-7xl mx-auto space-y-5">
      
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

      {/* Main Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Column: Poker Table & Action Controls */}
        <div className="lg:col-span-6 flex flex-col items-center bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm relative space-y-4">
          
          <PokerTable
            heroPosition={currentSpot.heroPosition}
            villainPosition={currentSpot.villainPosition}
            spotName={currentSpot.name}
            facingAction={currentSpot.facingAction}
            tableSize={tableSize}
            onTableSizeChange={setTableSize}
            onSelectSeat={() => setShowPositionalMatrix(true)}
          />

          <div className="my-2 flex items-center justify-center gap-4">
            {dealtCards.map((card, idx) => (
              <PlayingCard key={idx} card={card} size="lg" animated />
            ))}
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-m3-onSurface bg-m3-surfaceContainerHigh px-4 py-1.5 rounded-m3-xs border border-m3-outline">
                {handNotation}
              </span>
              <span className="text-sm text-m3-onSurfaceVariant font-bold">
                Hero: {formatPositionLabel(currentSpot.heroPosition)}
              </span>
            </div>

            <button
              onClick={() => setShowPositionalMatrix(true)}
              className="px-3.5 py-1.5 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/80 text-amber-300 rounded-m3-xs text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
              title="See what this hand would do from every position around the table"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>Inspect {handNotation} Across All Positions</span>
            </button>
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
              <div
                className="relative"
                onMouseEnter={() => {
                  if (!currentSpot.allowedActions.includes('call')) {
                    setIsCallHovered(true);
                  }
                }}
                onMouseLeave={() => {
                  setIsCallHovered(false);
                }}
                onClick={() => {
                  if (!currentSpot.allowedActions.includes('call')) {
                    setShowCallDisabledInfo((prev) => !prev);
                  }
                }}
              >
                <button
                  type="button"
                  onClick={(e) => {
                    if (currentSpot.allowedActions.includes('call')) {
                      if (userAction === null) {
                        handleActionPick('call');
                      }
                    } else {
                      e.stopPropagation();
                      setShowCallDisabledInfo((prev) => !prev);
                    }
                  }}
                  disabled={userAction !== null && currentSpot.allowedActions.includes('call')}
                  className={`w-full py-3 px-4 rounded-m3-xs font-black text-xs transition-all flex flex-col items-center justify-center border shadow relative ${
                    !currentSpot.allowedActions.includes('call')
                      ? 'bg-zinc-900 text-zinc-500 border-zinc-800 opacity-50 cursor-help hover:border-zinc-700 hover:text-zinc-300'
                      : userAction === 'call'
                      ? 'bg-emerald-600 border-white text-white ring-2 ring-white'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500'
                  }`}
                  title={!currentSpot.allowedActions.includes('call') ? "Hover, click, or press '2' for GTO context on why calling is disabled" : ""}
                >
                  <div className="flex items-center gap-1">
                    <span>CALL</span>
                    {!currentSpot.allowedActions.includes('call') && (
                      <HelpCircle className="w-3 h-3 text-zinc-500 shrink-0" />
                    )}
                  </div>
                  <span className={`text-[10px] font-normal mt-0.5 ${
                    !currentSpot.allowedActions.includes('call')
                      ? 'text-zinc-500'
                      : 'text-emerald-200'
                  }`}>
                    {!currentSpot.allowedActions.includes('call') ? '(Disabled)' : '(Key 2)'}
                  </span>
                </button>
              </div>

              {/* RAISE BUTTON */}
              <button
                type="button"
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

            {/* Call Disabled Context Card */}
            {!currentSpot.allowedActions.includes('call') && (isCallHovered || showCallDisabledInfo) && (
              <div className="mt-3 p-3.5 bg-zinc-900 border border-zinc-700 rounded-m3-xs text-left text-xs space-y-2 shadow-xl animate-fadeIn relative">
                <button 
                  type="button"
                  onClick={() => setShowCallDisabledInfo(false)}
                  className="absolute top-2.5 right-2.5 text-zinc-400 hover:text-zinc-200 p-0.5"
                  title="Close message"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 pr-4">
                    <div className="font-bold text-amber-300 text-xs">
                      Why is CALL disabled in {formatPositionLabel(currentSpot.heroPosition)} {currentSpot.category === 'rfi' ? 'RFI' : ''}?
                    </div>
                    <p className="text-zinc-300 text-[11px] leading-relaxed">
                      <strong className="text-white">GTO Standard:</strong> In unopened preflop pots from early & late positions ({formatPositionLabel(currentSpot.heroPosition)}), GTO mandates a strict <em>Raise-or-Fold</em> strategy. Open-calling (limping) forfeits pot initiative, gives away preflop equity, and invites players behind to squeeze or over-realize equity.
                    </p>
                    <div className="border-t border-zinc-800 pt-1.5 mt-1 text-[11px] leading-relaxed text-zinc-300">
                      <span className="font-bold text-emerald-400">When CAN calling be a valid choice?</span>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-zinc-300 text-[10.5px]">
                        <li><strong className="text-zinc-100">Small Blind Open:</strong> SB uses a mixed limp/raise strategy against the BB due to discounted pot odds.</li>
                        <li><strong className="text-zinc-100">Facing Opens / 3-Bets:</strong> Defending in position (e.g. BTN vs UTG open) or defending the Big Blind.</li>
                        <li><strong className="text-zinc-100">Exploitative Play:</strong> In loose/passive games with weak players behind who rarely squeeze, multiway limping/flatting with speculative hands (small pocket pairs, suited connectors) can yield high implied odds.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: GTO Solution & Dual 13x13 Range Grid Matrices */}
        <div className="lg:col-span-6 flex flex-col items-center w-full space-y-4">
          {userAction === null && !showHint ? (
            /* Pre-Decision State: Range Grids Hidden / Locked */
            <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 text-center space-y-4 shadow">
              <div className="w-12 h-12 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs flex items-center justify-center mx-auto text-amber-400 shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-base font-bold text-m3-onSurface">GTO Range Matrices Hidden</h3>
                <p className="text-xs text-m3-onSurfaceVariant font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                  Make your play (Fold, Call, or Raise) to test your skills and unlock the full 13x13 GTO Hero & Villain range matrices!
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

                <ul className="text-xs text-m3-onSurfaceVariant space-y-2 font-medium list-disc list-inside">
                  <li><strong className="text-m3-onSurface">Test Decision:</strong> Select Fold, Call, or Raise for Hero using your mouse or keys 1/2/3.</li>
                  <li><strong className="text-m3-onSurface">Hero & Villain Ranges:</strong> Compare Hero's defense/raise strategy directly against Villain's opening range.</li>
                  <li><strong className="text-m3-onSurface">Hint Shortcut:</strong> Press <kbd className="px-1 py-0.5 bg-zinc-800 text-amber-400 rounded font-mono text-[10px]">H</kbd> anytime to reveal GTO ranges.</li>
                </ul>
              </div>
            </div>
          ) : (
            /* Post-Decision State: Revealed Hero & Villain 13x13 Range Grids & GTO Feedback */
            <div className="w-full space-y-5 animate-fadeIn">
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

              {/* HERO 13x13 GTO RANGE MATRIX */}
              <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400 font-mono">
                      HERO RANGE ({currentSpot.heroPosition}):
                    </span>
                    <span className={`px-2 py-0.5 font-black text-[10px] uppercase tracking-wide border rounded-m3-xs ${morphologyMeta.textColor} ${morphologyMeta.badgeBg} ${morphologyMeta.borderColor}`}>
                      {morphologyMeta.label}
                    </span>
                  </div>
                </div>

                <p className="text-xs font-medium text-m3-onSurfaceVariant leading-snug">
                  {currentSpot.morphologyDescription}
                </p>

                <div className="pt-2 border-t border-m3-outlineVariant">
                  <RangeGrid
                    spot={currentSpot}
                    highlightHand={handNotation}
                    overrideTarget="hero"
                    title={`Hero GTO Matrix (${currentSpot.heroPosition})`}
                    showLegend
                  />
                </div>
              </div>

              {/* VILLAIN 13x13 GTO RANGE MATRIX */}
              <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider text-red-400 font-mono">
                      VILLAIN RANGE ({currentSpot.villainPosition || 'OPENER'}):
                    </span>
                    {currentSpot.villainMorphologyStructure && (
                      <span className="px-2 py-0.5 font-black text-[10px] uppercase tracking-wide border rounded-m3-xs bg-red-950/80 text-red-300 border-red-500">
                        {currentSpot.villainMorphologyStructure}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs font-medium text-m3-onSurfaceVariant leading-snug">
                  {currentSpot.villainMorphologyDescription || `Preflop opening / raising range structure for ${currentSpot.villainPosition || 'Villain'}.`}
                </p>

                <div className="pt-2 border-t border-m3-outlineVariant">
                  <RangeGrid
                    spot={currentSpot}
                    overrideTarget="villain"
                    title={`Villain GTO Matrix (${currentSpot.villainPosition || 'Opener'})`}
                    showLegend
                  />
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
      {showPositionalMatrix && (
        <PositionalHandMatrixModal
          handNotation={handNotation}
          tableSize={tableSize}
          currentHeroPosition={currentSpot.heroPosition}
          onClose={() => setShowPositionalMatrix(false)}
          onSelectPositionSpot={(spot) => {
            setCurrentSpot(spot);
            generateNewHand();
          }}
        />
      )}
    </div>
  );
};
