import { useState } from "react";
import { ALL_TYPES, CAT_COLORS, CAT_ICONS } from "../data/constants.js";
import { getCat, getType, cycleType } from "../logic/goals.js";
import Btn from "../components/Btn.jsx";
import BackBtn from "../components/BackBtn.jsx";

export default function CreateScreen({ T, cats, setCats, step, setStep, nGoal, setNGoal, onDone }) {
  return (
    <div className="fade" style={{ padding: "20px 20px 0" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 26 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: s <= step ? T.accent : T.border, transition: "all .3s",
          }} />
        ))}
      </div>

      {step === 1 && <Step1 T={T} cats={cats} setCats={setCats} g={nGoal} set={setNGoal} onNext={() => setStep(2)} />}
      {step === 2 && <Step2 T={T} cats={cats} g={nGoal} set={setNGoal} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <Step3 T={T} cats={cats} g={nGoal} set={setNGoal} onDone={onDone} onBack={() => setStep(2)} />}
    </div>
  );
}

function Step1({ T, cats, setCats, g, set, onNext }) {
  const [adding, setAdding] = useState(false);
  const [newCat, setNewCat] = useState({ label: "", color: CAT_COLORS[0], icon: CAT_ICONS[0] });

  const addCategory = () => {
    if (!newCat.label.trim()) return;
    const id = `cat_${Date.now()}`;
    setCats([...cats, { ...newCat, label: newCat.label.trim(), id }]);
    set({ ...g, cat: id });           // auto-select the new category
    setNewCat({ label: "", color: CAT_COLORS[0], icon: CAT_ICONS[0] });
    setAdding(false);
  };

  return (
    <div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 30, fontWeight: 700, marginBottom: 6 }}>Name your goal</h1>
      <p style={{ color: T.sub, fontSize: 14, marginBottom: 20 }}>What do you want to pursue?</p>

      <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        <input value={g.title} onChange={(e) => set({ ...g, title: e.target.value })}
          placeholder="e.g. Morning meditation, Daily run..."
          style={{
            width: "100%", background: "none", border: "none", outline: "none",
            fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 20, fontWeight: 600,
          }} />
      </div>

      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Category</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 12 }}>
        {cats.map(c => (
          <button key={c.id} onClick={() => set({ ...g, cat: c.id })} style={{
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

      {/* Add new category */}
      {adding ? (
        <div style={{ background: T.card, borderRadius: 14, padding: 14, border: `1px solid ${newCat.color}44`, marginBottom: 26 }}>
          <input value={newCat.label} onChange={(e) => setNewCat({ ...newCat, label: e.target.value })}
            placeholder="Category name..."
            style={{
              width: "100%", background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 14,
              outline: "none", marginBottom: 12,
            }} />
          <p style={{ color: T.sub, fontSize: 10, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Color</p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
            {CAT_COLORS.map(cl => (
              <button key={cl} onClick={() => setNewCat({ ...newCat, color: cl })} style={{
                width: 28, height: 28, borderRadius: 8, background: cl, border: "none", cursor: "pointer",
                outline: newCat.color === cl ? "2px solid #fff" : "none",
                boxShadow: newCat.color === cl ? `0 0 8px ${cl}88` : "none",
              }} />
            ))}
          </div>
          <p style={{ color: T.sub, fontSize: 10, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Icon</p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 14 }}>
            {CAT_ICONS.map(ic => (
              <button key={ic} onClick={() => setNewCat({ ...newCat, icon: ic })} style={{
                width: 32, height: 32, borderRadius: 8,
                background: newCat.icon === ic ? `${newCat.color}30` : T.surface,
                border: `1px solid ${newCat.icon === ic ? newCat.color : T.border}`,
                color: newCat.icon === ic ? newCat.color : T.sub, fontSize: 15, cursor: "pointer",
              }}>{ic}</button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addCategory} style={{
              flex: 1, padding: 11, borderRadius: 11, border: "none",
              background: newCat.label.trim() ? T.accent : T.muted, color: T.bg,
              fontSize: 13, fontWeight: 600, cursor: newCat.label.trim() ? "pointer" : "default",
            }}>Add Category</button>
            <button onClick={() => setAdding(false)} style={{
              padding: "11px 16px", borderRadius: 11, border: `1px solid ${T.border}`,
              background: "none", color: T.sub, fontSize: 13, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          width: "100%", padding: 12, borderRadius: 12, marginBottom: 26,
          background: "none", border: `1px dashed ${T.border}`,
          color: T.sub, fontSize: 13, cursor: "pointer",
        }}>+ New Category</button>
      )}

      <Btn T={T} label="Continue →" disabled={!g.title || !g.cat} onClick={onNext} />
    </div>
  );
}

function Step2({ T, cats, g, set, onNext, onBack }) {
  const cat   = getCat(cats, g.cat);
  const color = cat.color || T.accent;

  return (
    <div>
      <BackBtn T={T} onClick={onBack} />
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 30, fontWeight: 700, marginBottom: 4 }}>Tracking Criteria</h1>
      <p style={{ color: T.sub, fontSize: 13, marginBottom: 12 }}>
        Tap once = Required · Tap again = Optional · Tap again to remove
      </p>

      <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
        {[{ c: color, l: "Required" }, { c: color + "60", l: "Optional" }].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: x.c }} />
            <span style={{ color: T.sub, fontSize: 11 }}>{x.l}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 22 }}>
        {ALL_TYPES.map(t => {
          const sel   = g.types.find(s => s.typeId === t.id);
          const isReq = sel?.req === true;
          return (
            <button key={t.id} onClick={() => set(cycleType(g, t.id))} style={{
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

      <Btn T={T} disabled={!g.types.length} onClick={onNext}
        label={g.types.length ? `Continue — ${g.types.length} selected →` : "Select at least one"} />
    </div>
  );
}

function Step3({ T, cats, g, set, onDone, onBack }) {
  const cat = getCat(cats, g.cat);
  const [mode, setMode] = useState(g.freq.mode === "daily" ? "simple" : (g.freq.mode || "simple"));
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const toggleDay  = (d) => {
    const days = g.freq.days || [];
    set({ ...g, freq: { ...g.freq, mode: "days", days: days.includes(d) ? days.filter(x => x !== d) : [...days, d] } });
  };
  const toggleDate = (n) => {
    const dates = g.freq.dates || [];
    set({ ...g, freq: { ...g.freq, mode: "dates", dates: dates.includes(n) ? dates.filter(x => x !== n) : [...dates, n].sort((a,b) => a-b) } });
  };
  const setSimple  = (v) => set({ ...g, freq: { mode: "simple", val: v } });
  const switchMode = (m) => { setMode(m); if (m === "simple") set({ ...g, freq: { mode: "simple", val: "Daily" } }); };

  const hasTimer    = g.types.some(t => t.typeId === "timer");
  const hasNumber   = g.types.some(t => t.typeId === "number");
  const hasScale    = g.types.some(t => t.typeId === "scale");
  const scaleInvalid = hasScale && (g.scaleMin ?? 1) >= (g.scaleMax ?? 10);

  return (
    <div>
      <BackBtn T={T} onClick={onBack} />
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 30, fontWeight: 700, marginBottom: 6 }}>Frequency & Target</h1>
      <p style={{ color: T.sub, fontSize: 14, marginBottom: 18 }}>When do you want to do this?</p>

      <div style={{ background: T.card, borderRadius: 13, padding: 13, border: `1px solid ${cat.color}44`, marginBottom: 20 }}>
        <p style={{ color: T.sub, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>{g.title}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {g.types.map(t => {
            const ty = getType(t.typeId);
            return (
              <span key={t.typeId} style={{
                background: `${cat.color}${t.req ? "22" : "11"}`,
                border: `1px solid ${cat.color}${t.req ? "66" : "33"}`,
                borderRadius: 7, padding: "3px 10px",
                color: `${cat.color}${t.req ? "" : "AA"}`, fontSize: 11,
              }}>{ty.icon} {ty.label}{!t.req ? " (opt)" : ""}</span>
            );
          })}
        </div>
      </div>

      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Schedule</p>
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 20 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 20 }}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 20 }}>
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

      {/* Timer settings */}
      {hasTimer && <TimerTargetSection T={T} g={g} set={set} />}

      {/* Number settings */}
      {hasNumber && <NumberTargetSection T={T} g={g} set={set} />}

      {/* Scale settings */}
      {hasScale && <ScaleRangeSection T={T} g={g} set={set} />}

      <Btn T={T} label="Create Goal ✓" disabled={scaleInvalid} onClick={onDone} />
    </div>
  );
}

function TimerTargetSection({ T, g, set }) {
  const tt = g.timerTarget || { amount: "", unit: "min" };
  const upd = (p) => set({ ...g, timerTarget: { ...tt, ...p } });
  return (
    <>
      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Timer Target</p>
      <div style={{ background: T.card, borderRadius: 13, padding: 14, border: `1px solid ${T.border}`, marginBottom: 20 }}>
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
      <div style={{ background: T.card, borderRadius: 13, padding: 14, border: `1px solid ${T.border}`, marginBottom: 20 }}>
        <p style={{ color: T.sub, fontSize: 11, marginBottom: 8 }}>Label (e.g. miles, oz, steps)</p>
        <input value={g.unit || ""} onChange={(e) => set({ ...g, unit: e.target.value })}
          placeholder="oz, miles, steps..."
          style={{
            width: "100%", background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 14,
            outline: "none", marginBottom: 12,
          }} />
        <p style={{ color: T.sub, fontSize: 11, marginBottom: 8 }}>Goal amount</p>
        <input type="number" min="0" value={g.targetAmount || ""} onChange={(e) => set({ ...g, targetAmount: e.target.value })}
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
        background: T.card, borderRadius: 13, padding: 14, marginBottom: 20,
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
