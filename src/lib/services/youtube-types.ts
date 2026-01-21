// Internal types for parsing youtubei.js responses
// These are not exported to the rest of the application

export interface YtThumbnail {
    url: string;
    width: number;
    height: number;
}

export interface YtRun {
    text: string;
}

export interface YtText {
    text?: string;
    runs?: YtRun[];
}

export interface YtArtist {
    name: string;
    id?: string;
    channel_id?: string;
    channelId?: string;
}

export interface YtArtistResponse {
    header?: {
        title?: YtText;
        description?: YtText;
        thumbnails?: YtThumbnail[];
    };
    sections?: any[];
}

export interface YtMusicItem {
    id?: string;
    videoId?: string;
    video_id?: string;
    title?: YtText | string;
    artists?: YtArtist[];
    subtitle?: YtText | string;
    short_byline?: YtText | string;
    long_byline?: YtText | string;
    author?: YtText | string;
    thumbnail?: {
        thumbnails?: YtThumbnail[];
        contents?: Array<{
            image?: {
                sources?: YtThumbnail[];
            }
        }>;
    } | YtThumbnail[];
    thumbnails?: YtThumbnail[];
    duration?: YtText | string;
    length?: YtText | string;
    album?: YtText | string;
}

export interface YtPlaylistResponse {
    items?: YtMusicItem[];
}

export interface YtUpNextResponse {
    items?: YtMusicItem[];
    contents?: YtMusicItem[];
}
