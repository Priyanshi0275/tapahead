'use client';

import { useEffect, useRef, useState } from 'react';

const WORDS = ['I', 'want', 'water'];
const NATURAL_SENTENCE = "I'd like some water, please.";
const PREDICTED = ['want', 'water', 'please', 'more'];

const STEP_MS = 800;
const HOLD_MS = 2400;
const RESTART_GAP_MS = 900;

export default function LiveDemo() {
  const containerRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [showSpoken, setShowSpoken] = useState(false);
  const [showPredicted, setShowPredicted] = useState(false);

  // Start the animation only once the demo scrolls into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Play the tap sequence, then loop.
  useEffect(() => {
    if (!started) return;

    let cancelled = false;
    let timeouts = [];

    function runCycle() {
      setWordCount(0);
      setShowSpoken(false);
      setShowPredicted(false);

      WORDS.forEach((_, i) => {
        timeouts.push(
          setTimeout(() => {
            if (!cancelled) setWordCount(i + 1);
          }, STEP_MS * (i + 1))
        );
      });

      const afterWords = STEP_MS * (WORDS.length + 1);

      timeouts.push(
        setTimeout(() => {
          if (!cancelled) setShowSpoken(true);
        }, afterWords)
      );

      timeouts.push(
        setTimeout(() => {
          if (!cancelled) setShowPredicted(true);
        }, afterWords + 450)
      );

      const cycleLength = afterWords + 450 + HOLD_MS;
      timeouts.push(
        setTimeout(() => {
          if (!cancelled) runCycle();
        }, cycleLength + RESTART_GAP_MS)
      );
    }

    runCycle();

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [started]);

  const sentence = WORDS.slice(0, wordCount).join(' ');

  return (
    <div className="demo-card" ref={containerRef}>
      <div className="demo-panel">
        <span className="demo-label">Your sentence</span>
        <p className="demo-sentence">
          {sentence.length > 0 ? (
            sentence
          ) : (
            <span className="demo-placeholder">Tap a word to begin…</span>
          )}
        </p>

        <div className={`demo-spoken${showSpoken ? ' demo-spoken-visible' : ''}`}>
          <span className="demo-label">Spoken aloud</span>
          <p className="demo-quote">&ldquo;{NATURAL_SENTENCE}&rdquo;</p>
        </div>
      </div>

      <div className="demo-footer">
        <div>
          <span className="demo-label" style={{ marginBottom: 8, display: 'block' }}>
            Predicted next
          </span>
          <div className={`demo-predicted-tiles${showPredicted ? ' demo-predicted-visible' : ''}`}>
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
