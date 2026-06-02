import { useState, useEffect, useMemo } from "react";
import { mkT } from "./theme.js";
import {
  loadAll, saveGoals, saveCats, saveQuoteLists, saveActiveCfg, saveAccent, saveLogs,
} from "./data/storage.js";
import { blankGoal, stripUnknownTypes } from "./logic/goals.js";
import { pickQuote } from "./logic/quotes.js";

import HomeScreen     from "./screens/HomeScreen.jsx";
import GoalsScreen    from "./screens/GoalsScreen.jsx";
import CreateScreen   from "./screens/CreateScreen.jsx";
import LogScreen      from "./screens/LogScreen.jsx";
import EditGoalScreen from "./screens/EditGoalScreen.jsx";
import HistoryScreen  from "./screens/HistoryScreen.jsx";
import SettingsScreen from "./screens/SettingsScreen.jsx";
import BottomNav      from "./components/BottomNav.jsx";

export default function App() {
  const initial = useMemo(() => loadAll(), []);

  const [accent,      setAccentState]  = useState(initial.accent);
  const [cats,        setCatsState]    = useState(initial.cats);
  const [quoteLists,  setQListsState]  = useState(initial.quoteLists);
  const [activeCfg,   setActCfgState]  = useState(initial.activeConfig);
  const [goals,       setGoalsState]   = useState(() => stripUnknownTypes(initial.goals));
  const [logs,        setLogsState]    = useState(initial.logs);

  const setAccent = (v) => { setAccentState(v);   saveAccent(v); };
  const setCats   = (v) => { setCatsState(v);     saveCats(v); };
  const setQLists = (v) => { setQListsState(v);   saveQuoteLists(v); };
  const setActCfg = (v) => { setActCfgState(v);   saveActiveCfg(v); };
  const setGoals  = (v) => { setGoalsState(v);    saveGoals(v); };
  const setLogs   = (v) => { setLogsState(v);     saveLogs(v); };

  const T = mkT(accent);

  const [screen,      setScreen]      = useState("home");
  const [activeGoal,  setActiveGoal]  = useState(goals[0] || null);
  const [catFilter,   setCatFilter]   = useState("all");
  const [createStep,  setCreateStep]  = useState(1);
  const [newGoal,     setNewGoal]     = useState(blankGoal());
  const [settingsTab, setSetTab]      = useState("colors");

  const [homeQuote] = useState(() => pickQuote(initial.quoteLists, initial.activeConfig));

  const openLog    = (g) => { setActiveGoal(g); setScreen("log"); };
  const openEdit   = ()  => { setScreen("edit"); };
  const openCreate = ()  => { setCreateStep(1); setNewGoal(blankGoal()); setScreen("create"); };

  const addGoal = () => {
    const newG = { ...newGoal, id: Date.now(), streak: 0 };
    setGoals([...goals, newG]);
    setScreen("goals");
  };

  const saveGoal = (updated) => {
    setGoals(goals.map(g => g.id === updated.id ? updated : g));
    setActiveGoal(updated);
    setScreen("log");
  };

  const deleteGoal = () => {
    setGoals(goals.filter(g => g.id !== activeGoal.id));
    setActiveGoal(goals.find(g => g.id !== activeGoal.id) || null);
    setScreen("goals");
  };

  useEffect(() => {
    if (!activeGoal && goals.length) setActiveGoal(goals[0]);
  }, [goals, activeGoal]);

  return (
    <div style={{
      fontFamily: "'DM Sans',sans-serif",
      background: "#080806",
      minHeight: "100vh",
      display: "flex", justifyContent: "center",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        html, body, #root { height: 100%; }
        ::-webkit-scrollbar{width:0;}
        .fade{animation:fi .3s ease forwards;}
        @keyframes fi{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
        .press{transition:transform .15s ease;cursor:pointer;}
        .press:active{transform:scale(.97);}
        .rh{transition:opacity .18s;cursor:pointer;}
        .rh:hover{opacity:.82;}
        input[type=range]{-webkit-appearance:none;height:5px;border-radius:3px;outline:none;background:${T.border};}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:${accent};cursor:pointer;}
        input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;margin:0;}
        input[type=number]{-moz-appearance:textfield;}
      `}</style>

      <div style={{
        width: "100%", maxWidth: 480,
        background: T.bg, minHeight: "100vh",
        position: "relative", display: "flex", flexDirection: "column",
      }}>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 92 }}>
          {screen === "home"    && <HomeScreen     T={T} cats={cats} goals={goals} logs={logs} homeQuote={homeQuote} onTap={openLog} />}
          {screen === "goals"   && <GoalsScreen    T={T} cats={cats} goals={goals} filter={catFilter} setFilter={setCatFilter} onTap={openLog} />}
          {screen === "create"  && <CreateScreen   T={T} cats={cats} setCats={setCats} step={createStep} setStep={setCreateStep} nGoal={newGoal} setNGoal={setNewGoal} onDone={addGoal} />}
          {screen === "log"     && activeGoal && (
            <LogScreen
              T={T} cats={cats} goal={activeGoal}
              goals={goals} setGoals={setGoals}
              logs={logs} setLogs={setLogs}
              onEdit={openEdit}
            />
          )}
          {screen === "edit"    && activeGoal && (
            <EditGoalScreen
              T={T} cats={cats} goal={activeGoal}
              onSave={saveGoal}
              onDelete={deleteGoal}
              onBack={() => setScreen("log")}
            />
          )}
          {screen === "history" && (
            <HistoryScreen
              T={T} cats={cats} goals={goals} setGoals={setGoals}
              goal={activeGoal} setGoal={setActiveGoal}
              logs={logs} setLogs={setLogs}
            />
          )}
          {screen === "settings" && (
            <SettingsScreen T={T} accent={accent} setAccent={setAccent}
              cats={cats} setCats={setCats}
              quoteLists={quoteLists} setQLists={setQLists}
              activeCfg={activeCfg} setActCfg={setActCfg}
              tab={settingsTab} setTab={setSetTab} />
          )}
        </div>

        <BottomNav T={T} accent={accent} screen={screen} setScreen={setScreen} openCreate={openCreate} />
      </div>
    </div>
  );
}
