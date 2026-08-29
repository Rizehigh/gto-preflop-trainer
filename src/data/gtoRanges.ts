import { ActionFrequencies, SpotDefinition } from '../types/poker';
import { getAll169Hands, getRankValue } from '../utils/pokerUtils';

/**
 * SOLVER METHODOLOGY & GTO FREQUENCY ENGINE
 * 
 * Solver Parameters & Baseline Configuration:
 * - Stack Depth: 100 Big Blinds (100BB Effective).
 * - Rake Structure: 500NL / 1000NL High-Stakes Rake (5% rake, 0.6bb cap; no rake preflop).
 * - Sizing Standard:
 *     • Open Raise: 2.5bb (BTN / SB 2.5–3.0bb)
 *     • 3-Bet IP: 7.5bb (3x open)
 *     • 3-Bet OOP: 9.5–10.0bb (3.8–4x open)
 *     • 4-Bet IP: 19.5bb | 4-Bet OOP: 22.5bb
 * 
 * Mathematical Frequency Allocation:
 * - Each hand class maps to an ActionFrequencies object: { raise: r, call: c, fold: f } where r + c + f = 1.0.
 * - Total combos for a hand notation:
 *     • Pair = 6 combos (e.g. AA, KK)
 *     • Suited = 4 combos (e.g. AKs)
 *     • Offsuit = 12 combos (e.g. AKo)
 * - Total Range Combo Weighted Sum:
 *     Combos Open = ∑ [ (r_i x combo_count_i) ] for i in 1..169
 * - Range Frequency % = (Combos Open / 1,326) x 100%
 */

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

// ----------------------------------------------------
// MULTIWAY / SQUEEZE RANGES
// ----------------------------------------------------
const bbVsCoBtnSqueezeRanges = buildRange({
  raiseHands: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AJs', 'AKo', 'A5s', 'A4s', '98s', '87s'],
  callHands: ['99', '88', '77', '66', '55', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', 'AQo', 'AJo', 'KTs', 'QTs'],
  mixRaise: { '99': 0.4, 'A5s': 0.7, 'A4s': 0.6, '98s': 0.5, '87s': 0.5, 'ATs': 0.4 },
  mixCall: { '44': 0.5, '33': 0.5, '22': 0.4, '76s': 0.5, '65s': 0.4 }
});

const sbVsHjCoSqueezeRanges = buildRange({
  raiseHands: ['AA', 'KK', 'QQ', 'JJ', 'TT', 'AKs', 'AQs', 'AKo', 'A5s', 'A4s'],
  callHands: ['99', '88', 'KQs', 'QJs', 'JTs', 'AJs', 'ATs'],
  mixRaise: { '99': 0.5, 'A3s': 0.4, 'KJs': 0.5, 'QJs': 0.3 },
  mixCall: { '77': 0.5, 'KTs': 0.4, 'QTs': 0.4, 'T9s': 0.5 }
});

const btnVsUtgHjMultiwayRanges = buildRange({
  raiseHands: ['AA', 'KK', 'QQ', 'AKs', 'AKo'],
  callHands: ['JJ', 'TT', '99', '88', '77', 'KQs', 'KJs', 'QJs', 'JTs', 'T9s', 'AQs', 'AJs'],
  mixRaise: { 'JJ': 0.4, 'A5s': 0.6, 'A4s': 0.5 },
  mixCall: { '66': 0.6, '98s': 0.5, '87s': 0.4, 'ATs': 0.5, 'AQo': 0.5 }
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
    morphologyStructure: 'linear',
    morphologyDescription: 'Linear Range: Pure high-card strength & pocket pairs opening starting from top hands down to threshold without gaps.',
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
    morphologyStructure: 'linear',
    morphologyDescription: 'Linear Range: Expands top-tier hands linearly down to include high suited broadways and suited connectors.',
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
    morphologyStructure: 'linear',
    morphologyDescription: 'Linear Range: Wide merged opening range taking advantage of late position stealing opportunity.',
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
    morphologyStructure: 'linear',
    morphologyDescription: 'Linear Range: Wide uncapped merged opening range attacking the blinds.',
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
    morphologyStructure: 'mixed',
    morphologyDescription: 'Mixed Range: High frequency blend of raises, limps/calls, and folds due to playing OOP postflop.',
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
    morphologyStructure: 'polarized',
    morphologyDescription: 'Polarized Range: 3-betting premium value (AA/KK/AK) & A-blocker bluffs while flat-calling medium suited broadways.',
    ranges: btnVsUtgRanges,
    villainRange: utgRfiRanges,
    villainMorphologyStructure: 'linear',
    villainMorphologyDescription: 'UTG Opener Range: ~15.2% tight linear range (77+, A7s+, K9s+, Q9s+, J9s+, T9s, A10o+, KQo).'
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
    morphologyStructure: 'condensed',
    morphologyDescription: 'Condensed Range: Flatting medium-strength hands, suited connectors & broadways while capping top monsters.',
    ranges: bbVsBtnRanges,
    villainRange: btnRfiRanges,
    villainMorphologyStructure: 'linear',
    villainMorphologyDescription: 'BTN Opener Range: ~45.5% wide merged linear range attacking the blinds.'
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
    morphologyStructure: 'condensed',
    morphologyDescription: 'Condensed Range: Tight defensive call range of medium pairs and suited aces vs tight UTG open.',
    ranges: bbVsUtgRanges,
    villainRange: utgRfiRanges,
    villainMorphologyStructure: 'linear',
    villainMorphologyDescription: 'UTG Opener Range: ~15.2% tight linear range.'
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
    morphologyStructure: 'polarized',
    morphologyDescription: 'Polarized Range: 4-betting premium value & A5s bluffs, while calling in position with broadways.',
    ranges: btnVsBb3BetRanges,
    villainRange: bbVsBtnRanges,
    villainMorphologyStructure: 'polarized',
    villainMorphologyDescription: 'BB 3-Betting Range: ~13.5% polarized range (3-betting premium value & suited wheel bluffs).'
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
    morphologyStructure: 'polarized',
    morphologyDescription: 'Polarized Range: OOP 4-betting premium value & AK bluffs, folding intermediate unsuited hands.',
    ranges: utgVsBtn3BetRanges,
    villainRange: btnVsUtgRanges,
    villainMorphologyStructure: 'polarized',
    villainMorphologyDescription: 'BTN 3-Betting Range vs UTG: ~7.5% tight polarized range.'
  },
  {
    id: 'bb_vs_co_btn_squeeze',
    name: 'BB Squeeze vs CO Open & BTN Call',
    description: 'Multiway Pot: CO opens 2.5x and BTN flat calls 2.5x. You are in Big Blind facing two players. Squeeze 3-bet to 11x for value & bluffs.',
    category: 'multiway_squeeze',
    heroPosition: 'BB',
    villainPosition: 'CO',
    facingAction: 'CO opens 2.5x, BTN calls 2.5x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: 'Squeeze 3-Bet (to 11x)',
    morphologyStructure: 'polarized',
    morphologyDescription: 'Multiway Squeeze Range: Squeezing to 11x with premium value (JJ+, AK) & A-blockers/suited connectors while flatting medium pairs.',
    ranges: bbVsCoBtnSqueezeRanges,
    villainRange: btnVsUtgRanges,
    villainMorphologyStructure: 'condensed',
    villainMorphologyDescription: 'BTN Cold Call Range: Medium suited broadways & pocket pairs capped against CO raise.'
  },
  {
    id: 'sb_vs_hj_co_squeeze',
    name: 'SB Squeeze vs HJ Open & CO Call',
    description: 'Multiway Pot: HJ opens 2.5x and CO flat calls. Out of position in Small Blind, squeeze to 12x with strong linear/polarized value.',
    category: 'multiway_squeeze',
    heroPosition: 'SB',
    villainPosition: 'HJ',
    facingAction: 'HJ opens 2.5x, CO calls 2.5x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: 'Squeeze 3-Bet (to 12x)',
    morphologyStructure: 'polarized',
    morphologyDescription: 'OOP Multiway Squeeze: Squeezing large to punish callers out of position.',
    ranges: sbVsHjCoSqueezeRanges,
    villainRange: hjRfiRanges,
    villainMorphologyStructure: 'linear',
    villainMorphologyDescription: 'HJ Opener Range: ~19% linear range.'
  },
  {
    id: 'btn_vs_utg_hj_multiway',
    name: 'BTN Defense vs UTG Open & HJ Call',
    description: 'Multiway Pot: UTG opens 2.5x, HJ flat calls 2.5x. You have position on BTN. 3-bet top premiums or flat call high equity broadways.',
    category: 'multiway_squeeze',
    heroPosition: 'BTN',
    villainPosition: 'UTG',
    facingAction: 'UTG opens 2.5x, HJ calls 2.5x',
    allowedActions: ['fold', 'call', 'raise'],
    raiseLabel: 'Squeeze 3-Bet (to 9.5x)',
    morphologyStructure: 'condensed',
    morphologyDescription: 'In-Position Multiway Defense: Calling medium pairs & suited connectors in position to realize postflop equity.',
    ranges: btnVsUtgHjMultiwayRanges,
    villainRange: utgRfiRanges,
    villainMorphologyStructure: 'linear',
    villainMorphologyDescription: 'UTG Opener Range: ~15.2% tight linear range.'
  }
];

export function getSpotById(id: string): SpotDefinition {
  return SPOT_DEFINITIONS.find(s => s.id === id) || SPOT_DEFINITIONS[0];
}

/**
 * Returns GTO RFI matrix for ANY position from UTG down to BB.
 */
export function getPositionRfiRange(position: string): Record<string, ActionFrequencies> {
  switch (position) {
    case 'UTG':
    case 'UTG+1':
    case 'UTG+2':
      return utgRfiRanges;
    case 'MP':
    case 'MP1':
    case 'MP2':
    case 'MP3':
    case 'HJ':
      return hjRfiRanges;
    case 'CO':
      return coRfiRanges;
    case 'BTN':
      return btnRfiRanges;
    case 'SB':
      return sbRfiRanges;
    case 'BB':
    default:
      return buildRange({}); // BB fold range (everyone folded to BB, win pot)
  }
}
