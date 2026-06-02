# 🏋️ Workout Logger & Progress Tracker

Log your gym workouts, track sets, reps and weight, visualize your progress with charts, and watch your personal records climb — all in your browser.

> 🔒 **100% local.** No account, no server, no tracking. Your training data lives in your browser's LocalStorage and never leaves your device. Export/import as JSON anytime.

![demo](demo.gif)

## ✨ Features

- 📝 **Log workouts** — pick exercises from a built-in library grouped by muscle group, add sets with weight & reps
- 📂 **History** — browse every past session with volume and set summaries
- 📈 **Progress charts** — volume per session and per-exercise estimated 1RM over time (custom Canvas charts, no libraries)
- 🏆 **Personal records** — automatic PRs per exercise with estimated 1RM (Epley formula)
- 💾 **Export / Import** — back up or move your data as a JSON file
- ⚡ Zero dependencies, vanilla JS ES modules

## 🚀 Getting started

This app uses **ES modules**, so it must be served over HTTP (opening `index.html` directly via `file://` won't work). Run any static server:

```bash
npx serve .
# or
python3 -m http.server
```

Then open the printed `http://localhost:...` URL.

## 🌐 Deploy

Push the repo and enable **GitHub Pages** (Settings → Pages → branch `main`, folder `/root`). GitHub Pages serves over HTTP, so the modules load correctly and you get a free live URL.

## 🗂️ Project structure

```
workout-logger/
├── index.html
├── css/
│   └── styles.css
└── js/
    ├── app.js              # entry point: wires routes + export/import
    ├── core/
    │   ├── state.js        # central state + pub/sub, auto-persist
    │   ├── storage.js      # LocalStorage wrapper, export/import
    │   └── router.js       # minimal hash router
    ├── data/
    │   └── exercises.js    # built-in exercise library
    ├── features/
    │   ├── workout.js      # "Log" view
    │   ├── history.js      # "History" view
    │   ├── progress.js     # "Progress" charts view
    │   ├── prs.js          # "Personal Records" view
    │   └── charts.js       # dependency-free Canvas line chart
    └── utils/
        ├── date.js         # date helpers
        ├── format.js       # number formatting + 1RM / volume math
        └── ui.js           # toast + small DOM helpers
```

## 🧮 The math

- **Volume** = Σ (weight × reps) across all sets
- **Estimated 1RM** = `weight × (1 + reps / 30)` (Epley formula)

## 🛠️ Tech

- HTML + CSS + Vanilla JavaScript (ES modules)
- Canvas API for charts
- LocalStorage for persistence
- No dependencies, no build step

## 📄 License

[MIT](LICENSE)
