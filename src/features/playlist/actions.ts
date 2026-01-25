'use server';

import { ActionResponse } from '@/lib/types';
import { getPlaylist, getRecommendationsMulti, getArtistDetails } from '@/lib/services/youtube';
import { PlaylistInputSchema, ArtistIdSchema } from '@/lib/validations';
import { analyzePlaylistVibe } from '@/lib/services/vibe-engine';
import { isRateLimited } from '@/lib/security/rate-limiter';
import { logger } from '@/lib/logger';
import { headers } from 'next/headers';

/**
 * Server Action to process a YouTube playlist URL or ID.
 * Validates input, fetches playlist data, and performs vibe analysis.
 *
 * @param prevState - The previous state of the form (for useActionState).
 * @param formData - The form data containing the 'url' field.
 * @returns The result of the operation, including tracks, metadata, and vibe analysis.
 */
export async function processPlaylistAction(prevState: ActionResponse | null, formData: FormData): Promise<ActionResponse> {
    try {
        const ip = (await headers()).get('x-forwarded-for') || 'anonymous';
        if (await isRateLimited(ip, { maxRequests: 5, windowMs: 60000 })) {
            return { success: false, error: "Too many requests. Please try again in a minute." };
        }

        const playlistInput = formData.get('url') as string;
        const validation = PlaylistInputSchema.safeParse(playlistInput);
        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message };
        }

        let playlistId = "";

        // 1. Try parsing as a URL
        try {
            const urlObj = new URL(playlistInput);
            const listParam = urlObj.searchParams.get("list");
            if (listParam) {
                playlistId = listParam;
            }
        } catch {
            // Not a valid URL, treat as raw ID candidate
        }

        // 2. If not a URL, check if the input itself looks like an ID
        if (!playlistId) {
            // YouTube IDs are generally alphanumeric with dashes/underscores
            // Playlists usually start with PL, OLAK5e..., RD...
            // We use a loose check: at least 10 chars, safe characters
            if (/^[a-zA-Z0-9\-_]{10,}$/.test(playlistInput)) {
                playlistId = playlistInput;
            }
        }

        if (!playlistId) {
             return { success: false, error: "Invalid Playlist URL or ID format." };
        }

        console.log(`Fetching YouTube playlist: ${playlistId}`);

        let tracks;
        let metadata;
        try {
            const result = await getPlaylist(playlistId);
            tracks = result.tracks;
            metadata = result.metadata;
        } catch (e: unknown) {
             const errorMessage = e instanceof Error ? e.message : 'Unknown error';
             return { success: false, error: `Could not fetch playlist: ${errorMessage}` };
        }

        if (!tracks || tracks.length === 0) {
            return { success: false, error: "Empty playlist or could not find tracks" };
        }

        // Analysis Logic (Server Side)
        const vibes = analyzePlaylistVibe(tracks);

        return {
            success: true,
            data: {
                original: tracks,
                recommendations: [],
                vibes: vibes,
                metadata: metadata
            }
        };

    } catch (error: unknown) {
        console.error("Server Action Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
        return { success: false, error: errorMessage };
    }
}

/**
 * Server Action to fetch recommendations based on seed track IDs.
 *
 * @param seedIds - Array of YouTube Video IDs to use as seeds.
 * @returns An ActionResponse containing the recommended tracks.
 */
export async function getRecommendationsAction(seedIds: string[]): Promise<ActionResponse> {
    try {
        const ip = (await headers()).get('x-forwarded-for') || 'anonymous';
        if (await isRateLimited(ip, { maxRequests: 20, windowMs: 60000 })) {
            return { success: false, error: "Too many requests." };
        }

        if (!seedIds || seedIds.length === 0) {
            return { success: false, error: "No seed tracks provided." };
        }

        logger.info({ msg: `Fetching recommendations`, seedIds, ip });
        // Limit seed IDs to prevent abuse
        const limitedSeeds = seedIds.slice(0, 5);
        const recommendations = await getRecommendationsMulti(limitedSeeds);

        return {
            success: true,
            data: {
                original: [], // Not needed here
                recommendations: recommendations
            }
        };
    } catch (error: unknown) {
        console.error("Recommendations Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch recommendations.';
        return { success: false, error: errorMessage };
    }
}

/**
 * Server Action to fetch detailed information about an artist.
 *
 * @param artistId - The YouTube Artist Channel ID (e.g., UC...).
 * @returns An ActionResponse containing the artist details (bio, top tracks, etc.).
 */
export async function getArtistDetailsAction(artistId: string) {
    try {
        const validation = ArtistIdSchema.safeParse(artistId);
        if (!validation.success) {
            return { success: false, error: validation.error.issues[0].message };
        }

        const details = await getArtistDetails(artistId);
        if (!details) {
            return { success: false, error: "Could not find artist details." };
        }
        return { success: true, data: details };
    } catch (error: unknown) {
        console.error("Artist Details Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch artist details.';
        return { success: false, error: errorMessage };
    }
}