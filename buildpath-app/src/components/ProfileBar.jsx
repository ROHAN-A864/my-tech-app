// src/components/ProfileBar.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

const BADGE_META = {
  firstStep: { label: "First Step", icon: "🥇" },
  consistencyKing: { label: "Consistency King", icon: "👑" },
  xpGrinder: { label: "XP Grinder", icon: "💪" },
  courseFinisher: { label: "Course Finisher", icon: "🎓" },
};

export default function ProfileBar() {
  const { profile, user, logout } = useAuth();
  if (!profile) return null;

  return (
    <div style={styles.bar}>
      <div style={styles.identity}>
        <img src={profile.photoURL || fallbackAvatar(profile.displayName)} alt="" style={styles.avatar} />
        <span>{profile.displayName}</span>
      </div>
      <div style={styles.stat}>🔥 <b>{profile.streak || 0}</b> day streak</div>
      <div style={styles.stat}>⭐ <b>{(profile.xp || 0).toLocaleString()}</b> XP</div>
      <div style={styles.badges}>
        {Object.keys(profile.badges || {}).map((key) => (
          <span key={key} title={BADGE_META[key]?.label} style={styles.badge}>{BADGE_META[key]?.icon || "🏅"}</span>
        ))}
      </div>
      <button onClick={logout} style={styles.logout}>Log out</button>
    </div>
  );
}

function fallbackAvatar(name) {
  const initial = (name || "?").charAt(0).toUpperCase();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%231c9c63'/%3E%3Ctext x='20' y='27' font-size='18' text-anchor='middle' fill='white' font-family='monospace'%3E${initial}%3C/text%3E%3C/svg%3E`;
}

const styles = {
  bar: { display: "flex", alignItems: "center", gap: 18, padding: "10px 18px", background: "#0e1815", border: "1px solid #163029", borderRadius: 14, fontFamily: "monospace", color: "#cfe9de", fontSize: 13, flexWrap: "wrap" },
  identity: { display: "flex", alignItems: "center", gap: 8 },
  avatar: { width: 26, height: 26, borderRadius: "50%" },
  stat: { color: "#a8c9bb" },
  badges: { display: "flex", gap: 4, fontSize: 16 },
  badge: { cursor: "default" },
  logout: { marginLeft: "auto", background: "none", border: "1px solid #163029", color: "#6f9384", padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontFamily: "inherit", fontSize: 11 },
};
