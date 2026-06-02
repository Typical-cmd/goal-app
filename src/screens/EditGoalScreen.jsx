import { useState } from "react";
import { ALL_TYPES } from "../data/constants.js";
import { getCat, cycleType, getType } from "../logic/goals.js";
import Btn from "../components/Btn.jsx";
import BackBtn from "../components/BackBtn.jsx";

const SKIP_KEY = "ga.skipDeleteConfirm";

export default function EditGoalScreen({ T, cats, goal, onSave, onDelete, onBack }) {
  const [g, setG] = useState({ ...goal });
  const [mode, setMode] = useState(
    g.freq?.mode === "days"  ? "days"  :
    g.freq?.mode === "dates" ? "dates" : "simple"
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [skipNext,    setSkipNext]    = useState(false);

  const cat   = getCat(cats, g.cat);
  const color = cat.color || T.accent;
  const DAYS  = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const toggleDay  = (d) => {
    const days = g.freq.days || [];
    setG({ ...g, freq: { ...g.freq, mode: "days", days: days.includes(d) ? days.filter(x => x !== d) : [...days, d] } });
  };
  const toggleDate = (n) => {
    const dates = g.freq.dates || [];
    setG({ ...g, freq: { ...g.freq, mode: "dates", dates: dates.includes(n) ? dates.filter(x => x !== n) : [...dates, n].sort((a,b) => a-b) } });
  };
  const setSimple  = (v) => setG({ ...g, freq: { mode: "simple", val: v } });
  const switchMode = (m) => { setMode(m); if (m === "simple") setG({ ...g, freq: { mode: "simple", val: "Daily" } }); };

  const hasTimer     = g.types.some(t => t.typeId === "timer");
  const hasNumber    = g.types.some(t => t.typeId === "number");
  const hasScale     = g.types.some(t => t.typeId === "scale");
  const scaleInvalid = hasScale && (g.scaleMin ?? 1) >= (g.scaleMax ?? 10);
  const canSave      = g.title.trim() && g.cat && g.types.length > 0 && !scaleInvalid;

  const handleDeleteClick = () => {
    const skipUntil = parseInt(localStorage.getItem(SKIP_KEY) || "0");
    if (Date.now() < skipUntil) { onDelete(); return; }
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (skipNext) localStorage.setItem(SKIP_KEY, String(Date.now() + 30 * 60 * 1000));
    onDelete();
  };

  return (
    <div className="fade" style={{ padding: "20px 20px 0" }}>
      <BackBtn T={T} onClick={onBack} />
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 30, fontWeight: 700, marginBottom: 20 }}>Edit Goal</h1>

      {/* Title */}
      <p style={{ color: T.sub, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Title</p>
      <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}`, marginBottom: 22 }}>
        <input value={g.title} onChange={(e) => setG({ ...g, title: e.target.value })}
          placeholder="Goal title..."
          style={{
            width: "100%", background: "none", border: "none", outline: "none",
            fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 20, fontWeight: 600,
          }} />
      </div>

      {/* Category */}
      <p style={{ color: T.sub, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Category</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 22 }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => setG({ ...g, cat: c.id })} style={{
            background: g.cat === c.id ? `${c.color}20` : T.card,
            border: `1px solid ${g.cat === c.id ? c.color : T.border}`,
            borderRadius: 12, padding: "12px 14px", cursor: "pointer",
            color: g.cat === c.id ? c.color : T.sub,
            fontSize: 13, fontWeight: 500, textAlign: "left",
            display: "flex", alignItems: "center", gap: 8, transition: "all .2s",
          }}>
            <span>{c.icon}</span>{c.label}
          </button>
        ))}
      </div>

      {/* Tracking types — colors match current category */}
      <p style={{ color: T.sub, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Tracking Criteria</p>
      <p style={{ color: T.sub, fontSize: 12, marginBottom: 12 }}>Tap once = Required · Tap again = Optional · Tap again to remove</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
        {ALL_TYPES.map(t => {
          const sel   = g.types.find(s => s.typeId === t.id);
          const isReq = sel?.req === true;
          return (
            <button key={t.id} onClick={() => setG(cycleType(g, t.id))} style={{
              background: sel ? `${color}${isReq ? "22" : "11"}` : T.card,
              border: `2px solid ${sel ? (isReq ? color : `${color}55`) : T.border}`,
              borderRadius: 14, padding: "12px 14px", cursor: "pointer",
              textAlign: "left", display: "flex", alignItems: "center", gap: 13, transition: "all .2s",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                background: `${color}${sel ? "30" : "18"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: sel ? color : `${color}77`, fontSize: 15 }}>{t.icon}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond',serif",
                  color: sel ? (isReq ? color : `${color}AA`) : T.sub,
                  fontSize: 16, fontWeight: 600,
                }}>{t.label}</p>
                <p style={{ color: T.sub, fontSize: 11, marginTop: 2, opacity: sel ? 1 : 0.7 }}>{t.desc}</p>
              </div>
              {sel && (
                <div style={{
                  background: isReq ? color : `${color}25`,
                  border: isReq ? "none" : `1px solid ${color}55`,
                  borderRadius: 7, padding: "3px 9px",
                  color: isReq ? T.bg : color, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                }}>{isReq ? "REQ" : "OPT"}</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Timer settings */}
      {hasTimer && <TimerTargetSection T={T} g={g} set={setG} />}

      {/* Number settings */}
      {hasNumber && <NumberTargetSection T={T} g={g} set={setG} />}

      {/* Scale settings */}
      {hasScale && <ScaleRangeSection T={T} g={g} set={setG} />}

      {/* Schedule */}
      <p style={{ color: T.sub, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Schedule</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
        {[{ id: "simple", l: "Simple" }, { id: "days", l: "By Day" }, { id: "dates", l: "By Date" }].map(m => (
          <button key={m.id} onClick={() => switchMode(m.id)} style={{
            background: mode === m.id ? T.accent : T.card,
            border: `1px solid ${mode === m.id ? T.accent : T.border}`,
            borderRadius: 12, padding: "10px 0", cursor: "pointer",
            color: mode === m.id ? T.bg : T.sub, fontSize: 12, fontWeight: 500, transition: "all .2s",
          }}>{m.l}</button>
        ))}
      </div>

      {mode === "simple" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 22 }}>
          {["Daily","Weekdays","Weekends","Weekly","Monthly"].map(f => (
            <button key={f} onClick={() => setSimple(f)} style={{
              background: g.freq.val === f && g.freq.mode === "simple" ? `${T.accent}22` : T.card,
              border: `1px solid ${g.freq.val === f && g.freq.mode === "simple" ? T.accent : T.border}`,
              borderRadius: 12, padding: "12px 0", cursor: "pointer",
              color: g.freq.val === f && g.freq.mode === "simple" ? T.accent : T.sub,
              fontSize: 13, fontWeight: 500, transition: "all .2s",
            }}>{f}</button>
          ))}
        </div>
      )}

      {mode === "days" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 22 }}>
          {DAYS.map(d => {
            const sel = g.freq.days?.includes(d);
            return (
              <button key={d} onClick={() => toggleDay(d)} style={{
                padding: "10px 0", borderRadius: 10, cursor: "pointer",
                background: sel ? `${T.accent}22` : T.card,
                border: `1px solid ${sel ? T.accent : T.border}`,
                color: sel ? T.accent : T.sub, fontSize: 10, fontWeight: 500, transition: "all .2s",
              }}>{d.slice(0,2)}</button>
            );
          })}
        </div>
      )}

      {mode === "dates" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 22 }}>
          {Array.from({ length: 31 }, (_, i) => i + 1).map(n => {
            const sel = g.freq.dates?.includes(n);
            return (
              <button key={n} onClick={() => toggleDate(n)} style={{
                padding: "8px 0", borderRadius: 8, cursor: "pointer",
                background: sel ? `${T.accent}22` : T.card,
                border: `1px solid ${sel ? T.accent : T.border}`,
                color: sel ? T.accent : T.sub, fontSize: 11, transition: "all .2s",
              }}>{n}</button>
            );
          })}
        </div>
      )}

      <Btn T={T} label="Save Changes ✓" disabled={!canSave} onClick={() => onSave(g)} />

      {/* Delete */}
      {!showConfirm ? (
        <button onClick={handleDeleteClick} className="press" style={{
          width: "100%", marginTop: 12, marginBottom: 24, padding: 15, borderRadius: 14,
          border: "1px solid #E84B4B44", background: "#E84B4B10",
          color: "#E84B4B", fontSize: 15, fontWeight: 600, cursor: "pointer",
        }}>Delete Goal</button>
      ) : (
        <div style={{
          marginTop: 12, marginBottom: 24, background: "#E84B4B0D",
          border: "1px solid #E84B4B44", borderRadius: 14, padding: 18,
        }}>
          <p style={{ color: T.text, fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Delete "{g.title}"?</p>
          <p style={{ color: T.sub, fontSize: 13, marginBottom: 16 }}>This cannot be undone. All logged history will also be removed.</p>
          <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, cursor: "pointer" }}>
            <input type="checkbox" checked={skipNext} onChange={(e) => setSkipNext(e.target.checked)}
              style={{ width: 16, height: 16, accentColor: "#E84B4B", cursor: "pointer" }} />
            <span style={{ color: T.sub, fontSize: 13 }}>Don't ask again for 30 minutes</span>
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={confirmDelete} className="press" style={{
              flex: 1, padding: 13, borderRadius: 12, border: "none",
              background: "#E84B4B", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}>Yes, Delete</button>
            <button onClick={() => { setShowConfirm(false); setSkipNext(false); }} className="press" style={{
              flex: 1, padding: 13, borderRadius: 12, border: `1px solid ${T.border}`,
              background: T.card, color: T.sub, fontSize: 14, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

function TimerTargetSection({ T, g, set }) {
  const tt = g.timerTarget || { amount: "", unit: "min" };
  const upd = (p) => set({ ...g, timerTarget: { ...tt, ...p } });
  return (
    <>
      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Timer Target</p>
      <div style={{ background: T.card, borderRadius: 13, padding: 14, border: `1px solid ${T.border}`, marginBottom: 22 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input type="number" min="0" value={tt.amount} onChange={(e) => upd({ amount: e.target.value })}
            placeholder="0"
            style={{
              flex: 1, background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 15, outline: "none",
            }} />
          <div style={{ display: "flex", gap: 6 }}>
            {["sec","min","hr"].map(u => (
              <button key={u} onClick={() => upd({ unit: u })} style={{
                padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                background: tt.unit === u ? `${T.accent}22` : T.surface,
                border: `1px solid ${tt.unit === u ? T.accent : T.border}`,
                color: tt.unit === u ? T.accent : T.sub, fontSize: 12, fontWeight: 500,
              }}>{u}</button>
            ))}
          </div>
        </div>
        <p style={{ color: T.muted, fontSize: 11, marginTop: 8 }}>Timer will highlight when this target is reached.</p>
      </div>
    </>
  );
}

function NumberTargetSection({ T, g, set }) {
  return (
    <>
      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Number Target</p>
      <div style={{ background: T.card, borderRadius: 13, padding: 14, border: `1px solid ${T.border}`, marginBottom: 22 }}>
        <p style={{ color: T.sub, fontSize: 11, marginBottom: 8 }}>Label (e.g. miles, oz, steps)</p>
        <input value={g.unit || ""} onChange={(e) => set({ ...g, unit: e.target.value })}
          placeholder="oz, miles, steps..."
          style={{
            width: "100%", background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 14,
            outline: "none", marginBottom: 12,
          }} />
        <p style={{ color: T.sub, fontSize: 11, marginBottom: 8 }}>Goal amount</p>
        <input type="number" min="0" value={g.targetAmount || ""}
          onChange={(e) => set({ ...g, targetAmount: e.target.value })}
          placeholder="e.g. 10000"
          style={{
            width: "100%", background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 14, outline: "none",
          }} />
        <p style={{ color: T.muted, fontSize: 11, marginTop: 8 }}>Card will highlight when goal amount is reached.</p>
      </div>
    </>
  );
}

function ScaleRangeSection({ T, g, set }) {
  const min     = g.scaleMin ?? 1;
  const max     = g.scaleMax ?? 10;
  const invalid = Number.isFinite(min) && Number.isFinite(max) && min >= max;
  return (
    <>
      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Scale Range</p>
      <div style={{
        background: T.card, borderRadius: 13, padding: 14, marginBottom: 22,
        border: `1px solid ${invalid ? "#E84B4B" : T.border}`,
      }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <p style={{ color: T.sub, fontSize: 11, marginBottom: 6 }}>Minimum</p>
            <input type="number" value={min}
              onChange={(e) => set({ ...g, scaleMin: parseInt(e.target.value) })}
              style={{
                width: "100%", background: T.surface,
                border: `1px solid ${invalid ? "#E84B4B" : T.border}`,
                borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 15, outline: "none",
              }} />
          </div>
          <span style={{ color: T.sub, fontSize: 18, marginTop: 16 }}>–</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: T.sub, fontSize: 11, marginBottom: 6 }}>Maximum</p>
            <input type="number" value={max}
              onChange={(e) => set({ ...g, scaleMax: parseInt(e.target.value) })}
              style={{
                width: "100%", background: T.surface,
                border: `1px solid ${invalid ? "#E84B4B" : T.border}`,
                borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 15, outline: "none",
              }} />
          </div>
        </div>
        {invalid && (
          <p style={{ color: "#E84B4B", fontSize: 12, marginTop: 8 }}>
            Maximum must be greater than minimum.
          </p>
        )}
      </div>
    </>
  );
}
