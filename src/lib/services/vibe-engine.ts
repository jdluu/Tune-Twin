import { Track } from "../types";

export interface VibeTag {
    label: string;
    color: string;
    score?: number;
}

import { VIBE_KEYWORDS } from "../constants";

// Escape special regex characters in a string
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Analyzes a list of tracks to determine the dominant "vibes" (moods/genres).
 * Uses keyword matching against track titles, artists, and albums.
 *
 * @param tracks - The list of tracks to analyze.
 * @returns An array of the top 5 localized VibeTags with calculated scores (0-100).
 */
export function analyzePlaylistVibe(tracks: Track[]): VibeTag[] {
    const counts: Record<string, number> = {};
    const textToAnalyze = tracks.map(t => 
        `${t.title} ${t.artist} ${t.album || ""}`.toLowerCase()
    ).join(" ");

    Object.keys(VIBE_KEYWORDS).forEach(keyword => {
        const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "gi");
        const matches = textToAnalyze.match(regex);
        if (matches) {
            counts[keyword] = matches.length;
        }
    });

    // Special check for Instrumental (based on common lofi markers if no lyrics mentioned)
    if (!counts["instrumental"] && (textToAnalyze.includes("beats") || textToAnalyze.includes("lo-fi"))) {
        counts["instrumental"] = 5;
    }

    // Sort by count and take top 5 to have enough data
    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    // Normalize based on the highest count
    const maxCount = sorted[0]?.[1] || 1;

    return sorted.map(([keyword, count]) => ({
        ...VIBE_KEYWORDS[keyword],
        score: Math.round((count / maxCount) * 100) // 0-100 score
    }));
}
