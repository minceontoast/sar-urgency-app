import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { FACTORS } from '../data/factors';
import { calculateResult, URGENCY_LEVELS } from './scoring';

function hexToRgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function getShortBrowser() {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/')) return 'Chrome';
  if (ua.includes('Safari/')) return 'Safari';
  return ua.substring(0, 50);
}

export async function generatePDF({ selections, operationName, policeRef, userName, date }) {
  // Fetch public IP
  let ip = 'Unknown';
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);
    const data = await res.json();
    ip = data.ip;
  } catch {
    ip = 'Unknown';
  }

  const browser = getShortBrowser();
  const exportTimestamp = new Date().toLocaleString();

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = 12;

  // === HEADER ===
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Search Urgency Assessment', pageWidth / 2, y, { align: 'center' });
  y += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100);
  doc.text('Land - Searchency App Export', pageWidth / 2, y, { align: 'center' });
  doc.setTextColor(0);
  y += 4;

  // Horizontal rule
  doc.setDrawColor(180);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // === OPERATION DETAILS ===
  const details = [
    ['Operation Name', operationName || '-'],
    ['Job Reference', policeRef || '-'],
    ['Name', userName || '-'],
    ['Date', date],
  ];

  doc.setFontSize(8);
  details.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, margin, y);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 35, y);
    y += 5;
  });

  y += 4;

  // === SCORING TABLE ===
  const tableBody = [];

  FACTORS.forEach((factor) => {
    const value = selections[factor.id] ?? 1;
    const selectedOption = factor.options.find((o) => o.value === value);
    const selectionLabel = selectedOption ? selectedOption.label : 'Unanswered (default)';
    const isEmergency = value === 1;

    tableBody.push([
      { content: factor.name, styles: { fontStyle: 'bold', fontSize: 7 } },
      { content: selectionLabel, styles: { fontSize: 7 } },
      {
        content: String(value),
        styles: {
          halign: 'center',
          fontStyle: 'bold',
          fontSize: 8,
          textColor: isEmergency ? [211, 47, 47] : [0, 0, 0],
          fillColor: isEmergency ? [255, 235, 238] : null,
        },
      },
      { content: '', styles: { fontSize: 7 } },
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
        fontSize: 9,
        halign: 'right',
        fillColor: [240, 240, 240],
      },
    },
    {
      content: String(result.total),
      styles: {
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 10,
        fillColor: [240, 240, 240],
      },
    },
  ]);

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Factor', 'Selection', 'Score', 'Comments']],
    body: tableBody,
    headStyles: {
      fillColor: [50, 50, 50],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      cellPadding: 2,
      fontSize: 7,
      lineColor: [220, 220, 220],
      lineWidth: 0.25,
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 16, halign: 'center' },
      3: { cellWidth: 45 },
    },
    didParseCell: (data) => {
      // Remove default fill for non-header rows (let per-cell styles take precedence)
      if (data.section === 'body' && !data.cell.styles.fillColor) {
        data.cell.styles.fillColor = [255, 255, 255];
      }
    },
  });

  y = doc.lastAutoTable.finalY + 8;

  // === URGENCY RESULT BOX ===
  const urgency = URGENCY_LEVELS[result.level];
  const urgencyRgb = hexToRgb(urgency.color);
  const urgencyBgRgb = hexToRgb(urgency.bg);
  const boxHeight = result.hasEmergencyFlag ? 36 : 28;

  // Background box
  doc.setFillColor(...urgencyBgRgb);
  doc.setDrawColor(...urgencyRgb);
  doc.setLineWidth(0.75);
  doc.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, 'FD');

  // Urgency level label
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...urgencyRgb);
  doc.text(urgency.label, pageWidth / 2, y + 8, { align: 'center' });

  // Score and range
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Score: ${result.total} (Range: ${urgency.range})`, pageWidth / 2, y + 14, {
    align: 'center',
  });

  // Description
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text(urgency.description, pageWidth / 2, y + 20, { align: 'center' });

  // Emergency flag warning
  if (result.hasEmergencyFlag) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(211, 47, 47);
    doc.text(
      'EMERGENCY FLAG: Factor(s) scored as 1 - consider Emergency Response.',
      pageWidth / 2,
      y + 28,
      { align: 'center' }
    );
  }

  y += boxHeight + 6;
  doc.setTextColor(0);

  // === FOOTER ===
  const footerY = 287;

  // Export metadata
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160);
  doc.text(
    `Exported: ${exportTimestamp}  |  Browser: ${browser}  |  IP: ${ip}`,
    pageWidth / 2,
    footerY - 8,
    { align: 'center' }
  );

  doc.setFontSize(8);
  doc.setTextColor(140);
  doc.text(`Generated by Searchency App - ${date}`, pageWidth / 2, footerY, { align: 'center' });
  doc.text('Based on Search Urgency Form (Land)', pageWidth / 2, footerY + 4, {
    align: 'center',
  });

  // Save
  const filename = operationName
    ? `Urgency-${operationName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`
    : 'Urgency-Assessment.pdf';
  doc.save(filename);
}
