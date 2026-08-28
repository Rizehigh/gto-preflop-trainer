import React, { useState } from 'react';
import { Position, RangeMorphologyStructure, SpotDefinition, TableSize } from '../types/poker';
import { SPOT_DEFINITIONS } from '../data/gtoRanges';
import { getMorphologyStructureMeta } from '../utils/pokerUtils';
import { calculatePositionMathMetrics, getPositionsForTableSize } from '../utils/gtoMath';
import { Brain, CheckCircle2, XCircle, HelpCircle, RefreshCw } from 'lucide-react';

export const RangeQuizSection: React.FC = () => {
  const [currentSpotIndex, setCurrentSpotIndex] = useState<number>(0);
  const [userMorphology, setUserMorphology] = useState<RangeMorphologyStructure | null>(null);
  const [userFrequencyGuess, setUserFrequencyGuess] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [tableSize, setTableSize] = useState<TableSize>(6);

  const spot = SPOT_DEFINITIONS[currentSpotIndex];
  const heroMath = calculatePositionMathMetrics(spot.heroPosition, tableSize);

  const morphologyOptions: { type: RangeMorphologyStructure; label: string; desc: string }[] = [
    { type: 'linear', label: 'Linear Range', desc: 'Top-tier hands down to threshold without gaps (e.g. Early Position Open)' },
    { type: 'polarized', label: 'Polarized Range', desc: 'Nuts + Bluffs with medium hands excluded (e.g. 3-Bet / 4-Bet)' },
    { type: 'condensed', label: 'Condensed Range', desc: 'Medium strength hands flatting/calling with top hands capped (e.g. BB Defend)' },
    { type: 'mixed', label: 'Mixed Range', desc: 'Split frequency equilibrium plays (e.g. SB RFI vs BB)' }
  ];

  const frequencyChoices = [
    7.5, 11.8, 15.2, 19.2, 27.5, 45.5, 50.5
  ];

  const actualMorphology = spot.morphologyStructure;
  const actualFrequency = heroMath.gtoRfiFrequency || 15.2;

  const handleSubmit = () => {
    if (!userMorphology || userFrequencyGuess === null) return;
    setIsSubmitted(true);
  };

  const handleNextQuiz = () => {
    setUserMorphology(null);
    setUserFrequencyGuess(null);
    setIsSubmitted(false);
    setCurrentSpotIndex((prev) => (prev + 1) % SPOT_DEFINITIONS.length);
  };

  const isMorphologyCorrect = userMorphology === actualMorphology;
  const isFrequencyCorrect = userFrequencyGuess !== null && Math.abs(userFrequencyGuess - actualFrequency) <= 3.0;

  return (
    <div className="w-full bg-m3-surfaceContainerLow border border-m3-outline rounded-m3-md p-6 space-y-6 shadow">
      
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-m3-outlineVariant pb-4">
        <div>
          <div className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Brain className="w-4 h-4 text-amber-400" />
            <span>Range Predictor & Morphology Quiz</span>
          </div>
          <h2 className="text-lg font-bold text-m3-onSurface mt-0.5">
            Guess the Range Structure & GTO Opening Frequency
          </h2>
        </div>

        <button
          onClick={handleNextQuiz}
          className="px-3 py-1.5 bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright text-m3-onSurface font-bold rounded-m3-xs text-xs flex items-center gap-2 transition-colors border border-m3-outlineVariant shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Next Quiz Spot</span>
        </button>
      </div>

      {/* Spot Challenge Banner */}
      <div className="bg-zinc-950 p-4 rounded-m3-md border border-m3-outlineVariant space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-amber-400 font-extrabold font-mono uppercase">{spot.name}</span>
          <span className="text-zinc-400 font-bold">Hero Position: <strong className="text-white font-mono">{spot.heroPosition}</strong></span>
        </div>
        <p className="text-xs text-zinc-300 font-medium">
          {spot.description}
        </p>
      </div>

      {/* Quiz Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Question 1: Morphology Structure */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <span>1. What is the Range Morphology Structure?</span>
          </div>

          <div className="space-y-2">
            {morphologyOptions.map((opt) => (
              <button
                key={opt.type}
                disabled={isSubmitted}
                onClick={() => setUserMorphology(opt.type)}
                className={`w-full text-left p-3 rounded-m3-xs border transition-all flex flex-col space-y-0.5 ${
                  userMorphology === opt.type
                    ? 'bg-amber-950/60 border-amber-400 text-white ring-1 ring-amber-400/50'
                    : 'bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright border-m3-outlineVariant text-m3-onSurfaceVariant'
                } ${isSubmitted ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                <div className="text-xs font-bold text-amber-200 capitalize flex items-center justify-between">
                  <span>{opt.label}</span>
                  {isSubmitted && opt.type === actualMorphology && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
                <div className="text-[11px] text-zinc-400 font-medium">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Question 2: GTO Frequency % */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-m3-onSurface uppercase tracking-wider flex items-center gap-2">
            <span>2. What is the GTO Frequency % for this Spot?</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {frequencyChoices.map((freq) => (
              <button
                key={freq}
                disabled={isSubmitted}
                onClick={() => setUserFrequencyGuess(freq)}
                className={`p-3 rounded-m3-xs border text-center transition-all text-xs font-mono font-bold ${
                  userFrequencyGuess === freq
                    ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 ring-1 ring-emerald-400/50'
                    : 'bg-m3-surfaceContainerHigh hover:bg-m3-surfaceBright border-m3-outlineVariant text-m3-onSurface'
                } ${isSubmitted ? 'cursor-not-allowed opacity-90' : ''}`}
              >
                {freq}% Range
              </button>
            ))}
          </div>

          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={!userMorphology || userFrequencyGuess === null}
              className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 font-extrabold rounded-m3-xs text-xs uppercase tracking-wider transition-colors shadow"
            >
              Submit Range Prediction
            </button>
          ) : (
            <div className="bg-zinc-950 p-4 rounded-m3-xs border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-extrabold">
                {isMorphologyCorrect && isFrequencyCorrect ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Perfect Range Prediction!
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4" /> Solution Feedback
                  </span>
                )}
              </div>

              <div className="text-xs text-zinc-300 space-y-1 font-mono">
                <div>Actual Morphology: <span className="text-amber-300 font-bold uppercase">{actualMorphology}</span></div>
                <div>Actual Frequency: <span className="text-emerald-300 font-bold">{actualFrequency}%</span></div>
              </div>

              <p className="text-xs text-zinc-400 font-medium border-t border-zinc-800 pt-2">
                {spot.morphologyDescription}
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
