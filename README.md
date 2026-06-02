# Goal Tracker

Personal goal tracking app. Web-first PWA built with React + Vite.

## Quick Start

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## Run on Your Phone (Same Wi-Fi)

When you run `npm run dev`, Vite also prints a network URL like:
```
Network: http://192.168.1.42:5173
```
Open that URL on your phone's browser. To install as an app:

**Android (Chrome):** Tap the ⋮ menu → "Install app" or "Add to Home Screen"

The icon appears on your home screen and launches fullscreen, no browser bar.

## Deploy (so it's always available, even off your computer)

1. Push this folder to a new GitHub repo
2. Sign in to [vercel.com](https://vercel.com) with GitHub
3. Click "New Project" → import the repo
4. Click Deploy. You get a URL like `goal-app-yourname.vercel.app`
5. Open that URL on your phone and "Add to Home Screen"

## Project Structure

```
src/
├── App.jsx                  ← shell, state, navigation
├── theme.js                 ← color system + swatches
├── main.jsx                 ← React entry
│
├── data/
│   ├── constants.js         ← types, default cats, default quotes
│   └── storage.js           ← localStorage wrapper (swap for SQLite later)
│
├── logic/
│   ├── goals.js             ← streak math, filtering, freq labels
│   └── quotes.js            ← quote picking
│
├── screens/
│   ├── HomeScreen.jsx
│   ├── GoalsScreen.jsx
│   ├── CreateScreen.jsx
│   ├── LogScreen.jsx
│   ├── HistoryScreen.jsx
│   └── SettingsScreen.jsx
│
└── components/
    ├── Btn.jsx
    ├── BackBtn.jsx
    ├── CriterionCard.jsx
    └── BottomNav.jsx
```

## Where to Make Changes

- **Add a default category / quote / tracking type?** → `src/data/constants.js`
- **Change colors?** → `src/theme.js`
- **Tweak streak math or filters?** → `src/logic/goals.js`
- **Change how a screen looks?** → file in `src/screens/`
- **Change storage (e.g. add cloud sync later)?** → `src/data/storage.js` only

## Reset Data

Open browser DevTools → Console → run:
```js
localStorage.clear(); location.reload();
```

## Migration to Native (Future)

When you're ready to go native (React Native + Expo):

1. Most logic in `src/logic/` and `src/data/constants.js` transfers as-is
2. `src/data/storage.js` swaps to AsyncStorage or SQLite (one file)
3. Screen components get a UI rewrite using React Native primitives (View, Text, etc.)
4. Bottom nav is replaced with React Navigation
