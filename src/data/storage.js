// ─────────────────────────────────────────────────────────────────────────────
// STORAGE LAYER
//
// This is the ONLY file that talks to localStorage directly.
// When migrating to native, replace the body of these functions with SQLite
// (or AsyncStorage) calls — nothing else in the app changes.
//
// Every function is async-safe-shaped so the native swap is painless.
// ─────────────────────────────────────────────────────────────────────────────

import { DEFAULT_CATS, BUILT_IN_QUOTES, DEFAULT_ACCENT, SAMPLE_GOALS } from "./constants.js";

const KEYS = {
  goals:     "ga.goals",
  cats:      "ga.cats",
  quotes:    "ga.quoteLists",
  active:    "ga.activeConfig",
  accent:    "ga.accent",
  logs:      "ga.logs",          // future: per-goal log history
  initialized: "ga.initialized",
};

// Helpers
const read  = (k, fallback) => {
  try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// First-run seed
function seedIfNeeded() {
  if (read(KEYS.initialized, false)) return;
  write(KEYS.goals,  SAMPLE_GOALS);
  write(KEYS.cats,   DEFAULT_CATS);
  write(KEYS.quotes, [{ id: "builtin", name: "Built-In", locked: true, quotes: BUILT_IN_QUOTES }]);
  write(KEYS.active, { mode: "all", ids: [] });
  write(KEYS.accent, DEFAULT_ACCENT);
  write(KEYS.initialized, true);
}

// Public API ──────────────────────────────────────────────────────────────────
export function loadAll() {
  seedIfNeeded();
  return {
    goals:        read(KEYS.goals, SAMPLE_GOALS),
    cats:         read(KEYS.cats, DEFAULT_CATS),
    quoteLists:   read(KEYS.quotes, [{ id: "builtin", name: "Built-In", locked: true, quotes: BUILT_IN_QUOTES }]),
    activeConfig: read(KEYS.active, { mode: "all", ids: [] }),
    accent:       read(KEYS.accent, DEFAULT_ACCENT),
    logs:         read(KEYS.logs, {}),
  };
}

export const saveGoals      = (v) => write(KEYS.goals,  v);
export const saveCats       = (v) => write(KEYS.cats,   v);
export const saveQuoteLists = (v) => write(KEYS.quotes, v);
export const saveActiveCfg  = (v) => write(KEYS.active, v);
export const saveAccent     = (v) => write(KEYS.accent, v);

// Future expansion — log persistence per goal entry
export const loadLogs = ()        => read(KEYS.logs, {});
export const saveLogs = (v)       => write(KEYS.logs, v);

// Reset everything (handy for testing)
export function resetAll() {
  Object.values(KEYS).forEach(k => localStorage.removeItem(k));
}
