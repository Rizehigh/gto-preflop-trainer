import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ActionType, Card, HandAttempt, Position, SpotDefinition, TableSize } from '../types/poker';
import { SPOT_DEFINITIONS } from '../data/gtoRanges';
import { classifyHandType, dealCardsForNotation, evaluateUserAction, formatPositionLabel, getAll169Hands, getMorphologyStructureMeta } from '../utils/pokerUtils';
import { OPPONENT_PROFILES, OpponentArchetypeId, ExploitResult, evaluateExploitativeAction, getOpponentVillainRange } from '../data/opponentProfiles';
import { sounds } from '../utils/soundEffects';
import { PokerTable } from './PokerTable';
import { PlayingCard } from './PlayingCard';
import { MorphologyExplanation } from './MorphologyExplanation';
import { RangeGrid } from './RangeGrid';
import { PositionalHandMatrixModal } from './PositionalHandMatrixModal';
import { PositionalRangeGrid } from './PositionalRangeGrid';
import { GtoMathToolbar } from './GtoMathToolbar';
import { Filter, RefreshCw, ShieldAlert, Lock, Eye, GraduationCap, Lightbulb, Users, UserCheck, HelpCircle, Info, X, Sparkles, Target, Zap } from 'lucide-react';

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
  const [showPositionalGrid, setShowPositionalGrid] = useState<boolean>(false);

  // Exploitative Mode States
  const [isExploitMode, setIsExploitMode] = useState<boolean>(false);
  const [selectedOpponent, setSelectedOpponent] = useState<OpponentArchetypeId | 'random'>('random');
  const [activeOpponentId, setActiveOpponentId] = useState<OpponentArchetypeId>('maniac');

  const [evaluation, setEvaluation] = useState<{
    isCorrect: boolean;
    isMixed: boolean;
    optimalAction: ActionType;
    message: string;
  } | null>(null);

  const [exploitResult, setExploitResult] = useState<ExploitResult | null>(null);

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

    // Set Opponent Archetype for this hand
    if (selectedOpponent === 'random') {
      const archetypes: OpponentArchetypeId[] = ['maniac', 'calling_station', 'nit', 'wild'];
      const chosen = archetypes[Math.floor(Math.random() * archetypes.length)];
      setActiveOpponentId(chosen);
    } else {
      setActiveOpponentId(selectedOpponent);
    }

    setUserAction(null);
    setEvaluation(null);
    setExploitResult(null);
    setShowHint(false);
    setShowCallDisabledInfo(false);
    setIsCallHovered(false);

    sounds.playCardDeal();
  }, [selectedSpotId, selectedCategory, leakPosition, selectedOpponent]);

  useEffect(() => {
    generateNewHand();
  }, [generateNewHand]);

  const handleActionPick = (action: ActionType) => {
    if (userAction !== null) return;

    const freq = currentSpot.ranges[handNotation] || { fold: 1, call: 0, raise: 0 };
    
    let evalResult;
    let exploitRes: ExploitResult | null = null;

    if (isExploitMode) {
      exploitRes = evaluateExploitativeAction(action, handNotation, currentSpot, activeOpponentId);
      evalResult = {
        isCorrect: exploitRes.isCorrect,
        isMixed: false,
        optimalAction: exploitRes.optimalExploitAction,
        message: exploitRes.message
      };
      setExploitResult(exploitRes);
    } else {
      evalResult = evaluateUserAction(action, freq);
    }
    
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
      frequencies: freq,
      isExploitMode,
      opponentArchetype: isExploitMode ? activeOpponentId : undefined
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
  const activeOpponentProfile = isExploitMode ? OPPONENT_PROFILES[activeOpponentId] : null;

  return (
    <div className={`w-full mx-auto space-y-5 transition-all duration-500 ${showPositionalGrid ? 'max-w-[1700px]' : 'max-w-7xl'}`}>
      
      {/* Mode & Controls Header */}
      <div className="bg-m3-surfaceContainerLow border border-m3-outline p-4 rounded-m3-md flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-m3-surfaceContainer p-1 rounded-m3-xs border border-m3-outlineVariant">
            <button
              onClick={() => setIsExploitMode(false)}
              className={`px-3 py-1 text-xs font-extrabold rounded-m3-xs transition-all flex items-center gap-1.5 ${
                !isExploitMode
                  ? 'bg-m3-primary text-m3-onPrimary shadow-sm'
                  : 'text-m3-onSurfaceVariant hover:text-m3-onSurface'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>GTO Standard</span>
            </button>

            <button
              onClick={() => setIsExploitMode(true)}
              className={`px-3 py-1 text-xs font-extrabold rounded-m3-xs transition-all flex items-center gap-1.5 ${
                isExploitMode
                  ? 'bg-amber-500 text-zinc-950 shadow-sm'
                  : 'text-m3-onSurfaceVariant hover:text-m3-onSurface hover:bg-m3-surfaceBright'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Exploitative Mode</span>
            </button>
          </div>

          {/* Spot Selectors */}
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

          {/* Opponent Archetype Selector (when in Exploitative Mode) */}
          {isExploitMode && (
            <div className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-500/60 px-2.5 py-1 rounded-m3-xs">
              <span className="text-[11px] font-bold text-amber-300">Opponent:</span>
              <select
                value={selectedOpponent}
                onChange={(e) => setSelectedOpponent(e.target.value as any)}
                className="bg-zinc-900 text-amber-200 border border-amber-600/50 rounded text-xs font-bold px-2 py-0.5 focus:outline-none"
              >
                <option value="random">🎲 Random Opponent</option>
                <option value="maniac">💣 Maniac (Super Aggressive)</option>
                <option value="calling_station">🦥 Calling Station (Passive)</option>
                <option value="nit">🐢 Ultra Tight Nit</option>
                <option value="wild">🎲 Wild / Unpredictable</option>
              </select>
            </div>
          )}

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
            title="Toggle Solution Hint (Key H)"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Hide Hint (H)' : 'Peek Hint (H)'}</span>
          </button>

          <button
            onClick={generateNewHand}
            className="px-4 py-1.5 bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright text-m3-onSurface font-bold rounded-m3-xs text-sm flex items-center gap-2 transition-colors border border-m3-outlineVariant shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-m3-primary" />
            <span>New Hand</span>
          </button>
        </div>
      </div>

      {/* Exploitative Mode Banner (when active) */}
      {isExploitMode && activeOpponentProfile && (
        <div className={`p-4 rounded-m3-md border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow ${activeOpponentProfile.bgColor} ${activeOpponentProfile.borderColor}`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl p-2 bg-zinc-900/80 border border-zinc-700 rounded-m3-xs shadow-inner">
              {activeOpponentProfile.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white">{activeOpponentProfile.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${activeOpponentProfile.badgeColor}`}>
                  {activeOpponentProfile.shortName}
                </span>
              </div>
              <p className="text-xs text-zinc-200 font-medium mt-0.5">
                {activeOpponentProfile.tagline}
              </p>
            </div>
          </div>

          <div className="text-xs space-y-1 md:text-right max-w-md bg-zinc-950/60 p-2.5 rounded-m3-xs border border-white/10">
            <div className="font-bold text-amber-300 flex items-center gap-1 md:justify-end">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Exploit Focus:</span>
            </div>
            <p className="text-zinc-200 font-medium text-[11px] leading-tight">
              {activeOpponentProfile.exploitSummary}
            </p>
          </div>
        </div>
      )}

      {/* Main Grid Flex Container - Attached columns */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full overflow-x-auto pb-4 transition-all duration-500">
        
        {/* Left Column: Positional Range Grid Inspector (Attached when open) */}
        {showPositionalGrid && (
          <div className="w-full lg:w-[420px] xl:w-[480px] shrink-0 animate-fadeIn">
            <PositionalRangeGrid
              handNotation={handNotation}
              tableSize={tableSize}
              currentHeroPosition={currentSpot.heroPosition}
              onClose={() => setShowPositionalGrid(false)}
              onSelectPositionSpot={(spot) => {
                setCurrentSpot(spot);
                setUserAction(null);
                setShowHint(false);
                setEvaluation(null);
              }}
            />
          </div>
        )}
        
        {/* Main Column: Poker Table & Action Controls */}
        <div className="w-full lg:flex-1 lg:min-w-[540px] shrink-0 flex flex-col items-center bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 shadow-sm relative space-y-4">
          
          <PokerTable
            heroPosition={currentSpot.heroPosition}
            villainPosition={currentSpot.villainPosition}
            spotName={currentSpot.name}
            facingAction={currentSpot.facingAction}
            tableSize={tableSize}
            onTableSizeChange={setTableSize}
            onSelectSeat={() => setShowPositionalMatrix(true)}
            opponentProfile={activeOpponentProfile}
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
              <span className="text-base text-m3-onSurfaceVariant font-bold">
                Hero: {formatPositionLabel(currentSpot.heroPosition)}
              </span>
            </div>

            <button
              onClick={() => setShowPositionalGrid(!showPositionalGrid)}
              className={`px-3.5 py-1.5 border rounded-m3-xs text-sm font-bold flex items-center gap-2 transition-colors shadow-sm ${showPositionalGrid ? 'bg-amber-500 text-zinc-950 border-amber-400' : 'bg-amber-950/80 hover:bg-amber-900 border-amber-500/80 text-amber-300'}`}
              title="See what this hand would do from every position around the table"
            >
              <UserCheck className={`w-4 h-4 ${showPositionalGrid ? 'text-zinc-950' : 'text-amber-400'}`} />
              <span>{showPositionalGrid ? 'Hide Inspector' : `Inspect ${handNotation} Across All Positions`}</span>
            </button>
          </div>

          {/* Action Buttons & GTO Math Toolbar */}
          <div className="w-full max-w-xl md:max-w-2xl lg:max-w-3xl space-y-3">
            <div className="text-base font-bold text-m3-onSurfaceVariant text-center uppercase tracking-wider mb-2">
              {isExploitMode ? 'Select Optimal Exploitative Play' : 'Select Optimal GTO Play'}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* FOLD BUTTON */}
              <button
                onClick={() => handleActionPick('fold')}
                disabled={userAction !== null}
                className={`py-4 px-5 rounded-m3-xs font-black text-base transition-all flex flex-col items-center justify-center border shadow ${
                  userAction === 'fold'
                    ? 'bg-zinc-700 border-white text-white ring-2 ring-white'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-600'
                }`}
              >
                <span>FOLD</span>
                <span className="text-xs text-zinc-400 font-normal mt-0.5">(Key 1)</span>
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
                  className={`w-full py-4 px-5 rounded-m3-xs font-black text-base transition-all flex flex-col items-center justify-center border shadow relative ${
                    !currentSpot.allowedActions.includes('call')
                      ? 'bg-zinc-900 text-zinc-500 border-zinc-800 opacity-50 cursor-help hover:border-zinc-700 hover:text-zinc-300'
                      : userAction === 'call'
                      ? 'bg-emerald-600 border-white text-white ring-2 ring-white'
                      : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-500'
                  }`}
                  title={!currentSpot.allowedActions.includes('call') ? "Hover, click, or press '2' for context on why calling is disabled" : ""}
                >
                  <div className="flex items-center gap-1">
                    <span>CALL</span>
                    {!currentSpot.allowedActions.includes('call') && (
                      <HelpCircle className="w-3 h-3 text-zinc-500 shrink-0" />
                    )}
                  </div>
                  <span className={`text-xs font-normal mt-0.5 ${
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
                className={`py-4 px-5 rounded-m3-xs font-black text-base transition-all flex flex-col items-center justify-center border shadow ${
                  userAction === 'raise'
                    ? 'bg-red-600 border-white text-white ring-2 ring-white'
                    : 'bg-red-700 hover:bg-red-600 text-white border-red-500'
                }`}
              >
                <span>{currentSpot.raiseLabel.split(' ')[0]}</span>
                <span className="text-xs text-red-200 font-normal mt-0.5">(Key 3)</span>
              </button>
            </div>

            {/* Call Disabled Context Card */}
            {!currentSpot.allowedActions.includes('call') && (isCallHovered || showCallDisabledInfo) && (
              <div className="mt-3 p-4 bg-zinc-900 border border-zinc-700 rounded-m3-xs text-left text-sm space-y-2 shadow-xl animate-fadeIn relative">
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
                    <div className="font-bold text-amber-300 text-sm">
                      Why is CALL disabled in {formatPositionLabel(currentSpot.heroPosition)} {currentSpot.category === 'rfi' ? 'RFI' : ''}?
                    </div>
                    <p className="text-zinc-300 text-sm leading-relaxed">
                      <strong className="text-white">GTO Standard:</strong> In unopened preflop pots from early & late positions ({formatPositionLabel(currentSpot.heroPosition)}), GTO mandates a strict <em>Raise-or-Fold</em> strategy. Open-calling (limping) forfeits pot initiative, gives away preflop equity, and invites players behind to squeeze or over-realize equity.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* GTO Equity & Math Intelligence Toolbar */}
            <GtoMathToolbar spot={currentSpot} handNotation={handNotation} />
          </div>
        </div>

        {/* Right Column: Solution Grid & Feedback */}
        <div className="w-full lg:flex-1 lg:min-w-[540px] shrink-0 space-y-4 flex flex-col items-center">
          {userAction === null && !showHint ? (
            /* Pre-Decision Locked State */
            <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 text-center space-y-4 shadow">
              <div className="w-12 h-12 bg-m3-surfaceContainerHigh border border-m3-outlineVariant rounded-m3-xs flex items-center justify-center mx-auto text-m3-primary shadow-sm">
                <Lock className="w-6 h-6" />
              </div>
              
              <div>
                <h3 className="text-base font-bold text-m3-onSurface">
                  {isExploitMode ? 'Exploit Mode Matrix Locked' : 'GTO Solution Matrix Locked'}
                </h3>
                <p className="text-sm text-m3-onSurfaceVariant font-medium mt-1 max-w-sm mx-auto leading-relaxed">
                  Make your decision or press <strong className="text-amber-400 font-mono">H</strong> for a hint.
                </p>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={() => setShowHint(true)}
                  className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 rounded-m3-xs text-sm flex items-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Reveal Solution Hint (Key H)</span>
                </button>
              </div>

              {isExploitMode && activeOpponentProfile && (
                <div className="bg-amber-950/40 p-3.5 rounded-m3-xs border border-amber-500/40 text-left space-y-1.5">
                  <div className="text-sm font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    <span>Targeting Opponent Tendency:</span>
                  </div>
                  <ul className="text-sm text-zinc-300 space-y-1 font-medium list-disc list-inside">
                    <li><strong>RFI:</strong> {activeOpponentProfile.tendencies.rfiTendency}</li>
                    <li><strong>Facing Open:</strong> {activeOpponentProfile.tendencies.facingOpenTendency}</li>
                    <li><strong>Facing 3-Bet:</strong> {activeOpponentProfile.tendencies.facing3betTendency}</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            /* Unlocked Solution Grid & Feedback */
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
                  opponentProfile={activeOpponentProfile}
                  exploitResult={exploitResult}
                />
              )}

              {/* GTO Range Matrix with Hero/Villain Toggle */}
              <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-4 shadow space-y-3">
                <div className={`p-3 rounded-m3-xs border flex flex-col gap-1 ${morphologyMeta.badgeBg} ${morphologyMeta.borderColor}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm uppercase font-extrabold tracking-wider text-m3-onSurface">
                      Spot Range Morphology
                    </span>
                    <span className={`px-2.5 py-0.5 font-black text-xs uppercase tracking-wide border rounded-m3-xs ${morphologyMeta.textColor} ${morphologyMeta.borderColor}`}>
                      {morphologyMeta.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-300 leading-snug mt-0.5">
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

      {/* Modal for Positional Matrix */}
      {showPositionalMatrix && (
        <PositionalHandMatrixModal
          handNotation={handNotation}
          currentHeroPosition={currentSpot.heroPosition}
          tableSize={tableSize}
          onClose={() => setShowPositionalMatrix(false)}
        />
      )}
    </div>
  );
};