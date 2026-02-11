
export interface VibeVector {
    energy: number; // 0.0 (Chill) -> 1.0 (Hype)
    mood: number;   // 0.0 (Sad/Dark) -> 1.0 (Happy/Bright)
    dance: number;  // 0.0 (Ambient) -> 1.0 (Danceable)
    label: string;
    color: string;
}

export const VIBE_DICTIONARY: Record<string, VibeVector> = {
    // --- Genres ---
    "lofi": { energy: 0.2, mood: 0.5, dance: 0.3, label: "Lofi", color: "#9c27b0" },
    "jazz": { energy: 0.4, mood: 0.6, dance: 0.5, label: "Jazz", color: "#ff9800" },
    "rock": { energy: 0.8, mood: 0.5, dance: 0.6, label: "Rock", color: "#f44336" },
    "metal": { energy: 0.95, mood: 0.2, dance: 0.4, label: "Metal", color: "#212121" },
    "hip hop": { energy: 0.7, mood: 0.6, dance: 0.9, label: "Hip Hop", color: "#4caf50" },
    "rap": { energy: 0.75, mood: 0.5, dance: 0.85, label: "Rap", color: "#4caf50" },
    "pop": { energy: 0.7, mood: 0.8, dance: 0.8, label: "Pop", color: "#e91e63" },
    "k-pop": { energy: 0.9, mood: 0.9, dance: 0.95, label: "K-Pop", color: "#ff4081" },
    "electronic": { energy: 0.8, mood: 0.7, dance: 0.9, label: "Electronic", color: "#00bcd4" },
    "techno": { energy: 0.9, mood: 0.4, dance: 0.95, label: "Techno", color: "#00bcd4" },
    "house": { energy: 0.8, mood: 0.8, dance: 0.95, label: "House", color: "#009688" },
    "classical": { energy: 0.3, mood: 0.4, dance: 0.1, label: "Classical", color: "#795548" },
    "acoustic": { energy: 0.3, mood: 0.6, dance: 0.4, label: "Acoustic", color: "#ffc107" },
    "ambient": { energy: 0.1, mood: 0.5, dance: 0.0, label: "Ambient", color: "#607d8b" },
    "r&b": { energy: 0.4, mood: 0.7, dance: 0.6, label: "R&B", color: "#3f51b5" },
    "soul": { energy: 0.4, mood: 0.7, dance: 0.5, label: "Soul", color: "#795548" },
    "folk": { energy: 0.3, mood: 0.5, dance: 0.3, label: "Folk", color: "#8d6e63" },
    "country": { energy: 0.6, mood: 0.7, dance: 0.6, label: "Country", color: "#795548" },
    "latin": { energy: 0.8, mood: 0.9, dance: 0.95, label: "Latin", color: "#f44336" },
    "reggaeton": { energy: 0.85, mood: 0.8, dance: 0.95, label: "Reggaeton", color: "#ff5722" },
    "blues": { energy: 0.4, mood: 0.4, dance: 0.4, label: "Blues", color: "#3f51b5" },
    "punk": { energy: 0.9, mood: 0.6, dance: 0.7, label: "Punk", color: "#d32f2f" },
    "indie": { energy: 0.5, mood: 0.6, dance: 0.5, label: "Indie", color: "#8bc34a" },
    "alternative": { energy: 0.6, mood: 0.5, dance: 0.5, label: "Alt", color: "#9c27b0" },
    
    // --- Moods/Descriptors ---
    "chill": { energy: 0.2, mood: 0.6, dance: 0.2, label: "Chill", color: "#03a9f4" },
    "relax": { energy: 0.1, mood: 0.6, dance: 0.1, label: "Relaxing", color: "#03a9f4" },
    "sleep": { energy: 0.0, mood: 0.5, dance: 0.0, label: "Sleep", color: "#455a64" },
    "party": { energy: 0.9, mood: 0.9, dance: 0.9, label: "Party", color: "#ffeb3b" },
    "workout": { energy: 0.9, mood: 0.8, dance: 0.8, label: "Workout", color: "#ff9800" },
    "focus": { energy: 0.3, mood: 0.6, dance: 0.1, label: "Focus", color: "#009688" },
    "study": { energy: 0.2, mood: 0.6, dance: 0.1, label: "Study", color: "#009688" },
    "sad": { energy: 0.2, mood: 0.1, dance: 0.2, label: "Sad", color: "#3f51b5" },
    "happy": { energy: 0.8, mood: 1.0, dance: 0.8, label: "Happy", color: "#ffeb3b" },
    "upbeat": { energy: 0.8, mood: 0.9, dance: 0.8, label: "Upbeat", color: "#ffeb3b" },
    "dark": { energy: 0.5, mood: 0.2, dance: 0.4, label: "Dark", color: "#212121" },
    "instrumental": { energy: 0.4, mood: 0.5, dance: 0.3, label: "Instrumental", color: "#607d8b" },
    "live": { energy: 0.7, mood: 0.7, dance: 0.6, label: "Live", color: "#f44336" },
    
    // --- Contextual/Common Words ---
    "night": { energy: 0.4, mood: 0.4, dance: 0.5, label: "Night", color: "#3f51b5" },
    "late": { energy: 0.3, mood: 0.3, dance: 0.4, label: "Late Night", color: "#311b92" },
    "drive": { energy: 0.6, mood: 0.6, dance: 0.6, label: "Driving", color: "#ff9800" },
    "vibes": { energy: 0.5, mood: 0.6, dance: 0.5, label: "Vibes", color: "#9c27b0" },
    "love": { energy: 0.5, mood: 0.8, dance: 0.4, label: "Love", color: "#e91e63" },
    "heart": { energy: 0.5, mood: 0.7, dance: 0.4, label: "Heart", color: "#e91e63" },
    "broken": { energy: 0.3, mood: 0.2, dance: 0.2, label: "Heartbreak", color: "#607d8b" },
    "summer": { energy: 0.8, mood: 0.9, dance: 0.7, label: "Summer", color: "#ffeb3b" },
    "rain": { energy: 0.2, mood: 0.3, dance: 0.1, label: "Rainy", color: "#607d8b" },
    "piano": { energy: 0.3, mood: 0.5, dance: 0.2, label: "Piano", color: "#795548" },
    "guitar": { energy: 0.5, mood: 0.5, dance: 0.4, label: "Guitar", color: "#ff9800" },
    "remix": { energy: 0.8, mood: 0.6, dance: 0.9, label: "Remix", color: "#00bcd4" },
    "slowed": { energy: 0.3, mood: 0.3, dance: 0.3, label: "Slowed", color: "#9c27b0" },
    "reverb": { energy: 0.4, mood: 0.4, dance: 0.3, label: "Reverb", color: "#673ab7" }
};
