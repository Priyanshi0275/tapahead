# TapAhead — Adaptive AAC Communication Board

A communication board for nonverbal / speech-impaired users that **learns
how you talk**, so the words you need next are predicted and surfaced
automatically — without ever moving the main grid (which would break the
muscle-memory tapping that real AAC users rely on).

## How the prediction works

A small "Suggested for you" row above the main grid is ranked live using
three signals, blended into one score:

1. **Recency-frequency** — tapped often *and* recently (classic autocomplete
   logic, with exponential time-decay).
2. **Time-of-day match** — tiles historically used in the current time
   window (morning / afternoon / evening / night) get a boost.
3. **Sequence transition** — a first-order Markov model over your own tap
   history: "after 'I want', you usually tap 'water'."

All of this runs **on-device**, stored in `localStorage` — no login, no
server, no account. It starts learning from the very first tap.

The core logic lives in `lib/ranking.js` — that file alone is worth reading
if you want to see (or explain to judges) exactly how the scoring works.

## Run it locally

You'll need [Node.js](https://nodejs.org) 18 or newer installed.

```bash
# 1. Unzip this project, then open a terminal inside the folder
cd tapahead

# 2. Install dependencies
npm install

# 3. Run the dev server
npm run dev
```

Open **http://localhost:3000** in your browser. Tap tiles, build a
sentence, hit "Speak" (uses your browser's built-in text-to-speech, no API
key needed). Tap the same sequences a few times and watch the "Suggested
for you" row start predicting your next word.

## Deploy it to Vercel (so you have a live link to submit)

**Option A — no GitHub needed, fastest (Vercel CLI):**

```bash
# From inside the tapahead folder
npm install -g vercel
vercel login
vercel --prod
```

It'll ask a few questions — accept the defaults (it auto-detects Next.js).
After it finishes, it prints your live URL, e.g.
`https://tapahead-yourname.vercel.app`. That's the link you paste into the
submission form.

**Option B — via GitHub (if you want the project on GitHub too):**

1. Create a new empty repo on GitHub (e.g. `tapahead`).
2. In the project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/tapahead.git
   git push -u origin main
   ```
3. Go to [vercel.com/new](https://vercel.com/new), click **Import Project**,
   pick your `tapahead` repo.
4. Leave all settings as default (Vercel auto-detects Next.js) → click
   **Deploy**.
5. Vercel gives you a live URL in about a minute.

Either way, no environment variables or extra setup are needed — everything
runs client-side.

## Project structure

```
tapahead/
├── app/
│   ├── layout.js       # root layout, loads fonts
│   ├── page.js         # main app — wires state, ranking, and UI together
│   └── globals.css     # design tokens + all styling
├── components/
│   ├── SentenceStrip.js    # the sentence-building bar + Speak/Clear/Backspace
│   ├── SuggestionRow.js    # the dynamic, predicted-tiles row
│   ├── CategorySection.js  # one color-coded category block (stable grid)
│   └── TileButton.js       # a single tappable tile
├── lib/
│   ├── tiles.js         # the vocabulary dataset (Fitzgerald-key categories)
│   ├── ranking.js        # THE CORE LOGIC — scoring, ranking, tap recording
│   └── storage.js        # localStorage load/save/reset helpers
└── README.md
```

## If you want to extend it further

- **Cross-device sync**: currently all learning is per-device via
  `localStorage`. To sync across devices, swap `lib/storage.js` for calls to
  a small backend (Vercel KV is a fast, free option — no schema migrations,
  just key-value).
- **Context/location awareness**: add a 4th ranking signal using the
  Geolocation API — boost tiles relevant to saved places (e.g. "home,"
  "school").
- **Real AAC symbol sets**: tiles currently use emoji as icons for speed.
  Production AAC apps use licensed symbol sets like ARASAAC or PCS — worth
  mentioning as a "next step" if judges ask.
- **Caregiver view**: a simple dashboard showing which tiles/phrases are
  used most, which could help caregivers/therapists notice patterns.

## Why this design (in case a judge asks)

Real AAC research is clear that **fully reshuffling** a communication grid
hurts usability — users build spatial muscle memory and tap without
looking. So instead of reordering everything, TapAhead keeps the main grid
completely stable and adds one small, clearly-separated prediction row.
That's a deliberate trade-off, not a missing feature.
