import React from 'react';
import { SUITS } from '../data/factors';

export default function SuitIcon({ suit, size = 24 }) {
  const { symbol, color } = SUITS[suit];
  return (
    <span
      style={{
        fontSize: size,
        color,
        lineHeight: 1,
        fontFamily: 'serif',
      }}
    >
      {symbol}
    </span>
  );
}
