// src/hooks/useGamification.js
import { useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  db,
  ref,
  runTransaction,
  push,
  set,
  get,
  serverTimestamp,
} from "../firebase/firebase";

const XP_PER_VIDEO = 10;
const XP_PER_COURSE = 50;

function todayStr() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function useGamification() {
  const { user } = useAuth();

  /** Call this when a user finishes watching a video. Awards XP, updates streak, checks badges. */
  const completeVideo = useCallback(async () => {
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);

    await runTransaction(userRef, (data) => {
      if (!data) return data;
      const today = todayStr();
      const wasYesterdayOrToday = isConsecutiveDay(data.lastActiveDate, today);

      data.xp = (data.xp || 0) + XP_PER_VIDEO;
      data.videosWatched = (data.videosWatched || 0) + 1;

      if (data.lastActiveDate !== today) {
        data.streak = wasYesterdayOrToday ? (data.streak || 0) + 1 : 1;
        data.lastActiveDate = today;
      }

      data.badges = data.badges || {};
      if (data.videosWatched >= 1) data.badges.firstStep = true;
      if (data.streak >= 7) data.badges.consistencyKing = true;
      if (data.xp >= 1000) data.badges.xpGrinder = true;

      return data;
    });
  }, [user]);

  /** Call this when a full course module is completed. */
  const completeCourse = useCallback(async () => {
    if (!user) return;
    const userRef = ref(db, `users/${user.uid}`);
    await runTransaction(userRef, (data) => {
      if (!data) return data;
      data.xp = (data.xp || 0) + XP_PER_COURSE;
      data.coursesCompleted = (data.coursesCompleted || 0) + 1;
      data.badges = data.badges || {};
      if (data.coursesCompleted >= 1) data.badges.courseFinisher = true;
      return data;
    });
  }, [user]);

  /** XP Wager: stake XP into a shared pool. Winner is credited the full pool atomically. */
  const createWager = useCallback(async (stake) => {
    if (!user) throw new Error("Not authenticated");
    const userRef = ref(db, `users/${user.uid}`);

    let success = false;
    await runTransaction(userRef, (data) => {
      if (!data || (data.xp || 0) < stake) return data; // abort if insufficient XP
      data.xp -= stake;
      success = true;
      return data;
    });
    if (!success) throw new Error("Not enough XP to stake that amount");

    const wagerRef = push(ref(db, "wagers"));
    await set(wagerRef, {
      hostUid: user.uid,
      stake,
      status: "open",
      winnerUid: null,
      createdAt: serverTimestamp(),
    });
    return wagerRef.key;
  }, [user]);

  /** Settle a wager: credit 2x stake to winner's XP atomically. */
  const settleWager = useCallback(async (wagerId, winnerUid) => {
    const wagerRef = ref(db, `wagers/${wagerId}`);
    const snap = await get(wagerRef);
    if (!snap.exists()) throw new Error("Wager not found");
    const wager = snap.val();
    if (wager.status !== "open") return; // already settled, avoid double payout

    const winnerRef = ref(db, `users/${winnerUid}`);
    await runTransaction(winnerRef, (data) => {
      if (!data) return data;
      data.xp = (data.xp || 0) + wager.stake * 2;
      return data;
    });
    await set(ref(db, `wagers/${wagerId}/status`), "settled");
    await set(ref(db, `wagers/${wagerId}/winnerUid`), winnerUid);
  }, []);

  return { completeVideo, completeCourse, createWager, settleWager };
}

function isConsecutiveDay(lastDateStr, todayStr_) {
  if (!lastDateStr) return false;
  const last = new Date(lastDateStr);
  const today = new Date(todayStr_);
  const diffDays = Math.round((today - last) / 86400000);
  return diffDays === 1;
}
