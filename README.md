# TapAhead — Adaptive AAC Communication Board

A communication board for nonverbal / speech-impaired users that **learns
how you talk**, so the words you need next are predicted and surfaced
automatically — without ever moving the main grid (which would break the
muscle-memory tapping that real AAC users rely on).

It also uses a real LLM to turn telegraphic taps like `I want water` into
a natural spoken sentence like *"I'd like some water, please"* — because
speaking word-for-word sounds robotic, which is a real, documented
frustration for AAC users trying to have a normal conversation.

## Features

- **Predictive suggestion row** — a small, statistics-driven ranking engine
  (see "How the prediction works" below) — no LLM involved here, this is
  pure on-device logic.
- **AI sentence naturalization** — an LLM call (Groq, `llama-3.1-8b-instant`,
  the same setup used in MindTrace) turns your tapped words into a natural
  sentence before it's spoken aloud. Fails safe: if the API key is missing,
  the request times out, or anything goes wrong, it just speaks your raw
  tapped words instead — it never blocks you from being heard.
- **81 vocabulary tiles** across 6 categories, including a dedicated
  "Connecting Words" category (am, is, the, to, and, with, etc.) so
  sentences can flow more naturally.
- **Male/female voice toggle** plus an exact-voice dropdown, since the
  Web Speech API doesn't officially label voice gender — we guess from
  common voice names and let you override it.

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

# 3. Get a free Groq API key (needed for the AI sentence naturalization)
#    -> https://console.groq.com/keys
#    Copy .env.local.example to .env.local and paste your key in:
cp .env.local.example .env.local
# then edit .env.local and replace "your_groq_api_key_here"

# 4. Run the dev server
npm run dev
```

Open **http://localhost:3000** in your browser. Tap tiles, build a
sentence, hit "Speak." Without a Groq key, it just speaks your raw tapped
words (still fully functional) — with a key, it naturalizes the sentence
first and shows a preview line above the Speak button. Tap the same
sequences a few times and watch the "Suggested for you" row start
predicting your next word.

## Deploy it to Vercel (so you have a live link to submit)

**Important:** your `.env.local` file stays on your computer only — it is
never pushed to GitHub or read by Vercel automatically. You need to add
`GROQ_API_KEY` as an environment variable in Vercel too, or the deployed
app will just speak raw tapped words (still works, just without the AI
naturalization).

**Option A — no GitHub needed, fastest (Vercel CLI):**

```bash
# From inside the tapahead folder
npm install -g vercel
vercel login
vercel --prod
```

It'll ask a few questions — accept the defaults (it auto-detects Next.js).
After it finishes, it prints your live URL, e.g.
`https://tapahead-yourname.vercel.app`.

Then add your Groq key so the deployed version has it too:

```bash
vercel env add GROQ_API_KEY
```

Paste your key when prompted, select all environments (Production,
Preview, Development), then redeploy so it picks up the new variable:

```bash
vercel --prod
```

That final URL is the link you paste into the submission form.

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
4. Before clicking Deploy, expand **Environment Variables** and add:
   - Key: `GROQ_API_KEY`
   - Value: your key from [console.groq.com/keys](https://console.groq.com/keys)
5. Click **Deploy**. Vercel gives you a live URL in about a minute.

The suggestion engine and tap history run entirely client-side (no setup
needed for those) — the Groq key is only needed for the AI sentence
naturalization step.

## Project structure

```
tapahead/
├── app/
│   ├── api/naturalize/route.js  # LLM call (Groq) that naturalizes tapped words
│   ├── layout.js       # root layout, loads fonts
│   ├── page.js         # main app — wires state, ranking, voice, and UI together
│   └── globals.css     # design tokens + all styling
├── components/
│   ├── SentenceStrip.js    # sentence-building bar + naturalized preview + Speak
│   ├── SuggestionRow.js    # the dynamic, predicted-tiles row
│   ├── CategorySection.js  # one color-coded category block (stable grid)
│   ├── TileButton.js       # a single tappable tile
│   └── VoiceSettings.js    # male/female toggle + exact voice picker
├── lib/
│   ├── tiles.js         # vocabulary dataset (Fitzgerald-key categories)
│   ├── ranking.js        # THE CORE STATS LOGIC — scoring, ranking, tap recording
│   ├── storage.js        # localStorage load/save/reset helpers
│   └── voices.js          # heuristic male/female voice classification
├── .env.local.example    # copy to .env.local and add your Groq key
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
