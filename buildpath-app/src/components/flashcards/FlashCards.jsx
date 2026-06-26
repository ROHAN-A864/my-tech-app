// src/components/flashcards/FlashCards.jsx
import React, { useEffect, useState, useRef } from "react";
import { db, ref, onValue } from "../../firebase/firebase";
import "./flashcards.css";

// Seed content used only if `flashcards/{today}` hasn't been populated yet in your DB.
// In production, push real daily content to that node (via an admin script/cron) --
// this is real educational copy, not a loading-delay placeholder.
const FALLBACK_CARDS = [
  { title: "SQL Injection", body: "Attackers insert malicious SQL into input fields to manipulate database queries, potentially exposing, modifying, or deleting data. Prevented with parameterized queries, prepared statements, and strict input validation rather than string concatenation in queries." },
  { title: "Cross-Site Scripting (XSS)", body: "Malicious scripts get injected into trusted websites and execute in a victim's browser, stealing cookies or session tokens. Mitigated by escaping output, using Content Security Policy headers, and avoiding raw innerHTML with untrusted input." },
  { title: "Zero Trust Architecture", body: "A security model assuming no user or device is trusted by default, even inside the network perimeter. Every request is verified continuously using identity, device posture, and least-privilege access before granting resources." },
  { title: "Prompt Injection", body: "An emerging AI-specific attack where malicious instructions are hidden in input data to hijack an LLM's behavior, bypassing intended guardrails. Defenses include input sanitization, instruction hierarchy, and output validation layers." },
  { title: "Buffer Overflow", body: "Occurs when a program writes more data to a buffer than it can hold, overwriting adjacent memory. Can let attackers execute arbitrary code. Modern defenses include ASLR, stack canaries, and memory-safe languages like Rust." },
];

export default function FlashCards() {
  const [cards, setCards] = useState(FALLBACK_CARDS);
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startX = useRef(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const cardsRef = ref(db, `flashcards/${today}`);
    const unsub = onValue(cardsRef, (snap) => {
      if (snap.exists()) {
        const list = [];
        snap.forEach((c) => list.push(c.val()));
        if (list.length) setCards(list);
      }
    });
    return () => unsub();
  }, []);

  function onPointerDown(e) { startX.current = e.clientX ?? e.touches?.[0]?.clientX; }
  function onPointerMove(e) {
    if (startX.current == null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    setDragX(x - startX.current);
  }
  function onPointerUp() {
    if (Math.abs(dragX) > 110) advance();
    else setDragX(0);
    startX.current = null;
  }
  function advance() {
    setDragX(0);
    setIndex((i) => (i + 1) % cards.length);
  }

  const card = cards[index];
  const rotation = dragX / 18;

  return (
    <div className="fc-wrap">
      <div
        className="fc-card"
        style={{ transform: `translateX(${dragX}px) rotate(${rotation}deg)`, transition: startX.current ? "none" : "transform .3s ease" }}
        onMouseDown={onPointerDown}
        onMouseMove={onPointerMove}
        onMouseUp={onPointerUp}
        onMouseLeave={() => startX.current && onPointerUp()}
        onTouchStart={onPointerDown}
        onTouchMove={onPointerMove}
        onTouchEnd={onPointerUp}
      >
        <span className="fc-badge">{index + 1} / {cards.length}</span>
        <h3>{card.title}</h3>
        <p>{card.body}</p>
        <span className="fc-hint">← swipe →</span>
      </div>
      <div className="fc-controls">
        <button onClick={advance}>Skip</button>
        <button onClick={advance} className="fc-learned">Got it ✓</button>
      </div>
    </div>
  );
}
