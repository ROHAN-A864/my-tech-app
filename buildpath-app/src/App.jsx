// src/App.jsx
import React, { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginScreen from "./components/LoginScreen";
import ProfileBar from "./components/ProfileBar";
import Leaderboard from "./components/leaderboard/Leaderboard";
import QuizVsBot from "./components/quiz/QuizVsBot";
import WagerChallenge from "./components/quiz/WagerChallenge";
import TerminalSandbox from "./components/sandbox/TerminalSandbox";
import CssPlayground from "./components/sandbox/CssPlayground";
import AIProjectReviewer from "./components/reviewer/AIProjectReviewer";
import FlashCards from "./components/flashcards/FlashCards";
import { useGamification } from "./hooks/useGamification";
import CoursesSection from "./components/CoursesSection";
import TechArena from "./components/quiz/TechArena";
import GlobalChat from "./components/GlobalChat";

const SAMPLE_QUESTIONS = [
  { q: "Which port does HTTPS use by default?", options: ["21", "443", "8080", "25"], correctIndex: 1 },
  { q: "What does XSS stand for?", options: ["Cross-Site Scripting", "External Server Sync", "XML Style Sheet", "Extended Session State"], correctIndex: 0 },
  { q: "Which HTTP method is idempotent?", options: ["POST", "GET", "PATCH", "CONNECT"], correctIndex: 1 },
];

const TABS = ["Leaderboard", "Quiz vs Bot", "XP Wager", "Sandbox", "AI Reviewer", "Flash Cards", "Courses" , "Global Chat" , "Tech Arena"];

function Dashboard() {
  const [tab, setTab] = useState("Leaderboard");
  const { completeVideo } = useGamification();

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24, fontFamily: "monospace", color: "#cfe9de" }}>
      <ProfileBar />
      
      {/* Tabs Navigation Layout */}
      <div style={{ display: "flex", gap: 10, margin: "24px 0", flexWrap: "wrap" }}>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="grid-btn"
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 12,
              border: `1px solid ${tab === t ? "#39ff9e" : "#163029"}`,
              background: tab === t ? "rgba(57,255,158,0.1)" : "#0e1815",
              color: tab === t ? "#39ff9e" : "#cfe9de",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Conditional Tab Rendering */}
      {tab === "Leaderboard" && <Leaderboard />}
      {tab === "Quiz vs Bot" && (
        <QuizVsBot questions={SAMPLE_QUESTIONS} onMatchEnd={(r) => alert(`Match over — you ${r.winner === "user" ? "won" : "lost"}`)} />
      )}
      {tab === "XP Wager" && (
        <WagerChallenge onMatchReady={(resolveFn) => alert("Wager match would launch QuizVsBot here")} />
      )}
      {tab === "Sandbox" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <TerminalSandbox />
          <CssPlayground />
        </div>
      )}
      {tab === "AI Reviewer" && <AIProjectReviewer />}
      {tab === "Flash Cards" && <FlashCards />}
      {tab === "Courses" && <CoursesSection />}
      {tab === "Global Chat" && <GlobalChat />} {/* 👈 Chat ab sirf is tab par khulegi */}
      {tab === "Tech Arena" && <TechArena />}
    </div>
  );
}

function Gate() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ color: "#39ff9e", textAlign: "center", marginTop: 100 }}>Loading…</div>;
  return user ? <Dashboard /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <div style={{ background: "#060a09", minHeight: "100vh" }}>
        <Gate />
      </div>
    </AuthProvider>
  );
}
