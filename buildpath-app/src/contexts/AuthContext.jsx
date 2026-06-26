// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  db,
  ref,
  set,
  get,
  onValue,
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  googleProvider,
} from "../firebase/firebase";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // firebase auth user object
  const [profile, setProfile] = useState(null);  // live db profile (xp, streak, badges...)
  const [loading, setLoading] = useState(true);

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await ensureUserDoc(firebaseUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // Live listener on this user's profile node -- updates instantly on XP/streak change
  useEffect(() => {
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);
    const unsub = onValue(userRef, (snap) => {
      setProfile(snap.val());
    });
    return () => unsub();
  }, [user]);

  async function ensureUserDoc(firebaseUser) {
    const userRef = ref(db, `users/${firebaseUser.uid}`);
    const snap = await get(userRef);
    if (!snap.exists()) {
      await set(userRef, {
        displayName: firebaseUser.displayName || `Learner-${firebaseUser.uid.slice(0, 5)}`,
        photoURL: firebaseUser.photoURL || null,
        xp: 0,
        streak: 0,
        lastActiveDate: null,
        videosWatched: 0,
        coursesCompleted: 0,
        badges: {},
      });
    }
  }

  async function loginAnonymous() {
    await signInAnonymously(auth);
  }

  async function loginGoogle() {
    await signInWithPopup(auth, googleProvider);
  }

  async function logout() {
    await auth.signOut();
  }

  const value = { user, profile, loading, loginAnonymous, loginGoogle, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
