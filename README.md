# TuneTwin

TuneTwin is a music discovery application that generates algorithmic recommendations from YouTube Music playlists. Users can input a playlist URL and receive a curated list of similar tracks based on the playlist's musical profile.

## Features

- **Playlist Analysis**: Extracts track metadata including title, artist, album, and duration from YouTube Music playlists
- **Algorithmic Recommendations**: Generates similar track suggestions using YouTube Music's recommendation engine
- **Direct Playback Links**: Click any track title to open it directly in YouTube Music
- **Responsive Design**: Fluid typography and spacing scales adapt to all screen sizes
- **Light and Dark Themes**: Toggle between light and dark modes with a YouTube-inspired red accent

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | [Bun](https://bun.sh) |
| Backend | Bun HTTP Server with native routing |
| Frontend | React 19 with Material UI |
| API | [youtubei.js](https://github.com/LuanRT/YouTube.js) (unofficial YouTube Music API) |

## Requirements

- [Bun](https://bun.sh) v1.1 or later

## Installation

```bash
git clone https://github.com/jdluu/Tune-Twin.git
cd Tune-Twin
bun install
```

## Usage

### Development

```bash
bun run dev
```

The application will start at `http://localhost:3000` with hot module reloading enabled.

### Production

```bash
bun run build
bun run start
```

## How It Works

1. **Input**: Paste a YouTube Music playlist URL into the search field
2. **Processing**: The backend extracts the playlist ID and fetches track metadata via the YouTube Music API
3. **Recommendation**: The last track in the playlist is used as a seed to generate similar track suggestions
4. **Display**: Both the original playlist and recommendations are displayed side by side with metadata and playback links

## API Endpoints

### POST /api/process-playlist

Processes a YouTube Music playlist and returns track data with recommendations.

**Request Body:**
```json
{
  "playlistId": "PLxxxxxxxxxxxxxxxxxxxxxxxx"
}
```

**Response:**
```json
{
  "original": [
    {
      "id": "videoId",
      "title": "Track Title",
      "artist": "Artist Name",
      "thumbnail": "https://...",
      "duration": "3:45",
      "album": "Album Name"
    }
  ],
  "recommendations": [...]
}
```

## License

This project is licensed under the [MIT License](LICENSE).

## Disclaimer

YouTube Music is a trademark of Google LLC. This application is not affiliated with or endorsed by Google.
