import Link from 'next/link';
import Mascot from '@/components/Mascot';

export default function Landing() {
  return (
    <main className="landing">
      <div className="landing-inner">
        <div className="landing-copy">
          <span className="landing-eyebrow">Meet Tapper</span>
          <h1 className="landing-title">TapAhead</h1>
          <p className="landing-subtitle">
            The communication board that keeps up with you.
          </p>
          <p className="landing-body">
            Most AAC boards never change — the same taps, every single time,
            even for things you say ten times a day. TapAhead learns your
            patterns and brings your next word closer, without ever losing
            the tiles you already know by heart.
          </p>
          <Link href="/board" className="landing-cta">
            Start Tapping →
          </Link>
        </div>

        <div className="landing-visual">
          <div className="landing-blob" aria-hidden="true" />
          <Mascot className="landing-mascot" />
        </div>
      </div>
    </main>
  );
}
