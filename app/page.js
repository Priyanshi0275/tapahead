import Link from 'next/link';
import DemoAnimation from '@/components/DemoAnimation';
import Reveal from '@/components/Reveal';

const coreGridWords = ['I', 'want', 'water', 'more', 'help', 'please', 'yes', 'no'];

const predictionCards = [
  {
    index: '01',
    title: 'Recency & frequency',
    body: 'Words you reach for often stay close, with a gentle decay so old habits fade.',
  },
  {
    index: '02',
    title: 'Time of day',
    body: 'Breakfast words in the morning. Bedtime words at night. Learned from your own taps.',
  },
  {
    index: '03',
    title: 'What follows what',
    body: 'A first-order model of your sequences: after "I", your "want" comes first.',
  },
];

const speechExamples = [
  { tiles: ['I', 'want', 'water'], quote: "I'd like some water, please." },
  { tiles: ['me', 'tired', 'home'], quote: "I'm tired — can we go home?" },
  { tiles: ['you', 'help', 'book'], quote: 'Could you help me with my book?' },
];

export default function Landing() {
  return (
    <main>
      <nav className="site-nav">
        <span className="nav-logo">TapAhead</span>
        <div className="nav-links">
          <a href="#demo" className="nav-link">Demo</a>
          <a href="#how-it-works" className="nav-link">How it works</a>
        </div>
        <Link href="/board" className="nav-cta">Open the board</Link>
      </nav>

      {/* Hero */}
      <section className="hero">
        <span className="hero-watermark hero-watermark-1">water</span>
        <span className="hero-watermark hero-watermark-2">later</span>
        <span className="hero-watermark hero-watermark-3">outside</span>

        <div className="hero-inner">
          <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
            Adaptive AAC
          </span>
          <h1 className="hero-title">
            Communication
            <br />
            that keeps up.
          </h1>
          <p className="hero-subtitle">
            A communication board that learns how you speak — without ever
            moving the words you already know by heart.
          </p>
          <div className="hero-actions">
            <Link href="/board" className="btn-primary">Try the board</Link>
            <a href="#demo" className="btn-secondary">Watch it work</a>
          </div>
          <p className="hero-trust">No account. Learns on-device. Works offline-first.</p>
        </div>
      </section>

      {/* Live demo */}
      <section className="section section-center" id="demo">
        <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
          Live demo
        </span>
        <h2 className="section-title">Three taps. One natural sentence.</h2>

        <Reveal>
          <DemoAnimation />
        </Reveal>
      </section>

      {/* Core idea */}
      <section className="section" id="how-it-works">
        <Reveal>
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
              <button type="button" className="active">TapAhead</button>
              <button type="button">Boards that reshuffle</button>
            </div>
          </div>

          <div className="mini-board-card">
            <div className="mini-board-grid">
              {coreGridWords.map((w) => (
                <div key={w} className="mini-board-tile">{w}</div>
              ))}
            </div>
            <p className="mini-board-caption">
              Nothing moves. Ever. Predictions live above the grid.
            </p>
          </div>
        </div>
        </Reveal>
      </section>

      {/* Prediction */}
      <section className="section">
        <Reveal>
        <span className="section-eyebrow">Prediction</span>
        <h2 className="prediction-title-two-tone">
          The layout doesn&apos;t change.
          <span className="dim">Your conversations do.</span>
        </h2>
        <div className="prediction-cards">
          {predictionCards.map((card) => (
            <div key={card.index} className="prediction-card">
              <div className="prediction-index">{card.index}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* Natural speech */}
      <section className="section section-center">
        <span className="section-eyebrow" style={{ justifyContent: 'center' }}>
          Natural speech
        </span>
        <h2 className="section-title">
          Telegraphic taps become
          <br />a sentence people hear.
        </h2>
        <p className="section-subtitle">
          Fewer taps means less effort. A language model rewrites the
          sequence into fluent speech — never adding meaning you didn&apos;t tap.
        </p>

        <Reveal>
        <div className="speech-examples">
          {speechExamples.map((ex) => (
            <div key={ex.quote} className="speech-example">
              <div className="speech-tiles">
                {ex.tiles.map((t) => (
                  <span key={t} className="pill-tile">{t}</span>
                ))}
              </div>
              <span className="speech-arrow">→</span>
              <p className="speech-quote">&ldquo;{ex.quote}&rdquo;</p>
            </div>
          ))}
        </div>
        </Reveal>
      </section>

      {/* CTA banner */}
      <div className="cta-banner">
        <Reveal>
        <div className="cta-banner-inner">
          <h2 className="cta-banner-title">Say it in three taps.</h2>
          <p className="cta-banner-subtitle">
            Open the board and start tapping. It begins learning from the
            very first word.
          </p>
          <Link href="/board" className="cta-banner-btn">Open the board</Link>
        </div>
        </Reveal>
      </div>
    </main>
  );
}
