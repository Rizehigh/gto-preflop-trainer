import { Position, PositionMathMetrics, TableSize } from '../types/poker';

/**
 * Ordered seat positions clockwise around the table ending at BB.
 * Maps exact seat ordering for 6-Max to 10-Max configurations.
 * 
 * Seat Ring Dynamics:
 * - Early Positions (UTG, UTG+1, UTG+2): Highest risk of encountering 3-bets behind.
 * - Middle Positions (MP1, MP2, MP3, HJ): Transition zone with dynamic range expansion.
 * - Late Positions (CO, BTN): Positional leverage zone with positional advantage postflop.
 * - Blinds (SB, BB): Forced dead money posts; OOP postflop or absolute closing action.
 */
export function getPositionsForTableSize(size: TableSize): Position[] {
  switch (size) {
    case 6:
      return ['UTG', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    case 7:
      return ['UTG', 'UTG+1', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    case 8:
      return ['UTG', 'UTG+1', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    case 9:
      return ['UTG', 'UTG+1', 'UTG+2', 'MP1', 'MP2', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
    case 10:
      return ['UTG', 'UTG+1', 'UTG+2', 'MP1', 'MP2', 'MP3', 'HJ', 'CO', 'BTN', 'SB', 'BB'];
  }
}

/**
 * Returns seats distance from the Button (In-Position distance indicator).
 * - BTN = 0 (Absolute in-position player postflop)
 * - CO = 1, HJ = 2, MP/MP3 = 3, MP2 = 4, MP1 = 5, UTG+2 = 5, UTG+1 = 6, UTG = 7
 * - SB = 0.5 (Acts before BB preflop, out of position postflop)
 * - BB = 0 (Closes preflop action facing raises)
 */
export function getSeatsToButton(pos: Position): number {
  switch (pos) {
    case 'BTN': return 0;
    case 'CO': return 1;
    case 'HJ': return 2;
    case 'MP':
    case 'MP3': return 3;
    case 'MP2': return 4;
    case 'MP1': return 5;
    case 'UTG+2': return 5;
    case 'UTG+1': return 6;
    case 'UTG': return 7;
    case 'SB': return 0.5;
    case 'BB': return 0;
  }
}

/**
 * Calculates GTO preflop math metrics for any seat and table size (6 to 10 max).
 * 
 * MATHEMATICAL FORMULAS & COMBINATORICS:
 * 
 * 1. Players Remaining Behind (n):
 *    n = Total Seats - 1 - Hero Seat Index
 *    Quantifies the cold-call and 3-bet friction Hero faces when opening the pot.
 * 
 * 2. Premium Hand Risk Probability P(Premium Behind):
 *    Formula: P = 1 - (1 - p)^n
 *    Where p = 0.0483 (4.83% chance of a random hand being in {AA, KK, QQ, JJ, AKs, AKo}).
 *    - Total starting hand combinations in Hold'em: C(52, 2) = 1,326 combos.
 *    - Premium hand combinations count:
 *        • 4 Pocket Pairs {AA, KK, QQ, JJ} = 4 x 6 = 24 combos
 *        • AKs = 4 combos
 *        • AKo = 12 combos
 *        • Total Premium Combos = 24 + 4 + 12 = 40 combos (~3.02%)
 *        • Including TT, AQs, AQo raises top premium tier to 64 combos (4.83%).
 *    - Binomial Independent Assumption:
 *        • P(No Premium in 1 hand) = (1 - 0.048) = 0.952
 *        • P(No Premium in n hands) = 0.952^n
 *        • P(At least 1 Premium behind) = 1 - 0.952^n
 *    - Example (10-Max UTG with n=9 players behind):
 *        P = 1 - (0.952)^9 = 1 - 0.640 = 0.360 -> 36.0% probability of facing a monster hand behind!
 * 
 * 3. GTO Raise First In (RFI) Frequencies (% of total 1,326 combos opened):
 *    - Solver Benchmarks (100BB 500NL/1000NL rake-adjusted Nash Equilibria):
 *        • 10-Max UTG (9 behind):  7.5% (~100 combos: 99+, AJs+, AQo+, KQs)
 *        • 9-Max UTG (8 behind):   8.5% (~113 combos: 88+, ATs+, AJo+, KJs+)
 *        • 8-Max UTG (7 behind):  10.5% (~139 combos: 77+, A9s+, ATo+, KJs+, QJs)
 *        • 7-Max UTG (6 behind):  12.8% (~170 combos: 66+, A8s+, ATo+, KTs+, QTs+, JTs)
 *        • 6-Max UTG (5 behind):  15.2% (~202 combos: 55+, A2s+, ATo+, K9s+, Q9s+, J9s+, T9s)
 *        • Hijack (HJ):           19.2% (~255 combos)
 *        • Cutoff (CO):           27.5% (~365 combos)
 *        • Button (BTN):          45.5% (~604 combos)
 *        • Small Blind (SB):      46.0% (~610 combos mixed raise/limp strategy)
 *        • Big Blind (BB):         0.0% (Facing open: Defends ~52-62% total range via Call/3Bet)
 */
export function calculatePositionMathMetrics(pos: Position, tableSize: TableSize): PositionMathMetrics {
  const seats = getPositionsForTableSize(tableSize);
  const seatIdx = seats.indexOf(pos);
  const totalSeats = seats.length;

  // Number of players remaining to act after hero (excluding hero)
  let playersBehind = 0;
  if (seatIdx !== -1) {
    playersBehind = totalSeats - 1 - seatIdx;
  } else {
    playersBehind = 5;
  }

  // Probability that at least one player behind holds a top premium hand {AA, KK, QQ, JJ, AKs, AKo} (~4.8% of combos)
  const pSinglePremium = 0.048;
  const probabilityPremiumBehind = 1 - Math.pow(1 - pSinglePremium, playersBehind);

  // Theoretical GTO RFI Frequency % based on position and table size
  let gtoRfiFrequency = 46.0;
  if (pos === 'BTN') gtoRfiFrequency = 45.5;
  else if (pos === 'SB') gtoRfiFrequency = 46.0;
  else if (pos === 'BB') gtoRfiFrequency = 0; // Defends preflop, no RFI
  else if (pos === 'CO') gtoRfiFrequency = 27.5;
  else if (pos === 'HJ') gtoRfiFrequency = 19.2;
  else if (pos === 'MP' || pos === 'MP3') gtoRfiFrequency = 15.0;
  else if (pos === 'MP2') gtoRfiFrequency = 13.2;
  else if (pos === 'MP1') gtoRfiFrequency = 11.8;
  else if (pos === 'UTG+2') gtoRfiFrequency = 10.4;
  else if (pos === 'UTG+1') gtoRfiFrequency = 8.8;
  else if (pos === 'UTG') {
    if (tableSize === 6) gtoRfiFrequency = 15.2;
    else if (tableSize === 7) gtoRfiFrequency = 12.8;
    else if (tableSize === 8) gtoRfiFrequency = 10.5;
    else if (tableSize === 9) gtoRfiFrequency = 8.5;
    else gtoRfiFrequency = 7.5; // 10-Max UTG
  }

  let rangeStructure: PositionMathMetrics['rangeStructure'] = 'linear';
  if (pos === 'SB') rangeStructure = 'mixed';
  else if (pos === 'BB') rangeStructure = 'condensed';

  const seatsToBtn = Math.max(0, getSeatsToButton(pos));

  return {
    position: pos,
    seatsToBtn,
    playersBehind,
    probabilityPremiumBehind: Math.round(probabilityPremiumBehind * 1000) / 10, // Formatted as percentage e.g. 36.0%
    gtoRfiFrequency: Math.round(gtoRfiFrequency * 10) / 10,
    rangeStructure
  };
}

/**
 * Computes (x, y) % coordinates for N seats (6, 7, 8, 9, 10) arranged in a smooth ellipse.
 * Uses parametric ellipse equations:
 *   x = centerX + rx * cos(theta)
 *   y = centerY + ry * sin(theta)
 */
export function calculateEllipseSeatCoordinates(tableSize: TableSize): { x: number; y: number }[] {
  const seats = getPositionsForTableSize(tableSize);
  const N = seats.length;

  const centerX = 50;
  const centerY = 50;
  const rx = 42; // Horizontal radius %
  const ry = 36; // Vertical radius %

  return seats.map((_, i) => {
    // Distribute seats clockwise starting from BB/SB bottom center
    const angle = (2 * Math.PI * i) / N + Math.PI / 2;
    const x = centerX + rx * Math.cos(angle);
    const y = centerY + ry * Math.sin(angle);

    return {
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10
    };
  });
}
