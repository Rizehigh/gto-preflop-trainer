export type Suit = 's' | 'h' | 'd' | 'c';
export type Rank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2';

export interface Card {
  rank: Rank;
  suit: Suit;
}

export type Position = 'UTG' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB';
export type SpotCategory = 'rfi' | 'facing_open' | 'facing_3bet';
export type ActionType = 'fold' | 'call' | 'raise';

export type RangeMorphologyStructure = 'linear' | 'polarized' | 'condensed' | 'mixed';

export type HandCategoryType = 
  | 'pair' 
  | 'suited_broadway' 
  | 'suited_connector' 
  | 'suited_gapper' 
  | 'suited_wheel' 
  | 'offsuit_broadway' 
  | 'offsuit_trash' 
  | 'suited_trash';

export interface ActionFrequencies {
  fold: number;
  call: number;
  raise: number;
}

export interface SpotDefinition {
  id: string;
  name: string;
  description: string;
  category: SpotCategory;
  heroPosition: Position;
  villainPosition?: Position;
  facingAction: string;
  allowedActions: ActionType[];
  raiseLabel: string;
  morphologyStructure: RangeMorphologyStructure;
  morphologyDescription: string;
  ranges: Record<string, ActionFrequencies>;
}

export interface MorphologyInsight {
  title: string;
  handType: HandCategoryType;
  concept: string;
  highCardValue: string;
  suitedness: string;
  connectivity: string;
  blockerValue: string;
  equityRealization: string;
  explanation: string;
}

export interface HandAttempt {
  id: string;
  timestamp: number;
  spotId: string;
  spotName: string;
  heroPosition: Position;
  category: SpotCategory;
  handNotation: string;
  cards: Card[];
  handType: HandCategoryType;
  userAction: ActionType;
  optimalAction: ActionType;
  isCorrect: boolean;
  frequencies: ActionFrequencies;
}

export interface UserStats {
  totalAttempts: number;
  correctAttempts: number;
  streak: number;
  bestStreak: number;
  byPosition: Record<Position, { total: number; correct: number }>;
  byCategory: Record<SpotCategory, { total: number; correct: number }>;
  byHandType: Record<HandCategoryType, { total: number; correct: number }>;
  attemptsHistory: HandAttempt[];
}
