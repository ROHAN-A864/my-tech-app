// src/components/quiz/QuizVsBot.jsx
import React, { useEffect, useRef, useState } from "react";
import "./quiz.css";

/**
 * Pass real questions in via `questions` prop:
 * [{ q: "...", options: ["a","b","c","d"], correctIndex: 0 }, ...]
 * Pull these from your own DB node (e.g. db/quizzes/{topic}) -- not included here
 * since question banks are content data, not app logic.
 */
export default function QuizVsBot({ questions, onMatchEnd }) {
  const [qIndex, setQIndex] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [botScore, setBotScore] = useState(0);
  const [botState, setBotState] = useState("idle"); // idle | thinking | submitted
  const [userAnswered, setUserAnswered] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [godMode, setGodMode] = useState(false);
  const botTimer = useRef(null);

  const current = questions[qIndex];
  const isLastQuestion = qIndex === questions.length - 1;

  useEffect(() => {
    if (!current) return;
    setUserAnswered(false);
    setRevealed(false);
    setBotState("thinking");

    // --- Rubber-banding: if user is winning by 2+ correct answers, bot enters God Mode ---
    const margin = userScore - botScore;
    const inGodMode = margin >= 2;
    setGodMode(inGodMode);

    const minDelay = inGodMode ? 1200 : 2000;
    const maxDelay = inGodMode ? 2500 : 5000;
    const botDelay = randomBetween(minDelay, maxDelay);

    const botAccuracy = inGodMode ? randomBetween(90, 97) / 100 : randomBetween(75, 85) / 100;

    botTimer.current = setTimeout(() => {
      const botCorrect = Math.random() < botAccuracy;
      setBotState("submitted");
      if (botCorrect) setBotScore((s) => s + 1);
      maybeRevealAndAdvance();
    }, botDelay);

    return () => clearTimeout(botTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qIndex]);

  function maybeRevealAndAdvance() {
    // Reveal happens once BOTH user and bot have answered (handled via state checks below)
  }

  function handleUserAnswer(idx) {
    if (userAnswered || revealed) return;
    setUserAnswered(true);
    const correct = idx === current.correctIndex;
    if (correct) setUserScore((s) => s + 1);
  }

  // Reveal + advance once both sides have responded
  useEffect(() => {
    if (userAnswered && botState === "submitted") {
      setRevealed(true);
      const t = setTimeout(() => {
        if (isLastQuestion) {
          const finalUser = userScore;
          const finalBot = botScore;
          onMatchEnd && onMatchEnd({ userScore: finalUser, botScore: finalBot, winner: finalUser > finalBot ? "user" : finalUser < finalBot ? "bot" : "draw" });
        } else {
          setQIndex((i) => i + 1);
        }
      }, 1600);
      return () => clearTimeout(t);
    }
  }, [userAnswered, botState]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!current) return null;

  return (
    <div className="quiz-wrap">
      <div className="quiz-scorebar">
        <div className="score you">YOU<br /><b>{userScore}</b></div>
        <div className="vs">VS</div>
        <div className={`score bot ${godMode ? "godmode" : ""}`}>
          BOT {godMode && <span className="god-tag">⚡GOD MODE</span>}<br /><b>{botScore}</b>
        </div>
      </div>

      <div className="bot-status">
        {botState === "thinking" && <span className="thinking">🤖 Bot is thinking…</span>}
        {botState === "submitted" && <span className="submitted">🤖 Bot submitted an answer!</span>}
      </div>

      <div className="quiz-progress">Question {qIndex + 1} / {questions.length}</div>

      <h3 className="quiz-question">{current.q}</h3>
      <div className="quiz-options">
        {current.options.map((opt, idx) => {
          let cls = "opt";
          if (revealed) {
            if (idx === current.correctIndex) cls += " correct";
            else if (idx === selectedIndexOf(idx, userAnswered)) cls += "";
          }
          return (
            <button
              key={idx}
              className={cls}
              disabled={userAnswered}
              onClick={() => handleUserAnswer(idx)}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}
function selectedIndexOf() { return -1; } // placeholder hook for highlighting user's own pick if you track it
