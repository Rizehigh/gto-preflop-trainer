import { ActionFrequencies, ActionType, Position, RangeMorphologyStructure, SpotDefinition } from '../types/poker';
import { getAll169Hands, getRankValue } from '../utils/pokerUtils';

export type AmateurArchetypeId = 'maniac' | 'calling_station' | 'nit' | 'wild';

export interface AmateurProfile {
  id: AmateurArchetypeId;
  name: string;
  shortName: string;
  avatar: string; // Emoji or icon name
  badgeColor: string; // Tailwind class
  borderColor: string;
  bgColor: string;
  textColor: string;
  tagline: string;
  description: string;
  tendencies: {
    rfiTendency: string;
    facingOpenTendency: string;
    facing3betTendency: string;
  };
  exploitSummary: string;
}

export const AMATEUR_PROFILES: Record<AmateurArchetypeId, AmateurProfile> = {
  maniac: {
    id: 'maniac',
    name: 'Super Aggressive Maniac',
    shortName: 'Maniac',
    avatar: '💣',
    badgeColor: 'bg-red-600 text-white',
    borderColor: 'border-red-500',
    bgColor: 'bg-red-950/80',
    textColor: 'text-red-400',
    tagline: 'Hyper-aggressive, opens & 3-bets way too wide with marginal trash.',
    description: 'This player loves to exert pressure. They open up to 60%+ of hands, 3-bet mercilessly with weak suited connectors and junk offsuit broadways, and rarely fold when faced with counter-aggression.',
    tendencies: {
      rfiTendency: 'Opens top 50-70% of hands from any position.',
      facingOpenTendency: '3-bets ultra-light (~25% frequency) with any suited card or Ax.',
      facing3betTendency: 'Never folds to 3-bets; calls or 4-bet shoves unpredictably.'
    },
    exploitSummary: 'Tighten up your value range, eliminate light 3-bet bluffs, and trap with premium & strong broadway hands.'
  },
  calling_station: {
    id: 'calling_station',
    name: 'Passive Calling Station',
    shortName: 'Station',
    avatar: '🦥',
    badgeColor: 'bg-blue-600 text-white',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-950/80',
    textColor: 'text-blue-400',
    tagline: 'Calls almost everything, rarely raises or 3-bets without monsters.',
    description: 'Calling stations hate folding. They flat open raises with weak offsuit hands, suited trash, and low pairs. However, when they DO raise or 3-bet, they almost always hold nuts (AA/KK/AK).',
    tendencies: {
      rfiTendency: 'Passively limps or opens wide merged hands.',
      facingOpenTendency: 'Calls facing opens with 60%+ of hands; almost 0% 3-betting except AA/KK.',
      facing3betTendency: 'Calls 3-bets with medium hands and pocket pairs; folds trash.'
    },
    exploitSummary: 'Value bet relentlessly and bigger! Never bluff them (bluffs have negative EV because stations never fold).'
  },
  nit: {
    id: 'nit',
    name: 'Ultra Tight Nit',
    shortName: 'Nit',
    avatar: '🐢',
    badgeColor: 'bg-amber-600 text-white',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-950/80',
    textColor: 'text-amber-400',
    tagline: 'Plays only premium hands (top 5-10%). Extremely risk-averse.',
    description: 'Nits fold almost every hand. They open only top pairs and AK. Facing an open, they only 3-bet AA/KK/QQ/AK. Facing a 3-bet, they fold everything except KK+.',
    tendencies: {
      rfiTendency: 'Opens super tight (~8-12% top hands only).',
      facingOpenTendency: 'Folds 85%+ facing opens. 3-bets exclusively top 3% premiums.',
      facing3betTendency: 'Folds to 90%+ of 3-bets.'
    },
    exploitSummary: 'Steal their blinds continuously! 3-bet bluff them heavily. When they raise or 3-bet you, fold medium hands immediately.'
  },
  wild: {
    id: 'wild',
    name: 'Wild / Unpredictable Amateur',
    shortName: 'Wild',
    avatar: '🎲',
    badgeColor: 'bg-purple-600 text-white',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-950/80',
    textColor: 'text-purple-400',
    tagline: 'High play variance: plays gut feeling, random bluffs, overvalues suited cards.',
    description: 'Unpredictable recreational player who plays according to feeling. Over-values any suited hand (e.g. J2s, 73s), over-calls offsuit broadways, and makes random huge raises with low pairs.',
    tendencies: {
      rfiTendency: 'Erratic open range heavy in suited trash and low connectors.',
      facingOpenTendency: 'Random 3-bet frequency; calls wide with suited cards.',
      facing3betTendency: 'Splits randomly between folding decent hands and calling garbage.'
    },
    exploitSummary: 'Play a robust linear value strategy. Avoid complex GTO mixed bluffs; focus on clean equity and postflop positioning.'
  }
};

/**
 * Generate distorted amateur villain range for a given spot and archetype
 */
export function getAmateurVillainRange(
  spot: SpotDefinition,
  archetypeId: AmateurArchetypeId
): Record<string, ActionFrequencies> {
  const baseRange = spot.villainRange || spot.ranges;
  const allHands = getAll169Hands();
  const amateurRange: Record<string, ActionFrequencies> = {};

  for (const hand of allHands) {
    const base = baseRange[hand] || { fold: 1, call: 0, raise: 0 };
    const r1 = hand[0];
    const r2 = hand[1];
    const v1 = getRankValue(r1 as any);
    const v2 = getRankValue(r2 as any);
    const isPair = hand.length === 2;
    const isSuited = hand.endsWith('s');
    const isBroadway = v1 >= 10 && v2 >= 10;
    const isHighAce = v1 === 14;

    let r = base.raise;
    let c = base.call;
    let f = base.fold;

    if (archetypeId === 'maniac') {
      // Maniac raises and 3-bets aggressively with trash, aces, suited hands
      if (spot.category === 'rfi' || spot.category === 'facing_open') {
        if (isHighAce || isBroadway || isSuited || isPair || v1 >= 8) {
          r = Math.min(1.0, r + 0.5);
          c = Math.max(0, c - 0.2);
        } else if (Math.random() > 0.4) {
          r = Math.min(1.0, r + 0.3);
        }
      } else { // facing 3bet
        if (r > 0 || c > 0 || isPair || isSuited) {
          r = Math.min(1.0, r + 0.4);
          c = Math.min(1.0 - r, c + 0.3);
        }
      }
    } else if (archetypeId === 'calling_station') {
      // Calling station almost never raises/3bets unless premium, but calls heavily
      const isSuperPremium = (hand === 'AA' || hand === 'KK' || hand === 'AKs');
      if (spot.category === 'facing_open' || spot.category === 'facing_3bet') {
        if (isSuperPremium) {
          r = 1.0;
          c = 0;
        } else {
          // Convert raise frequency into calling frequency, and call wide
          const callBoost = (isSuited || isPair || isBroadway || v1 >= 9) ? 0.6 : 0.3;
          c = Math.min(1.0, c + r + callBoost);
          r = 0;
        }
      } else { // rfi
        if (!isSuperPremium && !isBroadway && !isPair) {
          c = Math.min(1.0, c + r + 0.3);
          r = Math.max(0, r - 0.4);
        }
      }
    } else if (archetypeId === 'nit') {
      // Nit folds everything except top ~5% hands
      const isPremium = (isPair && v1 >= 10) || (isHighAce && v2 >= 12); // TT+, AK, AQ
      if (!isPremium) {
        r = 0;
        c = 0;
      } else {
        r = Math.min(1.0, r + 0.2);
      }
    } else if (archetypeId === 'wild') {
      // Wild player overvalues suited hands and aces randomly
      if (isSuited || isHighAce) {
        if (spot.allowedActions.includes('call') && Math.random() > 0.5) {
          c = Math.min(1.0, c + 0.4);
        } else {
          r = Math.min(1.0, r + 0.4);
        }
      } else if (!isBroadway && !isPair && Math.random() > 0.6) {
        c = Math.min(1.0, c + 0.3);
      }
    }

    // Normalize frequencies
    const total = r + c;
    if (total > 1.0) {
      r = Math.round((r / total) * 100) / 100;
      c = Math.round((c / total) * 100) / 100;
      f = Math.max(0, 1.0 - r - c);
    } else {
      r = Math.round(r * 100) / 100;
      c = Math.round(c * 100) / 100;
      f = Math.round(Math.max(0, 1.0 - r - c) * 100) / 100;
    }

    amateurRange[hand] = { raise: r, call: c, fold: f };
  }

  return amateurRange;
}

export interface AmateurExploitResult {
  isCorrect: boolean;
  optimalExploitAction: ActionType;
  gtoOptimalAction: ActionType;
  message: string;
  exploitReasoning: string;
  evDifferenceNote: string;
}

/**
 * Evaluate user action against an Amateur archetype in a given spot
 */
export function evaluateAmateurExploit(
  userAction: ActionType,
  handNotation: string,
  spot: SpotDefinition,
  archetypeId: AmateurArchetypeId
): AmateurExploitResult {
  const profile = AMATEUR_PROFILES[archetypeId];
  const gtoFreq = spot.ranges[handNotation] || { fold: 1, call: 0, raise: 0 };
  
  // Find GTO optimal
  let gtoOptimal: ActionType = 'fold';
  if (gtoFreq.raise >= gtoFreq.call && gtoFreq.raise >= gtoFreq.fold) gtoOptimal = 'raise';
  else if (gtoFreq.call >= gtoFreq.raise && gtoFreq.call >= gtoFreq.fold) gtoOptimal = 'call';

  const r1 = handNotation[0];
  const r2 = handNotation[1];
  const v1 = getRankValue(r1 as any);
  const v2 = getRankValue(r2 as any);
  const isPair = handNotation.length === 2;
  const isSuited = handNotation.endsWith('s');
  const isBroadway = v1 >= 10 && v2 >= 10;
  const isHighAce = v1 === 14;

  let optimalExploit: ActionType = gtoOptimal;
  let exploitReasoning = '';
  let evDifferenceNote = '';

  if (archetypeId === 'maniac') {
    // Against Maniac:
    // - Bluffs (pure light 3-bets / 4-bets with weak trash) lose heavily because Maniac never folds.
    // - Value hands (strong broadways, pairs, AJ+) should call/raise for pure value.
    if (gtoOptimal === 'raise' && (gtoFreq.raise < 0.7) && !isBroadway && !isPair && !isHighAce) {
      // GTO light bluff raise -> Exploit is FOLD or CALL
      optimalExploit = spot.allowedActions.includes('call') ? 'call' : 'fold';
      exploitReasoning = `Against a ${profile.name}, light bluffs have negative EV because they fold far less than GTO. Shift bluffs into value calls or folds.`;
      evDifferenceNote = 'GTO raises light here as a bluff, but against a Maniac who calls/raises constantly, pure bluffs torch money.';
    } else if (isBroadway || isPair || (isHighAce && v2 >= 9)) {
      optimalExploit = (spot.allowedActions.includes('call') && !isPair) ? 'call' : 'raise';
      exploitReasoning = `Holdings with high high-card equity excel against a Maniac's wide, trashy range. Trap & value bet.`;
      evDifferenceNote = `Calling or raising with ${handNotation} captures massive EV against Maniac's over-aggressive range.`;
    }
  } else if (archetypeId === 'calling_station') {
    // Against Calling Station:
    // - Pure bluffs lose money because Station calls too much.
    // - Thin value bets/raises gain massive EV.
    if (gtoOptimal === 'raise' && (gtoFreq.raise < 0.6) && !isBroadway && !isPair && !isHighAce) {
      optimalExploit = spot.allowedActions.includes('call') ? 'call' : 'fold';
      exploitReasoning = `Station never folds! Replace GTO light bluffs with value hands. Do not bluff a Calling Station.`;
      evDifferenceNote = 'Bluffing a Station has 0 EV. Pure linear value range is optimal.';
    } else if ((isBroadway || v1 >= 9) && spot.allowedActions.includes('raise')) {
      optimalExploit = 'raise';
      exploitReasoning = `Raise for value! Calling Station will call you with far worse hands like weak offsuit cards.`;
      evDifferenceNote = `Raising ${handNotation} extracts maximum value from Station's wide calling range.`;
    }
  } else if (archetypeId === 'nit') {
    // Against Nit:
    // - If Nit opens or 3-bets, fold medium hands (AQ, AJ, JJ, TT face Nit's 3-bet).
    // - If facing Nit's open, 3-bet bluff heavily or steal blinds!
    if (spot.category === 'facing_3bet' || spot.villainPosition === 'UTG') {
      if (!isPair || v1 < 12) { // Less than QQ
        if (handNotation !== 'AKs' && handNotation !== 'AKo') {
          optimalExploit = 'fold';
          exploitReasoning = `Nit's open or 3-bet range is ultra-tight (AA/KK/AK). Fold marginal hands that GTO normally calls or raises.`;
          evDifferenceNote = `Calling or raising facing a Nit's action with ${handNotation} runs into their top 3% nut range.`;
        }
      }
    } else if (spot.category === 'facing_open' || spot.category === 'rfi') {
      if (spot.allowedActions.includes('raise') && (isSuited || isHighAce)) {
        optimalExploit = 'raise';
        exploitReasoning = `Attack the Nit! They fold over 85% to aggression. Raise/steal aggressively.`;
        evDifferenceNote = 'Stealing against a Nit prints instant uncontested pot equity.';
      }
    }
  } else if (archetypeId === 'wild') {
    // Against Wild:
    // Solid linear play, value raise top hands, fold trash.
    if (isPair || isBroadway || isHighAce) {
      optimalExploit = 'raise';
      exploitReasoning = `Against a Wild player, stick to high-card equity and linear value raises.`;
      evDifferenceNote = `Solid value strategy exploits Wild player's erratic mistakes.`;
    }
  }

  const isCorrect = userAction === optimalExploit;
  let message = '';
  if (isCorrect) {
    message = `Spot-on exploit! ${userAction.toUpperCase()} is the maximum EV play against a ${profile.shortName}.`;
  } else {
    message = `Suboptimal exploit. You selected ${userAction.toUpperCase()}, but optimal against a ${profile.shortName} is ${optimalExploit.toUpperCase()}.`;
  }

  return {
    isCorrect,
    optimalExploitAction: optimalExploit,
    gtoOptimalAction: gtoOptimal,
    message,
    exploitReasoning: exploitReasoning || `Exploitative play against ${profile.name} adjusts from GTO equilibrium to target their specific leaks.`,
    evDifferenceNote: evDifferenceNote || `Adjusting play against ${profile.shortName} captures higher EV than standard GTO.`
  };
}
