import type { Track } from '@/lib/types';
import { TrackSchema } from '@/lib/validations';
import { logger } from '../logger';
import type { 
    YtMusicItem, 
    YtText, 
    YtThumbnail, 
    YtPlaylistResponse, 
    YtUpNextResponse 
} from './youtube-types';

/**
 * Extracts text from various InnerTube text formats (string, run, object).
 * @param data - The text data to parse.
 * @returns The extracted string or empty string.
 */
export const getText = (data: YtText | string | undefined): string => {
    if (!data) return "";
    if (typeof data === 'string') return data;
    if (data.text) return data.text;
    if (data.runs) return data.runs.map((r) => r.text).join("");
    return "";
};

/**
 * Extracts the highest quality thumbnail URL from a music item.
 * Handles nested structure variants.
 * @param item - The item containing thumbnail data.
 * @returns The thumbnail URL or null.
 */
export const getThumbnail = (item: YtMusicItem): string | null => {
    // Handle nested thumbnail structures
    let thumbs: YtThumbnail[] | undefined;

    if (Array.isArray(item.thumbnails)) {
        thumbs = item.thumbnails;
    } else if (item.thumbnail && 'thumbnails' in item.thumbnail && item.thumbnail.thumbnails) {
        thumbs = item.thumbnail.thumbnails;
    } else if (item.thumbnail && 'contents' in item.thumbnail && item.thumbnail.contents?.[0]?.image?.sources) {
        thumbs = item.thumbnail.contents[0].image.sources;
    }

    if (thumbs && Array.isArray(thumbs) && thumbs.length > 0) {
        // Get the last one (usually highest quality)
        return thumbs[thumbs.length - 1].url || thumbs[0].url || "";
    }
    return null;
}

/**
 * Sanitizes and validates a raw YouTube Music item into a Track object.
 * @param item - The raw item from InnerTube.
 * @returns The validated Track object or null if invalid.
 */
export const sanitizeTrack = (item: YtMusicItem): Track => {
    // Extract Artist and ArtistID
    let artist = "";
    let artistId: string | undefined = undefined;

    if (item.artists && Array.isArray(item.artists) && item.artists.length > 0) {
        artist = item.artists.map((a) => a.name).join(", ");
        artistId = item.artists[0].id || item.artists[0].channel_id || item.artists[0].channelId;
    } else {
        artist = getText(item.subtitle) || getText(item.short_byline) || getText(item.long_byline) || getText(item.author);
    }

    const rawTrack = {
        id: item.video_id || item.videoId || item.id || "",
        title: getText(item.title),
        artist: artist,
        artistId: artistId,
        thumbnail: getThumbnail(item),
        duration: getText(item.duration) || getText(item.length) || undefined,
        album: getText(item.album) || undefined
    };

    const validation = TrackSchema.safeParse(rawTrack);
    if (!validation.success) {
        logger.warn({ msg: "Malformed track data detected", error: validation.error.format(), rawTrack });
        return null as unknown as Track; // We'll filter this out
    }

    return validation.data;
};

/**
 * Type Guard to check if a response is a valid playlist response.
 *
 * @param data - The unknown data to verify.
 * @returns True if the data matches the playlist response structure.
 */
export function isValidPlaylistResponse(data: unknown): data is YtPlaylistResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'items' in data &&
        Array.isArray((data as YtPlaylistResponse).items)
    );
}

/**
 * Type Guard to check if a response is a valid UpNext/Recommendation response.
 *
 * @param data - The unknown data to verify.
 * @returns True if the data matches the UpNext response structure.
 */
export function isValidUpNextResponse(data: unknown): data is YtUpNextResponse {
    if (typeof data !== 'object' || data === null) return false;
    const asType = data as YtUpNextResponse;
    // It should have either items or contents (or both, or empty arrays)
    return Array.isArray(asType.items) || Array.isArray(asType.contents);
}

/**
 * Parses a YouTube playlist ID from a URL or a raw string.
 * Supports various YouTube URL formats.
 * 
 * @param input - The URL or raw ID candidate.
 * @returns The parsed playlist ID or null if invalid.
 */
export function parsePlaylistId(input: string): string | null {
    if (!input) return null;

    // 1. Try parsing as a URL
    try {
        const urlObj = new URL(input);
        const listParam = urlObj.searchParams.get("list");
        if (listParam) return listParam;
    } catch {
        // Not a URL
    }

    // 2. Check if the input itself looks like an ID
    // YouTube IDs are generally Alphanumeric with dashes/underscores
    // Playlists usually start with PL, OLAK5e..., RD... (>= 10 chars)
    if (/^[a-zA-Z0-9\-_]{10,}$/.test(input)) {
        return input;
    }

    return null;
}
