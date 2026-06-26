import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, update, remove } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const SAMPLE_QUESTIONS = [
  { q: "Which port does HTTPS use by default?", options: ["21", "443", "8080", "25"], correctIndex: 1 },
  { q: "What does XSS stand for?", options: ["Cross-Site Scripting", "External Server Sync", "XML Style Sheet"], correctIndex: 0 },
  { q: "Which HTTP method is idempotent?", options: ["POST", "GET", "PATCH", "CONNECT"], correctIndex: 1 },
];

const WagerChallenge = () => {
  const auth = getAuth();
  const db = getDatabase();
  const user = auth.currentUser;

  const [roomKey, setRoomKey] = useState(null);
  const [gameState, setGameState] = useState('idle'); // idle, searching, playing, gameOver
  const [roomData, setRoomData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isPlayer1, setIsPlayer1] = useState(false);

  useEffect(() => {
    if (!roomKey) return;

    const roomRef = ref(db, `quiz_rooms/${roomKey}`);
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setRoomData(data);

      // Matchmaking check: Agar Player 2 join ho gaya toh game shuru
      if (gameState === 'searching' && data.player2) {
        setGameState('playing');
      }

      // Game Over Check: Jab dono players saare questions poore kar lein
      if (data.player1?.finished && data.player2?.finished && gameState !== 'gameOver') {
        setGameState('gameOver');
      }
    });

    return () => unsubscribe();
  }, [roomKey, gameState, db]);

  // ⚔️ Match Search Karne Ka Logic
  const startMatchmaking = async () => {
    if (!user) return;
    setGameState('searching');

    const roomsRef = ref(db, 'quiz_rooms');
    
    // Check karenge ki koi pehle se wait toh nahi kar raha
    onValue(roomsRef, (snapshot) => {
      const rooms = snapshot.val();
      let foundRoom = null;

      if (rooms) {
        foundRoom = Object.keys(rooms).find(key => rooms[key].status === 'waiting' && rooms[key].player1.uid !== user.uid);
      }

      if (foundRoom && !roomKey) {
        // Kisi ka waiting room mil gaya! Join as Player 2
        setIsPlayer1(false);
        setRoomKey(foundRoom);
        update(ref(db, `quiz_rooms/${foundRoom}`), {
          player2: {
            uid: user.uid,
            name: user.displayName || 'Anonymous Player',
            score: 0,
            finished: false
          },
          status: 'active'
        });
      } else if (!roomKey) {
        // Koi room nahi mila, khud ka waiting room banao as Player 1
        setIsPlayer1(true);
        const newRoomRef = push(roomsRef);
        setRoomKey(newRoomRef.key);
        set(newRoomRef, {
          status: 'waiting',
          player1: {
            uid: user.uid,
            name: user.displayName || 'Anonymous Player',
            score: 0,
            finished: false
          }
        });
      }
    }, { onlyOnce: true });
  };

  // 🎯 Answer Submit Logic (Real-Time Score Sync)
  const handleAnswerSubmit = (index) => {
    setSelectedOption(index);
    const isCorrect = index === SAMPLE_QUESTIONS[currentQuestionIndex].correctIndex;
    const pointsToAdd = isCorrect ? 10 : 0;

    const playerPath = isPlayer1 ? 'player1' : 'player2';
    const newScore = (roomData[playerPath]?.score || 0) + pointsToAdd;

    const isLastQuestion = currentQuestionIndex === SAMPLE_QUESTIONS.length - 1;

    update(ref(db, `quiz_rooms/${roomKey}/${playerPath}`), {
      score: newScore,
      finished: isLastQuestion
    });

    setTimeout(() => {
      if (!isLastQuestion) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
      }
    }, 1000);
  };

  // 🚪 Matchmaking Cancel Ya Room Exit Karna
  const exitRoom = () => {
    if (roomKey) {
      remove(ref(db, `quiz_rooms/${roomKey}`));
    }
    setRoomKey(null);
    setGameState('idle');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
  };

  return (
    <div style={{
      backgroundColor: '#0e1815',
      border: '1px solid #163029',
      borderRadius: '16px',
      padding: '24px',
      marginTop: '20px',
      fontFamily: 'monospace',
      color: '#cfe9de',
      boxShadow: '0 0 20px rgba(57, 255, 158, 0.02)'
    }}>
      {/* IDLE SCREEN */}
      {gameState === 'idle' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h2 style={{ color: '#39ff9e', marginBottom: '10px' }}>⚔️ LIVE PVP XP WAGER</h2>
          <p style={{ color: '#688c80', fontSize: '12px', marginBottom: '30px' }}>Real players. Real time. Multi-node synchronization.</p>
          <button onClick={startMatchmaking} style={{
            backgroundColor: '#39ff9e', color: '#0e1815', border: 'none', padding: '14px 32px',
            borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
            boxShadow: '0 0 15px rgba(57, 255, 158, 0.4)'
          }}>
            SEARCH ONLINE OPPONENT //
          </button>
        </div>
      )}

      {/* SEARCHING SCREEN */}
      {gameState === 'searching' && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '24px', color: '#39ff9e', marginBottom: '20px' }} className="animate-pulse">🛰️ CONNECTING TO GRID...</div>
          <p style={{ color: '#688c80', fontSize: '13px', marginBottom: '20px' }}>Waiting for another node to hook into the proxy room...</p>
          <button onClick={exitRoom} style={{ backgroundColor: 'transparent', border: '1px solid #ff4a4a', color: '#ff4a4a', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>
            ABORT MISSION
          </button>
        </div>
      )}

      {/* PLAYING SCREEN */}
      {gameState === 'playing' && roomData && (
        <div>
          {/* Live Score Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#0b1412', padding: '12px 20px', borderRadius: '8px', border: '1px solid #163029', marginBottom: '20px' }}>
            <div>
              <span style={{ color: '#39ff9e' }}>⚡ {roomData.player1?.name}</span>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>{roomData.player1?.score} XP</div>
            </div>
            <div style={{ color: '#688c80', alignSelf: 'center' }}>VS</div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ color: '#39ff9e' }}>⚡ {roomData.player2?.name}</span>
              <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '4px' }}>{roomData.player2?.score} XP</div>
            </div>
          </div>

          {/* Question Box */}
          <div style={{ margin: '30px 0' }}>
            <span style={{ color: '#688c80', fontSize: '11px' }}>TRANSMISSION #{currentQuestionIndex + 1}</span>
            <h3 style={{ margin: '8px 0 20px 0', fontSize: '16px', color: '#fff' }}>{SAMPLE_QUESTIONS[currentQuestionIndex].q}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {SAMPLE_QUESTIONS[currentQuestionIndex].options.map((opt, idx) => (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleAnswerSubmit(idx)}
                  style={{
                    textAlign: 'left', padding: '14px', borderRadius: '8px', fontFamily: 'monospace',
                    backgroundColor: selectedOption === idx ? '#163029' : '#0b1412',
                    border: selectedOption === idx ? '1px solid #39ff9e' : '1px solid #163029',
                    color: '#cfe9de', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s'
                  }}
                >
                  [{idx + 1}] {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* GAME OVER SCREEN */}
      {gameState === 'gameOver' && roomData && (
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <h2 style={{ color: '#39ff9e', marginBottom: '20px' }}>🏁 SIMULATION COMPLETE</h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', margin: '20px 0', fontSize: '18px' }}>
            <div>
              <p style={{ fontSize: '12px', color: '#688c80' }}>{roomData.player1?.name}</p>
              <p style={{ fontWeight: 'bold', color: '#fff' }}>{roomData.player1?.score} XP</p>
            </div>
            <div style={{ fontSize: '24px', color: '#39ff9e' }}>|</div>
            <div>
              <p style={{ fontSize: '12px', color: '#688c80' }}>{roomData.player2?.name}</p>
              <p style={{ fontWeight: 'bold', color: '#fff' }}>{roomData.player2?.score} XP</p>
            </div>
          </div>

          {/* Result Declaration */}
          <h3 style={{ color: '#39ff9e', marginTop: '20px' }}>
            {roomData.player1.score === roomData.player2.score ? "⚠️ MATCH TIED!" : 
             (isPlayer1 ? roomData.player1.score > roomData.player2.score : roomData.player2.score > roomData.player1.score) ? 
             "🏆 YOU WIN! DATABASE UPDATED." : "💀 DEFEAT! TARGET OUTSMARTED YOU."}
          </h3>

          <button onClick={exitRoom} style={{ marginTop: '30px', backgroundColor: '#163029', color: '#39ff9e', border: '1px solid #39ff9e', padding: '10px 24px', borderRadius: '6px', cursor: 'pointer' }}>
            RETURN TO LOBBY
          </button>
        </div>
      )}
    </div>
  );
};

export default WagerChallenge;