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
    sm: 'w-12 h-16 text-sm p-1 rounded-m3-xs border',
    md: 'w-20 h-28 text-xl p-2 rounded-m3-sm border shadow',
    lg: 'w-24 h-36 text-2xl p-2.5 rounded-m3-md border-2 shadow-md'
  }[size];

  const symbolSizeClasses = {
    sm: 'text-lg',
    md: 'text-3xl',
    lg: 'text-4xl'
  }[size];

  return (
    <div
      className={`relative flex flex-col justify-between bg-m3-surfaceContainerHighest border-m3-outline text-m3-onSurface font-bold select-none transition-transform duration-150 ${
        animated ? 'hover:-translate-y-1 hover:shadow-lg hover:border-m3-primary' : ''
      } ${sizeClasses}`}
    >
      {/* Top Left Corner */}
      <div className={`flex flex-col items-center leading-none ${colorClass}`}>
        <span>{card.rank}</span>
        <span className="text-[0.75em]">{symbol}</span>
      </div>

      {/* Center Giant Suit Symbol */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 ${colorClass} ${symbolSizeClasses}`}>
        {symbol}
      </div>

      {/* Bottom Right Corner (Inverted) */}
      <div className={`flex flex-col items-center leading-none self-end rotate-180 ${colorClass}`}>
        <span>{card.rank}</span>
        <span className="text-[0.75em]">{symbol}</span>
      </div>
    </div>
  );
};
