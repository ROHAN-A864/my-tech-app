// src/components/LoginScreen.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { loginAnonymous, loginGoogle } = useAuth();
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#060a09", color: "#cfe9de", fontFamily: "monospace", gap: 16 }}>
      <h1 style={{ color: "#39ff9e" }}>The Build Path</h1>
      <p style={{ color: "#6f9384" }}>Sign in to track XP, streaks, and compete on the leaderboard.</p>
      <button onClick={loginGoogle} style={btnPrimary}>Continue with Google</button>
      <button onClick={loginAnonymous} style={btnGhost}>Continue as Guest</button>
    </div>
  );
}

const btnPrimary = { padding: "12px 24px", background: "#39ff9e", border: "none", borderRadius: 30, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" };
const btnGhost = { padding: "12px 24px", background: "none", border: "1px solid #163029", color: "#cfe9de", borderRadius: 30, cursor: "pointer", fontFamily: "inherit" };
