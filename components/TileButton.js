'use client';

import { CATEGORIES } from '@/lib/tiles';

export default function TileButton({ tile, onTap, showReason }) {
  const cat = CATEGORIES[tile.category];

  return (
    <button
      type="button"
      className="tile"
      style={{ '--tile-color': cat.color, '--tile-bg': cat.bg }}
      onClick={() => onTap(tile)}
      aria-label={tile.label}
    >
      <span className="tile-icon" aria-hidden="true">
        {tile.icon}
      </span>
      <span className="tile-label">{tile.label}</span>
      {showReason && tile.reason && (
        <span className="tile-reason">
          <span aria-hidden="true">{tile.reason.icon}</span> {tile.reason.text}
        </span>
      )}
    </button>
  );
}
