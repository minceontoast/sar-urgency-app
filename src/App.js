import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import AssessmentScreen from './components/AssessmentScreen';
import ResultScreen from './components/ResultScreen';
import { FACTORS } from './data/factors';
import './App.css';

const bgUrl = `${process.env.PUBLIC_URL}/forest-bg.jpg`;

function App() {
  const [screen, setScreen] = useState('home'); // home | assessment | result
  const [selections, setSelections] = useState({});

  const handleSelect = (factorId, value) => {
    setSelections((prev) => ({ ...prev, [factorId]: value }));
  };

  const handleReset = () => {
    setSelections({});
    setScreen('home');
  };

  const handleRandomise = () => {
    const randomSelections = {};
    FACTORS.forEach((factor) => {
      const randomOption = factor.options[Math.floor(Math.random() * factor.options.length)];
      randomSelections[factor.id] = randomOption.value;
    });
    setSelections(randomSelections);
    setScreen('result');
  };

  let content;
  if (screen === 'home') {
    content = <HomeScreen onStart={() => setScreen('assessment')} onRandomise={handleRandomise} />;
  } else if (screen === 'assessment') {
    content = (
      <AssessmentScreen
        selections={selections}
        onSelect={handleSelect}
        onFinish={() => setScreen('result')}
        onBack={() => setScreen('home')}
        onRandomise={handleRandomise}
      />
    );
  } else {
    content = (
      <ResultScreen
        selections={selections}
        onSelect={handleSelect}
        onReset={handleReset}
        onBack={() => setScreen('assessment')}
      />
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Grayscale mountain background */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${bgUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'grayscale(100%)',
          opacity: 0.3,
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {content}
      </div>
    </div>
  );
}

export default App;
