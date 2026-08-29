import { RangeMorphologyStructure } from '../types/poker';

export interface MorphologyMnemonic {
  id: RangeMorphologyStructure;
  name: string;
  shapeName: string;
  shapeIcon: string;
  mnemonicPhrase: string;
  visualDescription: string;
  matrixPatternDesc: string;
  exampleSpots: string[];
  keyTakeaway: string;
}

export const MORPHOLOGY_MNEMONICS: Record<RangeMorphologyStructure, MorphologyMnemonic> = {
  linear: {
    id: 'linear',
    name: 'Linear Range',
    shapeName: 'Solid Wedge / Pyramid',
    shapeIcon: '📐',
    mnemonicPhrase: '"Linear is a Ladder — Solid Wedge from the Top!"',
    visualDescription: 'A solid triangular block filling the top-left corner of the 13x13 grid without gaps.',
    matrixPatternDesc: 'Starts at AA in the top-left (0,0) and expands outwards linearly down the pocket pair diagonal and out across suited broadways as position gets later.',
    exampleSpots: ['UTG Open Raise (RFI)', 'HJ Open Raise (RFI)', 'CO Open Raise (RFI)', 'Button Open Raise (RFI)'],
    keyTakeaway: 'In unopened pots, open-raise your top X% of hands purely by equity strength.'
  },
  polarized: {
    id: 'polarized',
    name: 'Polarized Range',
    shapeName: 'Two Horns / Double Wings',
    shapeIcon: '🐂',
    mnemonicPhrase: '"Polarized has Two Horns — Top Nuts & Blocker Bluffs!"',
    visualDescription: 'Two separate clusters on the 13x13 grid: a top-left value block (AA-QQ, AK) + a bottom-left suited bluff wing (A5s-A2s, 87s). The middle is empty.',
    matrixPatternDesc: 'Skips medium-strength hands (which check or flat call) and plays only extreme nuts for value plus equity-rich Ace-blockers/suited connectors for bluffs.',
    exampleSpots: ['BTN 3-Bet vs UTG Open', 'BTN 4-Bet vs BB 3-Bet', 'SB Multiway Squeeze'],
    keyTakeaway: '3-bet & 4-bet with a balance of monsters that get called for value and blockers that force folds.'
  },
  condensed: {
    id: 'condensed',
    name: 'Condensed Range',
    shapeName: 'Capped Belt / Middle Saddle',
    shapeIcon: '🥋',
    mnemonicPhrase: '"Condensed is the Belt — Capped Top, Wide Middle!"',
    visualDescription: 'A wide horizontal band across medium pocket pairs (88-22), suited connectors, and medium broadways. Top premiums (AA/KK) are capped/missing.',
    matrixPatternDesc: 'Missing the top-left monster corner (because AA/KK/AK were 3-bet). Contains a dense middle band of medium hands defending against open raises.',
    exampleSpots: ['Big Blind Defense vs BTN Open', 'Big Blind Defense vs UTG Open', 'BTN Flat Call vs UTG Open'],
    keyTakeaway: 'Flat-call to realize pot odds with speculative & medium hands while keeping top monsters in your 3-bet range.'
  },
  mixed: {
    id: 'mixed',
    name: 'Mixed Range',
    shapeName: 'Checkerboard / Split Gradient',
    shapeIcon: '🏁',
    mnemonicPhrase: '"Mixed is a Split Matrix — Balance Frequencies to Stay Unexploitable!"',
    visualDescription: 'A multi-colored gradient across cells where hands are split into fractional percentages (e.g. 50% Raise / 50% Call/Limp or Fold).',
    matrixPatternDesc: 'Indicates GTO indifference: multiple actions have identical Expected Value (0 EV diff). Splitting actions prevents opponents from exploiting your line.',
    exampleSpots: ['Small Blind Open (RFI) vs BB', 'BB Defense Boundary Hands', 'Marginal 3-Bet/Flat Boundaries'],
    keyTakeaway: 'Randomize actions on threshold hands so opponents cannot read your range strength.'
  }
};

export const MATRIX_ARROW_MNEMONIC = {
  title: 'The GTO 13x13 Arrowhead & Spear Layout',
  mnemonicPhrase: '"Suited Soars Up-Right (Wings), Offsuit Shrinks Down-Left (Stubs), Pairs Form the Arrowhead Diagonal!"',
  components: [
    {
      region: 'Central Diagonal (Top-Left to Bottom-Right)',
      label: 'Pocket Pairs Spine (AA → 22)',
      icon: '🎯',
      desc: 'The 13 pocket pair cells form the sharp central diagonal spine pointing towards 22. 6 combinations per pair.'
    },
    {
      region: 'Top-Right Triangle (Above Diagonal)',
      label: 'Suited Hands Wing (+3-4% Equity Bonus)',
      icon: '🦅',
      desc: 'Suited hands (AKs down to A2s, 87s, K2s) carry flush multi-barrel equity. They extend out wide like an arrow wing.'
    },
    {
      region: 'Bottom-Left Triangle (Below Diagonal)',
      label: 'Offsuit Hands Stub (Domination & Reverse Implied Odds)',
      icon: '🪵',
      desc: 'Offsuit hands (AKo to 72o) have 12 combos each but lack flush equity. They shrink close to the diagonal line.'
    }
  ]
};
