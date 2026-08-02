'use client';

import { useEffect, useState } from 'react';

// Runs once per mount/replay — never auto-loops. Each step either advances
// the sentence, or briefly highlights the predicted tile about to be
// picked (so it reads as "this one's about to be selected") before it
// joins the sentence. `duration: null` marks the terminal step.
const STEPS = [
  { words: [], highlight: null, spoken: null, duration: 1100 },
  { words: ['I'], highlight: null, spoken: null, duration: 800 },
  { words: ['I', 'want'], highlight: null, spoken: null, duration: 700 },
  { words: ['I', 'want'], highlight: 'water', spoken: null, duration: 650 },
  {
    words: ['I', 'want', 'water'],
    highlight: null,
    spoken: "I'd like some water, please.",
    duration: null,
  },
];

const PREDICTED = ['want', 'water', 'please', 'more'];

export default function DemoAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    const current = STEPS[stepIndex];
    if (current.duration == null) return undefined;
    const timer = setTimeout(() => {
      setStepIndex((i) => i + 1);
    }, current.duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, runId]);

  const step = STEPS[stepIndex];

  function handleReplay() {
    setStepIndex(0);
    setRunId((r) => r + 1);
  }

  return (
    <div className="demo-card">
      <div className="demo-panel">
        <span className="demo-label">Your sentence</span>
        <p className="demo-sentence">
          {step.words.length === 0 ? (
            <span className="demo-sentence-placeholder">Tap a word to begin…</span>
          ) : (
            step.words.map((w, i) => (
              <span key={`${w}-${i}`} className="demo-word">
                {w}
                {i < step.words.length - 1 ? '\u00A0' : ''}
              </span>
            ))
          )}
        </p>

        {step.spoken && (
          <div className="demo-spoken">
            <span className="demo-label">Spoken aloud</span>
            <p className="demo-quote">{`\u201C${step.spoken}\u201D`}</p>
          </div>
        )}
      </div>

      <div className="demo-footer">
        <div>
          <span className="demo-label" style={{ marginBottom: 8 }}>
            Predicted next
          </span>
          <div className="demo-predicted-tiles">
            {PREDICTED.map((t) => (
              <span
                key={t}
                className={`pill-tile${step.highlight === t ? ' pill-tile-highlight' : ''}`}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <button type="button" className="pill-ghost" onClick={handleReplay}>
          Replay
        </button>
      </div>
    </div>
  );
}