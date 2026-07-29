// The core prediction engine.
//
// Instead of reshuffling the whole board (which hurts real AAC users, who
// rely on spatial muscle memory to tap without looking), this engine only
// powers a small "Suggested for you" row. The main grid never moves.
//
// Three signals, combined as a weighted score:
//   1. Recency-frequency  — tapped often + tapped recently  (classic autocomplete logic)
//   2. Time-of-day match  — this tile is usually tapped around this time of day
//   3. Sequence transition — given the last tile tapped, this tile usually follows it
//      (a first-order Markov model over the user's own tap history)

const DECAY_PER_HOUR = 0.985; // recency decay rate
const WEIGHTS = { recency: 0.4, timeOfDay: 0.25, transition: 0.35 };
const SUGGESTION_COUNT = 6;

export function getTimeBucket(date = new Date()) {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'afternoon';
  if (h >= 17 && h < 22) return 'evening';
  return 'night';
}

function hoursSince(timestamp) {
  if (!timestamp) return Infinity;
  return (Date.now() - timestamp) / (1000 * 60 * 60);
}

function rawRecencyScore(tileId, state) {
  const count = state.tapCounts[tileId] || 0;
  if (count === 0) return 0;
  const hrs = hoursSince(state.lastUsed[tileId]);
  const decay = Math.pow(DECAY_PER_HOUR, Math.min(hrs, 1000));
  return count * decay;
}

function timeOfDayScore(tileId, state) {
  const bucket = getTimeBucket();
  const counts = state.bucketCounts[tileId];
  if (!counts) return 0;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return (counts[bucket] || 0) / total;
}

function transitionScore(tileId, state) {
  if (!state.lastTappedId) return 0;
  const trans = state.transitions[state.lastTappedId];
  if (!trans) return 0;
  const total = Object.values(trans).reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  return (trans[tileId] || 0) / total;
}

// Ranks every tile and attaches a human-readable "reason" so the prediction
// is visible/explainable, not a black box.
export function rankTiles(tiles, state) {
  const raw = tiles.map((tile) => ({
    tile,
    recency: rawRecencyScore(tile.id, state),
    timeOfDay: timeOfDayScore(tile.id, state),
    transition: transitionScore(tile.id, state),
  }));

  const maxRecency = Math.max(...raw.map((r) => r.recency), 0);

  const scored = raw.map(({ tile, recency, timeOfDay, transition }) => {
    const normRecency = maxRecency > 0 ? recency / maxRecency : 0;
    const score =
      WEIGHTS.recency * normRecency +
      WEIGHTS.timeOfDay * timeOfDay +
      WEIGHTS.transition * transition;

    let reason = null;
    if (transition > 0.2) {
      reason = { icon: '→', text: `after "${state.lastTappedLabel}"` };
    } else if (timeOfDay > 0.4) {
      reason = { icon: '🕐', text: getTimeBucket() };
    } else if (normRecency > 0.3) {
      reason = { icon: '⭐', text: 'frequent' };
    }

    return { ...tile, score, reason };
  });

  return scored.sort((a, b) => b.score - a.score);
}

// Cold-start aware: returns [] when there isn't enough history yet, so the
// UI can show a friendly empty state instead of a meaningless random row.
export function getSuggestions(tiles, state) {
  const ranked = rankTiles(tiles, state);
  return ranked.filter((t) => t.score > 0).slice(0, SUGGESTION_COUNT);
}

// Pure function: given a tap, returns the *next* state (no mutation).
export function recordTap(tile, state) {
  const now = Date.now();
  const bucket = getTimeBucket();

  const tapCounts = {
    ...state.tapCounts,
    [tile.id]: (state.tapCounts[tile.id] || 0) + 1,
  };
  const lastUsed = { ...state.lastUsed, [tile.id]: now };

  const prevBucketCounts = state.bucketCounts[tile.id] || {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0,
  };
  const bucketCounts = {
    ...state.bucketCounts,
    [tile.id]: {
      ...prevBucketCounts,
      [bucket]: (prevBucketCounts[bucket] || 0) + 1,
    },
  };

  let transitions = state.transitions;
  if (state.lastTappedId) {
    const prevTrans = state.transitions[state.lastTappedId] || {};
    transitions = {
      ...state.transitions,
      [state.lastTappedId]: {
        ...prevTrans,
        [tile.id]: (prevTrans[tile.id] || 0) + 1,
      },
    };
  }

  return {
    ...state,
    tapCounts,
    lastUsed,
    bucketCounts,
    transitions,
    lastTappedId: tile.id,
    lastTappedLabel: tile.label,
  };
}
