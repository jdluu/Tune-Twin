import type { Track, PlaylistResult as BasePlaylistResult, VibeTag } from './validations';

/**
 * Represents a track's position in the 3D Vibe Space.
 * All values are normalized between 0.0 and 1.0.
 */
export interface VibeVector {
    energy: number;
    mood: number;
    dance: number;
}

export interface PlaylistAnalysis {
    cohesionScore: number; // 0-100
    details: {
        text: string;
        color: string;
    };
    dominantVibes: VibeVector; // The centroid
    outliers: Track[];
}

export interface PlaylistResult extends BasePlaylistResult {
    analysis?: PlaylistAnalysis;
}

export type { Track, VibeTag };

/**
 * Metadata associated with a YouTube playlist.
 */
export interface PlaylistMetadata {
    /** The playlist ID. */
    id: string;
    /** The title of the playlist. */
    title: string;
    /** Total number of tracks found. */
    trackCount: number;
    /** URL of the playlist thumbnail. */
    thumbnail?: string | null;
}

/**
 * Standardized response format for Server Actions.
 */
export interface ActionResponse {
    /** Whether the operation was successful. */
    success: boolean;
    /** The payload data (if success is true). */
    data?: PlaylistResult;
    /** Error message (if success is false). */
    error?: string;
}
