'use client';

import { useEffect, useRef, useState } from 'react';

// Predicted-tile row never changes its contents — it's a fixed set that
// always includes the words this demo needs (I, want, water) plus a
// couple of filler words for realism. Only the highlighted tile changes,
// moving to whichever word is about to be picked next.
const PREDICTED = ['I', 'want', 'water', 'please', 'more'];

// Each step either highlights the tile about to be picked, or adds it to
// the sentence. `duration: null` marks the terminal step — the sequence
// stops there and never auto-loops.
const STEPS = [
  { words: [], highlight: null, spoken: null, duration: 900 },
  { words: [], highlight: 'I', spoken: null, duration: 650 },
  { words: ['I'], highlight: null, spoken: null, duration: 700 },
  { words: ['I'], highlight: 'want', spoken: null, duration: 650 },
  { words: ['I', 'want'], highlight: null, spoken: null, duration: 700 },
  { words: ['I', 'want'], highlight: 'water', spoken: null, duration: 650 },
  {
    words: ['I', 'want', 'water'],
    highlight: null,
    spoken: "I'd like some water, please.",
    duration: null,
  },
];

export default function DemoAnimation() {
  const containerRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [runId, setRunId] = useState(0);

  // The sequence is completely idle until this card actually scrolls into
  // view — it does not play on page load, only when you reach it. Once
  // triggered, it will not re-trigger just from scrolling away and back;
  // only the Replay button restarts it.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return undefined;
    const current = STEPS[stepIndex];
    if (current.duration == null) return undefined;
    const timer = setTimeout(() => {
      setStepIndex((i) => i + 1);
    }, current.duration);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasStarted, stepIndex, runId]);

  const step = STEPS[stepIndex];

  function handleReplay() {
    setStepIndex(0);
    setRunId((r) => r + 1);
  }

  return (
    <div className="demo-card" ref={containerRef}>
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