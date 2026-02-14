export const SUITS = {
  hearts: { name: 'Hearts', symbol: '👤', color: '#d84315', label: 'Person' },
  spades: { name: 'Spades', symbol: '🎒', color: '#6d4c41', label: 'Preparedness' },
  diamonds: { name: 'Diamonds', symbol: '⛰️', color: '#00796b', label: 'Environment' },
  clubs: { name: 'Clubs', symbol: '🧭', color: '#37474f', label: 'Situation' },
};

export const FACTORS = [
  // Hearts - Person (4 cards)
  {
    id: 1,
    suit: 'hearts',
    name: 'Age of Missing Person',
    options: [
      { label: 'Very young (1-5 years)', value: 1 },
      { label: 'Very old (75+ years)', value: 1 },
      { label: 'Youth (6-12 years)', value: 2 },
      { label: 'Elderly (65-75 years)', value: 2 },
      { label: 'Teen / Young adult (13-20)', value: 3 },
      { label: 'Adult (21-64 years)', value: 4 },
    ],
  },
  {
    id: 2,
    suit: 'hearts',
    name: 'Medical Conditions',
    options: [
      { label: 'Known injury or illness - critical', value: 1 },
      { label: 'Known injury or illness - non-critical', value: 2 },
      { label: 'Healthy / no known conditions', value: 3 },
      { label: 'Known fatality', value: 4 },
    ],
  },
  {
    id: 3,
    suit: 'hearts',
    name: 'Physical Fitness',
    options: [
      { label: 'Unfit / limited mobility', value: 1 },
      { label: 'Reasonably fit', value: 2 },
      { label: 'Very fit / athletic', value: 3 },
    ],
  },

  // Spades - Preparedness (3 cards)
  {
    id: 4,
    suit: 'spades',
    name: 'Experience',
    options: [
      { label: 'Not experienced, unfamiliar with area', value: 1 },
      { label: 'Not experienced, knows the area', value: 2 },
      { label: 'Experienced, unfamiliar with area', value: 3 },
      { label: 'Experienced and knows the area', value: 4 },
    ],
  },
  {
    id: 5,
    suit: 'spades',
    name: 'Clothing',
    options: [
      { label: 'Inadequate for conditions', value: 1 },
      { label: 'Adequate for conditions', value: 2 },
      { label: 'Well clothed for conditions', value: 3 },
    ],
  },
  {
    id: 6,
    suit: 'spades',
    name: 'Equipment',
    options: [
      { label: 'Inadequate for activity', value: 1 },
      { label: 'Questionable for activity', value: 2 },
      { label: 'Adequate for activity', value: 3 },
      { label: 'Well equipped for activity', value: 4 },
    ],
  },

  // Diamonds - Environment (3 cards)
  {
    id: 7,
    suit: 'diamonds',
    name: 'Weather',
    options: [
      { label: 'Existing hazardous weather', value: 1 },
      { label: 'Predicted hazardous weather < 8hrs', value: 2 },
      { label: 'No hazardous weather > 8hrs', value: 3 },
      { label: 'No hazardous weather predicted', value: 4 },
    ],
  },
  {
    id: 8,
    suit: 'diamonds',
    name: 'Terrain & Hazards',
    options: [
      { label: 'Known hazards in area', value: 1 },
      { label: 'Difficult terrain, potential hazards', value: 2 },
      { label: 'Few hazards in area', value: 3 },
      { label: 'Easy terrain, no known hazards', value: 4 },
    ],
  },
  {
    id: 9,
    suit: 'diamonds',
    name: 'Length of Time Missing',
    options: [
      { label: 'Over 12 hours', value: 1 },
      { label: '4 to 12 hours', value: 2 },
      { label: 'Under 4 hours', value: 3 },
      { label: 'Over 7 days', value: 4 },
    ],
  },

  {
    id: 11,
    suit: 'hearts',
    name: 'Reliability / Punctuality',
    options: [
      { label: 'Very reliable and punctual', value: 1 },
      { label: 'Usually reliable', value: 2 },
      { label: 'Questionable reliability', value: 3 },
      { label: 'Completely unreliable', value: 4 },
    ],
  },

  // Clubs - Situation (1 card)
  {
    id: 10,
    suit: 'clubs',
    name: 'Number of Missing Persons',
    options: [
      { label: 'Alone', value: 1 },
      { label: 'Group - separated / scattered', value: 1 },
      { label: 'Group - together, no leader', value: 2 },
      { label: 'Group - together with leader', value: 3 },
    ],
  },
];
