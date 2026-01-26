# TuneTwin

![CI](https://github.com/jdluu/Tune-Twin/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**TuneTwin** is an advanced music discovery engine that analyzes your YouTube Music playlists to uncover their algorithmic "DNA". By understanding the underlying vibe, tempo, and genre composition of your favorite collections, TuneTwin generates "Twin" recommendations—hidden gems that fit your playlist's exact energy but may have slipped under your radar.

> **Find your playlist's perfect matches.**

## ✨ Key Features

- **🧬 Vibe Engine Analysis**: break down playlists into core mood and genre components (e.g., "Chill Lofi", "Aggressive Phonk", "90s Nostalgia").
- **👥 Twin Recommendations**: Get 5 perfectly matched song suggestions based on the collective algorithmic identity of your seed playlist.
- **🔍 Artist Deep Dives**: Click on any artist to instantly pull up their bio, top tracks, and visual identity without leaving the app.
- **📱 PWA & Mobile First**: Installable as a native app on iOS and Android. Fully offline-capable UI with smooth transitions and touch optimizations.
- **🌗 Adaptive UI**: Beautiful, high-contrast Dark and Light modes that respect system preferences.
- **♿ Accessible Design**: Built with WCAG 2.1 AA standards in mind, featuring high-contrast colors, keyboard navigation, and screen reader support.
- **🛡️ Privacy Focused**: No login required for basic analysis. History is stored locally on your device.

## 🛠️ Technology Stack

Built with a focus on performance, type safety, and modern web standards.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Runtime**: [Bun](https://bun.sh/)
- **UI System**: [Material UI v7](https://mui.com/) (Joy/Material hybrid approach)
- **Data Fetching**: [youtubei.js](https://github.com/LuanRT/YouTube.js) (Reverse-engineered internal API)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)
- **PWA**: `next-pwa` with custom manifest and service worker configuration

## 🚀 Getting Started

### Prerequisites

- **Bun** (Latest version recommended)
- Node.js 20+ (If not using Bun directly)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/jdluu/Tune-Twin.git
   cd Tune-Twin
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

### Development

Start the local development server:

```bash
bun dev
```

Visit `http://localhost:3000` to see the app.

### Testing & Verification

Run the comprehensive test suite (Unit & Component tests):

```bash
# Run tests once
bun run test

# Run linting
bun run lint
```

### Building for Production

Create an optimized production build:

```bash
bun run build
bun start
```

## 📂 Architecture

The project follows a **Feature-Sliced Design (Lite)** approach for scalability:

```
src/
├── app/                 # Next.js App Router (Routes & Layouts)
├── components/          # Shared UI Components (Providers, Layouts)
├── features/            # Feature-based modules
│   └── playlist/        # Playlist Analysis Feature
│       ├── components/  # Feature-specific components (Analyzer, Player)
│       ├── actions.ts   # Server Actions
│       └── ...
├── hooks/               # Custom React Hooks (useSearchHistory)
├── lib/                 # Core Utilities & Services
│   ├── services/        # API Services (YouTube, Vibe Engine)
│   ├── theme.ts         # Design Tokens
│   └── types.ts         # Shared Types
└── test/                # Test setup and utilities
```

## 🤝 Contributing

Contributions are welcome! Please run `bun run test` before submitting a PR to ensure all checks pass.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).