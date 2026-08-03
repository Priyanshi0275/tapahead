'use client';

import { useLayoutEffect, useRef, useState } from 'react';

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
  const tileRefs = useRef({});
  const prevRectsRef = useRef({});

  function captureRects() {
    const rects = {};
    Object.entries(tileRefs.current).forEach(([word, node]) => {
      if (node) rects[word] = node.getBoundingClientRect();
    });
    return rects;
  }

  // True FLIP animation: capture each tile's position before the reorder,
  // let React/the grid reposition them instantly, then for each tile
  // apply an inverse transform back to its old spot and animate it back
  // to zero — so it visibly slides from its old position to its new one,
  // instead of just fading out and back in.
  useLayoutEffect(() => {
    const prevRects = prevRectsRef.current;

    Object.entries(tileRefs.current).forEach(([word, node]) => {
      if (!node) return;
      const prev = prevRects[word];
      if (!prev) return;

      const newRect = node.getBoundingClientRect();
      const dx = prev.left - newRect.left;
      const dy = prev.top - newRect.top;

      if (dx || dy) {
        node.style.transition = 'none';
        node.style.transform = `translate(${dx}px, ${dy}px)`;
        // eslint-disable-next-line no-unused-expressions
        node.getBoundingClientRect(); // force reflow before animating back
        requestAnimationFrame(() => {
          node.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
          node.style.transform = '';
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words]);

  function handleFixed() {
    prevRectsRef.current = captureRects();
    setMode('fixed');
    setWords(FIXED_ORDER);
  }

  function handleReshuffle() {
    prevRectsRef.current = captureRects();
    setMode('reshuffle');
    setWords(shuffledCopy(FIXED_ORDER));
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
        <div className="mini-board-grid">
          {words.map((w) => (
            <div
              key={w}
              ref={(node) => {
                tileRefs.current[w] = node;
              }}
              className="mini-board-tile"
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