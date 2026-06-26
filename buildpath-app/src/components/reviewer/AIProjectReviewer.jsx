// src/components/reviewer/AIProjectReviewer.jsx
import React, { useState } from "react";
import "./reviewer.css";

/**
 * IMPORTANT: True ML-based grading requires a real model call. Two real options:
 *
 * A) Call Anthropic's API directly from a small backend function (NEVER expose your
 *    API key client-side) with the uploaded code/text and ask Claude to score it
 *    on Security / Optimization / Aesthetics from 1-10 with justification, returned as JSON.
 *
 * B) Run static-analysis tooling (eslint, security linters like semgrep, lighthouse for
 *    design/perf) server-side and map their output to the 1-10 scale.
 *
 * Below is the heuristic structural scorer (lint-style checks you can run instantly,
 * client-side, on real uploaded content -- not a delay/timeout simulation). Swap
 * `runHeuristicReview()` for a fetch() to your backend endpoint when ready; the UI
 * below doesn't change.
 */

export default function AIProjectReviewer({ onScored }) {
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [scores, setScores] = useState(null);
  const [busy, setBusy] = useState(false);

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setFileContent(reader.result);
    reader.readAsText(file);
  }

  async function handleReview() {
    setBusy(true);
    // Swap this line for: const result = await fetch('/api/review', { method:'POST', body: fileContent }).then(r=>r.json());
    const result = runHeuristicReview(fileContent, fileName);
    setScores(result);
    setBusy(false);
    onScored && onScored(result);
  }

  return (
    <div className="reviewer-wrap">
      <h3>📤 Submit Project for Review</h3>
      <input type="file" onChange={handleFile} accept=".js,.py,.html,.css,.txt,.json" />
      {fileName && <p className="reviewer-filename">Loaded: {fileName}</p>}

      <button disabled={!fileContent || busy} onClick={handleReview} className="reviewer-btn">
        {busy ? "Analyzing…" : "Run Structural Review"}
      </button>

      {scores && (
        <div className="reviewer-results">
          <ScoreBar label="Security" value={scores.security} color="#ff5d6c" />
          <ScoreBar label="Optimization" value={scores.optimization} color="#4ee7ff" />
          <ScoreBar label="Aesthetics" value={scores.aesthetics} color="#ffb547" />
          <p className="reviewer-overall">Overall: <b>{scores.overall.toFixed(1)} / 10</b></p>
          <ul className="reviewer-notes">
            {scores.notes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreBar({ label, value, color }) {
  return (
    <div className="score-bar">
      <span className="score-label">{label}</span>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${value * 10}%`, background: color }}></div>
      </div>
      <span className="score-val">{value}/10</span>
    </div>
  );
}

/** Real structural checks against the actual uploaded file content. */
function runHeuristicReview(content, fileName) {
  const notes = [];
  let security = 7, optimization = 7, aesthetics = 7;

  const hasEval = /\beval\(/.test(content);
  const hasInnerHTML = /innerHTML\s*=/.test(content);
  const hasHardcodedSecret = /(api[_-]?key|secret|password)\s*[=:]\s*["'][^"']+["']/i.test(content);
  if (hasEval) { security -= 3; notes.push("⚠️ Avoid eval() — major injection risk."); }
  if (hasInnerHTML) { security -= 1; notes.push("⚠️ innerHTML usage detected — sanitize input to avoid XSS."); }
  if (hasHardcodedSecret) { security -= 3; notes.push("🚨 Hardcoded secret/API key found — never commit credentials."); }
  if (!hasEval && !hasHardcodedSecret) notes.push("✅ No obvious injection or secret-leak patterns found.");

  const longLines = content.split("\n").filter((l) => l.length > 120).length;
  const totalLines = content.split("\n").length || 1;
  if (longLines / totalLines > 0.15) { optimization -= 2; notes.push("⚠️ Many long lines — consider refactoring for readability/perf."); }
  const hasNestedLoops = /for[\s\S]{0,200}for/.test(content);
  if (hasNestedLoops) { optimization -= 1; notes.push("⚠️ Nested loops detected — check for O(n²) patterns on large input."); }
  if (optimization >= 7) notes.push("✅ Structure looks reasonably efficient.");

  if (fileName.endsWith(".css") || fileName.endsWith(".html")) {
    const colorCount = (content.match(/#[0-9a-f]{3,6}/gi) || []).length;
    if (colorCount > 12) { aesthetics -= 2; notes.push("⚠️ High color count — consider a tighter palette."); }
    else notes.push("✅ Palette size looks controlled.");
  } else {
    aesthetics = 6; notes.push("ℹ️ Aesthetics scoring is most meaningful for CSS/HTML/design uploads.");
  }

  security = clamp(security); optimization = clamp(optimization); aesthetics = clamp(aesthetics);
  const overall = (security + optimization + aesthetics) / 3;
  return { security, optimization, aesthetics, overall, notes };
}

function clamp(n) { return Math.max(1, Math.min(10, n)); }
