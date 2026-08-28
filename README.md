# ♠️ GTO Preflop & Hand Morphology Trainer (Material 3)

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Design System](https://img.shields.io/badge/Design_System-Material_3-teal.svg)](https://m3.material.io/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

An interactive, beginner-tailored **Game Theory Optimal (GTO) Preflop Range & Hand Morphology Trainer** designed with **Google's Material Design 3 (M3)** design system.

Unlike traditional flashcard tools, this trainer focuses on **Hand Morphology** — teaching players *why* hands are played based on high card domination, suited barrel equity, Ace blockers, board connectivity, and positional equity realization.

---

## ✨ Features & Architecture

- 🎨 **Material Design 3 Aesthetic**:
  - Tonal color palettes (`SurfaceContainer`, `PrimaryContainer`, `OutlineVariant`).
  - Google Roboto Flex typography hierarchy.
  - M3 Segmented Navigation Bars, Tonal Action Buttons, Assistant Chips, and Floating Dialogs.

- 🎯 **Random Spot Generator**: 
  - Deals physical playing cards with suits (e.g. `A♠ J♥`, `8♦ 7♦`, `Q♣ Q♥`).
  - Highlights Hero's position (`UTG`, `HJ`, `CO`, `BTN`, `SB`, `BB`) on a 6-Max poker table diagram.
  - Covers **Raise First In (RFI)**, **Facing Open Raises**, and **Facing 3-Bets**.

- 🧠 **Hand Morphology Educational Engine**:
  - Learn structural hand traits after every guess:
    - **High Card Domination**: Equity advantages of high broadways.
    - **Suitedness & Barrel Power**: Multi-street flush draw equity (+3-4% raw equity).
    - **Ace Blockers**: Why `A5s`/`A4s` are top 3-bet bluff candidates (blocking AA/AK by 50%).
    - **Connectivity & Implied Odds**: How suited connectors (`87s`, `JTs`) hit sneaky straights to stack overpairs.
    - **Equity Realization**: In Position (IP) vs Out of Position (OOP) penalties.

- 📊 **13x13 Interactive Grid Matrix**:
  - Full 169-hand preflop matrix revealed after each guess.
  - Animated indicator on the current hand cell.
  - Strategy color coding: Red (Raise/3-Bet), Emerald (Call/Defend), Dark Surface (Fold), and Gradient Mixes.
  - Click any matrix hand cell to inspect combo counts (6, 4, 12 combos), GTO action percentages, and morphology notes.

- 🔍 **Analytics & Positional Leak Detector**:
  - Positional accuracy tracking (`UTG`, `HJ`, `CO`, `BTN`, `SB`, `BB`).
  - Hand morphology performance breakdown.
  - **Automated Leak Warning System**: Automatically flags weak seats (<65% accuracy) and offers a one-click **"Practice This Leak"** drill mode.

- 🗺️ **Interactive Range Explorer (Study Mode)**:
  - Browse 6-Max 100BB GTO solutions for all preflop scenarios.
  - Filter matrix display by action (*All Hands*, *Raises Only*, *Calls Only*, *Mixed Strategy*).

- 🔊 **Synthesized Web Audio & Hotkeys**:
  - Built-in Web Audio sound synthesis (no external audio assets required).
  - Fast keyboard shortcuts (`1` = Fold, `2` = Call, `3` = Raise, `Space` = Next Hand).

- 🔒 **Privacy-First**:
  - All user stats, attempts, and leak logs are saved locally in browser `localStorage`.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```

3. **Build & Serve Production Build**:
   ```bash
   npm run build
   cd dist
   python3 -m http.server 8000
   ```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
