# The Build Path — Production Setup

## 1. Install
```
npm install
```

## 2. Plug in your Firebase credentials
Edit `src/firebase/firebase.js` and replace every `YOUR_...` placeholder with the
values from **Firebase Console → Project Settings → General → Your apps → SDK setup & config**.

You must be using **Realtime Database** (not Firestore) — enable it at
**Firebase Console → Build → Realtime Database → Create Database**.

## 3. Set Database Rules
Paste the rules block found at the bottom of `src/firebase/firebase.js` into
**Realtime Database → Rules**, then publish.

## 4. Enable Auth providers
**Firebase Console → Build → Authentication → Sign-in method** → enable:
- Anonymous
- Google

## 5. Run it
```
npm run dev
```

## What's real vs. what you still need to wire up

**Fully live and backend-integrated right now:**
- Anonymous + Google auth, unique UID per user
- XP, streak, badge writes — all via `runTransaction` (atomic, no race conditions)
- Live `.on('value')`-style listeners (`onValue`) — any user's XP change is broadcast
  to every connected client instantly
- Leaderboard sorted at the database engine level (`orderByChild('xp') + limitToLast(50)`)
- XP Wager pool — real atomic stake/payout via transactions

**Logic that's real but needs real content/endpoints plugged in:**
- **Quiz vs Bot**: the bot's timing/accuracy/rubber-banding logic is fully real and
  runs live — but you need to pass it a real question bank via the `questions` prop
  (pull these from a `quizzes/{topic}` DB node).
- **AI Project Reviewer**: ships with a real heuristic static-analysis scorer (it
  actually parses the uploaded file for eval(), hardcoded secrets, XSS patterns,
  nested loops, color counts). To use true ML grading, replace `runHeuristicReview()`
  with a `fetch()` to a backend endpoint that calls an LLM — **never put an AI API
  key in client-side code**, route it through a Cloud Function / serverless endpoint.
- **Flash Cards**: pulls from `flashcards/{YYYY-MM-DD}` in your DB; falls back to 5
  seeded real entries if that day hasn't been populated yet. Push new daily content
  via a small admin script or scheduled Cloud Function.

## Folder map
```
src/
  firebase/firebase.js       <- credentials + all DB/auth exports
  contexts/AuthContext.jsx   <- login state + live profile listener
  hooks/useGamification.js   <- XP/streak/badge/wager engine (transactions)
  components/
    leaderboard/Leaderboard.jsx
    quiz/QuizVsBot.jsx       <- bot AI logic
    quiz/WagerChallenge.jsx
    sandbox/TerminalSandbox.jsx
    sandbox/CssPlayground.jsx
    reviewer/AIProjectReviewer.jsx
    flashcards/FlashCards.jsx
    ProfileBar.jsx
    LoginScreen.jsx
  App.jsx                    <- tab navigation wiring it all together
```
