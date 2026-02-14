import React, { useState } from 'react';
import { generatePDF } from '../utils/pdfExport';

function formatDate() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function ExportModal({ selections, onClose }) {
  const [operationName, setOperationName] = useState('');
  const [policeRef, setPoliceRef] = useState('');
  const date = formatDate();

  const handleExport = () => {
    generatePDF({ selections, operationName, policeRef, date });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 14,
          padding: 24,
          width: '100%',
          maxWidth: 420,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: 18, color: '#333', marginBottom: 20 }}>
          Export PDF
        </div>

        <label style={{ display: 'block', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 4 }}>
            Operation Name
          </div>
          <input
            type="text"
            value={operationName}
            onChange={(e) => setOperationName(e.target.value)}
            placeholder="Optional"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #ddd',
              borderRadius: 8,
              fontSize: 15,
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 4 }}>
            Police Reference
          </div>
          <input
            type="text"
            value={policeRef}
            onChange={(e) => setPoliceRef(e.target.value)}
            placeholder="Optional"
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #ddd',
              borderRadius: 8,
              fontSize: 15,
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#555', marginBottom: 4 }}>
            Date
          </div>
          <input
            type="text"
            value={date}
            readOnly
            style={{
              width: '100%',
              padding: '10px 12px',
              border: '1.5px solid #ddd',
              borderRadius: 8,
              fontSize: 15,
              boxSizing: 'border-box',
              background: '#f5f5f5',
              color: '#666',
            }}
          />
        </label>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 10,
              border: '1px solid #ddd',
              background: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
              color: '#666',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            style={{
              flex: 1,
              padding: '12px 0',
              borderRadius: 10,
              border: 'none',
              background: '#1565c0',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
