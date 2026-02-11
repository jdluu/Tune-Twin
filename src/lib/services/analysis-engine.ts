import type { Track, VibeTag, VibeVector, PlaylistAnalysis } from "../types";
import { VIBE_DICTIONARY } from "../data/vibe-dictionary";
import { VIBE_KEYWORDS } from "../constants"; // Keeping for legacy keyword compatibility if needed

// Helper to escape regex
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Converts a single track into a Vibe Vector based on keyword matching.
 * Returns null if no keywords are matched.
 */
export function vectorizeTrack(track: Track): VibeVector | null {
    const textToAnalyze = `${track.title} ${track.artist} ${track.album || ""}`.toLowerCase();
    
    let energySum = 0;
    let moodSum = 0;
    let danceSum = 0;
    let matches = 0;

    Object.entries(VIBE_DICTIONARY).forEach(([keyword, vector]) => {
        // Word boundary check for accuracy
        const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, "i");
        if (regex.test(textToAnalyze)) {
            energySum += vector.energy;
            moodSum += vector.mood;
            danceSum += vector.dance;
            matches++;
        }
    });

    if (matches === 0) return null;

    return {
        energy: energySum / matches,
        mood: moodSum / matches,
        dance: danceSum / matches
    };
}

/**
 * Calculates the Euclidian distance between two vectors.
 */
function calculateDistance(v1: VibeVector, v2: VibeVector): number {
    return Math.sqrt(
        Math.pow(v1.energy - v2.energy, 2) +
        Math.pow(v1.mood - v2.mood, 2) +
        Math.pow(v1.dance - v2.dance, 2)
    );
}

/**
 * Extracts valid vectors from a list of tracks by checking each for vibe keywords.
 * @param tracks - The list of tracks to vectorize.
 * @returns Array of tracks with their corresponding vibe vectors.
 */
function getTrackVectors(tracks: Track[]): { track: Track, vector: VibeVector }[] {
    const vectors: { track: Track, vector: VibeVector }[] = [];
    tracks.forEach(t => {
        const v = vectorizeTrack(t);
        if (v) vectors.push({ track: t, vector: v });
    });
    return vectors;
}

/**
 * Maps average distance from centroid to a 0-100 cohesion score.
 * Lower distance results in a higher cohesion score.
 * @param avgDist - The average Euclidian distance of track vectors from the centroid.
 * @returns An integer score between 0 and 100.
 */
function getCohesionScore(avgDist: number): number {
    // Map avgDist 0.0 -> 0.5 (very spread) to 100 -> 0 score
    const rawCohesion = Math.max(0, 1 - (avgDist * 2)); 
    return Math.round(rawCohesion * 100);
}

/**
 * Returns a descriptive text and theme color for a given cohesion score.
 * @param score - The cohesion score (0-100).
 * @returns Object containing descriptive text and Hex color code.
 */
function getVibeDescription(score: number): { text: string, color: string } {
    if (score > 80) return { text: "Super Cohesive", color: "#4caf50" };
    if (score < 40) return { text: "Scattered Vibes", color: "#f44336" };
    return { text: "Moderately Cohesive", color: "#ff9800" };
}

/**
 * Analyzes a playlist to determine its vibe footprint, cohesion, and outliers.
 */
export function analyzePlaylist(tracks: Track[]): { analysis: PlaylistAnalysis, vibeTags: VibeTag[] } {
    const trackVectors = getTrackVectors(tracks);

    if (trackVectors.length === 0) {
        return {
            analysis: {
                cohesionScore: 0,
                details: { text: "Insufficient data to analyze vibe.", color: "#9e9e9e" },
                dominantVibes: { energy: 0, mood: 0, dance: 0 },
                outliers: []
            },
            vibeTags: []
        };
    }

    const centroid: VibeVector = {
        energy: trackVectors.reduce((sum, i) => sum + i.vector.energy, 0) / trackVectors.length,
        mood: trackVectors.reduce((sum, i) => sum + i.vector.mood, 0) / trackVectors.length,
        dance: trackVectors.reduce((sum, i) => sum + i.vector.dance, 0) / trackVectors.length,
    };

    const distances = trackVectors.map(item => ({
        track: item.track,
        dist: calculateDistance(item.vector, centroid)
    }));

    const avgDist = distances.reduce((sum, d) => sum + d.dist, 0) / trackVectors.length;
    const cohesionScore = getCohesionScore(avgDist);

    const outliers = distances
        .filter(d => d.dist > 0.4)
        .sort((a, b) => b.dist - a.dist)
        .map(d => d.track)
        .slice(0, 5);

    return {
        analysis: {
            cohesionScore,
            details: getVibeDescription(cohesionScore),
            dominantVibes: centroid,
            outliers
        },
        vibeTags: legacyAnalyze(tracks)
    };
}

/**
 * Legacy analysis function that counts keyword occurrences.
 * Used for specific vibe tagging in the UI.
 * @param tracks - The list of tracks to analyze.
 * @returns Array of VibeTags with calculated scores.
 */
function legacyAnalyze(tracks: Track[]): VibeTag[] {
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

    // Instrumentals check
    if (!counts["instrumental"] && (textToAnalyze.includes("beats") || textToAnalyze.includes("lo-fi"))) {
        counts["instrumental"] = 5;
    }

    const sorted = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    const maxCount = sorted[0]?.[1] || 1;

    return sorted.map(([keyword, count]) => ({
        ...VIBE_KEYWORDS[keyword],
        score: Math.round((count / maxCount) * 100)
    }));
}

// Export the wrapper to match the old API signature if needed, 
// but we really want the full object now.
export function analyzePlaylistVibe(tracks: Track[]) {
    return analyzePlaylist(tracks);
}
