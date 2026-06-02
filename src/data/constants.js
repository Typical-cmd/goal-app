// All default data and type definitions live here.
// Edit this file to change defaults without touching component code.

export const CAT_COLORS = [
  "#5AAF85","#8A7AE8","#C8924A","#E87A5A","#5A9AE8",
  "#6AC87A","#E84B4B","#FF8FAB","#4DAAFF","#FFD060",
];

export const CAT_ICONS = [
  "♥","◉","✦","◎","◆","◇","★","❖","✿","⊕","⊙","▲","◐","⟡",
];

export const DEFAULT_CATS = [
  { id: "health",  label: "Health",  color: "#5AAF85", icon: "♥" },
  { id: "mind",    label: "Mind",    color: "#8A7AE8", icon: "◉" },
  { id: "spirit",  label: "Spirit",  color: "#C8924A", icon: "✦" },
  { id: "social",  label: "Social",  color: "#E87A5A", icon: "◎" },
  { id: "work",    label: "Work",    color: "#5A9AE8", icon: "◆" },
  { id: "finance", label: "Finance", color: "#6AC87A", icon: "◇" },
];

// Tracking type definitions. To add a new tracking style, add it here AND
// add a render branch in components/CriterionCard.jsx.
export const ALL_TYPES = [
  { id: "yesno",   label: "Yes / No",    desc: "Did you complete it?",          icon: "✓",  color: "#5AAF85" },
  { id: "scale",   label: "1–10 Scale",  desc: "Rate quality or effort",        icon: "◈",  color: "#8A7AE8" },
  { id: "timer",   label: "Time Logged", desc: "How long did you spend?",       icon: "⏱", color: "#5A9AE8" },
  { id: "journal", label: "Journal",     desc: "Reflect in your own words",     icon: "✍", color: "#C8924A" },
  { id: "number",  label: "Number",      desc: "Track a measurable metric",     icon: "#",  color: "#6AC87A" },
];

export const BUILT_IN_QUOTES = [
  "Discipline is choosing between what you want now and what you want most.",
  "The secret of getting ahead is getting started.",
  "Small steps every day lead to big changes.",
  "We are what we repeatedly do. Excellence is not an act, but a habit.",
  "The only way out is through.",
  "Show up even when you don't feel like it.",
  "It does not matter how slowly you go as long as you do not stop.",
];

export const DEFAULT_ACCENT = "#C8924A";

// Sample goals on first run. Delete these to start with an empty app.
export const SAMPLE_GOALS = [
  { id: 1, title: "Morning Run",  cat: "health",  types: [{ typeId: "yesno", req: true }, { typeId: "scale", req: false }], streak: 0, freq: { mode: "daily" } },
  { id: 2, title: "Meditation",   cat: "mind",    types: [{ typeId: "scale", req: true }, { typeId: "journal", req: false }], streak: 0, freq: { mode: "days", days: ["Mon","Tue","Wed","Thu","Fri"] } },
  { id: 3, title: "Bible Study",  cat: "spirit",  types: [{ typeId: "timer", req: true }], streak: 0, freq: { mode: "daily" } },
  { id: 4, title: "Water Intake", cat: "health",  types: [{ typeId: "number", req: true }], streak: 0, freq: { mode: "daily" }, unit: "oz" },
];
