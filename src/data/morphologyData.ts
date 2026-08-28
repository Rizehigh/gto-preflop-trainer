import { HandCategoryType, MorphologyInsight } from '../types/poker';

export const MORPHOLOGY_INSIGHTS: Record<HandCategoryType, MorphologyInsight> = {
  pair: {
    title: 'Pocket Pairs (AA – 22)',
    handType: 'pair',
    concept: 'Set Mining & High Preflop Equity',
    highCardValue: 'High for premium pairs (AA-TT), lower for small pairs (66-22).',
    suitedness: 'N/A (Same rank cards, never suited). 6 combinations per pair.',
    connectivity: 'N/A',
    blockerValue: 'AA & KK block opponent premium holdings by 50%.',
    equityRealization: 'High for AA-TT; low for 66-22 out of position (easily overcarded on board).',
    explanation: 'Pocket pairs have made hands before the flop. AA-QQ are pure value raises and 3-bets. Smaller pairs (22-66) rely on set-mining (flopping 3-of-a-kind ~11.8% of the time); fold them when facing heavy aggression or out of position with shallow stacks.'
  },
  suited_broadway: {
    title: 'Suited Broadways (AKs, KQs, QJs, JTs, ATs)',
    handType: 'suited_broadway',
    concept: 'Equity Domination & Barrel Potential',
    highCardValue: 'Elite! All rank cards are 10 or higher.',
    suitedness: 'Suited (+3-4% equity + nut/high flush potential). 4 combinations per hand.',
    connectivity: 'Strong (make top straights like Broadway TJQKA).',
    blockerValue: 'Exceptional blockers to opponent top pairs and 3-bet ranges.',
    equityRealization: 'Very High (~110-120% IP). Easy to play on almost all flop textures.',
    explanation: 'Suited broadways are the cornerstone of GTO preflop strategy. They combine top pair domination, nut flush draws, and straight possibilities, allowing you to multi-barrel postflop with strong equity.'
  },
  suited_wheel: {
    title: 'Suited Wheels (A5s – A2s)',
    handType: 'suited_wheel',
    concept: 'Ace Blocker & Wheel Straight Potential',
    highCardValue: 'High Ace top card + low kicker (5, 4, 3, 2).',
    suitedness: 'Suited (Nut Flush draw capability).',
    connectivity: 'Wheel connectivity (5-4-3-2-A makes the 5-high straight).',
    blockerValue: 'Crucial Ace Blocker! Reduces opponent holding AA by 50% and AK by 50%.',
    equityRealization: 'Moderate to High when played aggressively.',
    explanation: 'Suited wheel aces (especially A5s & A4s) are GTO default 3-bet and 4-bet bluffing hands! Holding the Ace blocks your opponent from having AA/AK, while your suited low card gives you nut flush and wheel straight equity when called.'
  },
  suited_connector: {
    title: 'Suited Connectors (T9s, 98s, 87s, 76s, 65s, 54s)',
    handType: 'suited_connector',
    concept: 'Implied Odds & Board Coverage',
    highCardValue: 'Medium to Low.',
    suitedness: 'Suited (Flush draws + backdoors).',
    connectivity: 'Maximum connectivity! (Sequential ranks make straights from both sides).',
    blockerValue: 'Low card blockers (rarely block high value ranges).',
    equityRealization: 'High in position (IP), lower out of position (OOP).',
    explanation: 'Suited connectors provide crucial board coverage so opponents cannot easily fold on low/connected boards. They hit sneaky straights and flushes that can win massive pots (high implied odds) against overpairs.'
  },
  suited_gapper: {
    title: 'Suited Gappers (J9s, T8s, 97s, 86s, 75s)',
    handType: 'suited_gapper',
    concept: 'Disguised Straights & Wide Range Defense',
    highCardValue: 'Medium.',
    suitedness: 'Suited.',
    connectivity: 'Single-gap connectivity (can make 3 different straights).',
    blockerValue: 'Low/Moderate.',
    equityRealization: 'Moderate.',
    explanation: 'Suited 1-gappers are great stealing and blind defense hands. They hit disguised straights that opponents rarely expect, making them great candidate opens on Cutoff and Button.'
  },
  offsuit_broadway: {
    title: 'Offsuit Broadways (AKo, AQo, AJo, ATo, KQo, KJo, QJo)',
    handType: 'offsuit_broadway',
    concept: 'High Card Strength vs Reverse Implied Odds',
    highCardValue: 'High to Very High.',
    suitedness: 'Offsuit (12 combos each). No flush potential.',
    connectivity: 'Moderate to High.',
    blockerValue: 'Strong high card blockers.',
    equityRealization: 'Moderate (~90% realization). Harder to play when missing flop.',
    explanation: 'Offsuit broadways have high raw equity preflop but lack postflop flexibility because they cannot make flushes. Hands like KJo and QJo suffer from "reverse implied odds" — when you hit top pair, you are often dominated by AK, AQ, or AJ.'
  },
  offsuit_trash: {
    title: 'Offsuit Unconnected / Trash (K8o, Q6o, J4o, 72o)',
    handType: 'offsuit_trash',
    concept: 'Dominated & Equity Trash',
    highCardValue: 'Low or single weak high card.',
    suitedness: 'Offsuit.',
    connectivity: 'Weak or disconnected.',
    blockerValue: 'Negligible.',
    equityRealization: 'Very Low (<60%).',
    explanation: 'These hands have low equity, no suited flush potential, and terrible reverse implied odds. They should be folded in almost every preflop situation.'
  },
  suited_trash: {
    title: 'Suited Trash / Weak Suited (K3s, Q4s, J2s, 82s)',
    handType: 'suited_trash',
    concept: 'Suited Flush Potential with Weak Kicker',
    highCardValue: 'Low or single medium card.',
    suitedness: 'Suited (4 combos).',
    connectivity: 'Weak/Disconnected.',
    blockerValue: 'Weak.',
    equityRealization: 'Low to Moderate.',
    explanation: 'While suitedness adds ~3% raw equity, weak suited hands are easily dominated when hitting top pair or second-best flushes (e.g. K3s making 2nd nut flush vs A8s making nut flush). Best folded except on the Button or in late position steals.'
  }
};

export function getMorphologyInsightForHand(handNotation: string): MorphologyInsight {
  if (handNotation.length === 2) {
    return MORPHOLOGY_INSIGHTS.pair;
  }
  const r1 = handNotation[0];
  const r2 = handNotation[1];
  const isSuited = handNotation.endsWith('s');
  
  if (isSuited) {
    if (r1 === 'A' && ['5', '4', '3', '2'].includes(r2)) {
      return MORPHOLOGY_INSIGHTS.suited_wheel;
    }
    if (['A', 'K', 'Q', 'J', 'T'].includes(r1) && ['A', 'K', 'Q', 'J', 'T'].includes(r2)) {
      return MORPHOLOGY_INSIGHTS.suited_broadway;
    }
    const val1 = r1 === 'A' ? 14 : r1 === 'K' ? 13 : r1 === 'Q' ? 12 : r1 === 'J' ? 11 : r1 === 'T' ? 10 : parseInt(r1);
    const val2 = r2 === 'A' ? 14 : r2 === 'K' ? 13 : r2 === 'Q' ? 12 : r2 === 'J' ? 11 : r2 === 'T' ? 10 : parseInt(r2);
    const diff = Math.abs(val1 - val2);
    
    if (diff === 1) return MORPHOLOGY_INSIGHTS.suited_connector;
    if (diff === 2 || diff === 3) return MORPHOLOGY_INSIGHTS.suited_gapper;
    return MORPHOLOGY_INSIGHTS.suited_trash;
  } else {
    if (['A', 'K', 'Q', 'J', 'T'].includes(r1) && ['A', 'K', 'Q', 'J', 'T'].includes(r2)) {
      return MORPHOLOGY_INSIGHTS.offsuit_broadway;
    }
    return MORPHOLOGY_INSIGHTS.offsuit_trash;
  }
}
