import React from 'react';

export default function HomeScreen({ onStart, onRandomise }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '100vh',
        padding: '32px 32px calc(32px + env(safe-area-inset-bottom))',
        background: 'rgba(20, 20, 30, 0.65)',
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <h1 style={{ fontSize: 42, fontWeight: 800, marginBottom: 6, letterSpacing: -1 }}>
        Searchency
      </h1>
      <h2
        style={{
          fontSize: 15,
          fontWeight: 400,
          opacity: 0.7,
          marginBottom: 8,
        }}
      >
        SAR Search Urgency Assessment
      </h2>
      <p
        style={{
          fontSize: 14,
          opacity: 0.5,
          maxWidth: 320,
          lineHeight: 1.5,
          marginBottom: 48,
        }}
      >
        Assess 11 urgency factors across 4 categories to determine the
        appropriate search response level.
      </p>

      <select
        style={{
          padding: '10px 16px',
          fontSize: 15,
          fontWeight: 600,
          background: 'rgba(255,255,255,0.15)',
          color: '#fff',
          border: '2px solid rgba(255,255,255,0.3)',
          borderRadius: 10,
          marginBottom: 20,
          cursor: 'pointer',
          appearance: 'none',
          WebkitAppearance: 'none',
          textAlign: 'center',
          minWidth: 200,
        }}
        defaultValue="nz"
      >
        <option value="nz" style={{ color: '#222' }}>New Zealand</option>
      </select>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <button
          onClick={onStart}
          style={{
            padding: '16px 48px',
            fontSize: 18,
            fontWeight: 700,
            background: '#fff',
            color: '#222',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Begin Assessment
        </button>
        <button
          onClick={onRandomise}
          style={{
            padding: '14px 48px',
            fontSize: 16,
            fontWeight: 600,
            background: 'transparent',
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseDown={(e) => (e.target.style.transform = 'scale(0.96)')}
          onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
        >
          Randomise
        </button>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 'max(16px, env(safe-area-inset-bottom))',
          left: 0,
          right: 0,
          textAlign: 'center',
          fontSize: 11,
          color: 'rgba(255,255,255,0.35)',
          lineHeight: 1.5,
          padding: '0 24px',
        }}
      >
        Created by Ally Rutherford & Ed Cook, Land Search & Rescue Wellington.
        <br />
        Based on NZSAR Search Urgency Form (Land).
      </div>
    </div>
  );
}
