import { useState } from "react";
import {
  getCat, dayKey, todayKey, isGoalDueOn,
  computeStreak, computeBestStreak, computeHitRate, requiredMet,
} from "../logic/goals.js";
import CriterionCard from "../components/CriterionCard.jsx";

export default function HistoryScreen({ T, cats, goals, setGoals, goal, setGoal, logs, setLogs }) {
  const [dropOpen, setDropOpen] = useState(false);
  const [calDay,   setCalDay]   = useState(null);   // selected date key
  const [allMode,  setAllMode]  = useState(false);

  const TODAY = todayKey();

  if (!goals.length) {
    return (
      <div className="fade" style={{ padding: "20px 20px 0" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 32, fontWeight: 700, marginBottom: 18 }}>Progress</h1>
        <div style={{ background: T.card, borderRadius: 14, padding: 22, border: `1px dashed ${T.border}`, textAlign: "center", color: T.sub, fontSize: 13 }}>
          No goals yet. Create one to track progress.
        </div>
      </div>
    );
  }

  const activeGoal = goal || goals[0];
  const cat        = getCat(cats, activeGoal.cat);
  const color      = allMode ? T.accent : (cat.color || "#666666");

  // ── Shared log writers: completion is ALWAYS derived from the data ──
  const writeEntry = (g, dateKey, typeId, value) => {
    const gLogs = logs[g.id] || {};
    const entries = { ...(gLogs[dateKey]?.entries || {}), [typeId]: value };
    const newLogs = {
      ...logs,
      [g.id]: { ...gLogs, [dateKey]: { ...(gLogs[dateKey] || {}), entries, completed: requiredMet(g, entries) } },
    };
    setLogs(newLogs);
    setGoals(goals.map(x => x.id === g.id ? { ...x, streak: computeStreak(g.id, g.freq, newLogs) } : x));
  };
  const clearEntry = (g, dateKey, typeId) => {
    const gLogs = logs[g.id] || {};
    const entries = { ...(gLogs[dateKey]?.entries || {}) };
    delete entries[typeId];
    const newLogs = {
      ...logs,
      [g.id]: { ...gLogs, [dateKey]: { ...(gLogs[dateKey] || {}), entries, completed: requiredMet(g, entries) } },
    };
    setLogs(newLogs);
    setGoals(goals.map(x => x.id === g.id ? { ...x, streak: computeStreak(g.id, g.freq, newLogs) } : x));
  };

  const grouped = cats
    .map(c => ({ cat: c, goals: goals.filter(g => g.cat === c.id) }))
    .filter(g => g.goals.length > 0);
  const uncategorized = goals.filter(g => !cats.find(c => c.id === g.cat));

  return (
    <div className="fade" style={{ padding: "20px 20px 0", position: "relative" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Progress</h1>

      {/* Goal selector */}
      <div style={{ position: "relative", marginBottom: 18 }}>
        <button onClick={() => setDropOpen(o => !o)} className="press" style={{
          width: "100%", background: T.card, border: `1px solid ${color}66`,
          borderRadius: 14, padding: "12px 16px", cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: `${color}22`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color, fontSize: 13 }}>{allMode ? "◈" : cat.icon}</span>
          </div>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 17, fontWeight: 600, flex: 1, textAlign: "left" }}>
            {allMode ? "All Goals" : activeGoal.title}
          </span>
          <span style={{ color: T.sub, fontSize: 13 }}>{dropOpen ? "▲" : "▼"}</span>
        </button>

        {dropOpen && (
          <div style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            background: T.card, borderRadius: 14, border: `1px solid ${T.border}`,
            zIndex: 100, overflow: "hidden", boxShadow: "0 8px 32px #00000044",
          }}>
            <button onClick={() => { setAllMode(true); setCalDay(null); setDropOpen(false); }} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", background: allMode ? `${T.accent}15` : "none",
              border: "none", borderBottom: `1px solid ${T.border}`, cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ color: T.accent, fontSize: 14 }}>◈</span>
              <span style={{ fontFamily: "'Cormorant Garamond',serif", color: allMode ? T.accent : T.text, fontSize: 15, fontWeight: 600 }}>All Goals</span>
            </button>
            {grouped.map(({ cat: c, goals: gs }) => (
              <div key={c.id}>
                <p style={{ color: c.color, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 16px 4px" }}>{c.icon} {c.label}</p>
                {gs.map(g => (
                  <button key={g.id} onClick={() => { setAllMode(false); setGoal(g); setCalDay(null); setDropOpen(false); }} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 16px 10px 26px", background: !allMode && activeGoal.id === g.id ? `${c.color}15` : "none",
                    border: "none", cursor: "pointer", textAlign: "left",
                  }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", color: !allMode && activeGoal.id === g.id ? c.color : T.text, fontSize: 15 }}>{g.title}</span>
                  </button>
                ))}
              </div>
            ))}
            {uncategorized.length > 0 && (
              <div>
                <p style={{ color: T.sub, fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 16px 4px" }}>Other</p>
                {uncategorized.map(g => (
                  <button key={g.id} onClick={() => { setAllMode(false); setGoal(g); setCalDay(null); setDropOpen(false); }} style={{
                    width: "100%", padding: "10px 16px 10px 26px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  }}>
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 15 }}>{g.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {allMode
        ? <AllView T={T} cats={cats} goals={goals} logs={logs} TODAY={TODAY}
            calDay={calDay} setCalDay={setCalDay} writeEntry={writeEntry} clearEntry={clearEntry} />
        : <SingleView T={T} cat={cat} color={color} activeGoal={activeGoal} logs={logs} TODAY={TODAY}
            calDay={calDay} setCalDay={setCalDay} writeEntry={writeEntry} clearEntry={clearEntry} />
      }
    </div>
  );
}

// 28-day grid helper
const build28 = () => Array.from({ length: 28 }, (_, i) => dayKey(27 - i));
const dateNum = (key) => parseInt(key.slice(8), 10);

// ───────────────────────── SINGLE GOAL ─────────────────────────
function SingleView({ T, cat, color, activeGoal, logs, TODAY, calDay, setCalDay, writeEntry, clearEntry }) {
  const goalLogs = logs[activeGoal.id] || {};
  const streak   = computeStreak(activeGoal.id, activeGoal.freq, logs);
  const best     = Math.max(computeBestStreak(activeGoal.id, activeGoal.freq, logs), streak);
  const hitRate  = computeHitRate(activeGoal.id, activeGoal.freq, logs);

  const days = build28().map(key => {
    const due  = isGoalDueOn(activeGoal.freq, key);
    const data = goalLogs[key];
    const completed = data?.completed === true;
    const attempted = !completed && data?.entries && Object.keys(data.entries).length > 0;
    return { key, due, data, completed, attempted, isToday: key === TODAY };
  });

  const tileStyle = (d, selected) => {
    let background = "transparent", borderColor = "transparent", check = null;
    if (d.completed && d.due)        { background = color;          borderColor = color;        check = T.bg; }
    else if (d.completed && !d.due)  { background = T.surface;      borderColor = `${color}55`; check = color; }
    else if (d.attempted && d.due)   { background = `${color}33`;   borderColor = `${color}55`; }
    else if (d.due)                  { background = T.surface;      borderColor = T.border; }
    const border = d.isToday ? `2px solid ${T.accent}` : `1px solid ${borderColor}`;
    const boxShadow = selected ? `0 0 0 2px ${color}` : "none";
    return { background, border, boxShadow, check };
  };

  const selData = calDay ? goalLogs[calDay] : null;
  const selDue  = calDay ? isGoalDueOn(activeGoal.freq, calDay) : false;
  const selEntries = selData?.entries || {};

  return (
    <>
      <StatsRow T={T} color={color} stats={[
        { l: "Streak", v: `${streak}d 🔥` }, { l: "Best", v: `${best}d` }, { l: "Hit Rate", v: `${hitRate}%` },
      ]} />

      <Calendar T={T} days={days} calDay={calDay} setCalDay={setCalDay}
        render={(d, selected) => {
          const s = tileStyle(d, selected);
          return { background: s.background, border: s.border, boxShadow: s.boxShadow,
            content: s.check ? <span style={{ color: s.check, fontSize: 15, fontWeight: 700 }}>✓</span> : null };
        }} />

      {/* Day editor */}
      {calDay && (
        <div style={{ background: T.card, borderRadius: 16, padding: 16, border: `1px solid ${color}44`, marginBottom: 20 }}>
          <DayHeader T={T} color={color} dateKey={calDay} due={selDue}
            completed={selData?.completed === true} onClose={() => setCalDay(null)} />
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {activeGoal.types.map(t => (
              <CriterionCard key={t.typeId} T={T} t={t} cat={cat} goal={activeGoal}
                done={t.typeId in selEntries}
                loggedValue={selEntries[t.typeId]}
                onDone={(v) => writeEntry(activeGoal, calDay, t.typeId, v)}
                onRelog={() => clearEntry(activeGoal, calDay, t.typeId)} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

// ───────────────────────── ALL GOALS ─────────────────────────
function AllView({ T, cats, goals, logs, TODAY, calDay, setCalDay, writeEntry, clearEntry }) {
  const [expanded, setExpanded] = useState(null); // goalId being edited

  const best   = goals.reduce((m, g) => Math.max(m, computeStreak(g.id, g.freq, logs)), 0);
  const avgHit = Math.round(goals.reduce((s, g) => s + computeHitRate(g.id, g.freq, logs), 0) / goals.length);

  const days = build28().map(key => {
    let due = 0, done = 0;
    goals.forEach(g => {
      if (isGoalDueOn(g.freq, key)) due++;
      if ((logs[g.id] || {})[key]?.completed) done++;
    });
    return { key, due, done, isToday: key === TODAY };
  });

  const selected = calDay ? goals.map(g => ({
    goal: g, cat: getCat(cats, g.cat),
    due: isGoalDueOn(g.freq, calDay), data: (logs[g.id] || {})[calDay],
  })).filter(x => x.due || (x.data && Object.keys(x.data.entries || {}).length > 0)) : [];

  return (
    <>
      <StatsRow T={T} color={T.accent} stats={[
        { l: "Active", v: goals.length }, { l: "Best", v: `${best}d` }, { l: "Avg Hit", v: `${avgHit}%` },
      ]} />

      <Calendar T={T} days={days} calDay={calDay} setCalDay={setCalDay}
        legend="Brightness = % of goals completed"
        render={(d, selected) => {
          const ratio = d.due ? d.done / d.due : (d.done > 0 ? 1 : 0);
          const alpha = d.done === 0 ? 0 : Math.round(45 + ratio * 210); // 45–255 (high contrast)
          const hex = alpha === 0 ? "" : Math.min(255, alpha).toString(16).padStart(2, "0").toUpperCase();
          // Due-but-nothing-done reads darker than the card to contrast with completed days
          const background = d.done > 0 ? `${T.accent}${hex}` : (d.due ? T.bg : "transparent");
          const border = d.isToday ? `2px solid ${T.accent}`
            : `1px solid ${d.due || d.done ? T.border : "transparent"}`;
          return {
            background, border, boxShadow: selected ? `0 0 0 2px ${T.accent}` : "none",
            content: d.done > 0
              ? <span style={{ color: ratio > 0.45 ? T.bg : T.text, fontSize: 13, fontWeight: 700 }}>{d.done}</span>
              : null,
          };
        }} />

      {/* Day detail with per-goal editing */}
      {calDay && (
        <div style={{ background: T.card, borderRadius: 16, padding: 16, border: `1px solid ${T.accent}44`, marginBottom: 20 }}>
          <DayHeader T={T} color={T.accent} dateKey={calDay} onClose={() => { setCalDay(null); setExpanded(null); }} />
          {selected.length === 0 && <p style={{ color: T.sub, fontSize: 13 }}>No goals on this day.</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {selected.map(({ goal: g, cat: c, data }) => {
              const completed = data?.completed === true;
              const entries   = data?.entries || {};
              const isOpen    = expanded === g.id;
              return (
                <div key={g.id} style={{ background: T.surface, borderRadius: 12, border: `1px solid ${isOpen ? c.color : T.border}`, overflow: "hidden" }}>
                  <button onClick={() => setExpanded(isOpen ? null : g.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 8,
                    padding: "11px 13px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 15, fontWeight: 600, flex: 1 }}>{g.title}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px",
                      background: completed ? `${c.color}22` : "none",
                      border: `1px solid ${completed ? c.color : T.border}`,
                      color: completed ? c.color : T.sub,
                    }}>{completed ? "Complete" : "Incomplete"}</span>
                    <span style={{ color: T.sub, fontSize: 12 }}>{isOpen ? "▲" : "▼"}</span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: "0 13px 13px", display: "flex", flexDirection: "column", gap: 10 }}>
                      {g.types.map(t => (
                        <CriterionCard key={t.typeId} T={T} t={t} cat={c} goal={g}
                          done={t.typeId in entries}
                          loggedValue={entries[t.typeId]}
                          onDone={(v) => writeEntry(g, calDay, t.typeId, v)}
                          onRelog={() => clearEntry(g, calDay, t.typeId)} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

// ───────────────────────── SHARED PIECES ─────────────────────────
function StatsRow({ T, color, stats }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: T.card, borderRadius: 14, padding: "13px 10px", textAlign: "center", border: `1px solid ${T.border}` }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", color: i === 0 ? color : T.text, fontSize: 18, fontWeight: 700 }}>{s.v}</p>
          <p style={{ color: T.sub, fontSize: 10, marginTop: 2 }}>{s.l}</p>
        </div>
      ))}
    </div>
  );
}

function Calendar({ T, days, calDay, setCalDay, render, legend }) {
  const canClick = () => true; // any day is selectable (you can log on any date)
  return (
    <div style={{ background: T.card, borderRadius: 16, padding: 16, border: `1px solid ${T.border}`, marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>Last 28 Days</p>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 11, height: 11, borderRadius: 3, border: `2px solid ${T.accent}` }} />
          <span style={{ color: T.muted, fontSize: 10 }}>Today</span>
        </div>
      </div>
      {legend && <p style={{ color: T.muted, fontSize: 10, marginBottom: 10 }}>{legend}</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginTop: 8 }}>
        {"SMTWTFS".split("").map((d, i) => (
          <div key={i} style={{ textAlign: "center", color: T.muted, fontSize: 10, marginBottom: 2 }}>{d}</div>
        ))}
        {/* Leading blanks so dates line up under their weekday */}
        {Array.from({ length: new Date(days[0].key + "T12:00:00").getDay() }).map((_, i) => (
          <div key={`pad${i}`} />
        ))}
        {days.map((d) => {
          const selected = calDay === d.key;
          const r = render(d, selected);
          const click = canClick(d);
          return (
            <button key={d.key} onClick={() => click ? setCalDay(selected ? null : d.key) : null}
              style={{
                position: "relative", height: 46, borderRadius: 9, padding: 0, outline: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: click ? "pointer" : "default", transition: "transform .12s",
                transform: selected ? "scale(1.06)" : "scale(1)",
                background: r.background, border: r.border, boxShadow: r.boxShadow,
              }}>
              <span style={{ position: "absolute", top: 3, left: 5, fontSize: 9, color: T.muted, opacity: 0.8 }}>{dateNum(d.key)}</span>
              {r.content}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DayHeader({ T, color, dateKey, due, completed, onClose }) {
  const label = new Date(dateKey + "T12:00:00").toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
      <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 16, fontWeight: 600 }}>
        {label}{due === false && <span style={{ color: T.muted, fontSize: 11, fontWeight: 400 }}> · not scheduled</span>}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {completed !== undefined && (
          <span style={{
            fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 7px",
            background: completed ? `${color}22` : T.surface,
            border: `1px solid ${completed ? color : T.border}`,
            color: completed ? color : T.sub,
          }}>{completed ? "Complete" : "Incomplete"}</span>
        )}
        <button onClick={onClose} style={{ background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
      </div>
    </div>
  );
}
