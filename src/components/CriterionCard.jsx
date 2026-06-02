import { useState, useEffect, useRef } from "react";
import { getType, fmtCsClock, formatLogValue } from "../logic/goals.js";

// Each CHARACTER sits in its own fixed-width cell, so digits never shift
// (no shake) and never overlap. Only show HH when >= 1 hour.
function TimerDisplay({ cs, color }) {
  const h  = Math.floor(cs / 360000);
  const m  = Math.floor((cs % 360000) / 6000);
  const s  = Math.floor((cs % 6000) / 100);
  const cc = cs % 100;
  const p2 = (n) => String(n).padStart(2, "0");

  // Main part (HH:MM:SS) at full size; fractional (.cc) smaller
  const main = [];
  if (h > 0) { String(h).split("").forEach(c => main.push(c)); main.push(":"); }
  p2(m).split("").forEach(c => main.push(c)); main.push(":");
  p2(s).split("").forEach(c => main.push(c));
  const frac = ("." + p2(cc)).split("");

  const cell = (ch, key, small) => {
    const sep = ch === ":" || ch === ".";
    return (
      <span key={key} style={{
        display: "inline-block", textAlign: "center",
        width: sep ? (small ? "0.30em" : "0.34em") : (small ? "0.62em" : "0.64em"),
        fontFamily: "'DM Sans', sans-serif", fontVariantNumeric: "tabular-nums",
        fontSize: small ? 22 : 32, fontWeight: 700, color, lineHeight: 1,
      }}>{ch}</span>
    );
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "baseline", justifyContent: "center" }}>
      {main.map((c, i) => cell(c, "m" + i, false))}
      {frac.map((c, i) => cell(c, "f" + i, true))}
    </div>
  );
}

export default function CriterionCard({ T, t, cat, done, loggedValue, onDone, onRelog, goal }) {
  const type  = getType(t.typeId);
  const color = cat?.color || "#666666";

  const [scale,  setScale]  = useState(goal.scaleMin ?? 1);
  const [numV,   setNumV]   = useState("");
  const [text,   setText]   = useState("");
  const [yn,     setYn]     = useState(null);

  // Timer
  const [cs,         setCs]         = useState(0);
  const [run,        setRun]        = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [mh,   setMh]   = useState("");
  const [mmin, setMmin] = useState("");
  const [ms2,  setMs2]  = useState("");
  const startRef = useRef(null);
  const accRef   = useRef(0);
  const ivRef    = useRef(null);

  useEffect(() => {
    if (run) {
      startRef.current = Date.now();
      ivRef.current = setInterval(() => {
        setCs(accRef.current + Math.floor((Date.now() - startRef.current) / 10));
      }, 50);
    } else {
      clearInterval(ivRef.current);
      if (startRef.current !== null) {
        accRef.current += Math.floor((Date.now() - startRef.current) / 10);
        startRef.current = null;
      }
    }
    return () => clearInterval(ivRef.current);
  }, [run]);

  const resetTimer = () => {
    setRun(false);
    clearInterval(ivRef.current);
    accRef.current = 0;
    startRef.current = null;
    setCs(0);
  };

  const applyManual = () => {
    const h = Math.max(0, parseInt(mh   || "0") || 0);
    const m = Math.max(0, parseInt(mmin || "0") || 0);
    const s = Math.max(0, parseInt(ms2  || "0") || 0);
    const total = (h * 3600 + m * 60 + s) * 100;
    accRef.current = total;
    setCs(total);
    setRun(false);
    setManualMode(false);
  };

  // Timer target in centiseconds
  const tt = goal.timerTarget;
  const timerTargetCs = tt && tt.amount
    ? parseFloat(tt.amount) * (tt.unit === "hr" ? 360000 : tt.unit === "min" ? 6000 : 100)
    : null;
  const timerMet = timerTargetCs !== null && cs >= timerTargetCs;

  // Number target
  const numTarget   = goal.targetAmount ? parseFloat(goal.targetAmount) : null;
  const numMet      = numTarget !== null && parseFloat(numV) >= numTarget;

  // Scale range
  const scaleMin = goal.scaleMin ?? 1;
  const scaleMax = goal.scaleMax ?? 10;

  const border = done ? `${color}CC` : t.req ? `${color}CC` : `${color}55`;

  return (
    <div style={{
      background: done ? `${color}15` : `${color}${t.req ? "10" : "08"}`,
      borderRadius: 16, padding: 16, border: `1.5px solid ${border}`,
      opacity: (!t.req && !done) ? 0.88 : 1, transition: "all .2s",
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: done ? 0 : 14 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9, background: `${color}22`,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: done ? T.green : color, fontSize: 13 }}>
            {done ? "✓" : type.icon}
          </span>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 16, fontWeight: 600, flex: 1 }}>
          {type.label}
        </p>
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
          color:      t.req ? color    : `${color}77`,
          background: t.req ? `${color}20` : `${color}10`,
          border:     `1px solid ${t.req ? color : `${color}44`}`,
          borderRadius: 6, padding: "2px 8px",
        }}>{t.req ? "REQ" : "OPT"}</span>
      </div>

      {/* Done state */}
      {done && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ color: T.green, fontSize: 12 }}>
            ✓ {formatLogValue(t.typeId, loggedValue, goal.unit)}
          </p>
          <button onClick={onRelog} className="press" style={{
            background: "none", border: `1px solid ${color}44`,
            borderRadius: 8, padding: "3px 10px", color: color, fontSize: 11, cursor: "pointer",
          }}>Edit</button>
        </div>
      )}

      {/* Input state */}
      {!done && (
        <>
          {t.typeId === "yesno" && (
            <div style={{ display: "flex", gap: 8 }}>
              {[{ v: true, l: "✓  Done" }, { v: false, l: "✗  Skip" }].map(({ v, l }) => (
                <button key={String(v)} onClick={() => { setYn(v); onDone(v); }} className="press" style={{
                  flex: 1, padding: "11px 0", borderRadius: 10, cursor: "pointer",
                  background: yn === v ? (v ? `${T.green}20` : `${T.red}15`) : T.surface,
                  border: `1.5px solid ${yn === v ? (v ? T.green : T.red) : T.border}`,
                  color: yn === v ? (v ? T.green : T.red) : T.sub,
                  fontSize: 15, transition: "all .2s",
                }}>{l}</button>
              ))}
            </div>
          )}

          {t.typeId === "scale" && (
            <div>
              <div style={{ textAlign: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", color, fontSize: 40, fontWeight: 700 }}>{scale}</span>
                <span style={{ color: T.sub, fontSize: 15 }}>/{scaleMax}</span>
              </div>
              <input type="range" min={scaleMin} max={scaleMax} value={scale}
                onChange={(e) => setScale(+e.target.value)}
                style={{ width: "100%", accentColor: color, marginBottom: 10 }} />
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ color: T.muted, fontSize: 11 }}>{scaleMin}</span>
                <span style={{ color: T.muted, fontSize: 11 }}>{scaleMax}</span>
              </div>
              <button onClick={() => onDone(scale)} className="press" style={{
                width: "100%", padding: 11, borderRadius: 10, border: "none",
                background: color, color: T.bg, fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>Log {scale}/{scaleMax}</button>
            </div>
          )}

          {t.typeId === "timer" && (
            <div>
              {manualMode ? (
                <div>
                  <p style={{ color: T.sub, fontSize: 11, marginBottom: 10, textAlign: "center" }}>Enter time manually</p>
                  <div style={{ display: "flex", gap: 6, justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
                    {[
                      { val: mh,   set: setMh,   ph: "HH" },
                      { val: mmin, set: setMmin,  ph: "MM" },
                      { val: ms2,  set: setMs2,   ph: "SS" },
                    ].map(({ val, set, ph }, i) => (
                      <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <input type="number" min="0" placeholder={ph} value={val}
                          onChange={(e) => set(e.target.value)}
                          style={{
                            width: 54, background: T.surface, border: `1px solid ${T.border}`,
                            borderRadius: 8, padding: "8px 6px", color: T.text,
                            fontFamily: "'DM Sans', sans-serif", fontSize: 20,
                            textAlign: "center", outline: "none",
                          }} />
                        {i < 2 && <span style={{ color: T.sub, fontSize: 18 }}>:</span>}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={applyManual} className="press" style={{
                      flex: 1, padding: 10, borderRadius: 10, border: "none",
                      background: color, color: T.bg, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>Set Time</button>
                    <button onClick={() => setManualMode(false)} className="press" style={{
                      padding: "10px 14px", borderRadius: 10, border: `1px solid ${T.border}`,
                      background: T.surface, color: T.sub, fontSize: 13, cursor: "pointer",
                    }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: "center" }}>
                  {/* Fixed-width timer display — tabular nums prevents layout shift */}
                  <div style={{
                    display: "inline-block", textAlign: "center",
                    background: timerMet ? `${T.green}12` : `${color}10`,
                    borderRadius: 12, padding: "10px 20px", marginBottom: 10,
                    border: `1px solid ${timerMet ? T.green : `${color}33`}`,
                    transition: "background .4s, border-color .4s",
                  }}>
                    <TimerDisplay cs={cs} color={timerMet ? T.green : color} />
                    {timerTargetCs !== null && (
                      <span style={{ color: timerMet ? T.green : T.sub, fontSize: 11, display: "block", marginTop: 2 }}>
                        {timerMet ? "✓ Target reached!" : `Target: ${fmtCsClock(timerTargetCs)}`}
                      </span>
                    )}
                  </div>

                  {/* Timer target progress bar */}
                  {timerTargetCs !== null && (
                    <div style={{ background: T.surface, borderRadius: 4, height: 4, marginBottom: 10 }}>
                      <div style={{
                        width: `${Math.min(100, (cs / timerTargetCs) * 100)}%`,
                        height: "100%", borderRadius: 4,
                        background: timerMet ? T.green : color,
                        transition: "width .5s, background .4s",
                      }} />
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <button onClick={() => setRun(r => !r)} className="press" style={{
                      flex: 1, padding: 11, borderRadius: 10,
                      background: run ? `${color}20` : color,
                      border: run ? `1px solid ${color}` : "none",
                      color: run ? color : T.bg, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>{run ? "⏸ Pause" : "▶ Start"}</button>
                    <button onClick={resetTimer} className="press" style={{
                      padding: "11px 14px", borderRadius: 10, border: `1px solid ${T.border}`,
                      background: T.surface, color: T.sub, fontSize: 13, cursor: "pointer",
                    }}>↺</button>
                    <button onClick={() => setManualMode(true)} className="press" style={{
                      padding: "11px 14px", borderRadius: 10, border: `1px solid ${T.border}`,
                      background: T.surface, color: T.sub, fontSize: 12, cursor: "pointer",
                    }}>✎</button>
                  </div>

                  {cs > 0 && (
                    <button onClick={() => { setRun(false); onDone(cs); }} className="press" style={{
                      width: "100%", padding: 11, borderRadius: 10, border: "none",
                      background: color, color: T.bg, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>Log {fmtCsClock(cs)}{timerTargetCs !== null && !timerMet ? " (below target)" : ""}</button>
                  )}
                </div>
              )}
            </div>
          )}

          {t.typeId === "journal" && (
            <div>
              <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)}
                placeholder="Write your reflection..."
                style={{
                  width: "100%", background: T.surface, border: `1px solid ${T.border}`,
                  borderRadius: 10, padding: 11, color: T.text,
                  fontFamily: "'Cormorant Garamond',serif", fontSize: 15,
                  resize: "none", outline: "none", lineHeight: 1.5,
                }} />
              <button onClick={() => onDone(text)} disabled={!text} className="press" style={{
                width: "100%", marginTop: 8, padding: 11, borderRadius: 10, border: "none",
                background: text ? color : T.muted, color: T.bg,
                fontSize: 13, fontWeight: 600, cursor: text ? "pointer" : "default",
              }}>Save Entry</button>
            </div>
          )}

          {t.typeId === "number" && (
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, justifyContent: "center", marginBottom: 8 }}>
                <input type="number" placeholder="0" value={numV}
                  onChange={(e) => setNumV(e.target.value)}
                  style={{
                    background: "none", border: "none", outline: "none",
                    fontFamily: "'Cormorant Garamond',serif",
                    color: numMet ? T.green : color,
                    fontSize: 42, fontWeight: 700,
                    width: numTarget !== null ? 80 : 120, textAlign: "right",
                    transition: "color .3s",
                  }} />
                {numTarget !== null && (
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", color: T.sub, fontSize: 28, fontWeight: 600 }}>
                    / {numTarget}
                  </span>
                )}
                <span style={{ color: T.sub, fontSize: 16 }}>{goal.unit || "units"}</span>
              </div>

              {numTarget !== null && (
                <>
                  <div style={{ background: T.surface, borderRadius: 4, height: 4, marginBottom: 6 }}>
                    <div style={{
                      width: `${Math.min(100, ((parseFloat(numV) || 0) / numTarget) * 100)}%`,
                      height: "100%", borderRadius: 4,
                      background: numMet ? T.green : color,
                      transition: "width .3s, background .3s",
                    }} />
                  </div>
                  <p style={{ color: numMet ? T.green : T.sub, fontSize: 11, textAlign: "center", marginBottom: 8 }}>
                    {numMet ? `✓ Target reached (${numTarget} ${goal.unit || ""})` : `Goal: ${numTarget} ${goal.unit || ""}`}
                  </p>
                </>
              )}

              <button onClick={() => onDone(numV)} disabled={!numV} className="press" style={{
                width: "100%", padding: 11, borderRadius: 10, border: "none",
                background: numMet ? T.green : numV ? color : T.muted,
                color: T.bg, fontSize: 13, fontWeight: 600,
                cursor: numV ? "pointer" : "default", transition: "background .3s",
              }}>Log {numV || "0"} {goal.unit}</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
