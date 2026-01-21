import { z } from 'zod';

// Track Schema
export const TrackSchema = z.object({
    id: z.string(),
    title: z.string(),
    artist: z.string(),
    artistId: z.string().optional(),
    album: z.string().optional(),
    duration: z.string().optional(),
    thumbnail: z.string().nullable().optional(),
});

export type Track = z.infer<typeof TrackSchema>;

// Vibe Tag Schema
export const VibeTagSchema = z.object({
  label: z.string(),
  color: z.string(),
});

export type VibeTag = z.infer<typeof VibeTagSchema>;

// Playlist Results Schema
export const PlaylistResultSchema = z.object({
    original: z.array(TrackSchema),
    recommendations: z.array(TrackSchema),
    vibes: z.array(VibeTagSchema).optional(),
});

export type PlaylistResult = z.infer<typeof PlaylistResultSchema>;

// Input Validations
export const PlaylistInputSchema = z.string().min(10, "Input must be a valid YouTube URL or at least 10 characters for an ID");
export const ArtistIdSchema = z.string().min(2, "Invalid Artist ID");

// Internal YouTube API Response Schemas (Partial for what we need)
export const YtThumbnailSchema = z.object({
    url: z.string(),
    width: z.number().optional(),
    height: z.number().optional(),
});

export const YtTextSchema = z.union([
    z.string(),
    z.object({
        text: z.string().optional(),
        runs: z.array(z.object({ text: z.string() })).optional(),
    })
]);
