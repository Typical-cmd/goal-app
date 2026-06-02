// Theme system. The `mkT` function takes an accent color and builds the full palette.
// Everything in the UI references the returned theme object. To re-theme, change accent.
export const mkT = (accent) => ({
  bg:      "#0E0C0A",
  surface: "#131110",
  card:    "#1B1714",
  border:  "#252018",
  accent,
  dim:     `${accent}1F`,   // 12% accent
  glow:    `${accent}38`,   // 22% accent
  text:    "#EAE2D4",
  sub:     "#8A7A6A",
  muted:   "#4A3A2A",
  green:   "#5AC880",
  red:     "#E86060",
});

// Accent swatches available in Settings → Colors
export const SWATCHES = [
  { name: "Ember",   hex: "#C8924A" },
  { name: "Arctic",  hex: "#4DAAFF" },
  { name: "Crimson", hex: "#E84B4B" },
  { name: "Forest",  hex: "#4EC97A" },
  { name: "Violet",  hex: "#A87AE8" },
  { name: "Coral",   hex: "#FF6B6B" },
  { name: "Sky",     hex: "#5A9AE8" },
  { name: "Gold",    hex: "#FFD060" },
  { name: "Rose",    hex: "#FF8FAB" },
  { name: "Mint",    hex: "#3DFFC0" },
];
