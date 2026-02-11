import type { VibeTag } from "./types";

/**
 * Dictionary of vibe keywords mapping to display labels and colors.
 * Used for analyzing playlist titles and metadata.
 */
export const VIBE_KEYWORDS: Record<string, VibeTag> = {
    // Genres
    "lofi": { label: "Chill & Lofi", color: "#9c27b0" },
    "jazz": { label: "Jazz Vibes", color: "#ff9800" },
    "rock": { label: "Rock", color: "#f44336" },
    "metal": { label: "Metal", color: "#212121" },
    "hip hop": { label: "Hip Hop", color: "#4caf50" },
    "rap": { label: "Rap", color: "#4caf50" },
    "electronic": { label: "Electronic", color: "#00bcd4" },
    "techno": { label: "Techno", color: "#00bcd4" },
    "pop": { label: "Pop", color: "#e91e63" },
    "classical": { label: "Classical", color: "#795548" },
    "acoustic": { label: "Acoustic", color: "#ffc107" },
    "instrumental": { label: "Instrumental", color: "#607d8b" },
    "ambient": { label: "Ambient", color: "#009688" },
    
    // Moods
    "chill": { label: "Relaxing", color: "#03a9f4" },
    "hype": { label: "High Energy", color: "#ff5722" },
    "sad": { label: "Melancholy", color: "#3f51b5" },
    "happy": { label: "Upbeat", color: "#ffeb3b" },
    "focus": { label: "Focus", color: "#009688" },
    "workout": { label: "Workout", color: "#ff9800" },
    
    // Era
    "80s": { label: "80s Retro", color: "#e91e63" },
    "90s": { label: "90s Nostalgia", color: "#9c27b0" },
    "2000s": { label: "2000s Era", color: "#3f51b5" },

    // Extended Genres
    "indie": { label: "Indie", color: "#8bc34a" },
    "alternative": { label: "Alt", color: "#9c27b0" },
    "r&b": { label: "R&B", color: "#3f51b5" },
    "soul": { label: "Soul", color: "#795548" },
    "latin": { label: "Latin", color: "#f44336" },
    "folk": { label: "Folk", color: "#8d6e63" },
    "reggaeton": { label: "Reggaeton", color: "#ff5722" },
    
    // Context
    "night": { label: "Night", color: "#3f51b5" },
    "love": { label: "Love", color: "#e91e63" },
    "summer": { label: "Summer", color: "#ffeb3b" },
    "run": { label: "Running", color: "#ff9800" },
    "gym": { label: "Gym", color: "#f44336" }
};
