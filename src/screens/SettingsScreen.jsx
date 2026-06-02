import { useState } from "react";
import { SWATCHES } from "../theme.js";
import { CAT_COLORS, CAT_ICONS } from "../data/constants.js";

export default function SettingsScreen({
  T, accent, setAccent, cats, setCats,
  quoteLists, setQLists, activeCfg, setActCfg, tab, setTab,
}) {
  return (
    <div className="fade" style={{ padding: "20px 20px 0" }}>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 32, fontWeight: 700, marginBottom: 20 }}>Settings</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 24 }}>
        {[{ id: "colors", l: "Colors" }, { id: "quotes", l: "Quotes" }, { id: "categories", l: "Categories" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 0", borderRadius: 12,
            border: `1px solid ${tab === t.id ? T.accent : T.border}`,
            background: tab === t.id ? T.accent : T.card,
            color: tab === t.id ? T.bg : T.sub,
            fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .2s",
          }}>{t.l}</button>
        ))}
      </div>

      {tab === "colors"     && <ColorsTab T={T} accent={accent} setAccent={setAccent} />}
      {tab === "quotes"     && <QuotesTab T={T} quoteLists={quoteLists} setQLists={setQLists} activeCfg={activeCfg} setActCfg={setActCfg} />}
      {tab === "categories" && <CategoriesTab T={T} cats={cats} setCats={setCats} />}
    </div>
  );
}

// ─── COLORS ───────────────────────────────────────────────────────────────────
function ColorsTab({ T, accent, setAccent }) {
  return (
    <div>
      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 18 }}>Accent Color</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 14, marginBottom: 28 }}>
        {SWATCHES.map(s => (
          <button key={s.hex} onClick={() => setAccent(s.hex)} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 7,
            background: "none", border: "none", cursor: "pointer",
          }}>
            <div style={{
              width: 46, height: 46, borderRadius: 14, background: s.hex,
              border: `3px solid ${accent === s.hex ? "#FFF" : "transparent"}`,
              boxShadow: accent === s.hex ? `0 0 0 1px ${s.hex},0 0 18px ${s.hex}66` : "none",
              transition: "all .2s",
            }} />
            <span style={{ color: T.sub, fontSize: 9 }}>{s.name}</span>
          </button>
        ))}
      </div>

      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Preview</p>
      <div style={{ background: T.card, borderRadius: 16, padding: 18, border: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 14 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12, background: T.dim,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ color: T.accent, fontSize: 17 }}>♥</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 17, fontWeight: 600 }}>Morning Run</p>
            <p style={{ color: T.sub, fontSize: 12 }}>Health · Yes/No · 🔥 8d</p>
          </div>
        </div>
        <div style={{ background: T.accent, borderRadius: 12, padding: "12px", textAlign: "center", marginBottom: 12 }}>
          <span style={{ color: T.bg, fontSize: 14, fontWeight: 600 }}>Check In — Show Up</span>
        </div>
        <div style={{ background: T.dim, borderRadius: 10, padding: "11px 14px", borderLeft: `3px solid ${T.accent}` }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 13, fontStyle: "italic" }}>
            "Discipline is the bridge between goals and accomplishment."
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── QUOTES ───────────────────────────────────────────────────────────────────
function QuotesTab({ T, quoteLists, setQLists, activeCfg, setActCfg }) {
  const [adding, setAdding] = useState(null);
  const [newQ, setNewQ] = useState("");
  const [newListName, setNewLN] = useState("");

  const addList  = () => {
    if (!newListName.trim()) return;
    const id = `list_${Date.now()}`;
    setQLists([...quoteLists, { id, name: newListName.trim(), locked: false, quotes: [] }]);
    setNewLN("");
  };
  const delList  = (id) => setQLists(quoteLists.filter(l => l.id !== id));
  const delQuote = (lid, qi) => setQLists(quoteLists.map(l => l.id === lid ? { ...l, quotes: l.quotes.filter((_, i) => i !== qi) } : l));
  const addQuote = (lid) => {
    if (!newQ.trim()) return;
    setQLists(quoteLists.map(l => l.id === lid ? { ...l, quotes: [...l.quotes, newQ.trim()] } : l));
    setNewQ(""); setAdding(null);
  };
  const toggleId = (id) => {
    if (activeCfg.mode !== "select") return;
    const ids = activeCfg.ids.includes(id) ? activeCfg.ids.filter(x => x !== id) : [...activeCfg.ids, id];
    setActCfg({ ...activeCfg, ids });
  };

  return (
    <div>
      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Active Source</p>
      <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.border}`, marginBottom: 22 }}>
        {[{ id: "all", l: "All Lists" }, { id: "select", l: "Select Lists" }].map((m, idx) => (
          <button key={m.id} onClick={() => setActCfg({ ...activeCfg, mode: m.id })} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 12,
            background: "none", border: "none", cursor: "pointer",
            marginBottom: idx === 0 ? 12 : activeCfg.mode === "select" ? 10 : 0,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${activeCfg.mode === m.id ? T.accent : T.sub}`,
              background: activeCfg.mode === m.id ? T.accent : "none",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {activeCfg.mode === m.id && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.bg }} />}
            </div>
            <span style={{ color: activeCfg.mode === m.id ? T.text : T.sub, fontSize: 14 }}>{m.l}</span>
          </button>
        ))}
        {activeCfg.mode === "select" && (
          <div style={{ paddingLeft: 32, display: "flex", flexDirection: "column", gap: 9 }}>
            {quoteLists.map(l => (
              <button key={l.id} onClick={() => toggleId(l.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "none", border: "none", cursor: "pointer",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                  border: `2px solid ${activeCfg.ids.includes(l.id) ? T.accent : T.sub}`,
                  background: activeCfg.ids.includes(l.id) ? T.accent : "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {activeCfg.ids.includes(l.id) && <span style={{ color: T.bg, fontSize: 10, fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{ color: T.text, fontSize: 13 }}>{l.name}</span>
                <span style={{ color: T.muted, fontSize: 11, marginLeft: "auto" }}>{l.quotes.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {quoteLists.map(l => (
        <div key={l.id} style={{
          background: T.card, borderRadius: 14, border: `1px solid ${T.border}`,
          marginBottom: 14, overflow: "hidden",
        }}>
          <div style={{
            display: "flex", alignItems: "center", padding: "13px 16px",
            borderBottom: `1px solid ${T.border}`,
          }}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 17, fontWeight: 600, flex: 1 }}>{l.name}</p>
            <span style={{ color: T.muted, fontSize: 11, marginRight: 8 }}>{l.quotes.length}</span>
            {!l.locked && (
              <button onClick={() => delList(l.id)} style={{
                background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 18,
              }}>×</button>
            )}
          </div>
          {l.quotes.map((q, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "11px 16px", borderBottom: `1px solid ${T.border}`,
            }}>
              <p style={{
                fontFamily: "'Cormorant Garamond',serif", color: T.sub, fontSize: 13,
                fontStyle: "italic", flex: 1, lineHeight: 1.5,
              }}>"{q}"</p>
              {!l.locked && (
                <button onClick={() => delQuote(l.id, i)} style={{
                  background: "none", border: "none", color: T.muted, cursor: "pointer",
                  fontSize: 16, flexShrink: 0,
                }}>×</button>
              )}
            </div>
          ))}
          {!l.locked && (
            <div style={{ padding: "12px 16px" }}>
              {adding === l.id ? (
                <div>
                  <textarea rows={2} value={newQ} onChange={(e) => setNewQ(e.target.value)}
                    placeholder="Enter quote..."
                    style={{
                      width: "100%", background: T.surface, border: `1px solid ${T.border}`,
                      borderRadius: 10, padding: 10, color: T.text,
                      fontFamily: "'Cormorant Garamond',serif", fontSize: 14,
                      resize: "none", outline: "none", marginBottom: 8,
                    }} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => addQuote(l.id)} style={{
                      flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
                      background: T.accent, color: T.bg, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    }}>Add</button>
                    <button onClick={() => setAdding(null)} style={{
                      padding: "8px 14px", borderRadius: 10, border: `1px solid ${T.border}`,
                      background: "none", color: T.sub, fontSize: 13, cursor: "pointer",
                    }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAdding(l.id)} style={{
                  background: "none", border: `1px dashed ${T.border}`, borderRadius: 10,
                  padding: "9px 0", width: "100%", color: T.sub, fontSize: 12, cursor: "pointer",
                }}>+ Add Quote</button>
              )}
            </div>
          )}
        </div>
      ))}

      <div style={{ background: T.card, borderRadius: 14, padding: 14, border: `1px dashed ${T.border}` }}>
        <p style={{ color: T.sub, fontSize: 11, marginBottom: 10 }}>Create a new quote list</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={newListName} onChange={(e) => setNewLN(e.target.value)} placeholder="List name..."
            style={{
              flex: 1, background: T.surface, border: `1px solid ${T.border}`,
              borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 14, outline: "none",
            }} />
          <button onClick={addList} style={{
            padding: "10px 16px", borderRadius: 10, border: "none",
            background: newListName ? T.accent : T.muted, color: T.bg,
            fontSize: 14, fontWeight: 600, cursor: newListName ? "pointer" : "default",
          }}>+</button>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
function CategoriesTab({ T, cats, setCats }) {
  const [editId, setEditId] = useState(null);
  const [newCat, setNewCat] = useState({ label: "", color: "#C8924A", icon: "◈" });
  const [adding, setAdding] = useState(false);
  const del    = (id) => setCats(cats.filter(c => c.id !== id));
  const update = (id, p) => setCats(cats.map(c => c.id === id ? { ...c, ...p } : c));
  const add    = () => {
    if (!newCat.label) return;
    setCats([...cats, { ...newCat, id: `cat_${Date.now()}` }]);
    setNewCat({ label: "", color: "#C8924A", icon: "◈" });
    setAdding(false);
  };

  const EditorPanel = ({ val, onChange }) => (
    <div style={{
      background: T.surface, borderRadius: 13, padding: 14,
      border: `1px solid ${val.color}44`, marginTop: 2,
    }}>
      <input value={val.label} onChange={(e) => onChange({ ...val, label: e.target.value })}
        placeholder="Category name..."
        style={{
          width: "100%", background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, padding: "10px 12px", color: T.text, fontSize: 14,
          outline: "none", marginBottom: 12,
        }} />
      <p style={{ color: T.sub, fontSize: 10, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Color</p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginBottom: 12 }}>
        {CAT_COLORS.map(cl => (
          <button key={cl} onClick={() => onChange({ ...val, color: cl })} style={{
            width: 28, height: 28, borderRadius: 8, background: cl, border: "none", cursor: "pointer",
            outline: val.color === cl ? "2px solid #fff" : "none",
            boxShadow: val.color === cl ? `0 0 8px ${cl}88` : "none", transition: "all .2s",
          }} />
        ))}
      </div>
      <p style={{ color: T.sub, fontSize: 10, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>Icon</p>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
        {CAT_ICONS.map(ic => (
          <button key={ic} onClick={() => onChange({ ...val, icon: ic })} style={{
            width: 32, height: 32, borderRadius: 8,
            background: val.icon === ic ? `${val.color}30` : T.card,
            border: `1px solid ${val.icon === ic ? val.color : T.border}`,
            color: val.icon === ic ? val.color : T.sub, fontSize: 15, cursor: "pointer",
          }}>{ic}</button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <p style={{ color: T.sub, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>Categories</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
        {cats.map(c => (
          <div key={c.id}>
            <div style={{
              background: T.card, borderRadius: 13, padding: "12px 16px",
              border: `1px solid ${editId === c.id ? c.color : T.border}`,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: `${c.color}22`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: c.color, fontSize: 17 }}>{c.icon}</span>
              </div>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", color: T.text, fontSize: 16, fontWeight: 600, flex: 1 }}>{c.label}</p>
              <button onClick={() => setEditId(editId === c.id ? null : c.id)} style={{
                background: "none", border: `1px solid ${T.border}`, borderRadius: 8,
                padding: "4px 10px", color: T.sub, fontSize: 11, cursor: "pointer",
              }}>Edit</button>
              <button onClick={() => del(c.id)} style={{
                background: "none", border: "none", color: T.muted, cursor: "pointer", fontSize: 20,
              }}>×</button>
            </div>
            {editId === c.id && <EditorPanel val={c} onChange={(p) => update(c.id, p)} />}
          </div>
        ))}
      </div>

      {adding ? (
        <div style={{ background: T.card, borderRadius: 14, padding: 16, border: `1px solid ${T.accent}44` }}>
          <EditorPanel val={newCat} onChange={setNewCat} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={add} style={{
              flex: 1, padding: 12, borderRadius: 12, border: "none",
              background: newCat.label ? T.accent : T.muted, color: T.bg,
              fontSize: 14, fontWeight: 600, cursor: newCat.label ? "pointer" : "default",
            }}>Create</button>
            <button onClick={() => setAdding(false)} style={{
              padding: "12px 16px", borderRadius: 12, border: `1px solid ${T.border}`,
              background: "none", color: T.sub, fontSize: 14, cursor: "pointer",
            }}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} style={{
          width: "100%", padding: 14, borderRadius: 14,
          background: "none", border: `1px dashed ${T.border}`,
          color: T.sub, fontSize: 14, cursor: "pointer",
        }}>+ New Category</button>
      )}
    </div>
  );
}
