'use client';

export default function SentenceStrip({
  words,
  onSpeak,
  onBackspace,
  onClear,
  isThinking,
  naturalizedPreview,
}) {
  return (
    <div className="sentence-strip">
      <div className="sentence-words">
        {words.length === 0 ? (
          <span className="sentence-placeholder">
            Tap tiles below to build a sentence…
          </span>
        ) : (
          words.map((w, i) => (
            <span key={i} className="sentence-word">
              {w}
            </span>
          ))
        )}
      </div>

      {naturalizedPreview && (
        <p className="naturalized-preview">
          <span className="naturalized-icon" aria-hidden="true">
            🔊
          </span>
          {naturalizedPreview}
        </p>
      )}

      <div className="sentence-actions">
        <button
          type="button"
          className="action-btn"
          onClick={onBackspace}
          disabled={words.length === 0}
          aria-label="Remove last word"
        >
          ⌫
        </button>
        <button
          type="button"
          className="action-btn"
          onClick={onClear}
          disabled={words.length === 0}
          aria-label="Clear sentence"
        >
          Clear
        </button>
        <button
          type="button"
          className="action-btn action-speak"
          onClick={onSpeak}
          disabled={words.length === 0 || isThinking}
          aria-label="Speak sentence"
        >
          {isThinking ? 'Thinking…' : '🔊 Speak'}
        </button>
      </div>
    </div>
  );
}
