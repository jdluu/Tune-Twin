import { useState, useCallback } from 'react';

/**
 * Custom hook to manage the state of the YouTube player and playlist queue.
 * Handles single track playback, playlist queueing, and closing the player.
 *
 * @returns Object containing:
 * - `playingVideoId`: The ID of the currently playing video, or null if none.
 * - `playlistQueue`: Array of video IDs queued for playback.
 * - `playTrack`: Function to play a single track (clears queue).
 * - `playQueue`: Function to play a track and queue subsequent tracks.
 * - `closePlayer`: Function to stop playback and clear the queue.
 */
export function usePlayerQueue() {
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const [playlistQueue, setPlaylistQueue] = useState<string[]>([]);

    /**
     * Plays a single track and clears the playlist queue.
     * @param id - The YouTube video ID to play.
     */
    const playTrack = useCallback((id: string) => {
        setPlayingVideoId(id);
        setPlaylistQueue([]);
    }, []);

    /**
     * Plays an initial track and sets up a queue for subsequent playback.
     * @param initialTrackId - The first track to play.
     * @param queueIds - Array of track IDs to play after the first one.
     */
    const playQueue = useCallback((initialTrackId: string, queueIds: string[]) => {
        setPlayingVideoId(initialTrackId);
        setPlaylistQueue(queueIds);
    }, []);

    /**
     * Closes the player and clears the state.
     */
    const closePlayer = useCallback(() => {
        setPlayingVideoId(null);
        setPlaylistQueue([]);
    }, []);

    return {
        playingVideoId,
        playlistQueue,
        playTrack,
        playQueue,
        closePlayer
    };
}
