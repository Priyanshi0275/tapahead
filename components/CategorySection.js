'use client';

import { CATEGORIES } from '@/lib/tiles';
import TileButton from './TileButton';

export default function CategorySection({ category, tiles, onTap }) {
  const meta = CATEGORIES[category];

  return (
    <section className="category-section" style={{ '--cat-color': meta.color }}>
      <h2 className="category-title">{meta.label}</h2>
      <div className="category-grid">
        {tiles.map((tile) => (
          <TileButton key={tile.id} tile={tile} onTap={onTap} />
        ))}
      </div>
    </section>
  );
}
