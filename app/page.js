'use client';

import Link from 'next/link';
import TileButton from '@/components/TileButton';

const previewSuggestions = [
  { id: 'water', label: 'water', category: 'noun', icon: '💧', reason: { icon: '→', text: 'after "want"' } },
  { id: 'please', label: 'please', category: 'social', icon: '🤲', reason: { icon: '⭐', text: 'frequent' } },
  { id: 'help', label: 'help', category: 'verb', icon: '🆘', reason: { icon: '🕐', text: 'morning' } },
];

function noop() {}

export default function Landing() {
  return (
    <main className="landing">
      <div className="landing-inner">
        <div className="landing-copy">
          <span className="landing-eyebrow">Communication support</span>
          <h1 className="landing-title">TapAhead</h1>
          <p className="landing-subtitle">
            A communication board that learns how you talk.
          </p>
          <p className="landing-body">
            Most AAC boards never change — the same tap sequence, every
            single time, even for things you say ten times a day. TapAhead
            quietly learns your patterns and brings the words you need next
            closer to your fingers, without ever moving the ones you already
            know by heart.
          </p>
          <Link href="/board" className="landing-cta">
            Start Using TapAhead →
          </Link>
        </div>

        <div className="landing-preview" aria-hidden="true">
          <span className="preview-label">Suggested for you</span>
          <div className="preview-tiles">
            {previewSuggestions.map((tile) => (
              <TileButton key={tile.id} tile={tile} onTap={noop} showReason />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
