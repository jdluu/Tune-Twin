# TuneTwin

![CI](https://github.com/jdluu/Tune-Twin/actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**TuneTwin** is a music discovery engine that analyzes YouTube Music playlists to uncover their algorithmic "DNA". By understanding the underlying vibe, tempo, and genre composition of a playlist, TuneTwin generates "Twin" recommendations—tracks that fit the playlist's energy profile.

> **Find your playlist's perfect matches.**

## Key Features

- **Vibe Engine Analysis**: Deconstructs playlists into core mood and genre components (e.g., "Chill Lofi", "Aggressive Phonk", "90s Nostalgia").
- **Twin Recommendations**: Provides matched song suggestions based on the collective algorithmic identity of the seed playlist.
- **Artist Details**: Displays artist biographies, top tracks, and visual details.
- **PWA & Mobile Support**: Installable as a native app on iOS and Android with offline-capable UI.
- **Adaptive UI**: High-contrast Dark and Light modes that respect system preferences.
- **Accessible Design**: Compliant with WCAG 2.1 AA standards, featuring high-contrast colors and keyboard navigation.
- **Privacy Focused**: No login required for analysis. Search history is stored locally on the device.

## Technology Stack

This project is built using modern web technologies focusing on performance and type safety.

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Actions)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Runtime**: [Bun](https://bun.sh/)
- **UI System**: [Material UI v7](https://mui.com/)
- **Data Fetching**: [youtubei.js](https://github.com/LuanRT/YouTube.js)
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/)

## Getting Started

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

Visit `http://localhost:3000` to access the application.

### Testing & Verification

Run the test suite (Unit & Component tests):

```bash
# Run tests
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

## Architecture

The project follows a **Feature-Sliced Design (Lite)** approach:

```
src/
├── app/                 # Next.js App Router (Routes & Layouts)
├── components/          # Shared UI Components (Providers, Layouts)
├── features/            # Feature-based modules
│   └── playlist/        # Playlist Analysis Feature
│       ├── components/  # Feature-specific components
│       ├── actions.ts   # Server Actions
│       └── ...
├── hooks/               # Custom React Hooks
├── lib/                 # Core Utilities & Services
│   ├── services/        # API Services
│   ├── theme.ts         # Design Tokens
│   └── types.ts         # Shared Types
└── test/                # Test setup and utilities
```

## License

This project is open source and available under the [MIT License](LICENSE).