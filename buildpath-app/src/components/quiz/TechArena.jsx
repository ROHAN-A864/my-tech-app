import React, { useState, useEffect } from 'react';
import { TECH_CATEGORIES } from '../../data/techQuestions';

const TechArena = () => {
  const [selectedCategory, setSelectedCategory] = useState('Coding');
  const [selectedLevel, setSelectedLevel] = useState('Easy');
  const [gameState, setGameState] = useState('setup'); 
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]); 
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);

  // Timer Lifecycle
  useEffect(() => {
    if (gameState !== 'playing' || selectedOption !== null) return;

    if (timeLeft === 0) {
      setSelectedOption(-1); 
      setTimeout(() => {
        loadNextQuestion();
      }, 1500);
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timeLeft, gameState, selectedOption]);

  const loadNextQuestion = (currentHistory = history) => {
    // Crash Protection: Safe Guard mapping if object keys fail
    const categoryData = TECH_CATEGORIES[selectedCategory] || {};
    const allQuestions = categoryData[selectedLevel] || [];
    
    const remainingQuestions = allQuestions.filter((_, idx) => !currentHistory.includes(idx));

    if (remainingQuestions.length === 0) {
      setGameState('end');
      return;
    }

    const randomIndex = Math.floor(Math.random() * remainingQuestions.length);
    const actualIndexInBank = allQuestions.indexOf(remainingQuestions[randomIndex]);

    setCurrentQuestion(remainingQuestions[randomIndex]);
    setHistory([...currentHistory, actualIndexInBank]);
    setSelectedOption(null);
    setTimeLeft(30); 
  };

  const startQuiz = () => {
    setScore(0);
    setHistory([]);
    setGameState('playing');
    loadNextQuestion([]);
  };

  const handleAnswerSubmit = (idx) => {
    setSelectedOption(idx);
    if (idx === currentQuestion.correctIndex) {
      setScore(prev => prev + 20);
    }

    setTimeout(() => {
      loadNextQuestion();
    }, 1200);
  };

  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (timeLeft / 30) * circumference;
  const isWarningState = timeLeft <= 10;

  return (
    <div style={{
      backgroundColor: '#0c1311', border: '1px solid #1a3a32', borderRadius: '16px',
      padding: '30px', marginTop: '25px', fontFamily: 'monospace', color: '#cfe9de',
      boxShadow: '0 0 25px rgba(57, 255, 158, 0.03)', animation: 'arenaFadeIn 0.4s ease-out'
    }}>

      <style>{`
        @keyframes arenaFadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes questionSlide { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulseCritical { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
        .grid-btn { transition: all 0.25s ease; }
        .grid-btn:hover:not(:disabled) { background-color: #163029 !important; border-color: #39ff9e !important; }
        .action-btn { transition: all 0.2s; }
        .action-btn:hover { background-color: #26b36d !important; box-shadow: 0 0 20px rgba(57, 255, 158, 0.4); }
      `}</style>
      
      {gameState === 'setup' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '35px' }}>
            <h2 style={{ color: '#39ff9e', letterSpacing: '2px', fontSize: '18px' }}>⚡ SYSTEM TECH ARENA v2.5</h2>
            <p style={{ color: '#688c80', fontSize: '12px' }}>[ Safe Initialization Terminal Layer Active ]</p>
          </div>
          
          <div style={{ marginBottom: '25px' }}>
            <p style={{ fontSize: '11px', color: '#39ff9e', marginBottom: '10px' }}>&gt; CHOOSE OPERATION VECTOR</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {['Coding', 'Cybersecurity', 'AI', 'Graphic_Designing'].map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className="grid-btn" style={{
                  backgroundColor: selectedCategory === cat ? '#163029' : '#070d0c',
                  border: `1px solid ${selectedCategory === cat ? '#39ff9e' : '#1a3a32'}`,
                  color: selectedCategory === cat ? '#39ff9e' : '#cfe9de',
                  padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'
                }}>{cat.replace('_', ' ')}</button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '35px' }}>
            <p style={{ fontSize: '11px', color: '#39ff9e', marginBottom: '10px' }}>&gt; SET RISK DIFFICULTY LAYER</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
              {['Easy', 'Moderate', 'Tough', 'Advanced_Tough'].map(lvl => (
                <button key={lvl} onClick={() => setSelectedLevel(lvl)} className="grid-btn" style={{
                  backgroundColor: selectedLevel === lvl ? '#163029' : '#070d0c',
                  border: `1px solid ${selectedLevel === lvl ? '#39ff9e' : '#1a3a32'}`,
                  color: selectedLevel === lvl ? '#39ff9e' : '#cfe9de',
                  padding: '12px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold'
                }}>{lvl.replace('_', ' ')}</button>
              ))}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <button onClick={startQuiz} className="action-btn" style={{
              backgroundColor: '#39ff9e', color: '#0c1311', border: 'none', padding: '15px 40px',
              borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer'
            }}>COMPILE & INITIATE SIMULATION //</button>
          </div>
        </div>
      )}

      {gameState === 'playing' && currentQuestion && (
        <div style={{ animation: 'questionSlide 0.3s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a3a32', paddingBottom: '15px', marginBottom: '25px' }}>
            <div><span style={{ fontSize: '12px', color: '#688c80' }}>LAYER: <b style={{ color: '#fff' }}>{selectedCategory} ({selectedLevel.replace('_', ' ')})</b></span></div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', animation: isWarningState ? 'pulseCritical 1s infinite' : 'none' }}>
              <div style={{ position: 'relative', width: '56px', height: '56px' }}>
                <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="28" cy="28" r={radius} fill="transparent" stroke="#10201b" strokeWidth="4" />
                  <circle cx="28" cy="28" r={radius} fill="transparent" stroke={isWarningState ? '#ff4a4a' : '#39ff9e'} strokeWidth="4" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                </svg>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', color: isWarningState ? '#ff4a4a' : '#39ff9e' }}>{timeLeft}s</div>
              </div>
            </div>

            <div style={{ backgroundColor: '#163029', border: '1px solid #39ff9e', padding: '5px 12px', borderRadius: '6px', fontSize: '12px', color: '#39ff9e' }}>XP: {score}</div>
          </div>

          <div style={{ backgroundColor: '#070d0c', border: '1px solid #1a3a32', padding: '20px', borderRadius: '12px', marginBottom: '25px' }}>
            <span style={{ fontSize: '10px', color: '#39ff9e', display: 'block', marginBottom: '8px' }}>[INCOMING TRANSMISSION]</span>
            <h3 style={{ color: '#fff', fontSize: '15px', margin: 0, lineHeight: '1.5' }}>{currentQuestion.q}</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(currentQuestion.options || []).map((opt, idx) => {
              let btnBg = '#070d0c'; let btnBorder = '#1a3a32'; let textColor = '#cfe9de';
              if (selectedOption !== null) {
                if (idx === currentQuestion.correctIndex) { btnBg = '#11291f'; btnBorder = '#39ff9e'; textColor = '#39ff9e'; }
                else if (selectedOption === idx) { btnBg = '#2d1414'; btnBorder = '#ff4a4a'; textColor = '#ff4a4a'; }
              }
              return (
                <button key={idx} disabled={selectedOption !== null} onClick={() => handleAnswerSubmit(idx)} className="grid-btn" style={{
                  textAlign: 'left', padding: '16px', borderRadius: '10px', backgroundColor: btnBg, border: `1px solid ${btnBorder}`, color: textColor, cursor: selectedOption !== null ? 'default' : 'pointer', fontFamily: 'monospace', fontSize: '13px'
                }}><span style={{ color: '#39ff9e', marginRight: '10px' }}>0{idx + 1}.</span> {opt}</button>
              );
            })}
          </div>
        </div>
      )}

      {gameState === 'end' && (
        <div style={{ textAlign: 'center', padding: '15px 0' }}>
          <h2 style={{ color: '#39ff9e', letterSpacing: '1px' }}>CORE ITERATION TERMINATED</h2>
          <div style={{ backgroundColor: '#070d0c', border: '1px solid #1a3a32', padding: '20px', borderRadius: '12px', maxWidth: '300px', margin: '20px auto' }}>
            <span style={{ fontSize: '11px', color: '#688c80' }}>TOTAL RETURN ASSETS</span>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#39ff9e', marginTop: '5px' }}>+{score} XP</div>
          </div>
          <button onClick={() => setGameState('setup')} className="action-btn" style={{ backgroundColor: '#163029', border: '1px solid #39ff9e', color: '#39ff9e', padding: '12px 30px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>RETURN TO MATRIX TERMINAL</button>
        </div>
      )}
    </div>
  );
};

export default TechArena;
