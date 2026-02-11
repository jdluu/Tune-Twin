import { Innertube } from 'youtubei.js';
import type { Track, PlaylistMetadata } from '@/lib/types';
import { unstable_cache } from 'next/cache';
import type { 
    YtMusicItem, 
    YtArtistResponse
} from './youtube-types';
import { logger } from '../logger';
import { withRetry } from '../utils/retry';
import { 
    getText, 
    sanitizeTrack, 
    isValidPlaylistResponse, 
    isValidUpNextResponse 
} from './youtube-helpers';

let youtube: Innertube | null = null;

async function getYoutube() {
  if (!youtube) {
    youtube = await Innertube.create();
  }
  return youtube;
}

const _getPlaylist = async (playlistId: string): Promise<{ tracks: Track[], metadata: PlaylistMetadata }> => {
    const yt = await getYoutube();
    const playlist = await withRetry(() => yt.music.getPlaylist(playlistId));
    
    // Runtime Validation
    if (!isValidPlaylistResponse(playlist)) {
        logger.error({ msg: "Invalid response from YouTube API", playlistId });
        throw new Error("Invalid response from YouTube API: Missing playlist items.");
    }
    
    // Filter for items that look like tracks (have an ID)
    if (!playlist.items || playlist.items.length === 0) {
         throw new Error("Playlist seems empty or private.");
    }

    const validItems = playlist.items.filter((item) => {
        const musicItem = item as YtMusicItem;
        return musicItem.id || musicItem.videoId;
    });

    const tracks = validItems
        .map((item) => sanitizeTrack(item as YtMusicItem))
        .filter(track => track !== null);

    // Extract Metadata
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const header = playlist.header as any;
    const title = getText(header?.title) || playlist.title || "Unknown Playlist";
    const thumbnail = header?.thumbnails ? header.thumbnails[header.thumbnails.length - 1].url : null;
    
    return {
        tracks,
        metadata: {
            id: playlistId,
            title,
            trackCount: tracks.length,
            thumbnail
        }
    };
}

export const _getRecommendations = async (seedVideoId: string): Promise<Track[]> => {
    const yt = await getYoutube();
    const upNext = await withRetry(() => yt.music.getUpNext(seedVideoId));

    // Runtime Validation
    if (!isValidUpNextResponse(upNext)) {
        // Recommendations are optional, so we log but don't crash
        logger.warn({ msg: "Invalid response structure from getUpNext", seedVideoId });
        return [];
    }

    // Recommendations can be in .items or .contents
    const recItemsRaw = upNext.items || upNext.contents || [];
    logger.info({ msg: "Fetched recommendations", seedVideoId, count: recItemsRaw.length });

    return recItemsRaw
        .filter((item) => {
             const musicItem = item as YtMusicItem;
             return musicItem.videoId || musicItem.id || musicItem.video_id;
        })
        .map((item) => sanitizeTrack(item as YtMusicItem))
        .filter(track => track !== null);
}

const _getArtistDetails = async (artistId: string) => {
    const yt = await getYoutube();
    try {
        const artist = await withRetry(() => yt.music.getArtist(artistId)) as YtArtistResponse;
        
        let topTracks: Track[] = [];
        if (artist.sections) {
            const songsSection = artist.sections.find(section => {
                const title = getText(section.title).toLowerCase();
                return title.includes('songs') || title.includes('top');
            });

            if (songsSection) {
                const items = songsSection.items || songsSection.contents || [];
                topTracks = items
                    .filter((item) => {
                        const musicItem = item as YtMusicItem;
                        return musicItem.videoId || musicItem.id || musicItem.video_id;
                    })
                    .map((item) => sanitizeTrack(item as YtMusicItem))
                    .filter(track => track !== null)
                    .slice(0, 5); // Limit to top 5
            }
        }

        return {
            name: getText(artist.header?.title) || "Unknown Artist",
            bio: getText(artist.header?.description) || "No biography available.",
            thumbnail: artist.header?.thumbnails ? artist.header.thumbnails[0]?.url : null,
            topTracks
        };
    } catch (error) {
        logger.error({ msg: "Error fetching artist details", artistId, error });
        return null;
    }
}

/**
 * Fetches a playlist from YouTube Music and extracts its metadata and tracks.
 * Cached for 5 minutes.
 *
 * @param id - The YouTube Playlist ID (e.g., PL...).
 * @returns An object containing the playlist tracks and metadata.
 * @throws Error if the playlist is empty, private, or invalid.
 */
export const getPlaylist = (id: string) => unstable_cache(
    () => _getPlaylist(id),
    ['get-playlist', id, 'playlist'],
    { revalidate: 300 }
)();

export const getRecommendations = (id: string) => unstable_cache(
    () => _getRecommendations(id),
    ['get-recommendations-v2', id],
    { revalidate: 300 }
)();

export const getArtistDetails = (id: string) => unstable_cache(
    () => _getArtistDetails(id),
    ['get-artist-details-v2', id],
    { revalidate: 300 }
)();

/**
 * Fetches recommendations for multiple seed tracks in parallel.
 * Results are flattened and deduplicated by Track ID.
 *
 * @param seedVideoIds - Array of video IDs to use as seeds.
 * @returns A unified list of unique recommended tracks.
 */
export const getRecommendationsMulti = async (seedVideoIds: string[]): Promise<Track[]> => {
    const promises = seedVideoIds.map(id => getRecommendations(id));
    const results = await Promise.all(promises);
    
    // Flatten and deduplicate
    const allTracks = results.flat();
    const uniqueTracks = new Map<string, Track>();
    
    allTracks.forEach(track => {
        if (track.id && !uniqueTracks.has(track.id)) {
            uniqueTracks.set(track.id, track);
        }
    });

    return Array.from(uniqueTracks.values());
}
