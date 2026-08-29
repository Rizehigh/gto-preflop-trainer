# ♠️ GTO Preflop Range & Hand Morphology Trainer

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-amber.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-emerald.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

An interactive, high-contrast **Game Theory Optimal (GTO) Preflop Range & Hand Morphology Trainer** supporting **6-Max, 7-Max, 8-Max, 9-Max, and 10-Max Full Ring** tables.

Unlike traditional flashcard tools, this trainer focuses on **Hand Morphology** — teaching players *why* hands are played based on high card domination, suited barrel equity, Ace/King blockers, board connectivity, positional equity realization, and range structure type (**Linear**, **Polarized**, **Condensed**, **Mixed**).

---

## ✨ Key Features & Capabilities

### 🔍 1. Position Inspector Grid Matrix
- **In-Flow Attached Inspector**: Open the inspector to view how your dealt hand (e.g. `AKs`, `TT`, `A5s`) is played across **every preflop position** (`UTG` through `BB`).
- **Decoupled Gameplay**: Navigating seats inside the Position Inspector will **never reset your active hand decision** or hide your open GTO solutions.
- **Interactive 13x13 RFI Matrix**: Renders full 169-hand preflop matrices per position with exact GTO raise, call, and fold frequencies.
- **Full Ring GTO Statistics**: Displays GTO RFI %, players remaining behind, premium hand risk %, and range morphology notes.

### 📐 2. Ultra-Wide Responsive Layout (1800px Ceiling)
- Engineered for standard **1080p** (1920x1080) and **1440p** (2560x1440) monitors.
- Supports **3 attached side-by-side card panels**:
  1. *Position Inspector Grid* (Left)
  2. *Interactive Poker Felt & Action Controls* (Center)
  3. *GTO Solution Matrix & Explanation Panel* (Right)
- Smooth CSS layout shifts preserve exact poker table dimensions with zero cutoffs or clipping.

### 🧮 3. GTO Mathematics & Combinatorics Engine
- **Card Removal & Opponent Risk**: Binomial probability model:
  $$\text{P(Premium Behind)} = 1 - (1 - 0.048)^n$$
  calculates the exact likelihood of facing `AA, KK, QQ, JJ, AKs, AKo` among the $n$ players remaining to act.
- **Pot Odds Requirement**:
  $$\text{Pot Odds \%} = \frac{\text{Amount to Call}}{\text{Total Pot after Call}} \times 100\%$$
- **Minimum Defense Frequency (MDF)**:
  $$\text{MDF \%} = \frac{\text{Pot}}{\text{Pot} + \text{Bet}} \times 100\%$$
  quantifies the exact percentage of Hero's range required to defend to prevent Villain from profitably auto-bluffing.
- **Blocker Removal Power**: Calculates Ace/King combinatoric reductions (e.g. holding an Ace reduces opponent AA combinations from 6 to 3 combos, a 50% removal power).
- **Equity Realization (EqR)**: Evaluates playability bonuses for suited hands (>100% EqR) vs reverse implied odds penalties for weak offsuit hands (<85% EqR).

### 🧬 4. Range Morphology Structure Classification
- **Linear Range**: Pure strength opening from early positions without gaps.
- **Polarized Range**: 3-bet / 4-bet ranges combining monster premiums with high-card blocker bluffs.
- **Condensed Range**: Capped calling ranges (e.g. BB defend) preserving implied odds.
- **Mixed Range**: Split-frequency equilibrium plays (e.g. SB RFI vs BB).

### 🎯 5. Exploit & Opponent Profiling Engine
- Toggle between **GTO Standard Equilibrium** and **Exploit Mode**.
- Practice tactical adjustments against specific villain profiles:
  - *Tight Nit / Nitty Reg*: Over-fold vs 3-bets, steal aggressively.
  - *Calling Station*: Remove zero-EV bluffs, value bet wider.
  - *Maniac / Aggro-3Bettor*: Tighten open range, 4-bet linear premiums.

### 📊 6. Analytics & Positional Leak Detector
- Real-time tracking of positional accuracy across all seats (`UTG`, `HJ`, `CO`, `BTN`, `SB`, `BB`).
- **Automated Leak Detector**: Flags weak seats (<65% accuracy) with a one-click **"Practice This Leak"** drill mode.
- Local browser data persistence via `localStorage` (`gto_preflop_stats`) with zero server tracking.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| <kbd>1</kbd> | Action: **Fold** |
| <kbd>2</kbd> | Action: **Call** |
| <kbd>3</kbd> | Action: **Raise / 3-Bet** |
| <kbd>H</kbd> | Toggle **GTO Solution Hint** |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | Deal **Next Hand** |

---

## 💾 Data Retention & Privacy

1. **Local Browser Isolation**:
   Progress (attempts, accuracy %, streaks, leak history) is stored directly in your browser's `window.localStorage`.
2. **Multi-Session Continuity**:
   Data automatically reloads across sessions — close the browser anytime and resume where you left off.
3. **Privacy-First**:
   Zero login, registration, or cloud tracking required.

---

## 🚀 Local Setup & Deployment

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build & preview production bundle
npm run build
npm run preview
```

### GitHub Pages Deployment
Automated CI/CD via `.github/workflows/deploy.yml` deploys to GitHub Pages on every push to `main`.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
