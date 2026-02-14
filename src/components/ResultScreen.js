import React, { useState } from 'react';
import { FACTORS, SUITS } from '../data/factors';
import { calculateResult, URGENCY_LEVELS } from '../utils/scoring';

const FACTOR_COLORS = [
  '#e53935', // 1  Age - red
  '#d81b60', // 2  Medical - pink
  '#8e24aa', // 3  Fitness - purple
  '#5e35b1', // 4  Experience - deep purple
  '#3949ab', // 5  Clothing - indigo
  '#1e88e5', // 6  Equipment - blue
  '#00acc1', // 7  Weather - cyan
  '#00897b', // 8  Terrain - teal
  '#43a047', // 9  Time missing - green
  '#f4a100', // 10 Number of MPs - amber
  '#6d4c41', // 11 Reliability - brown
];

function ResultCard({ factor, value, color, isActive, onClick }) {
  const isEmergency = value === 1;
  const selectedOption = factor.options.find((o) => o.value === value);

  return (
    <div
      onClick={onClick}
      style={{
        width: 110,
        minWidth: 110,
        height: 160,
        background: isActive ? `${color}12` : '#fff',
        borderRadius: 10,
        boxShadow: isActive
          ? `0 4px 16px ${color}44`
          : isEmergency
          ? '0 2px 12px rgba(211,47,47,0.35)'
          : '0 2px 8px rgba(0,0,0,0.1)',
        border: isActive
          ? `3px solid ${color}`
          : isEmergency
          ? '2px solid #d32f2f'
          : `2px solid ${color}`,
        padding: '8px 6px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        flexShrink: 0,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        transform: isActive ? 'scale(1.05)' : 'scale(1)',
      }}
    >
      {/* Top-left value */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: isEmergency ? '#d32f2f' : color,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>

      {/* Center - factor name */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 2px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: '#333',
            lineHeight: 1.3,
            marginBottom: 3,
          }}
        >
          {factor.name}
        </div>
        {selectedOption && (
          <div style={{ fontSize: 8, color: '#888', lineHeight: 1.2 }}>
            {selectedOption.label}
          </div>
        )}
      </div>

      {/* Bottom-right value (rotated) */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          right: 6,
          transform: 'rotate(180deg)',
        }}
      >
        <span
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: isEmergency ? '#d32f2f' : color,
            lineHeight: 1,
          }}
        >
          {value}
        </span>
      </div>

      {/* Color strip at top */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: isEmergency ? '#d32f2f' : color,
          borderRadius: '10px 10px 0 0',
        }}
      />
    </div>
  );
}

function EditPanel({ factor, value, color, onSelect, onClose }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: `2px solid ${color}`,
        boxShadow: `0 6px 24px ${color}33, 0 2px 8px rgba(0,0,0,0.1)`,
        padding: 16,
        marginTop: 8,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 15, color: '#333' }}>
          {factor.name}
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: 18,
            cursor: 'pointer',
            color: '#999',
            padding: '0 4px',
          }}
        >
          ×
        </button>
      </div>
      {factor.options.map((option, i) => {
        const isSelected = value === option.value;
        return (
          <button
            key={i}
            onClick={() => onSelect(factor.id, option.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '10px 12px',
              border: isSelected ? `2px solid ${color}` : '2px solid #e0e0e0',
              borderRadius: 8,
              background: isSelected ? `${color}15` : '#fff',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 14,
              marginBottom: 6,
              transition: 'all 0.1s ease',
            }}
          >
            <span
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: isSelected ? `5px solid ${color}` : '2px solid #bbb',
                flexShrink: 0,
                boxSizing: 'border-box',
              }}
            />
            <span style={{ flex: 1, color: '#333' }}>{option.label}</span>
            <span
              style={{
                fontWeight: 700,
                color: option.value === 1 ? '#d32f2f' : '#666',
                fontSize: 13,
              }}
            >
              {option.value}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function ResultScreen({ selections, onSelect, onReset, onBack }) {
  const [editingId, setEditingId] = useState(null);

  const result = calculateResult(selections, FACTORS);
  const urgency = URGENCY_LEVELS[result.level];
  const unansweredCount = FACTORS.filter((f) => selections[f.id] == null).length;

  const editingIndex = editingId != null ? FACTORS.findIndex((f) => f.id === editingId) : -1;
  const editingFactor = editingIndex >= 0 ? FACTORS[editingIndex] : null;

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
          ← Back to Cards
        </button>
      </div>

      {/* Score card */}
      <div style={{ padding: '16px 16px 0', maxWidth: 540, margin: '0 auto', width: '100%' }}>
        <div
          style={{
            background: urgency.bg,
            border: `2px solid ${urgency.color}`,
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
            Total Score
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 800,
              color: urgency.color,
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            {result.total}
          </div>
          <div style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>
            out of 41 (range: {urgency.range})
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: urgency.color,
              marginBottom: 8,
            }}
          >
            {urgency.label}
          </div>
          <div style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>
            {urgency.description}
          </div>
        </div>
      </div>

      {/* All cards horizontal strip */}
      <div
        className="hide-scrollbar"
        style={{
          display: 'flex',
          gap: 10,
          padding: '16px 16px 12px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: 'x mandatory',
          background: 'rgba(255,255,255,0.92)',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        {FACTORS.map((f, i) => (
          <div key={f.id} style={{ scrollSnapAlign: 'start' }}>
            <ResultCard
              factor={f}
              value={selections[f.id] ?? 1}
              color={FACTOR_COLORS[i]}
              isActive={editingId === f.id}
              onClick={() => setEditingId(editingId === f.id ? null : f.id)}
            />
          </div>
        ))}
      </div>

      {/* Edit panel (appears below cards when one is selected) */}
      {editingFactor && (
        <div style={{ padding: '0 16px', maxWidth: 540, margin: '0 auto', width: '100%' }}>
          <EditPanel
            factor={editingFactor}
            value={selections[editingFactor.id] ?? 1}
            color={FACTOR_COLORS[editingIndex]}
            onSelect={(id, val) => {
              onSelect(id, val);
            }}
            onClose={() => setEditingId(null)}
          />
        </div>
      )}

      <div style={{ padding: 16, maxWidth: 540, margin: '0 auto', width: '100%' }}>
        {/* Unanswered warning */}
        {unansweredCount > 0 && (
          <div
            style={{
              background: '#fff3e0',
              border: '1px solid #ff9800',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 16,
              fontSize: 14,
              color: '#e65100',
            }}
          >
            ⚠ {unansweredCount} factor{unansweredCount > 1 ? 's' : ''} unanswered
            (defaulting to value 1)
          </div>
        )}

        {/* Emergency flag */}
        {result.hasEmergencyFlag && (
          <div
            style={{
              background: '#ffebee',
              border: '1px solid #d32f2f',
              borderRadius: 10,
              padding: '12px 16px',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                color: '#d32f2f',
                fontSize: 14,
                marginBottom: 4,
              }}
            >
              ⚠ Emergency Flag: Factor(s) scored as 1
            </div>
            <div style={{ fontSize: 13, color: '#d32f2f' }}>
              Consider Emergency Response regardless of total score.
            </div>
          </div>
        )}

        {/* Contributing factors breakdown */}
        {(() => {
          const factorDetails = FACTORS.map((f, i) => ({
            factor: f,
            value: selections[f.id] ?? 1,
            color: FACTOR_COLORS[i],
            suit: SUITS[f.suit],
            option: f.options.find((o) => o.value === (selections[f.id] ?? 1)),
          }));

          const critical = factorDetails.filter((d) => d.value === 1);
          const concerning = factorDetails.filter((d) => d.value === 2);
          const favourable = factorDetails.filter((d) => d.value >= 3);

          const groups = [
            { label: 'Critical', items: critical, color: '#d32f2f', bg: '#ffebee' },
            { label: 'Concerning', items: concerning, color: '#e65100', bg: '#fff3e0' },
            { label: 'Favourable', items: favourable, color: '#2e7d32', bg: '#e8f5e9' },
          ];

          return (
            <div
              style={{
                background: '#fff',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: 15, color: '#333', marginBottom: 12 }}>
                Contributing Factors
              </div>
              {groups.map(
                (group) =>
                  group.items.length > 0 && (
                    <div key={group.label} style={{ marginBottom: 12 }}>
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: group.color,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                          marginBottom: 6,
                        }}
                      >
                        {group.label} ({group.items.length})
                      </div>
                      {group.items.map((d) => (
                        <div
                          key={d.factor.id}
                          onClick={() =>
                            setEditingId(editingId === d.factor.id ? null : d.factor.id)
                          }
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '8px 10px',
                            background: group.bg,
                            borderRadius: 8,
                            marginBottom: 4,
                            cursor: 'pointer',
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              color: '#999',
                              minWidth: 16,
                            }}
                          >
                            {d.suit.symbol}
                          </span>
                          <span
                            style={{
                              flex: 1,
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#333',
                            }}
                          >
                            {d.factor.name}
                          </span>
                          <span
                            style={{
                              fontSize: 12,
                              color: '#666',
                              maxWidth: 160,
                              textAlign: 'right',
                              lineHeight: 1.3,
                            }}
                          >
                            {d.option?.label}
                          </span>
                          <span
                            style={{
                              fontWeight: 800,
                              fontSize: 14,
                              color: group.color,
                              minWidth: 18,
                              textAlign: 'center',
                            }}
                          >
                            {d.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )
              )}
            </div>
          );
        })()}

        {/* Actions */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            paddingBottom: 'max(32px, env(safe-area-inset-bottom))',
          }}
        >
          <button
            onClick={onReset}
            style={{
              padding: '14px 32px',
              borderRadius: 10,
              border: '1px solid #ddd',
              background: '#fff',
              fontSize: 15,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
