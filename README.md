# TapAhead — AI that turns taps into speech

TapAhead is an AAC (Augmentative and Alternative Communication) board for
nonverbal and speech-impaired users. At its center is a language model that
takes what someone taps out word-by-word and speaks it back as a real,
natural sentence, solving a problem every AAC user runs into: speaking
word-for-word sounds robotic, and that gets in the way of a normal
conversation.

**Live site:** `https://tapahead.vercel.app` — lands on an explainer page first,
"Open the board" goes to the actual working app.

---

## The problem

Tapping out full grammatical sentences one tile at a time is slow, so AAC
users naturally tap in shorthand — `want water`, `me tired home`. That's
efficient to type, but it comes out sounding flat and childlike when
spoken aloud verbatim, which is a real, documented frustration: people
don't want to sound like a robot when they're just trying to have a
conversation.

## The AI: turning taps into natural speech

This is the core AI feature of the project, in `app/api/naturalize/route.js`.

Every time the Speak button is pressed, the tapped sequence is sent to a
serverless function that calls **Groq's `llama-3.1-8b-instant`** with one
job: rewrite the sequence as a single, natural, grammatically correct
sentence — without inventing anything the user didn't tap.

More examples straight from the app:

| Tapped | Spoken |
|---|---|
| `me, tired, home` | "I'm tired — can we go home?" |
| `you, help, book` | "Could you help me with my book?" |

**Design choices that matter here:**
- **`temperature: 0.3`** — low, so the output stays close to a direct
  rewrite rather than a creative one. This is someone's actual intended
  speech; the model's job is to sound natural, not to improvise.
- **The prompt explicitly forbids adding meaning.** An AAC user's words
  carry real intent — the model is instructed never to guess at
  unstated details.
- **It fails safe.** No API key, a slow response, or any error and the
  route just returns the raw tapped words instead — a broken AI call
  should never be the reason someone can't be heard. This is a
  fail-safe, not fail-open, design: silence is worse than an unstyled
  sentence, but an AI error should never mean total silence.
- **A preview is always shown**, not just spoken — so the naturalized
  sentence is visible before and while it's said aloud, not a black box.

## Why the *rest* of the app deliberately isn't AI

The suggestion row (predicting which tile you'll want next) runs on plain
statistics in `lib/ranking.js` — recency-weighted frequency, time-of-day
patterns, and a first-order Markov model of tap sequences. No model, no
training, entirely on-device.

That's a deliberate split, not a missed opportunity to use AI everywhere:
predicting *which tile* is a narrow, well-defined ranking problem where a
transparent, explainable rule ("this tile is suggested because it usually
follows 'want'") is more trustworthy and debuggable for an accessibility
tool than an opaque model would be. Generating *natural phrasing*,
though, is a genuinely open-ended language task — exactly where an LLM
earns its place instead of being used for its own sake.

---

## What else TapAhead does

- **The main grid never moves.** Real AAC research shows reshuffling a
  board breaks the muscle memory users rely on to tap without looking, so
  predictions live in a separate row above a permanently stable grid. The
  landing page's "Core idea" section has a live toggle demonstrating
  exactly why — flip it to "Boards that reshuffle" and watch it scramble.
- **Predictions are explainable.** Suggested tiles show *why* they were
  picked (`→ after "want"`, `🕐 morning`, `⭐ frequent`), not just that
  they were.
- **81 vocabulary tiles** across 6 categories, color-coded with the
  **Fitzgerald key** — the real grammatical color-coding convention used
  on physical AAC boards.
- **Male/female voice toggle** plus an exact-voice picker, since the Web
  Speech API doesn't officially label voice gender.

### How the prediction engine scores tiles

| Signal | What it captures | Weight |
|---|---|---|
| Recency & frequency | Tapped often *and* recently, with decay so old habits fade | 0.40 |
| Time of day | Tiles historically used in the current time window | 0.25 |
| Sequence transition | Markov model of your own tap history | 0.35 |

Cold start is handled explicitly — with no history yet, the row is empty
rather than showing a meaningless guess. All of it runs in `localStorage`,
per device — no account, no server required for the board to start
learning.

---

## Tech stack

- **Next.js 14** (App Router) — landing page, board, and the naturalize
  API route in one app
- **Groq API** (`llama-3.1-8b-instant`) — the AI naturalization call
- **Plain CSS** (`app/globals.css`) — custom design tokens, no framework
- **Web Speech API** for text-to-speech — no external TTS cost
- **localStorage** for on-device learning — no database, no backend state

## Project structure

```
tapahead/
├── app/
│   ├── page.js               # Landing page — problem/solution explainer
│   ├── board/page.js         # The actual working AAC board
│   ├── api/naturalize/route.js   # THE AI — Groq call that naturalizes tapped words
│   ├── layout.js             # Root layout, font loading
│   └── globals.css           # Design tokens + all styling
├── components/
│   ├── DemoAnimation.js      # Scripted, scroll-triggered landing page demo
│   ├── CoreIdeaDemo.js       # Interactive "stable grid vs reshuffle" toggle
│   ├── Reveal.js             # Scroll-triggered fade-in wrapper
│   ├── SentenceStrip.js      # Sentence-building bar + naturalized preview
│   ├── SuggestionRow.js      # The dynamic, predicted-tiles row
│   ├── CategorySection.js    # One color-coded category block (stable grid)
│   ├── TileButton.js         # A single tappable tile
│   └── VoiceSettings.js      # Male/female toggle + exact voice picker
├── lib/
│   ├── ranking.js            # The (non-AI) prediction engine
│   ├── tiles.js              # Vocabulary dataset (Fitzgerald-key categories)
│   ├── storage.js            # localStorage load/save/reset helpers
│   └── voices.js             # Heuristic male/female voice classification
├── .env.local.example        # Copy to .env.local and add your Groq key
└── README.md
```

---

## Running it locally

Requires [Node.js](https://nodejs.org) 18+.

```bash
git clone <your repo URL>
cd tapahead
npm install
```

Get a free Groq API key at [console.groq.com/keys](https://console.groq.com/keys),
then:

```bash
cp .env.local.example .env.local
# edit .env.local and paste your key in place of the placeholder
npm run dev
```

Open **http://localhost:3000**. Without a Groq key, the board still works
fully — it just speaks your raw tapped words instead of a naturalized
sentence, since the naturalize route fails safe.

## Deploying to Vercel

```bash
npm install -g vercel
vercel login
vercel --prod
```

Then add the Groq key to the deployed environment too (`.env.local` never
gets pushed or read by Vercel automatically):

```bash
vercel env add GROQ_API_KEY
# paste your key, select all environments
vercel --prod
```

## Extending this further

- **Streaming naturalization** — stream the Groq response so the spoken
  sentence starts as soon as it's ready, instead of waiting for the full
  completion.
- **Personalized phrasing** — fine-tune the naturalization prompt per
  user (formality, regional phrasing) based on how they've edited/spoken
  past suggestions.
- **Cross-device sync** — swap `lib/storage.js` for a small backend
  (Vercel KV is a fast, free, schema-less option).
- **Licensed AAC symbol sets** — tiles use emoji for speed; production
  AAC apps typically use ARASAAC or PCS symbol libraries.


