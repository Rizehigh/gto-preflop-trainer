# ♠️ GTO Preflop & Hand Morphology Trainer

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-teal.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

An interactive, beginner-tailored **Game Theory Optimal (GTO) Preflop Range & Hand Morphology Trainer** built for Texas Hold'em poker players. 

Unlike traditional flashcard trainers that rely on rote memorization, this app focuses on **Hand Morphology** — teaching you *why* hands are played based on high card domination, suited barrel equity, Ace blockers, board connectivity, and positional equity realization.

---

## ✨ Features

- 🎯 **Random Spot Generator**: 
  - Deals physical playing cards with suits (e.g. `A♠ J♥`, `8♦ 7♦`, `Q♣ Q♥`).
  - Highlights Hero's position (`UTG`, `HJ`, `CO`, `BTN`, `SB`, `BB`) on a visual 6-Max poker table diagram.
  - Generates realistic spots across **Raise First In (RFI)**, **Facing Open Raises**, and **Facing 3-Bets**.

- 🧠 **Hand Morphology & Educational Engine**:
  - Receive detailed explanations after every decision:
    - **High Card Domination**: Why broadways outperform lower holdings.
    - **Suitedness & Barrel Power**: Multi-street flush draw equity (+3-4% raw equity).
    - **Ace Blockers**: Why `A5s`/`A4s` are top 3-bet bluff candidates (blocking AA/AK by 50%).
    - **Connectivity & Implied Odds**: How suited connectors (`87s`, `JTs`) hit sneaky straights to stack overpairs.
    - **Equity Realization**: Position advantages (In Position vs Out of Position penalty).

- 📊 **13x13 Interactive Grid Matrix View**:
  - Full 169-hand preflop matrix revealed after each guess (or browsable in Study Mode).
  - Glowing indicator on the dealt hand.
  - Color-coded strategy cells: Red (Raise/3-Bet), Emerald (Call/Defend), Slate (Fold), and Multi-color gradients for mixed frequency hands.
  - Click any matrix cell to open a breakdown modal showing exact combo counts (6, 4, 12 combos), GTO action percentages, and morphology notes.

- 🔍 **Analytics & Positional Leak Detector**:
  - Track accuracy % and streak counters over time.
  - Positional breakdown (`UTG`, `HJ`, `CO`, `BTN`, `SB`, `BB`).
  - Hand morphology breakdown (Pocket Pairs, Suited Broadways, Connectors, Wheels, Offsuit Trash).
  - **Automated Leak Warning System**: Automatically flags weak positions (<65% accuracy) and offers a one-click **"Practice This Leak"** mode.

- 🗺️ **Interactive Range Explorer (Study Mode)**:
  - Browse complete 6-Max 100BB GTO solutions for all preflop scenarios.
  - Filter matrix display by action (*All Hands*, *Raises Only*, *Calls Only*, *Mixed Strategy*).

- 📖 **Beginner Guide & Poker 101**:
  - Built-in primer on reading 13x13 matrix grids, understanding 6-max positions, and core GTO preflop concepts.

- 🔊 **Synthesized Web Audio & Hotkeys**:
  - Native Web Audio sound synthesis (no external audio assets required).
  - Fast keyboard shortcuts (`1` = Fold, `2` = Call, `3` = Raise, `Space` = Next Hand).

- 🔒 **Privacy-First**:
  - All user stats, attempts, and leak logs are saved locally in your browser's `localStorage`. No personal data is sent to external servers.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Rizehigh/gto-preflop-trainer.git
   cd gto-preflop-trainer
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🛠️ Built With

* **[React 18](https://reactjs.org/)** - UI Framework
* **[TypeScript](https://www.typescriptlang.org/)** - Type Safety
* **[Vite](https://vitejs.dev/)** - Lightning-fast Build Tooling
* **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first Styling
* **[Lucide React](https://lucide.dev/)** - Modern Icon Library
* **Web Audio API** - Synthesized Sound Effects

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
