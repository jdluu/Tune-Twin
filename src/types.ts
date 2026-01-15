export interface MusicItem {
    id?: string;
    title?: string;
    artist?: string; // This might be nested in 'artists' array or 'author' depending on exact youtubei.js response mapped to JSON
    // accessing raw youtubei.js output in frontend might be complex due to class instances becoming plain JSON over wire
    // We will define a loose interface for now or inspect the response.
    [key: string]: any;
}

export interface RecommendationResponse {
    original: any[]; // MusicResponsiveListItem[]
    recommendations: any; // AutomixPreviewVideo or similar
}
