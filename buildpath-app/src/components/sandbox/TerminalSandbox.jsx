// src/components/sandbox/TerminalSandbox.jsx
import React, { useState, useRef, useEffect } from "react";
import "./sandbox.css";

const FAKE_FS_FILES = ["recon.log", "exploit.py", "notes.txt", "creds.bak"];

export default function TerminalSandbox() {
  const [lines, setLines] = useState([
    "buildpath-terminal v1.0 — type 'help' to see available commands",
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  function runCommand(raw) {
    const cmd = raw.trim();
    if (!cmd) return;
    const [base, ...args] = cmd.split(" ");
    let output;

    switch (base.toLowerCase()) {
      case "help":
        output = [
          "Available commands:",
          "  help          show this list",
          "  clear         clear the terminal",
          "  status        show sandbox session status",
          "  scan          run a mock network scan",
          "  ls            list files in current sandbox dir",
          "  whoami        show current sandbox user",
          "  echo [text]   print text back",
        ].join("\n");
        break;
      case "clear":
        setLines([]);
        setInput("");
        return;
      case "status":
        output = `Session: ACTIVE\nUptime: ${Math.floor(performance.now() / 1000)}s\nMode: sandboxed (no real network access)`;
        break;
      case "scan":
        output = mockScan();
        break;
      case "ls":
        output = FAKE_FS_FILES.join("   ");
        break;
      case "whoami":
        output = "learner@buildpath-sandbox";
        break;
      case "echo":
        output = args.join(" ");
        break;
      default:
        output = `command not found: ${base} (type 'help')`;
    }

    setLines((prev) => [...prev, `$ ${cmd}`, output]);
    setInput("");
  }

  function mockScan() {
    const ports = [22, 80, 443, 3306, 8080].filter(() => Math.random() > 0.4);
    if (ports.length === 0) return "scan complete: no open ports found on sandbox target";
    return (
      "scanning sandbox-target (10.0.0.5)...\n" +
      ports.map((p) => `  PORT ${p}/tcp   OPEN`).join("\n") +
      "\nscan complete."
    );
  }

  return (
    <div className="term-wrap" onClick={() => document.getElementById("term-input")?.focus()}>
      <div className="term-bar">
        <span className="dot red"></span><span className="dot amber"></span><span className="dot green"></span>
        <span className="term-title">sandbox.sh</span>
      </div>
      <div className="term-body" ref={scrollRef}>
        {lines.map((l, i) => (
          <pre key={i} className="term-line">{l}</pre>
        ))}
        <div className="term-input-row">
          <span className="prompt">$</span>
          <input
            id="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runCommand(input)}
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
