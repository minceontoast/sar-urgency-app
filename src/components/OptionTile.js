import React from 'react';

export default function OptionTile({ option, selected, onSelect, suitColor }) {
  const isSelected = selected === option.value && selected != null;

  return (
    <button
      onClick={() => onSelect(option.value)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        padding: '12px 16px',
        minHeight: 44,
        border: isSelected ? `2px solid ${suitColor}` : '2px solid #e0e0e0',
        borderRadius: 10,
        background: isSelected ? `${suitColor}15` : '#fff',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: 15,
        transition: 'all 0.15s ease',
        marginBottom: 8,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: isSelected ? `6px solid ${suitColor}` : '2px solid #bbb',
          flexShrink: 0,
          boxSizing: 'border-box',
        }}
      />
      <span style={{ flex: 1, color: '#333' }}>{option.label}</span>
      <span
        style={{
          fontWeight: 700,
          color: option.value === 1 ? '#d32f2f' : '#666',
          fontSize: 14,
          minWidth: 20,
          textAlign: 'center',
        }}
      >
        {option.value}
      </span>
    </button>
  );
}
