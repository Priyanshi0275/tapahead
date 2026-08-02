'use client';

import { useState } from 'react';

const FIXED_ORDER = ['I', 'want', 'water', 'more', 'help', 'please', 'yes', 'no'];

function shuffledCopy(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function CoreIdeaDemo() {
  const [mode, setMode] = useState('fixed');
  const [words, setWords] = useState(FIXED_ORDER);
  const [animKey, setAnimKey] = useState(0);

  function handleFixed() {
    setMode('fixed');
    setWords(FIXED_ORDER);
    setAnimKey((k) => k + 1);
  }

  function handleReshuffle() {
    setMode('reshuffle');
    setWords(shuffledCopy(FIXED_ORDER));
    setAnimKey((k) => k + 1);
  }

  return (
    <div className="core-idea-grid">
      <div>
        <span className="section-eyebrow">The core idea</span>
        <h2 className="section-title" style={{ fontSize: 36 }}>
          Your words stay where they belong.
        </h2>
        <p className="core-idea-body">
          Most adaptive boards reshuffle tiles to &ldquo;help.&rdquo; For someone
          who taps by muscle memory, that is a new board every morning.
          TapAhead keeps the grid fixed forever and puts learning in a
          separate row.
        </p>
        <div className="segmented-toggle">
          <button
            type="button"
            className={mode === 'fixed' ? 'active' : ''}
            onClick={handleFixed}
          >
            TapAhead
          </button>
          <button
            type="button"
            className={mode === 'reshuffle' ? 'active' : ''}
            onClick={handleReshuffle}
          >
            Boards that reshuffle
          </button>
        </div>
      </div>

      <div className="mini-board-card">
        <div className="mini-board-grid" key={animKey}>
          {words.map((w, i) => (
            <div
              key={`${w}-${animKey}`}
              className="mini-board-tile"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              {w}
            </div>
          ))}
        </div>
        <p className="mini-board-caption">
          {mode === 'fixed'
            ? 'Nothing moves. Ever. Predictions live above the grid.'
            : 'Every tile moved. Muscle memory is gone.'}
        </p>
      </div>
    </div>
  );
}