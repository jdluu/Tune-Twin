'use server';

import { ActionResponse, Track } from '@/lib/types';
import { getPlaylist, getRecommendations } from '@/lib/services/youtube';

export async function processPlaylistAction(playlistInput: string): Promise<ActionResponse> {
    try {
        if (!playlistInput) {
            return { success: false, error: "Please enter a valid URL or ID." };
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
        try {
            tracks = await getPlaylist(playlistId);
        } catch (e: any) {
             return { success: false, error: `Could not fetch playlist: ${e.message || 'Unknown error'}` };
        }

        if (!tracks || tracks.length === 0) {
            return { success: false, error: "Empty playlist or could not find tracks" };
        }

        // Recommendation Logic
        const lastTrack = tracks[tracks.length - 1];
        const seedVideoId = lastTrack?.id;

        if (!seedVideoId) {
             return { success: false, error: "Could not identify seed track ID for recommendations" };
        }

        console.log(`Fetching recommendations based on seed ID: ${seedVideoId}`);
        
        let recommendations: Track[] = [];
        try {
            recommendations = await getRecommendations(seedVideoId);
        } catch (e: any) {
             console.error("Recommendation fetch failed", e);
             // We can still return the original tracks even if recs fail
        }

        return {
            success: true,
            data: {
                original: tracks,
                recommendations: recommendations
            }
        };

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message || "Internal Server Error" };
    }
}