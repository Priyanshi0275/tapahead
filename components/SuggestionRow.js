'use client';

import TileButton from './TileButton';

export default function SuggestionRow({ suggestions, onTap }) {
  if (suggestions.length === 0) {
    return (
      <div className="suggestion-row suggestion-empty">
        <span className="section-eyebrow">Suggested for you</span>
        <p className="suggestion-empty-text">
          Suggestions will appear here as you use the board.
        </p>
      </div>
    );
  }

  return (
    <div className="suggestion-row">
      <span className="section-eyebrow">Suggested for you</span>
      <div className="suggestion-tiles">
        {suggestions.map((tile) => (
          <TileButton key={tile.id} tile={tile} onTap={onTap} showReason />
        ))}
      </div>
    </div>
  );
}
