import { ALL_TYPES } from "../data/constants.js";

// Lookups
export const getCat  = (cats, id) => cats.find(c => c.id === id) || { label: "—", color: "#666666", icon: "◈", id: "" };
export const getType = (id)       => ALL_TYPES.find(t => t.id === id) || ALL_TYPES[0];

export const bestStreak = (goals) => goals.length ? Math.max(...goals.map(g => g.streak || 0)) : 0;

export const filterByCategory = (goals, catId) =>
  catId === "all" ? goals : goals.filter(g => g.cat === catId);

export const freqLabel = (f) => {
  if (!f) return "Daily";
  if (f.mode === "daily")  return "Daily";
  if (f.mode === "simple") return f.val || "Daily";
  if (f.mode === "days") {
    const d = f.days || [];
    return d.slice(0, 3).map(x => x.slice(0, 2)).join(", ") + (d.length > 3 ? "…" : "");
  }
  if (f.mode === "dates") return (f.dates || []).map(d => `${d}${ord(d)}`).join(", ");
  return "Custom";
};

const ord = (d) => (d === 1 ? "st" : d === 2 ? "nd" : d === 3 ? "rd" : "th");

export const blankGoal = () => ({
  title: "",
  cat:   "",
  types: [],
  freq:  { mode: "simple", val: "Daily" },
  unit:  "",
});

export const cycleType = (goal, typeId) => {
  const existing = goal.types.find(t => t.typeId === typeId);
  if (!existing)    return { ...goal, types: [...goal.types, { typeId, req: true }] };
  if (existing.req) return { ...goal, types: goal.types.map(t => t.typeId === typeId ? { ...t, req: false } : t) };
  return { ...goal, types: goal.types.filter(t => t.typeId !== typeId) };
};

export const criteriaCounts = (goal) => ({
  required: goal.types.filter(t => t.req).length,
  optional: goal.types.filter(t => !t.req).length,
});

// Strip removed tracking type IDs from goals (migration helper)
export const stripUnknownTypes = (goals) =>
  goals.map(g => ({ ...g, types: g.types.filter(t => ALL_TYPES.some(a => a.id === t.typeId)) }));

// ── Date helpers ───────────────────────────────────────────────────────────────

export const todayKey = () => fmtDate(new Date());

export const dayKey = (n = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return fmtDate(d);
};

const fmtDate = (d) =>
  `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

export const isGoalDueOn = (freq, dateKey) => {
  const d = new Date(dateKey + "T12:00:00");
  const dayName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()];
  const dateNum = d.getDate();
  if (!freq || freq.mode === "daily") return true;
  if (freq.mode === "simple") {
    const v = freq.val || "Daily";
    if (v === "Daily")    return true;
    if (v === "Weekdays") return !["Sat","Sun"].includes(dayName);
    if (v === "Weekends") return ["Sat","Sun"].includes(dayName);
    if (v === "Weekly")   return dayName === "Mon";
    if (v === "Monthly")  return dateNum === 1;
    return true;
  }
  if (freq.mode === "days")  return (freq.days  || []).includes(dayName);
  if (freq.mode === "dates") return (freq.dates || []).includes(dateNum);
  return true;
};

export const computeStreak = (goalId, freq, logs) => {
  const goalLogs = logs[goalId] || {};
  let streak = 0;
  let i = 0;
  let passedToday = false;

  while (i <= 365) {
    const key = dayKey(i);
    const isDue = isGoalDueOn(freq, key);

    if (!isDue) { i++; continue; }

    if (!passedToday && i === 0 && !goalLogs[key]?.completed) {
      passedToday = true;
      i++;
      continue;
    }

    if (goalLogs[key]?.completed) {
      streak++;
      i++;
    } else {
      break;
    }
  }

  return streak;
};

export const computeBestStreak = (goalId, freq, logs) => {
  const goalLogs = logs[goalId] || {};
  const allDates = Object.keys(goalLogs).sort();
  if (!allDates.length) return 0;
  let best = 0, cur = 0;
  for (const key of allDates) {
    if (!isGoalDueOn(freq, key)) continue;
    if (goalLogs[key]?.completed) { cur++; if (cur > best) best = cur; }
    else cur = 0;
  }
  return best;
};

export const computeHitRate = (goalId, freq, logs, days = 30) => {
  const goalLogs = logs[goalId] || {};
  let due = 0, completed = 0;
  for (let i = 0; i < days; i++) {
    const key = dayKey(i);
    if (isGoalDueOn(freq, key)) {
      due++;
      if (goalLogs[key]?.completed) completed++;
    }
  }
  return due === 0 ? 0 : Math.round((completed / due) * 100);
};

// Timer target expressed in centiseconds (null if no target set)
export const timerTargetCs = (goal) => {
  const tt = goal.timerTarget;
  if (!tt || tt.amount === "" || tt.amount === undefined || tt.amount === null) return null;
  const mult = tt.unit === "hr" ? 360000 : tt.unit === "min" ? 6000 : 100;
  return parseFloat(tt.amount) * mult;
};

// Does a single logged value satisfy its criterion?
//   yesno  → must be "Yes" (true), not skipped
//   number → must reach targetAmount (if one is set)
//   timer  → must reach timerTarget (if one is set)
//   scale / journal → logging it counts as met
export const criterionMet = (goal, typeId, value) => {
  if (value === undefined || value === null || value === "") return false;
  if (typeId === "yesno")  return value === true;
  if (typeId === "number") {
    if (goal.targetAmount) return parseFloat(value) >= parseFloat(goal.targetAmount);
    return true;
  }
  if (typeId === "timer") {
    const target = timerTargetCs(goal);
    return target !== null ? value >= target : value > 0;
  }
  return true; // scale, journal
};

// Are ALL required criteria met given an entries map { typeId: value }?
export const requiredMet = (goal, entries = {}) => {
  const req = goal.types.filter(t => t.req);
  if (req.length === 0) return false;
  return req.every(t => criterionMet(goal, t.typeId, entries[t.typeId]));
};

// Format a logged value for display
export const formatLogValue = (typeId, value, unit = "") => {
  if (value === undefined || value === null) return "—";
  if (typeId === "yesno")   return value ? "✓ Done" : "✗ Skipped";
  if (typeId === "scale")   return `${value}/10`;
  if (typeId === "timer")   return fmtCsDisplay(value);
  if (typeId === "journal") return "Entry";
  if (typeId === "number")  return `${value}${unit ? " " + unit : ""}`;
  return String(value);
};

// Centiseconds → short display (e.g. "2h 14m", "28m 30s", "45s")
const fmtCsDisplay = (cs) => {
  const h = Math.floor(cs / 360000);
  const m = Math.floor((cs % 360000) / 6000);
  const s = Math.floor((cs % 6000) / 100);
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};

// Centiseconds → HH:MM:SS.cc clock format
export const fmtCsClock = (cs) => {
  const h  = Math.floor(cs / 360000);
  const m  = Math.floor((cs % 360000) / 6000);
  const s  = Math.floor((cs % 6000) / 100);
  const cc = cs % 100;
  const ss  = String(s).padStart(2, "0");
  const ccs = String(cc).padStart(2, "0");
  if (h > 0) return `${h}:${String(m).padStart(2,"0")}:${ss}.${ccs}`;
  if (m > 0) return `${String(m).padStart(2,"0")}:${ss}.${ccs}`;
  return `${ss}.${ccs}`;
};
