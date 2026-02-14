import React, { useState, useRef, useEffect } from 'react';
import UrgencyCard from './UrgencyCard';
import { FACTORS, SUITS } from '../data/factors';

export default function AssessmentScreen({ selections, onSelect, onFinish, onBack, onRandomise }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef(null);
  const [touchStart, setTouchStart] = useState(null);

  const factor = FACTORS[currentIndex];
  const suit = SUITS[factor.suit];
  const goTo = (idx) => {
    if (idx >= 0 && idx <= FACTORS.length) {
      setCurrentIndex(idx);
    }
  };

  // Swipe handling
  const handleTouchStart = (e) => setTouchStart(e.touches[0].clientX);
  const handleTouchEnd = (e) => {
    if (touchStart == null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0 && currentIndex < FACTORS.length - 1) goTo(currentIndex + 1);
      if (diff < 0 && currentIndex > 0) goTo(currentIndex - 1);
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' && currentIndex < FACTORS.length - 1) goTo(currentIndex + 1);
      if (e.key === 'ArrowLeft' && currentIndex > 0) goTo(currentIndex - 1);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'rgba(30, 30, 40, 0.7)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.92)',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 16,
            cursor: 'pointer',
            color: '#666',
            padding: '4px 8px',
          }}
        >
          ← Back
        </button>
        <span style={{ fontSize: 14, color: '#666', fontWeight: 600 }}>
          Card {currentIndex + 1} of {FACTORS.length}
        </span>
        <button
          onClick={onRandomise}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            borderRadius: 6,
            fontSize: 12,
            cursor: 'pointer',
            color: '#666',
            padding: '4px 10px',
            fontWeight: 600,
          }}
        >
          Randomise All
        </button>
      </div>

      {/* Progress bar */}
      <div style={{ height: 4, background: '#e0e0e0' }}>
        <div
          style={{
            height: '100%',
            width: `${((currentIndex + 1) / FACTORS.length) * 100}%`,
            background: suit.color,
            transition: 'all 0.3s ease',
          }}
        />
      </div>

      {/* Suit label */}
      <div
        style={{
          textAlign: 'center',
          padding: '12px 0 4px',
          fontSize: 12,
          color: '#fff',
          fontWeight: 600,
          letterSpacing: 1,
          textTransform: 'uppercase',
        }}
      >
        {suit.symbol} {suit.label} {suit.symbol}
      </div>

      {/* Card area */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '8px 16px 16px',
          overflow: 'hidden',
        }}
      >
        <UrgencyCard
          key={factor.id}
          factor={factor}
          selectedValue={selections[factor.id]}
          onSelect={(value) => onSelect(factor.id, value)}
        />
      </div>

      {/* Card dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          padding: '8px 0',
          flexWrap: 'wrap',
          maxWidth: 300,
          margin: '0 auto',
        }}
      >
        {FACTORS.map((f, i) => (
          <button
            key={f.id}
            onClick={() => goTo(i)}
            style={{
              width: i === currentIndex ? 24 : 10,
              height: 10,
              borderRadius: 5,
              border: 'none',
              background:
                i === currentIndex
                  ? SUITS[f.suit].color
                  : selections[f.id] != null
                  ? `${SUITS[f.suit].color}88`
                  : '#ccc',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          padding: 'calc(12px) 16px calc(24px + env(safe-area-inset-bottom))',
          justifyContent: 'center',
        }}
      >
        <button
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          style={{
            padding: '12px 24px',
            borderRadius: 10,
            border: '1px solid #ddd',
            background: '#fff',
            fontSize: 15,
            cursor: currentIndex === 0 ? 'default' : 'pointer',
            opacity: currentIndex === 0 ? 0.4 : 1,
            fontWeight: 600,
          }}
        >
          ← Previous
        </button>

        {currentIndex < FACTORS.length - 1 ? (
          <button
            onClick={() => goTo(currentIndex + 1)}
            style={{
              padding: '12px 24px',
              borderRadius: 10,
              border: 'none',
              background: suit.color,
              color: '#fff',
              fontSize: 15,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={onFinish}
            style={{
              padding: '12px 32px',
              borderRadius: 10,
              border: 'none',
              background: '#1a237e',
              color: '#fff',
              fontSize: 15,
              cursor: 'pointer',
              fontWeight: 700,
            }}
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
}
