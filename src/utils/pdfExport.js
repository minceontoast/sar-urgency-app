import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FACTORS } from '../data/factors';
import { calculateResult, URGENCY_LEVELS } from './scoring';

const SUIT_LABELS = {
  hearts: 'Person',
  spades: 'Preparedness',
  diamonds: 'Environment',
  clubs: 'Situation',
};

const SUIT_COLORS = {
  hearts: [216, 67, 21],
  spades: [109, 76, 65],
  diamonds: [0, 121, 107],
  clubs: [55, 71, 79],
};

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function generatePDF({ selections, operationName, policeRef, date }) {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  // === HEADER ===
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('NZSAR Search Urgency Assessment', pageWidth / 2, y, { align: 'center' });
  y += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Land - Searchency App Export', pageWidth / 2, y, { align: 'center' });
  doc.setTextColor(0);
  y += 5;

  // Horizontal rule
  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // === OPERATION DETAILS ===
  const details = [
    ['Operation Name', operationName || '—'],
    ['Police Reference', policeRef || '—'],
    ['Date', date],
  ];

  doc.setFontSize(10);
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 40, y);
    y += 6;
  });

  y += 8;

  // === SCORING TABLE ===
  const tableBody = [];
  let currentSuit = null;

  FACTORS.forEach((factor) => {
    // Add suit header row when suit changes
    if (factor.suit !== currentSuit) {
      currentSuit = factor.suit;
      const suitLabel = SUIT_LABELS[factor.suit];
      const suitColor = SUIT_COLORS[factor.suit];
      tableBody.push([
        {
          content: suitLabel,
          colSpan: 4,
          styles: {
            fillColor: suitColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
            halign: 'left',
          },
        },
      ]);
    }

    const value = selections[factor.id] ?? 1;
    const selectedOption = factor.options.find((o) => o.value === value);
    const selectionLabel = selectedOption ? selectedOption.label : 'Unanswered (default)';
    const isEmergency = value === 1;

    tableBody.push([
      { content: SUIT_LABELS[factor.suit], styles: { fontSize: 9, textColor: [100, 100, 100] } },
      { content: factor.name, styles: { fontStyle: 'bold', fontSize: 9 } },
      { content: selectionLabel, styles: { fontSize: 9 } },
      {
        content: String(value),
        styles: {
          halign: 'center',
          fontStyle: 'bold',
          fontSize: 10,
          textColor: isEmergency ? [211, 47, 47] : [0, 0, 0],
          fillColor: isEmergency ? [255, 235, 238] : null,
        },
      },
    ]);
  });

  // Total row
  const result = calculateResult(selections, FACTORS);
  tableBody.push([
    {
      content: 'TOTAL SCORE',
      colSpan: 3,
      styles: {
        fontStyle: 'bold',
        fontSize: 11,
        halign: 'right',
        fillColor: [240, 240, 240],
      },
    },
    {
      content: String(result.total),
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 12,
        fillColor: [240, 240, 240],
      },
    },
  ]);

  doc.autoTable({
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Category', 'Factor', 'Selection', 'Score']],
    body: tableBody,
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
    },
    styles: {
      cellPadding: 3,
      fontSize: 9,
      lineColor: [220, 220, 220],
      lineWidth: 0.25,
    },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 50 },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 18, halign: 'center' },
    },
    didParseCell: (data) => {
      // Remove default fill for non-header rows (let per-cell styles take precedence)
      if (data.section === 'body' && !data.cell.styles.fillColor) {
        data.cell.styles.fillColor = [255, 255, 255];
      }
    },
  });

  y = doc.lastAutoTable.finalY + 12;

  // === URGENCY RESULT BOX ===
  const urgency = URGENCY_LEVELS[result.level];
  const urgencyRgb = hexToRgb(urgency.color);
  const urgencyBgRgb = hexToRgb(urgency.bg);
  const boxHeight = result.hasEmergencyFlag ? 48 : 38;

  // Check if we need a new page
  if (y + boxHeight > 275) {
    doc.addPage();
    y = 15;
  }

  // Background box
  doc.setFillColor(...urgencyBgRgb);
  doc.setDrawColor(...urgencyRgb);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

  // Urgency level label
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...urgencyRgb);
  doc.text(urgency.label, pageWidth / 2, y + 10, { align: 'center' });

  // Score and range
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(`Score: ${result.total} (Range: ${urgency.range})`, pageWidth / 2, y + 18, {
    align: 'center',
  });

  // Description
  doc.setFontSize(10);
  doc.setTextColor(80);
  doc.text(urgency.description, pageWidth / 2, y + 26, { align: 'center' });

  // Emergency flag warning
  if (result.hasEmergencyFlag) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(211, 47, 47);
    doc.text(
      'EMERGENCY FLAG: Factor(s) scored as 1 — consider Emergency Response.',
      pageWidth / 2,
      y + 36,
      { align: 'center' }
    );
  }

  y += boxHeight + 8;
  doc.setTextColor(0);

  // === FOOTER ===
  const footerY = 287;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(140);
  doc.text(`Generated by Searchency App — ${date}`, pageWidth / 2, footerY, { align: 'center' });
  doc.text('Based on NZSAR Search Urgency Form (Land)', pageWidth / 2, footerY + 4, {
    align: 'center',
  });

  // Save
  const filename = operationName
    ? `NZSAR-Urgency-${operationName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    : 'NZSAR-Urgency-Assessment.pdf';
  doc.save(filename);
}
