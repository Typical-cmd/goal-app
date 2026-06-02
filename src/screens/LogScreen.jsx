import { useState } from "react";
import { getCat, freqLabel, todayKey, computeStreak, isGoalDueOn, criterionMet, requiredMet } from "../logic/goals.js";
import CriterionCard from "../components/CriterionCard.jsx";

export default function LogScreen({ T, cats, goal, goals, setGoals, logs, setLogs, onEdit }) {
  const cat        = getCat(cats, goal.cat);
  const color      = cat.color || "#666666";
  const today      = todayKey();
  const isDueToday = isGoalDueOn(goal.freq, today);

  // Prefill from anything already logged today, so re-opening shows it
  const [logState, setLogState] = useState(() => logs[goal.id]?.[today]?.entries || {});

  const reqTypes  = goal.types.filter(t => t.req);
  const optTypes  = goal.types.filter(t => !t.req);
  const metReq    = reqTypes.filter(t => criterionMet(goal, t.typeId, logState[t.typeId])).length;
  const allMet    = reqTypes.length > 0 && metReq === reqTypes.length;

  // Persist entries + auto-derive completion + recompute streak
  const persist = (entries) => {
    const completed = requiredMet(goal, entries);
    const newLogs = {
      ...logs,
      [goal.id]: {
        ...(logs[goal.id] || {}),
        [today]: { ...((logs[goal.id] || {})[today] || {}), entries, completed },
      },
    };
    setLogs(newLogs);
    const newStreak = computeStreak(goal.id, goal.freq, newLogs);
    setGoals(goals.map(g => g.id === goal.id ? { ...g, streak: newStreak } : g));
  };

  const markDone = (id, value) => {
    const entries = { ...logState, [id]: value };
    setLogState(entries);
    persist(entries);
  };

  const relogType = (id) => {
    const entries = { ...logState };
    delete entries[id];
    setLogState(entries);
    persist(entries);
  };

  return (
    <div className="fade" style={{ padding: "20px 20px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", gap: 13, alignItems: "flex-start", marginBottom: 20 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 15, background: `${color}18`,
          border: `1px solid ${color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color, fontSize: 20 }}>{cat.icon}</span>
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 26, fontWeight: 700 }}>{goal.title}</h1>
          <p style={{ color: T.sub, fontSize: 13 }}>
            {cat.label} · 🔥 {goal.streak}d streak · {freqLabel(goal.freq)}
          </p>
        </div>
        <button onClick={onEdit} className="press" style={{
          background: "none", border: `1px solid ${T.border}`, borderRadius: 10,
          padding: "6px 12px", color: T.sub, fontSize: 12, cursor: "pointer",
        }}>Edit</button>
      </div>

      {/* Not-due notice */}
      {!isDueToday && (
        <div style={{
          background: `${T.accent}12`, border: `1px solid ${T.accent}44`,
          borderRadius: 12, padding: "10px 14px", marginBottom: 16,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{ fontSize: 14 }}>📅</span>
          <span style={{ color: T.sub, fontSize: 12, lineHeight: 1.4 }}>
            This goal isn't scheduled for today — you're logging it early. It will still be recorded.
          </span>
        </div>
      )}

      {/* Progress bar */}
      {reqTypes.length > 0 && (
        <div style={{
          background: T.card, borderRadius: 13, padding: "12px 16px",
          border: `1px solid ${T.border}`, marginBottom: 16,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <span style={{ color: T.sub, fontSize: 12 }}>Required Criteria Met</span>
            <span style={{ color: allMet ? T.green : color, fontSize: 12, fontWeight: 600 }}>
              {metReq} / {reqTypes.length}
            </span>
          </div>
          <div style={{ background: T.surface, borderRadius: 4, height: 5 }}>
            <div style={{
              width: `${(metReq / reqTypes.length) * 100}%`, height: "100%",
              borderRadius: 4, background: allMet ? T.green : color, transition: "all .4s",
            }} />
          </div>
        </div>
      )}

      {/* Required criteria */}
      {reqTypes.length > 0 && (
        <>
          <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Required</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {reqTypes.map(t => (
              <CriterionCard key={t.typeId} T={T} t={t} cat={cat}
                done={t.typeId in logState}
                loggedValue={logState[t.typeId]}
                onDone={(v) => markDone(t.typeId, v)}
                onRelog={() => relogType(t.typeId)}
                goal={goal} />
            ))}
          </div>
        </>
      )}

      {/* Optional criteria */}
      {optTypes.length > 0 && (
        <>
          <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>Optional</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
            {optTypes.map(t => (
              <CriterionCard key={t.typeId} T={T} t={t} cat={cat}
                done={t.typeId in logState}
                loggedValue={logState[t.typeId]}
                onDone={(v) => markDone(t.typeId, v)}
                onRelog={() => relogType(t.typeId)}
                goal={goal} />
            ))}
          </div>
        </>
      )}

      {/* Auto-derived completion status — a message, not a button */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        padding: "16px 0 24px", borderTop: `1px solid ${T.border}`, marginTop: 4,
        color: allMet ? T.green : T.sub, fontSize: 13, fontWeight: 500, textAlign: "center",
      }}>
        {allMet ? (
          <>
            <span style={{ fontSize: 15 }}>✓</span>
            Goal complete for today
          </>
        ) : reqTypes.length > 0 ? (
          `${reqTypes.length - metReq} required ${reqTypes.length - metReq === 1 ? "criterion" : "criteria"} left to meet`
        ) : (
          "This goal has no required criteria"
        )}
      </div>
    </div>
  );
}
