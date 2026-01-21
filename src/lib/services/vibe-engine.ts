import { Track } from "../types";

export interface VibeTag {
    label: string;
    color: string;
}

const VIBE_KEYWORDS: Record<string, VibeTag> = {
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

export function analyzePlaylistVibe(tracks: Track[]): VibeTag[] {
    const counts: Record<string, number> = {};
    const textToAnalyze = tracks.map(t => 
        `${t.title} ${t.artist} ${t.album || ""}`.toLowerCase()
    ).join(" ");

    Object.keys(VIBE_KEYWORDS).forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        const matches = textToAnalyze.match(regex);
        if (matches) {
            counts[keyword] = matches.length;
        }
    });

    // Special check for Instrumental (based on common lofi markers if no lyrics mentioned)
    if (!counts["instrumental"] && (textToAnalyze.includes("beats") || textToAnalyze.includes("lo-fi"))) {
        counts["instrumental"] = 5;
    }

    // Sort by count and take top 3
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([keyword]) => VIBE_KEYWORDS[keyword]);
}
