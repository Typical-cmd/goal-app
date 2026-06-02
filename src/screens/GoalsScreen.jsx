import { getCat, getType, freqLabel, criteriaCounts, filterByCategory } from "../logic/goals.js";

export default function GoalsScreen({ T, cats, goals, filter, setFilter, onTap }) {
  const allCats = [{ id: "all", label: "All", color: T.accent }, ...cats];
  const list = filterByCategory(goals, filter);

  return (
    <div className="fade" style={{ padding: "20px 20px 0" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 32, fontWeight: 700, marginBottom: 18 }}>My Goals</h1>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 16 }}>
        {allCats.map(c => (
          <button key={c.id} onClick={() => setFilter(c.id)} style={{
            background: filter === c.id ? c.color : T.card,
            border: `1px solid ${filter === c.id ? c.color : T.border}`,
            borderRadius: 20, padding: "6px 14px", cursor: "pointer",
            color: filter === c.id ? T.bg : T.sub,
            fontSize: 12, fontWeight: 500, whiteSpace: "nowrap", transition: "all .2s",
          }}>{c.label}</button>
        ))}
      </div>

      {list.length === 0 && (
        <div style={{
          background: T.card, borderRadius: 14, padding: 22, border: `1px dashed ${T.border}`,
          textAlign: "center", color: T.sub, fontSize: 13,
        }}>
          No goals in this category yet.
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {list.map(g => {
          const cat = getCat(cats, g.cat);
          const primaryType = getType(g.types[0]?.typeId);
          const { required, optional } = criteriaCounts(g);
          return (
            <div key={g.id} className="rh press" onClick={() => onTap(g)} style={{
              background: T.card, borderRadius: 16, padding: 16, border: `1px solid ${T.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* REQ / OPT badges on left */}
                <div style={{ display: "flex", flexDirection: "column", gap: 3, flexShrink: 0, alignItems: "flex-start" }}>
                  {required > 0 && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                      color: cat.color, background: `${cat.color}20`,
                      border: `1px solid ${cat.color}44`, borderRadius: 4, padding: "2px 5px",
                    }}>REQ {required}</span>
                  )}
                  {optional > 0 && (
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
                      color: T.sub, background: T.surface,
                      border: `1px solid ${T.border}`, borderRadius: 4, padding: "2px 5px",
                    }}>OPT {optional}</span>
                  )}
                </div>
                <div style={{
                  width: 42, height: 42, borderRadius: 13, background: `${cat.color}18`,
                  border: `1px solid ${cat.color}44`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ color: cat.color, fontSize: 18 }}>{cat.icon || primaryType.icon}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 18, fontWeight: 600 }}>{g.title}</p>
                  <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                    <span style={{ color: cat.color, fontSize: 11, background: `${cat.color}15`, borderRadius: 6, padding: "2px 8px" }}>{cat.label}</span>
                    <span style={{ color: T.muted, fontSize: 11 }}>{freqLabel(g.freq)}</span>
                  </div>
                </div>
                {g.streak > 0 && (
                  <div style={{ textAlign: "center", flexShrink: 0 }}>
                    <p style={{ fontSize: 13 }}>🔥</p>
                    <p style={{ color: T.accent, fontSize: 11, fontWeight: 600 }}>{g.streak}d</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
