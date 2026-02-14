export function calculateResult(selections, factors) {
  const total = factors.reduce((sum, factor) => {
    const selected = selections[factor.id];
    return sum + (selected != null ? selected : 1); // unknown = 1
  }, 0);

  const hasEmergencyFlag = factors.some((factor) => {
    const selected = selections[factor.id];
    return selected === 1 || selected == null;
  });

  let level;
  if (total <= 18) {
    level = 'emergency';
  } else if (total <= 27) {
    level = 'measured';
  } else {
    level = 'evaluate';
  }

  return { total, level, hasEmergencyFlag };
}

export const URGENCY_LEVELS = {
  emergency: {
    label: 'Emergency Response',
    color: '#d32f2f',
    bg: '#ffebee',
    range: '11-18',
    description: 'Immediate action required. Mobilise search resources now.',
  },
  measured: {
    label: 'Measured Response',
    color: '#e65100',
    bg: '#fff3e0',
    range: '19-27',
    description: 'Prompt action needed. Begin planning and resource allocation.',
  },
  evaluate: {
    label: 'Evaluate & Investigate',
    color: '#2e7d32',
    bg: '#e8f5e9',
    range: '28-41',
    description: 'Gather more information before committing resources.',
  },
};
