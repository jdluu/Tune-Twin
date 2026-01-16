# Tune Twin

Tune Twin is a music discovery application that analyzes YouTube Music playlists to surface underlying algorithmic connections and recommendations. It leverages the YouTube internal API to fetch playlist data and generate "twin" suggestions based on the seed tracks.

## Technology Stack

This project is built using modern web technologies focusing on performance and type safety:

*   **Runtime:** Bun
*   **Framework:** Next.js 16 (App Router)
*   **Language:** TypeScript
*   **UI Library:** Material UI v7
*   **Data Fetching:** youtubei.js (Server Actions)

## Architecture

The application follows a Feature Sliced Design (Lite) architecture to ensure maintainability and separation of concerns.

*   **app/**: Contains the Next.js App Router configuration, global layouts, and route definitions.
*   **components/**: Houses shared UI components such as layouts and providers.
*   **features/**: Groups domain specific logic and UI. The core "playlist" feature contains the analysis logic, server actions, and specific components.
*   **lib/**: Contains shared utilities, including the Service Layer for external API interactions and strict type definitions.

## Getting Started

### Prerequisites

Ensure you have Bun installed on your system.

### Installation

Install the project dependencies:

```bash
bun install
```

### Development

Start the development server:

```bash
bun dev
```

The application will be available at http://localhost:3000.

### Building for Production

Create a production build:

```bash
bun run build
```

Start the production server:

```bash
bun start
```

## Deployment

This application is designed to be deployed on Vercel or any hosting platform that supports Next.js.

## License

MIT