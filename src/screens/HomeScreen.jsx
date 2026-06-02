import { getCat, criteriaCounts, bestStreak, isGoalDueOn, todayKey } from "../logic/goals.js";

export default function HomeScreen({ T, cats, goals, logs = {}, homeQuote, onTap }) {
  const best  = bestStreak(goals);
  const today = todayKey();
  const isDoneToday = (g) => logs[g.id]?.[today]?.completed === true;

  const doneGoals = goals.filter(isDoneToday);
  const dueGoals  = goals.filter(g => isGoalDueOn(g.freq, today) && !isDoneToday(g));

  return (
    <div className="fade" style={{ padding: "20px 20px 0" }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.sub, fontSize: 14, fontStyle: "italic" }}>
        {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      </p>
      <h1 style={{
        fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 34, fontWeight: 700,
        lineHeight: 1.1, marginTop: 2, marginBottom: 18,
      }}>
        What will you<br />
        <span style={{ color: T.accent, fontStyle: "italic" }}>pursue today?</span>
      </h1>

      {homeQuote && (
        <div style={{
          background: T.card, borderRadius: 16, padding: "16px 20px", marginBottom: 18,
          border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.accent}`,
        }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 16, fontStyle: "italic", lineHeight: 1.65 }}>
            "{homeQuote.text}"
          </p>
          <p style={{ color: T.sub, fontSize: 10, marginTop: 8, letterSpacing: "0.06em" }}>— {homeQuote.list}</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Active", value: goals.length },
          { label: "Best Streak", value: `${best}d` },
          { label: "This Month", value: "—" },
        ].map((s, i) => (
          <div key={i} style={{
            background: T.card, borderRadius: 14, padding: "13px 10px",
            textAlign: "center", border: `1px solid ${T.border}`,
          }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.accent, fontSize: 22, fontWeight: 700 }}>{s.value}</p>
            <p style={{ color: T.sub, fontSize: 10, marginTop: 2 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {goals.length === 0 && (
        <div style={{
          background: T.card, borderRadius: 14, padding: 22, border: `1px dashed ${T.border}`,
          textAlign: "center", color: T.sub, fontSize: 13, marginBottom: 20,
        }}>
          No goals yet. Tap <span style={{ color: T.accent }}>+ New</span> below to create one.
        </div>
      )}

      {/* Due Today */}
      {goals.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Due Today</p>
            <span style={{ color: T.muted, fontSize: 11 }}>{dueGoals.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 24 }}>
            {dueGoals.length === 0 && (
              <div style={{
                background: T.card, borderRadius: 14, padding: 18, border: `1px dashed ${T.border}`,
                textAlign: "center", color: T.sub, fontSize: 13,
              }}>
                {doneGoals.length > 0 ? "All caught up for today 🎉" : "Nothing scheduled for today."}
              </div>
            )}
            {dueGoals.map(g => {
              const cat = getCat(cats, g.cat);
              const { required, optional } = criteriaCounts(g);
              return (
                <div key={g.id} className="rh press" onClick={() => onTap(g)}
                  style={{
                    background: T.card, borderRadius: 14, padding: "13px 16px",
                    border: `1px solid ${T.border}`, display: "flex", alignItems: "center", gap: 13,
                  }}>
                  <div style={{ width: 4, height: 34, borderRadius: 2, background: cat.color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 17, fontWeight: 600 }}>{g.title}</p>
                    <p style={{ color: T.sub, fontSize: 11, marginTop: 2 }}>
                      {cat.label} · {required} req{optional > 0 ? ` · ${optional} opt` : ""}
                    </p>
                  </div>
                  {g.streak > 0 && <span style={{ color: T.accent, fontSize: 12 }}>🔥 {g.streak}</span>}
                  <span style={{ color: T.muted, fontSize: 17 }}>›</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Done Today */}
      {doneGoals.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Done Today</p>
            <span style={{ color: T.muted, fontSize: 11 }}>{doneGoals.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
            {doneGoals.map(g => {
              const cat = getCat(cats, g.cat);
              return (
                <div key={g.id} className="rh press" onClick={() => onTap(g)}
                  style={{
                    background: T.card, borderRadius: 14, padding: "13px 16px",
                    border: `1px solid ${cat.color}44`, display: "flex", alignItems: "center", gap: 13,
                    opacity: 0.78,
                  }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 9, background: `${cat.color}22`, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <span style={{ color: T.green, fontSize: 14 }}>✓</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 17, fontWeight: 600,
                      textDecoration: "line-through", textDecorationColor: `${T.sub}88`,
                    }}>{g.title}</p>
                    <p style={{ color: T.sub, fontSize: 11, marginTop: 2 }}>{cat.label} · Completed</p>
                  </div>
                  {g.streak > 0 && <span style={{ color: cat.color, fontSize: 12 }}>🔥 {g.streak}</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
