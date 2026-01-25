import { VibeTag } from "./types";

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
    "2000s": { label: "2000s Era", color: "#3f51b5" }
};
