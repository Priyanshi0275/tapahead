'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { TILES, CATEGORIES } from '@/lib/tiles';
import { getSuggestions, recordTap } from '@/lib/ranking';
import { loadState, saveState, resetState } from '@/lib/storage';
import { pickDefaultVoice } from '@/lib/voices';
import SentenceStrip from '@/components/SentenceStrip';
import SuggestionRow from '@/components/SuggestionRow';
import CategorySection from '@/components/CategorySection';
import VoiceSettings from '@/components/VoiceSettings';

const VOICE_PREF_KEY = 'tapahead_voice_pref_v1';

export default function Home() {
  const [state, setState] = useState(null);
  const [sentence, setSentence] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [naturalizedPreview, setNaturalizedPreview] = useState('');

  const [voices, setVoices] = useState([]);
  const [genderPref, setGenderPref] = useState('female');
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(null);

  // Load learned history from localStorage only on the client, to avoid
  // any server/client hydration mismatch.
  useEffect(() => {
    setState(loadState());

    try {
      const raw = window.localStorage.getItem(VOICE_PREF_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.genderPref) setGenderPref(saved.genderPref);
        if (saved.selectedVoiceURI) setSelectedVoiceURI(saved.selectedVoiceURI);
      }
    } catch {
      // ignore corrupted prefs
    }
  }, []);

  // Voice list loads asynchronously in most browsers.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    function loadVoices() {
      const list = window.speechSynthesis.getVoices();
      if (list.length > 0) setVoices(list);
    }

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Once voices are available, pick a default matching the saved/gender
  // preference if nothing has been explicitly selected yet.
  useEffect(() => {
    if (voices.length === 0 || selectedVoiceURI) return;
    const defaultVoice = pickDefaultVoice(voices, genderPref);
    if (defaultVoice) setSelectedVoiceURI(defaultVoice.voiceURI);
  }, [voices, genderPref, selectedVoiceURI]);

  const persistVoicePref = useCallback((next) => {
    try {
      window.localStorage.setItem(VOICE_PREF_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const handleGenderChange = useCallback(
    (gender) => {
      setGenderPref(gender);
      const defaultVoice = pickDefaultVoice(voices, gender);
      const voiceURI = defaultVoice ? defaultVoice.voiceURI : null;
      setSelectedVoiceURI(voiceURI);
      persistVoicePref({ genderPref: gender, selectedVoiceURI: voiceURI });
    },
    [voices, persistVoicePref]
  );

  const handleVoiceChange = useCallback(
    (voiceURI) => {
      setSelectedVoiceURI(voiceURI);
      persistVoicePref({ genderPref, selectedVoiceURI: voiceURI });
    },
    [genderPref, persistVoicePref]
  );

  const handleTap = useCallback((tile) => {
    setSentence((s) => [...s, tile.label]);
    setNaturalizedPreview('');
    setState((prev) => {
      const next = recordTap(tile, prev);
      saveState(next);
      return next;
    });
  }, []);

  const handleSpeak = useCallback(async () => {
    if (sentence.length === 0) return;

    setIsThinking(true);
    let textToSpeak = sentence.join(' ');

    try {
      const res = await fetch('/api/naturalize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: sentence }),
      });
      const data = await res.json();
      if (data?.sentence) {
        textToSpeak = data.sentence;
        setNaturalizedPreview(data.naturalized ? data.sentence : '');
      }
    } catch {
      // fall back to raw tapped words — the fetch failing should never
      // block the user from being heard.
    }

    setIsThinking(false);

    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;

    const voice = voices.find((v) => v.voiceURI === selectedVoiceURI);
    if (voice) utterance.voice = voice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }, [sentence, voices, selectedVoiceURI]);

  const handleBackspace = useCallback(() => {
    setSentence((s) => s.slice(0, -1));
    setNaturalizedPreview('');
  }, []);

  const handleClear = useCallback(() => {
    setSentence([]);
    setNaturalizedPreview('');
  }, []);

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
      <Link href="/" className="board-back-link">← Home</Link>
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

      <VoiceSettings
        voices={voices}
        genderPref={genderPref}
        onGenderChange={handleGenderChange}
        selectedVoiceURI={selectedVoiceURI}
        onVoiceChange={handleVoiceChange}
      />

      <SentenceStrip
        words={sentence}
        onSpeak={handleSpeak}
        onBackspace={handleBackspace}
        onClear={handleClear}
        isThinking={isThinking}
        naturalizedPreview={naturalizedPreview}
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
