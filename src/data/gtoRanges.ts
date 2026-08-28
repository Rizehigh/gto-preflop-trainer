import { ActionFrequencies, SpotDefinition } from '../types/poker';
import { getAll169Hands, getRankValue } from '../utils/pokerUtils';

/**
 * Helper to construct frequency map for 169 hands
 */
function buildRange(
  definitions: {
    raiseHands?: string[]; // 100% Raise
    callHands?: string[];  // 100% Call
    mixRaise?: Record<string, number>; // Partial Raise e.g. { "A5s": 0.5 }
    mixCall?: Record<string, number>;  // Partial Call e.g. { "76s": 0.4 }
  }
): Record<string, ActionFrequencies> {
  const allHands = getAll169Hands();
  const ranges: Record<string, ActionFrequencies> = {};

  const raiseSet = new Set(definitions.raiseHands || []);
  const callSet = new Set(definitions.callHands || []);
  const mixR = definitions.mixRaise || {};
  const mixC = definitions.mixCall || {};

  for (const hand of allHands) {
    let r = 0;
    let c = 0;

    if (raiseSet.has(hand)) {
      r = 1.0;
    } else if (callSet.has(hand)) {
      c = 1.0;
    } else {
      if (mixR[hand] !== undefined) r = mixR[hand];
      if (mixC[hand] !== undefined) c = mixC[hand];
    }

    const f = Math.max(0, 1.0 - r - c);
    ranges[hand] = { raise: Math.round(r * 100) / 100, call: Math.round(c * 100) / 100, fold: Math.round(f * 100) / 100 };
  }

  return ranges;
}

// ----------------------------------------------------
// 1. UTG OPEN (RFI ~ 15%)
// ----------------------------------------------------
const utgRfiRanges = buildRange({
  raiseHands: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s',
    'KQs', 'KJs', 'KTs', 'K9s',
    'QJs', 'QTs',
    'JTs',
    'T9s', '98s',
    'AKo', 'AQo', 'AJo'
  ],
  mixRaise: {
    '66': 0.5, '55': 0.3,
    'A3s': 0.4, 'A2s': 0.3,
    'K8s': 0.3, 'Q9s': 0.5, 'J8s': 0.4, '87s': 0.5, '76s': 0.3,
    'ATo': 0.6, 'KQo': 0.7, 'KJo': 0.3
  }
});

// ----------------------------------------------------
// 2. HJ OPEN (RFI ~ 19%)
// ----------------------------------------------------
const hjRfiRanges = buildRange({
  raiseHands: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s',
    'QJs', 'QTs', 'Q9s',
    'JTs', 'J9s',
    'T9s', '98s', '87s',
    'AKo', 'AQo', 'AJo', 'ATo', 'KQo', 'KJo'
  ],
  mixRaise: {
    '55': 0.6, '44': 0.4,
    'K7s': 0.4, 'Q8s': 0.4, 'J8s': 0.5, 'T8s': 0.6, '76s': 0.5, '65s': 0.3,
    'A9o': 0.4, 'QJo': 0.5, 'KTo': 0.4
  }
});

// ----------------------------------------------------
// 3. CO OPEN (RFI ~ 27%)
// ----------------------------------------------------
const coRfiRanges = buildRange({
  raiseHands: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s',
    'QJs', 'QTs', 'Q9s', 'Q8s',
    'JTs', 'J9s', 'J8s',
    'T9s', 'T8s', '98s', '97s', '87s', '86s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o',
    'KQo', 'KJo', 'KTo', 'QJo', 'QTo', 'JTo'
  ],
  mixRaise: {
    'K4s': 0.5, 'K3s': 0.4, 'Q7s': 0.4, 'J7s': 0.4, 'T7s': 0.4, '75s': 0.4, '64s': 0.3,
    'A7o': 0.4, 'A5o': 0.5, 'K9o': 0.5, 'Q9o': 0.4, 'J9o': 0.3
  }
});

// ----------------------------------------------------
// 4. BTN OPEN (RFI ~ 44%)
// ----------------------------------------------------
const btnRfiRanges = buildRange({
  raiseHands: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
    'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s',
    'JTs', 'J9s', 'J8s', 'J7s', 'J6s',
    'T9s', 'T8s', 'T7s', 'T6s',
    '98s', '97s', '96s',
    '87s', '86s', '85s',
    '76s', '75s', '65s', '64s', '54s', '53s', '43s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o',
    'KQo', 'KJo', 'KTo', 'K9o', 'K8o',
    'QJo', 'QTo', 'Q9o', 'JTo', 'J9o', 'T9o'
  ],
  mixRaise: {
    'A2o': 0.4, 'K7o': 0.5, 'K6o': 0.4, 'Q8o': 0.5, 'J8o': 0.5, 'T8o': 0.4, '98o': 0.4,
    'Q4s': 0.4, 'Q3s': 0.4, 'J5s': 0.4, '74s': 0.4
  }
});

// ----------------------------------------------------
// 5. SB OPEN (RFI ~ 46%)
// ----------------------------------------------------
const sbRfiRanges = buildRange({
  raiseHands: [
    'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55',
    'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s',
    'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s',
    'QJs', 'QTs', 'Q9s', 'Q8s',
    'JTs', 'J9s', 'J8s',
    'T9s', 'T8s', '98s', '87s', '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'KQo', 'KJo', 'KTo', 'QJo', 'QTo'
  ],
  callHands: [
    '44', '33', '22',
    'K5s', 'K4s', 'K3s', 'K2s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'J7s', 'J6s', 'T7s', '97s', '86s', '75s',
    'A7o', 'A6o', 'A5o', 'A4o', 'K9o', 'K8o', 'Q9o', 'J9o', 'T9o', '98o'
  ],
  mixRaise: {
    '44': 0.4, 'K5s': 0.5, 'Q7s': 0.4, 'A7o': 0.4, 'K9o': 0.4
  }
});

// ----------------------------------------------------
// 6. BTN VS UTG OPEN (Facing Raise IP)
// ----------------------------------------------------
const btnVsUtgRanges = buildRange({
  raiseHands: [ // 3-Bet
    'AA', 'KK', 'QQ', 'JJ',
    'AKs', 'AQs', 'A5s', 'A4s',
    'KQs',
    'AKo'
  ],
  callHands: [
    'TT', '99', '88', '77',
    'AJs', 'ATs', 'KJs', 'KTs', 'QJs', 'QTs', 'JTs', 'T9s', '98s', '87s'
  ],
  mixRaise: { // 3-Bet Bluffs / Mixes
    'TT': 0.3, 'AJs': 0.3, 'A3s': 0.5, 'A2s': 0.4, 'KJs': 0.2, 'QJs': 0.2, 'JTs': 0.2, '76s': 0.4, '65s': 0.4, 'AQo': 0.6
  },
  mixCall: {
    '66': 0.5, '55': 0.4, 'K9s': 0.3, 'Q9s': 0.3, 'J9s': 0.3, 'T8s': 0.3, '76s': 0.4, 'AQo': 0.3
  }
});

// ----------------------------------------------------
// 7. BB VS BTN OPEN (Facing Raise OOP)
// ----------------------------------------------------
const bbVsBtnRanges = buildRange({
  raiseHands: [ // 3-Bet
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs', 'ATs', 'A5s', 'A4s', 'A3s',
    'KQs', 'KJs',
    'QJs',
    'JTs',
    '76s', '65s', '54s',
    'AKo', 'AQo', 'AJo'
  ],
  callHands: [
    '99', '88', '77', '66', '55', '44', '33', '22',
    'A9s', 'A8s', 'A7s', 'A6s', 'A2s',
    'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s',
    'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s',
    'J9s', 'J8s', 'J7s', 'J6s',
    'T9s', 'T8s', 'T7s',
    '98s', '97s', '87s', '86s', '75s', '64s', '43s', '32s',
    'ATo', 'A9o', 'A8o', 'A7o', 'A5o',
    'KQo', 'KJo', 'KTo', 'K9o',
    'QJo', 'QTo', 'Q9o',
    'JTo', 'J9o', 'T9o'
  ],
  mixRaise: {
    '99': 0.4, '88': 0.3, 'A2s': 0.5, 'KTs': 0.3, 'Q9s': 0.3, 'J9s': 0.3, 'T9s': 0.4, '98s': 0.4, '87s': 0.4, 'ATo': 0.3, 'KQo': 0.4
  }
});

// ----------------------------------------------------
// 8. BB VS UTG OPEN (Facing EP Raise OOP)
// ----------------------------------------------------
const bbVsUtgRanges = buildRange({
  raiseHands: [ // 3-Bet
    'AA', 'KK', 'QQ', 'JJ',
    'AKs', 'AQs', 'A5s', 'A4s',
    'KQs',
    'AKo'
  ],
  callHands: [
    'TT', '99', '88', '77', '66', '55', '44', '33', '22',
    'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A3s', 'A2s',
    'KJs', 'KTs', 'K9s', 'K8s',
    'QJs', 'QTs', 'Q9s',
    'JTs', 'J9s',
    'T9s', 'T8s', '98s', '87s', '76s', '65s', '54s',
    'AQo', 'AJo', 'KQo'
  ],
  mixRaise: {
    'TT': 0.4, 'AJs': 0.3, 'ATs': 0.2, 'KJs': 0.2, '76s': 0.3, '65s': 0.3, 'AQo': 0.4
  }
});

// ----------------------------------------------------
// 9. BTN OPEN VS BB 3-BET (Facing 3-Bet IP)
// ----------------------------------------------------
const btnVsBb3BetRanges = buildRange({
  raiseHands: [ // 4-Bet
    'AA', 'KK', 'QQ',
    'AKs', 'A5s', 'A4s',
    'AKo'
  ],
  callHands: [
    'JJ', 'TT', '99', '88', '77',
    'AQs', 'AJs', 'ATs', 'A9s', 'A8s',
    'KQs', 'KJs', 'KTs',
    'QJs', 'QTs',
    'JTs', 'T9s', '98s', '87s',
    'AQo', 'AJo'
  ],
  mixRaise: { // 4-Bet bluffs / value mix
    'JJ': 0.4, 'AQs': 0.3, 'A3s': 0.5, 'A2s': 0.4, 'KQs': 0.3, 'AQo': 0.3, 'KQo': 0.2
  },
  mixCall: {
    '66': 0.5, '55': 0.4, 'A7s': 0.4, 'K9s': 0.4, 'Q9s': 0.4, 'J9s': 0.4, 'T8s': 0.4, '76s': 0.5, 'ATo': 0.4, 'KQo': 0.5
  }
});

// ----------------------------------------------------
// 10. UTG OPEN VS BTN 3-BET (Facing 3-Bet OOP)
// ----------------------------------------------------
const utgVsBtn3BetRanges = buildRange({
  raiseHands: [ // 4-Bet
    'AA', 'KK',
    'AKs',
    'AKo'
  ],
  callHands: [
    'QQ', 'JJ', 'TT', '99',
    'AQs', 'AJs', 'ATs',
    'KQs', 'KJs',
    'QJs',
    'JTs'
  ],
  mixRaise: {
    'QQ': 0.5, 'AQs': 0.4, 'A5s': 0.6, 'A4s': 0.5
  },
  mixCall: {
    '88': 0.4, 'A9s': 0.3, 'KTs': 0.3, 'QTs': 0.3, 'T9s': 0.3, '98s': 0.3, 'AQo': 0.4
  }
});

export const SPOT_DEFINITIONS: SpotDefinition[] = [
  {
    id: 'utg_rfi',
    name: 'UTG Open (RFI)',
    description: 'Under The Gun is first to act at a 6-max table. Requires a tight, disciplined range due to 5 players acting after you.',
    category: 'rfi',
    heroPosition: 'UTG',
    facingAction: 'Folded to you (Unopened)',
    allowedActions: ['fold', 'raise'],
    raiseLabel: 'Raise (Open 2.5x)',
    ranges: utgRfiRanges
  },
  {
    id: 'hj_rfi',
    name: 'Hijack Open (RFI)',
    description: 'Hijack position opens slightly wider than UTG (~19%). Balance strong high cards with solid suited connectors.',
    category: 'rfi',
    heroPosition: 'HJ',
    facingAction: 'Folded to you (Unopened)',
    allowedActions: ['fold', 'raise'],
    raiseLabel: 'Raise (Open 2.5x)',
    ranges: hjRfiRanges
  },
  {
    id: 'co_rfi',
    name: 'Cutoff Open (RFI)',
    description: 'Cutoff is a prime stealing position (~27% range). Only BTN, SB, and BB remain behind you.',
    category: 'rfi',
    heroPosition: 'CO',
    facingAction: 'Folded to you (Unopened)',
    allowedActions: ['fold', 'raise'],
    raiseLabel: 'Raise (Open 2.5x)',
    ranges: coRfiRanges
  },
  {
    id: 'btn_rfi',
    name: 'Button Open (RFI)',
    description: 'The Button is the most profitable position in poker. Open wide (~44%) to exploit postflop position advantage.',
    category: 'rfi',
    heroPosition: 'BTN',
    facingAction: 'Folded to you (Unopened)',
    allowedActions: ['fold', 'raise'],
    raiseLabel: 'Raise (Open 2.5x)',
    ranges: btnRfiRanges
  },
  {
    id: 'sb_rfi',
    name: 'Small Blind Open (RFI)',
    description: 'Small Blind faces only the Big Blind. GTO opens ~46% with a mixed strategy of raises and limps/calls.',
    category: 'rfi',
    heroPosition: 'SB',
    facingAction: 'Folded to you (Unopened)',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: 'Raise (Open 3x)',
    ranges: sbRfiRanges
  },
  {
    id: 'btn_vs_utg',
    name: 'BTN vs UTG Open',
    description: 'You are on the Button facing an early position (UTG) open raise. UTG range is tight, so your defense must be selective.',
    category: 'facing_open',
    heroPosition: 'BTN',
    villainPosition: 'UTG',
    facingAction: 'UTG opens to 2.5x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: '3-Bet (to 7.5x)',
    ranges: btnVsUtgRanges
  },
  {
    id: 'bb_vs_btn',
    name: 'BB Defense vs BTN Open',
    description: 'You are in the Big Blind facing a Button open raise. Pot odds allow wide defending, mixed between calls and 3-bets.',
    category: 'facing_open',
    heroPosition: 'BB',
    villainPosition: 'BTN',
    facingAction: 'BTN opens to 2.5x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: '3-Bet (to 9x)',
    ranges: bbVsBtnRanges
  },
  {
    id: 'bb_vs_utg',
    name: 'BB Defense vs UTG Open',
    description: 'Big Blind defending against an early position open. UTG has a strong range, so fold weaker offsuit hands.',
    category: 'facing_open',
    heroPosition: 'BB',
    villainPosition: 'UTG',
    facingAction: 'UTG opens to 2.5x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: '3-Bet (to 10x)',
    ranges: bbVsUtgRanges
  },
  {
    id: 'btn_vs_bb_3bet',
    name: 'BTN Open vs BB 3-Bet',
    description: 'You opened on BTN and BB 3-bet you! You have position in a 3-bet pot. Defend with calls, 4-bet premiums & bluffs.',
    category: 'facing_3bet',
    heroPosition: 'BTN',
    villainPosition: 'BB',
    facingAction: 'You opened 2.5x, BB 3-bets to 9x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: '4-Bet (to 22x)',
    ranges: btnVsBb3BetRanges
  },
  {
    id: 'utg_vs_btn_3bet',
    name: 'UTG Open vs BTN 3-Bet',
    description: 'You opened UTG and BTN 3-bet in position. Your opening range was already tight, so fold lower equity hands and 4-bet top values.',
    category: 'facing_3bet',
    heroPosition: 'UTG',
    villainPosition: 'BTN',
    facingAction: 'You opened 2.5x, BTN 3-bets to 7.5x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: '4-Bet (to 19x)',
    ranges: utgVsBtn3BetRanges
  }
];

export function getSpotById(id: string): SpotDefinition {
  return SPOT_DEFINITIONS.find(s => s.id === id) || SPOT_DEFINITIONS[0];
}
