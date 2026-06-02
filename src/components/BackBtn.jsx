export default function BackBtn({ T, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", color: T.sub, cursor: "pointer",
      marginBottom: 16, fontSize: 14,
    }}>← Back</button>
  );
}
