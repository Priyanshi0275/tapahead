'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  { words: [], spoken: null, duration: 1200 },
  { words: ['I'], spoken: null, duration: 850 },
  { words: ['I', 'want'], spoken: null, duration: 850 },
  { words: ['I', 'want', 'water'], spoken: null, duration: 900 },
  {
    words: ['I', 'want', 'water'],
    spoken: "I'd like some water, please.",
    duration: 2800,
  },
];

const PREDICTED = ['want', 'water', 'please', 'more'];

export default function DemoAnimation() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const current = STEPS[stepIndex];
    const timer = setTimeout(() => {
      setStepIndex((i) => (i + 1) % STEPS.length);
    }, current.duration);
    return () => clearTimeout(timer);
  }, [stepIndex]);

  const step = STEPS[stepIndex];

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

        <div className={`demo-spoken-wrap${step.spoken ? ' visible' : ''}`}>
          <div className="demo-spoken">
            <span className="demo-label">Spoken aloud</span>
            <p className="demo-quote">
              {step.spoken ? `\u201C${step.spoken}\u201D` : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="demo-footer">
        <div>
          <span className="demo-label" style={{ marginBottom: 8 }}>
            Predicted next
          </span>
          <div className="demo-predicted-tiles">
            {PREDICTED.map((t) => (
              <span key={t} className="pill-tile">
                {t}
              </span>
            ))}
          </div>
        </div>
        <button type="button" className="pill-ghost" disabled>
          Replay
        </button>
      </div>
    </div>
  );
}
