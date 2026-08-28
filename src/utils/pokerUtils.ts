import { ActionFrequencies, ActionType, Card, HandCategoryType, Position, Rank, RangeMorphologyStructure, Suit } from '../types/poker';

export const RANKS: Rank[] = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
export const SUITS: Suit[] = ['s', 'h', 'd', 'c'];

export const SUIT_SYMBOLS: Record<Suit, string> = {
  s: '♠',
  h: '♥',
  d: '♦',
  c: '♣'
};

export const SUIT_NAMES: Record<Suit, string> = {
  s: 'Spades',
  h: 'Hearts',
  d: 'Diamonds',
  c: 'Clubs'
};

export const SUIT_COLORS: Record<Suit, string> = {
  s: 'text-slate-100', // Spades
  h: 'text-red-500',   // Hearts
  d: 'text-amber-400', // Diamonds (Warm Gold)
  c: 'text-emerald-500' // Clubs (Emerald Green)
};

export const SUIT_BG: Record<Suit, string> = {
  s: 'bg-slate-800 text-slate-100 border border-slate-700',
  h: 'bg-red-950/80 text-red-400 border border-red-800/50',
  d: 'bg-amber-950/80 text-amber-400 border border-amber-800/50',
  c: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
};

export function getRankValue(rank: Rank): number {
  const values: Record<Rank, number> = {
    'A': 14, 'K': 13, 'Q': 12, 'J': 11, 'T': 10,
    '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2
  };
  return values[rank];
}

export function getMatrixHandNotation(rowIdx: number, colIdx: number): string {
  const r1 = RANKS[rowIdx];
  const r2 = RANKS[colIdx];

  if (rowIdx === colIdx) {
    return r1 + r2;
  } else if (rowIdx < colIdx) {
    return r1 + r2 + 's';
  } else {
    return r2 + r1 + 'o';
  }
}

export function getAll169Hands(): string[] {
  const hands: string[] = [];
  for (let r = 0; r < 13; r++) {
    for (let c = 0; c < 13; c++) {
      hands.push(getMatrixHandNotation(r, c));
    }
  }
  return hands;
}

export function getHandCombosCount(notation: string): number {
  if (notation.length === 2) return 6; // Pair (e.g. AA)
  if (notation.endsWith('s')) return 4; // Suited (e.g. AKs)
  return 12; // Offsuit (e.g. AKo)
}

export function classifyHandType(notation: string): HandCategoryType {
  if (notation.length === 2) {
    return 'pair';
  }

  const r1 = notation[0] as Rank;
  const r2 = notation[1] as Rank;
  const v1 = getRankValue(r1);
  const v2 = getRankValue(r2);
  const isSuited = notation.endsWith('s');
  const isBroadway = v1 >= 10 && v2 >= 10;
  const gap = Math.abs(v1 - v2);

  if (isSuited) {
    if (isBroadway) return 'suited_broadway';
    if (v1 === 14 && v2 <= 5) return 'suited_wheel';
    if (gap === 1) return 'suited_connector';
    if (gap === 2 || gap === 3) return 'suited_gapper';
    return 'suited_trash';
  } else {
    if (isBroadway) return 'offsuit_broadway';
    return 'offsuit_trash';
  }
}

export function dealCardsForNotation(notation: string): Card[] {
  const r1 = notation[0] as Rank;
  const r2 = notation[1] as Rank;

  if (notation.length === 2) {
    // Pair
    const availableSuits = [...SUITS];
    const s1Idx = Math.floor(Math.random() * availableSuits.length);
    const s1 = availableSuits.splice(s1Idx, 1)[0];
    const s2Idx = Math.floor(Math.random() * availableSuits.length);
    const s2 = availableSuits[s2Idx];
    return [{ rank: r1, suit: s1 }, { rank: r2, suit: s2 }];
  } else if (notation.endsWith('s')) {
    // Suited
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    return [{ rank: r1, suit }, { rank: r2, suit }];
  } else {
    // Offsuit
    const s1 = SUITS[Math.floor(Math.random() * SUITS.length)];
    let s2 = SUITS[Math.floor(Math.random() * SUITS.length)];
    while (s2 === s1) {
      s2 = SUITS[Math.floor(Math.random() * SUITS.length)];
    }
    return [{ rank: r1, suit: s1 }, { rank: r2, suit: s2 }];
  }
}

export function getOptimalAction(freq: ActionFrequencies): ActionType {
  const { fold, call, raise } = freq;
  if (raise >= call && raise >= fold) return 'raise';
  if (call >= raise && call >= fold) return 'call';
  return 'fold';
}

export function evaluateUserAction(userAction: ActionType, freq: ActionFrequencies): {
  isCorrect: boolean;
  isMixed: boolean;
  optimalAction: ActionType;
  message: string;
} {
  const optimalAction = getOptimalAction(freq);
  const userFreq = freq[userAction] || 0;
  const optFreq = freq[optimalAction] || 0;
  
  const isMixed = optFreq < 0.85 && optFreq > 0.15;
  const isCorrect = userFreq >= 0.15;

  let message = '';
  if (isCorrect) {
    if (userFreq >= 0.85) {
      message = 'Spot on! Pure ' + userAction.toUpperCase() + ' (' + Math.round(userFreq * 100) + '% frequency).';
    } else {
      message = 'Great play! ' + userAction.toUpperCase() + ' is a valid GTO option in this mixed strategy spot (' + Math.round(userFreq * 100) + '% frequency).';
    }
  } else {
    message = 'Inaccurate play. ' + userAction.toUpperCase() + ' has 0% (or negligible) GTO frequency here. Optimal is ' + optimalAction.toUpperCase() + ' (' + Math.round(optFreq * 100) + '%).';
  }

  return { isCorrect, isMixed, optimalAction, message };
}

export function getMorphologyStructureMeta(structure: RangeMorphologyStructure): {
  label: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  description: string;
} {
  switch (structure) {
    case 'linear':
      return {
        label: 'Linear Range',
        badgeBg: 'bg-emerald-950/80',
        textColor: 'text-emerald-300',
        borderColor: 'border-emerald-700/60',
        description: 'Contains top-tier hands sequentially down to an equity threshold without gaps.'
      };
    case 'polarized':
      return {
        label: 'Polarized Range',
        badgeBg: 'bg-red-950/80',
        textColor: 'text-red-300',
        borderColor: 'border-red-700/60',
        description: 'Combines monster premium value hands + blocker-heavy bluffs, omitting medium hands.'
      };
    case 'condensed':
      return {
        label: 'Condensed Range',
        badgeBg: 'bg-amber-950/80',
        textColor: 'text-amber-300',
        borderColor: 'border-amber-700/60',
        description: 'Contains medium-strength hands & suited broadways calling to preserve pot odds without top premiums.'
      };
    case 'mixed':
      return {
        label: 'Mixed Range',
        badgeBg: 'bg-purple-950/80',
        textColor: 'text-purple-300',
        borderColor: 'border-purple-700/60',
        description: 'Fractionally splits actions (e.g. 50% Raise / 50% Call) to maintain GTO equilibrium.'
      };
  }
}

export function formatPositionLabel(pos: Position): string {
  const map: Record<Position, string> = {
    UTG: 'Under the Gun (UTG)',
    'UTG+1': 'Under the Gun +1 (UTG+1)',
    'UTG+2': 'Under the Gun +2 (UTG+2)',
    MP: 'Middle Position (MP)',
    MP1: 'Middle Position 1 (MP1)',
    MP2: 'Middle Position 2 (MP2)',
    MP3: 'Middle Position 3 (MP3)',
    HJ: 'Hijack (HJ)',
    CO: 'Cutoff (CO)',
    BTN: 'Button (BTN)',
    SB: 'Small Blind (SB)',
    BB: 'Big Blind (BB)'
  };
  return map[pos] || pos;
}

export function formatHandCategoryLabel(cat: HandCategoryType): string {
  const map: Record<HandCategoryType, string> = {
    pair: 'Pocket Pairs',
    suited_broadway: 'Suited Broadways',
    suited_connector: 'Suited Connectors',
    suited_gapper: 'Suited Gappers',
    suited_wheel: 'Suited Wheels (A2s-A5s)',
    offsuit_broadway: 'Offsuit Broadways',
    offsuit_trash: 'Offsuit Trash',
    suited_trash: 'Suited Trash'
  };
  return map[cat];
}
