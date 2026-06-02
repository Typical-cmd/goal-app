export default function Btn({ T, label, onClick, disabled, color, style = {} }) {
  return (
    <button onClick={onClick} disabled={disabled} className="press" style={{
      width: "100%", padding: 16, borderRadius: 14, border: "none",
      background: disabled ? T.muted : (color || T.accent),
      color: T.bg, fontSize: 15, fontWeight: 600,
      cursor: disabled ? "default" : "pointer", transition: "all .2s",
      ...style,
    }}>{label}</button>
  );
}
