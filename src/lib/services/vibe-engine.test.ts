import { describe, it, expect } from 'vitest';
import { analyzePlaylistVibe } from '@/lib/services/vibe-engine';
import { Track } from '@/lib/types';
import { VibeTag } from '@/lib/services/vibe-engine';

describe('analyzePlaylistVibe', () => {
    it('should identify chill and lofi vibes', () => {
        const tracks: Track[] = [
            { id: '1', title: 'Lofi hip hop beats', artist: 'Artist 1' },
            { id: '2', title: 'Chill study music', artist: 'Artist 2' },
        ];
        const vibes = analyzePlaylistVibe(tracks);
        expect(vibes.some((v: VibeTag) => v.label === 'Chill & Lofi' || v.label === 'Relaxing')).toBe(true);
    });

    it('should handle empty playlists', () => {
        const vibes = analyzePlaylistVibe([]);
        expect(vibes).toEqual([]);
    });

    it('should identify rock vibes', () => {
        const tracks: Track[] = [
            { id: '1', title: 'Hard Rock Anthem', artist: 'Rockers' },
            { id: '2', title: 'Metal Fury', artist: 'Headbangers' },
        ];
        const vibes = analyzePlaylistVibe(tracks);
        expect(vibes.some((v: VibeTag) => v.label === 'Rock')).toBe(true);
        expect(vibes.some((v: VibeTag) => v.label === 'Metal')).toBe(true);
    });
});
