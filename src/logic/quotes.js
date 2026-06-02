// Pure quote logic — no React, no UI.

export function pickQuote(quoteLists, activeConfig) {
  const sourceLists = activeConfig.mode === "all"
    ? quoteLists
    : quoteLists.filter(l => activeConfig.ids.includes(l.id));

  const pool = [];
  sourceLists.forEach(l => l.quotes.forEach(q => pool.push({ text: q, list: l.name })));
  return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
}
