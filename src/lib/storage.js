// Web storage access that never throws (private mode, blocked storage).
// `session: true` uses sessionStorage: kept across reloads, gone when the tab closes.
const store = (session) => (session ? sessionStorage : localStorage);

export function readJSON(key, fallback, { session = false } = {}) {
  try {
    const raw = store(session).getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value, { session = false } = {}) {
  try {
    if (value == null) store(session).removeItem(key);
    else store(session).setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable: state just won't persist */
  }
}
