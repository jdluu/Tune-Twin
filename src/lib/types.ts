import { Track, PlaylistResult, VibeTag } from './validations';

export type { Track, PlaylistResult, VibeTag };

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
