// src/firebase/firebase.js
//
// >>> PLUG YOUR CREDENTIALS HERE <<<
// Get these from: Firebase Console -> Project Settings -> General -> Your apps -> SDK setup & config
// Realtime Database must be enabled: Firebase Console -> Build -> Realtime Database -> Create Database
//
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  push,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  runTransaction,
  serverTimestamp,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDj08qExE3au3OgdXwA2sfRwXw3hh-tjf4", // 👈 Yahan 'Dj08' me ab ZERO hai bhai, ekdum sahi!
  authDomain: "buildpath-5f8fa.firebaseapp.com",
  databaseURL: "https://buildpath-5f8fa-default-rtdb.asia-southeast1.firebasedatabase.app/",
  projectId: "buildpath-5f8fa",
  storageBucket: "buildpath-5f8fa.firebasestorage.app",
  messagingSenderId: "1053415556109",
  appId: "1:1053415556109:web:5fc539f17829b82a9f8144"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export {
  signInAnonymously,
  signInWithPopup,
  onAuthStateChanged,
  ref,
  set,
  get,
  update,
  push,
  onValue,
  off,
  query,
  orderByChild,
  limitToLast,
  runTransaction,
  serverTimestamp,
};

/*
REQUIRED REALTIME DATABASE RULES (Firebase Console -> Realtime Database -> Rules):
{
  "rules": {
    "users": {
      ".indexOn": ["xp"],
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "wagers": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "flashcards": {
      ".read": "auth != null",
      ".write": false
    }
  }
}

DATA SHAPE:
users/{uid} = {
  displayName, photoURL, xp, streak, lastActiveDate,
  badges: { firstStep: true, consistencyKing: true },
  videosWatched, coursesCompleted
}
wagers/{wagerId} = { hostUid, opponentUid, stake, status, winnerUid, createdAt }
*/
