# ♠️ GTO Preflop Range & Hand Morphology Trainer

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-amber.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-emerald.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

An interactive, high-contrast **Game Theory Optimal (GTO) Preflop Range & Hand Morphology Trainer** supporting **6-Max, 7-Max, 8-Max, 9-Max, and 10-Max Full Ring** tables.

Unlike traditional flashcard tools, this trainer focuses on **Hand Morphology** — teaching players *why* hands are played based on high card domination, suited barrel equity, Ace blockers, board connectivity, positional equity realization, and range structure type (**Linear**, **Polarized**, **Condensed**, **Mixed**).

---

## ✨ Features & Capabilities

- 🎨 **High-Contrast Obsidian Dark Theme**:
  - Deep obsidian dark background (`#0d0e11` / `#15171c`) designed for maximum visual clarity.
  - Vivid action coding: **Warm Gold** (Primary / Highlight), **Crimson Red** (Raise / 3-Bet / 4-Bet), **Emerald Green** (Call / Defend), and **Charcoal Slate** (Fold).

- 🧮 **Full Ring GTO Mathematics (6-Max to 10-Max)**:
  - Supports dynamic table sizes (**6-Max, 7-Max, 8-Max, 9-Max, 10-Max**).
  - Real-time preflop probability metrics:
    - **Card Removal & Opponent Risk**: P(Premium Behind) = 1 - (1 - 0.048)^N
    - **Geometric RFI Open Decay**: Exponential RFI decay scaling from BTN (~46%) down to 10-Max UTG (~7.5%).
  - Dynamic elliptical seat renderer that positions seats clockwise around the felt.

- 🧬 **Range Morphology Structure Classification**:
  - **Linear Range**: Pure strength opening from early positions without gaps.
  - **Polarized Range**: 3-bet / 4-bet ranges combining monster premiums + blocker bluffs.
  - **Condensed Range**: Capped calling ranges (e.g. BB defend) preserving implied odds.
  - **Mixed Range**: Split-frequency equilibrium plays (e.g., SB RFI vs BB).

- 💡 **Pre-Decision Solution Lock & Hint Shortcut (`H` Key)**:
  - Solution matrix remains locked while considering your move to prevent peeking.
  - Press <kbd>H</kbd> anytime to toggle a live GTO solution hint grid.

- 📊 **13x13 Interactive Grid Matrix**:
  - Full 169-hand preflop matrix revealed after each play.
  - Click any matrix hand cell to inspect combo counts (6, 4, 12 combos), GTO action percentages, and morphology notes.

- 🔍 **Analytics & Positional Leak Detector**:
  - Tracks positional accuracy across all seats (`UTG`, `HJ`, `CO`, `BTN`, `SB`, `BB`).
  - **Automated Leak Warning System**: Flags weak seats (<65% accuracy) with a one-click **"Practice This Leak"** drill mode.

- 🔒 **Data Retention & Privacy**:
  - All user stats, attempt histories, streaks, and leak logs are preserved locally in browser `localStorage` (`gto_preflop_stats`).
  - Every visitor gets their own private, persistent data store with zero cloud tracking.

---

## 💾 How Data Retention Works

1. **Local Browser Isolation**:
   Your progress (total attempts, accuracy %, current streak, positional leaks, and hand history) is stored directly in your browser's `window.localStorage`. 
2. **Multi-Session Continuity**:
   You can close the tab or browser anytime and return days later — your statistics, best streak, and leak history will automatically reload.
3. **Privacy-First**:
   No login, account creation, or server tracking is required. Each browser/device maintains its own isolated data set. Data is cleared automatically after 365 days of inactivity.

---

## 🚀 Deployment & Local Setup

### Live GitHub Pages Deployment
Automated GitHub Actions CI/CD workflow (`.github/workflows/deploy.yml`) deploys to GitHub Pages on every push to `main`.

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build & test production bundle
npm run build
npm run preview
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
