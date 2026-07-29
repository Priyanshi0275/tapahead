'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { TILES, CATEGORIES } from '@/lib/tiles';
import { getSuggestions, recordTap } from '@/lib/ranking';
import { loadState, saveState, resetState } from '@/lib/storage';
import SentenceStrip from '@/components/SentenceStrip';
import SuggestionRow from '@/components/SuggestionRow';
import CategorySection from '@/components/CategorySection';

export default function Home() {
  const [state, setState] = useState(null);
  const [sentence, setSentence] = useState([]);

  // Load learned history from localStorage only on the client, to avoid
  // any server/client hydration mismatch.
  useEffect(() => {
    setState(loadState());
  }, []);

  const handleTap = useCallback((tile) => {
    setSentence((s) => [...s, tile.label]);
    setState((prev) => {
      const next = recordTap(tile, prev);
      saveState(next);
      return next;
    });
  }, []);

  const handleSpeak = useCallback(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(sentence.join(' '));
    utterance.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [sentence]);

  const handleBackspace = useCallback(() => {
    setSentence((s) => s.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => setSentence([]), []);

  const handleReset = useCallback(() => {
    if (typeof window === 'undefined') return;
    const confirmed = window.confirm(
      'Reset all learned suggestions on this device? This cannot be undone.'
    );
    if (!confirmed) return;
    setState(resetState());
  }, []);

  const suggestions = useMemo(() => {
    if (!state) return [];
    return getSuggestions(TILES, state);
  }, [state]);

  const tilesByCategory = useMemo(() => {
    const grouped = {};
    for (const tile of TILES) {
      if (!grouped[tile.category]) grouped[tile.category] = [];
      grouped[tile.category].push(tile);
    }
    return grouped;
  }, []);

  if (!state) return null;

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <h1 className="app-title">TapAhead</h1>
          <p className="app-subtitle">
            A communication board that learns how you talk.
          </p>
        </div>
        <button type="button" className="reset-link" onClick={handleReset}>
          Reset learning data
        </button>
      </header>

      <SentenceStrip
        words={sentence}
        onSpeak={handleSpeak}
        onBackspace={handleBackspace}
        onClear={handleClear}
      />

      <SuggestionRow suggestions={suggestions} onTap={handleTap} />

      <div className="category-list">
        {Object.keys(CATEGORIES).map((cat) => (
          <CategorySection
            key={cat}
            category={cat}
            tiles={tilesByCategory[cat] || []}
            onTap={handleTap}
          />
        ))}
      </div>
    </main>
  );
}
