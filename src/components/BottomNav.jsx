export default function BottomNav({ T, accent, screen, setScreen, openCreate }) {
  const NAV = [
    { id: "home",     icon: "⌂", label: "Home" },
    { id: "goals",    icon: "◈", label: "Goals" },
    { id: "create",   icon: "+", label: "New", special: true },
    { id: "history",  icon: "◎", label: "History" },
    { id: "settings", icon: "⚙", label: "Settings" },
  ];

  return (
    <div style={{
      position: "absolute", bottom: 0, left: 0, right: 0,
      background: "rgba(14,12,10,.97)", backdropFilter: "blur(16px)",
      borderTop: `1px solid ${T.border}`,
      display: "flex", alignItems: "center", padding: "10px 6px 24px",
    }}>
      {NAV.map(tab => (
        <button key={tab.id}
          onClick={() => tab.id === "create" ? openCreate() : setScreen(tab.id)}
          style={{
            flex: 1, border: "none", cursor: "pointer",
            background: tab.special ? `linear-gradient(135deg,${accent},${accent}CC)` : "none",
            borderRadius: tab.special ? 14 : 0,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            padding: tab.special ? "9px 0" : "6px 0",
            marginTop: tab.special ? -12 : 0,
            boxShadow: tab.special ? `0 4px 20px ${T.glow}` : "none",
            color: tab.special ? T.bg : screen === tab.id ? accent : T.sub,
          }}>
          <span style={{ fontSize: tab.special ? 20 : 17 }}>{tab.icon}</span>
          <span style={{
            fontSize: 9, fontWeight: 500, letterSpacing: "0.05em",
            color: tab.special ? T.bg : screen === tab.id ? accent : T.sub,
          }}>{tab.label}</span>
          {!tab.special && screen === tab.id && (
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: accent }} />
          )}
        </button>
      ))}
    </div>
  );
}
