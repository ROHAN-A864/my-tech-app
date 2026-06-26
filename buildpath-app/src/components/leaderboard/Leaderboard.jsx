// src/components/leaderboard/Leaderboard.jsx
import React, { useEffect, useState } from "react";
import { db, ref, query, orderByChild, limitToLast, onValue } from "../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import "./leaderboard.css";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Sorting happens on the database engine itself (orderByChild + limitToLast),
    // not client-side -- this scales correctly with thousands of users.
    const q = query(ref(db, "users"), orderByChild("xp"), limitToLast(50));
    const unsub = onValue(q, (snap) => {
      const list = [];
      snap.forEach((child) => list.push({ uid: child.key, ...child.val() }));
      list.sort((a, b) => (b.xp || 0) - (a.xp || 0)); // limitToLast returns ascending; flip for display
      setRows(list);
    });
    return () => unsub();
  }, []);

  return (
    <div className="lb-wrap">
      <h2 className="lb-title">🏆 Global Leaderboard <span className="lb-live">● LIVE</span></h2>
      <div className="lb-list">
        {rows.map((r, i) => (
          <div key={r.uid} className={`lb-row ${r.uid === user?.uid ? "lb-me" : ""}`}>
            <span className={`lb-rank rank-${i + 1}`}>{i + 1}</span>
            <img className="lb-avatar" src={r.photoURL || fallbackAvatar(r.displayName)} alt="" />
            <span className="lb-name">{r.displayName}</span>
            <span className="lb-streak">🔥{r.streak || 0}</span>
            <span className="lb-xp">{(r.xp || 0).toLocaleString()} XP</span>
          </div>
        ))}
        {rows.length === 0 && <div className="lb-empty">No ranked learners yet — be the first.</div>}
      </div>
    </div>
  );
}

function fallbackAvatar(name) {
  const initial = (name || "?").charAt(0).toUpperCase();
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%231c9c63'/%3E%3Ctext x='20' y='27' font-size='18' text-anchor='middle' fill='white' font-family='monospace'%3E${initial}%3C/text%3E%3C/svg%3E`;
}
