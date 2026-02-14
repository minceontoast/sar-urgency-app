import React from 'react';
import OptionTile from './OptionTile';
import { SUITS } from '../data/factors';

export default function UrgencyCard({ factor, selectedValue, onSelect }) {
  const suit = SUITS[factor.suit];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 400,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
        padding: '20px 20px 24px',
        position: 'relative',
        border: `1px solid ${suit.color}22`,
      }}
    >
      {/* Card header */}
      <div style={{ textAlign: 'center', marginBottom: 16, paddingTop: 8 }}>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: 1.5,
            color: suit.color,
            fontWeight: 600,
            marginBottom: 4,
          }}
        >
          {suit.label}
        </div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#222',
          }}
        >
          {factor.name}
        </div>
      </div>

      {/* Options */}
      <div style={{ padding: '0 4px' }}>
        {factor.options.map((option, i) => (
          <OptionTile
            key={i}
            option={option}
            selected={selectedValue}
            onSelect={onSelect}
            suitColor={suit.color}
          />
        ))}
      </div>

      {/* Unknown hint */}
      <div
        style={{
          textAlign: 'center',
          fontSize: 12,
          color: '#999',
          marginTop: 8,
        }}
      >
        If unknown, value defaults to 1
      </div>
    </div>
  );
}
