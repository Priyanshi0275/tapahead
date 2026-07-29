// Persists the user's tap history on-device via localStorage. No account,
// no server, no login — the board starts learning from the very first tap
// and keeps working forever on that device.

const STORAGE_KEY = 'tapahead_state_v1';

export function getDefaultState() {
  return {
    tapCounts: {},
    lastUsed: {},
    bucketCounts: {},
    transitions: {},
    lastTappedId: null,
    lastTappedLabel: null,
  };
}

export function loadState() {
  if (typeof window === 'undefined') return getDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultState();
    return { ...getDefaultState(), ...JSON.parse(raw) };
  } catch {
    return getDefaultState();
  }
}

export function saveState(state) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage can fail in private browsing / storage-full cases —
    // fail silently rather than break the board.
  }
}

export function resetState() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
  }
  return getDefaultState();
}
