import React from 'react';
import { Card } from '../types/poker';
import { SUIT_COLORS, SUIT_SYMBOLS } from '../utils/pokerUtils';

interface PlayingCardProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const PlayingCard: React.FC<PlayingCardProps> = ({ card, size = 'md', animated = true }) => {
  const symbol = SUIT_SYMBOLS[card.suit];
  const colorClass = SUIT_COLORS[card.suit];

  const sizeClasses = {
    sm: 'w-12 h-16 text-sm p-1 rounded border',
    md: 'w-20 h-28 text-xl p-2 rounded-lg border-2 shadow-lg',
    lg: 'w-28 h-40 text-3xl p-3 rounded-xl border-2 shadow-xl'
  }[size];

  const symbolSizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-5xl'
  }[size];

  return (
    <div
      className={`relative flex flex-col justify-between bg-slate-900 border-slate-700/80 text-slate-100 font-bold select-none transform transition-all duration-300 ${
        animated ? 'hover:-translate-y-1 hover:shadow-emerald-500/10 hover:border-slate-500' : ''
      } ${sizeClasses}`}
    >
      {/* Top Left Corner */}
      <div className={`flex flex-col items-center leading-none ${colorClass}`}>
        <span>{card.rank}</span>
        <span className="text-[0.7em]">{symbol}</span>
      </div>

      {/* Center Giant Suit Symbol */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 ${colorClass} ${symbolSizeClasses}`}>
        {symbol}
      </div>

      {/* Bottom Right Corner (Inverted) */}
      <div className={`flex flex-col items-center leading-none self-end rotate-180 ${colorClass}`}>
        <span>{card.rank}</span>
        <span className="text-[0.7em]">{symbol}</span>
      </div>
    </div>
  );
};
