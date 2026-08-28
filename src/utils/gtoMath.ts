import { Position, PositionMathMetrics, TableSize } from '../types/poker';

/**
 * Ordered seat positions clockwise around the table ending at BB.
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
 * Returns seats distance from the Button.
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

  // Theoretical GTO RFI Frequency % based on seats from BTN
  let gtoRfiFrequency = 46.0;
  if (pos === 'BTN') gtoRfiFrequency = 45.5;
  else if (pos === 'SB') gtoRfiFrequency = 46.0;
  else if (pos === 'BB') gtoRfiFrequency = 0; // Defends, no RFI
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
    probabilityPremiumBehind: Math.round(probabilityPremiumBehind * 1000) / 10, // e.g. 32.7%
    gtoRfiFrequency: Math.round(gtoRfiFrequency * 10) / 10,
    rangeStructure
  };
}

/**
 * Computes (x, y) % coordinates for N seats (6, 7, 8, 9, 10) arranged in a smooth ellipse.
 */
export function calculateEllipseSeatCoordinates(tableSize: TableSize): { x: number; y: number }[] {
  const seats = getPositionsForTableSize(tableSize);
  const count = seats.length;
  const coords: { x: number; y: number }[] = [];

  const rx = 42; // Horizontal radius %
  const ry = 36; // Vertical radius %

  for (let i = 0; i < count; i++) {
    // Angle in radians starting at top center (-PI/2) moving clockwise
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    
    const x = 50 + rx * Math.cos(angle);
    const y = 50 + ry * Math.sin(angle);

    coords.push({
      x: Math.round(x * 10) / 10,
      y: Math.round(y * 10) / 10
    });
  }

  return coords;
}
