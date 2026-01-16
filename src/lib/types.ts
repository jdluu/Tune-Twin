export interface Track {
    id: string;
    title: string;
    artist: string;
    album?: string;
    duration?: string;
    thumbnail?: string | null;
}

export interface PlaylistResult {
    original: Track[];
    recommendations: Track[];
}

export interface ActionResponse {
    success: boolean;
    data?: PlaylistResult;
    error?: string;
}
