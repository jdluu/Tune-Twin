import { Innertube } from 'youtubei.js';
import { Track } from '@/lib/types';
import { unstable_cache } from 'next/cache';
import type { 
    YtMusicItem, 
    YtText, 
    YtPlaylistResponse, 
    YtUpNextResponse,
    YtThumbnail
} from './youtube-types';

let youtube: Innertube | null = null;

async function getYoutube() {
  if (!youtube) {
    youtube = await Innertube.create();
  }
  return youtube;
}

// Helper to extract text from various InnerTube formats
const getText = (data: YtText | string | undefined): string => {
    if (!data) return "";
    if (typeof data === 'string') return data;
    if (data.text) return data.text;
    if (data.runs) return data.runs.map((r) => r.text).join("");
    return "";
};

// Helper to get thumbnail
const getThumbnail = (item: YtMusicItem): string | null => {
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

const sanitizeTrack = (item: YtMusicItem): Track => {
    // Extract Artist
    let artist = "";
    if (item.artists && Array.isArray(item.artists)) {
        artist = item.artists.map((a) => a.name).join(", ");
    } else {
        artist = getText(item.subtitle) || getText(item.short_byline) || getText(item.long_byline) || getText(item.author);
    }

    return {
        id: item.video_id || item.videoId || item.id || "",
        title: getText(item.title),
        artist: artist,
        thumbnail: getThumbnail(item),
        duration: getText(item.duration) || getText(item.length),
        album: getText(item.album) || undefined
    };
};

// Type Guard to verify if an object has the expected 'items' array
function isValidPlaylistResponse(data: unknown): data is YtPlaylistResponse {
    return (
        typeof data === 'object' &&
        data !== null &&
        'items' in data &&
        Array.isArray((data as YtPlaylistResponse).items)
    );
}

// Type Guard for UpNext/Recommendations
function isValidUpNextResponse(data: unknown): data is YtUpNextResponse {
    if (typeof data !== 'object' || data === null) return false;
    const asType = data as YtUpNextResponse;
    // It should have either items or contents (or both, or empty arrays)
    return Array.isArray(asType.items) || Array.isArray(asType.contents);
}

const _getPlaylist = async (playlistId: string): Promise<Track[]> => {
    const yt = await getYoutube();
    const playlist = await yt.music.getPlaylist(playlistId);
    
    // Runtime Validation
    if (!isValidPlaylistResponse(playlist)) {
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
    return validItems.map((item) => sanitizeTrack(item as YtMusicItem));
}

const _getRecommendations = async (seedVideoId: string): Promise<Track[]> => {
    const yt = await getYoutube();
    const upNext = await yt.music.getUpNext(seedVideoId);

    // Runtime Validation
    if (!isValidUpNextResponse(upNext)) {
        // Recommendations are optional, so we log but don't crash
        console.warn("Invalid response structure from getUpNext", upNext);
        return [];
    }

    // Recommendations can be in .items or .contents
    const recItemsRaw = upNext.items || upNext.contents || [];

    return recItemsRaw
        .filter((item) => {
             const musicItem = item as YtMusicItem;
             return musicItem.videoId || musicItem.id || musicItem.video_id;
        })
        .map((item) => sanitizeTrack(item as YtMusicItem));
}

export const getPlaylist = unstable_cache(_getPlaylist, ['get-playlist'], { revalidate: 300 });
export const getRecommendations = unstable_cache(_getRecommendations, ['get-recommendations'], { revalidate: 300 });
