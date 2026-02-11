import { describe, it, expect, mock, beforeEach } from 'bun:test';

// Mock dependencies before importing the module under test
mock.module('@/lib/services/youtube', () => ({
    getPlaylist: mock(() => Promise.resolve({ tracks: [], metadata: {} })),
    getRecommendationsMulti: mock(() => Promise.resolve([])),
    getArtistDetails: mock(() => Promise.resolve({})),
}));

mock.module('@/lib/security/rate-limiter', () => ({
    isRateLimited: mock(() => Promise.resolve(false)),
}));

mock.module('next/headers', () => ({
    headers: mock(() => Promise.resolve({
        get: () => '127.0.0.1',
    })),
}));

import { processPlaylistAction, getRecommendationsAction, getArtistDetailsAction } from './actions';
import { getPlaylist, getRecommendationsMulti, getArtistDetails } from '@/lib/services/youtube';
import { isRateLimited } from '@/lib/security/rate-limiter';

describe('processPlaylistAction', () => {
    beforeEach(() => {
        (isRateLimited as any).mockClear();
        (getPlaylist as any).mockClear();
    });

    it('should return error for invalid URL format', async () => {
        const formData = new FormData();
        formData.set('url', 'short');

        const result = await processPlaylistAction(null, formData);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('10 characters');
    });

    it('should return error when rate limited', async () => {
        (isRateLimited as any).mockImplementation(() => Promise.resolve(true));
        
        const formData = new FormData();
        formData.set('url', 'https://music.youtube.com/playlist?list=PLsomethingvalid');

        const result = await processPlaylistAction(null, formData);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('Too many requests');
    });

    it('should extract playlist ID from URL and call getPlaylist', async () => {
        (isRateLimited as any).mockImplementation(() => Promise.resolve(false));
        (getPlaylist as any).mockImplementation(() => Promise.resolve({
            tracks: [{ id: '1', title: 'Track 1', artist: 'Artist 1', thumbnail: 'thumb.jpg' }],
            metadata: { id: 'PLtest12345', title: 'Test Playlist', trackCount: 1, thumbnail: 'thumb.jpg' }
        }));

        const formData = new FormData();
        formData.set('url', 'https://music.youtube.com/playlist?list=PLtest12345');

        const result = await processPlaylistAction(null, formData);
        
        expect(getPlaylist).toHaveBeenCalledWith('PLtest12345');
        expect(result.success).toBe(true);
        expect(result.data?.original).toHaveLength(1);
    });

    it('should accept raw playlist IDs', async () => {
        (isRateLimited as any).mockImplementation(() => Promise.resolve(false));
        (getPlaylist as any).mockImplementation(() => Promise.resolve({
            tracks: [{ id: '1', title: 'Track 1', artist: 'Artist 1', thumbnail: 'thumb.jpg' }],
            metadata: { id: 'PLtest12345678', title: 'Test Playlist', trackCount: 1, thumbnail: 'thumb.jpg' }
        }));

        const formData = new FormData();
        formData.set('url', 'PLtest12345678');

        const result = await processPlaylistAction(null, formData);
        
        expect(getPlaylist).toHaveBeenCalledWith('PLtest12345678');
        expect(result.success).toBe(true);
    });
});

describe('getRecommendationsAction', () => {
    beforeEach(() => {
        (isRateLimited as any).mockClear();
        (getRecommendationsMulti as any).mockClear();
    });

    it('should return error for empty seed IDs', async () => {
        const result = await getRecommendationsAction([]);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('No seed tracks');
    });

    it('should limit seed IDs to 5', async () => {
        (isRateLimited as any).mockImplementation(() => Promise.resolve(false));
        (getRecommendationsMulti as any).mockImplementation(() => Promise.resolve([]));

        const seedIds = ['1', '2', '3', '4', '5', '6', '7'];
        await getRecommendationsAction(seedIds);
        
        expect(getRecommendationsMulti).toHaveBeenCalledWith(['1', '2', '3', '4', '5']);
    });
    it('should filter out excluded IDs', async () => {
        (isRateLimited as any).mockImplementation(() => Promise.resolve(false));
        (getRecommendationsMulti as any).mockImplementation(() => Promise.resolve([
            { id: '1', title: 'Track 1', artist: 'Artist 1', thumbnail: 't1.jpg' },
            { id: '2', title: 'Track 2', artist: 'Artist 2', thumbnail: 't2.jpg' },
            { id: '3', title: 'Track 3', artist: 'Artist 3', thumbnail: 't3.jpg' }
        ]));

        const seedIds = ['10'];
        const excludeIds = ['2']; // We want to exclude Track 2
        
        const result = await getRecommendationsAction(seedIds, excludeIds);
        
        expect(result.success).toBe(true);
        expect(result.data?.recommendations).toHaveLength(2);
        expect(result.data?.recommendations.find(t => t.id === '2')).toBeUndefined();
        expect(result.data?.recommendations.find(t => t.id === '1')).toBeDefined();
    });
});

describe('getArtistDetailsAction', () => {
    it('should return error for invalid artist ID', async () => {
        const result = await getArtistDetailsAction('x');
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid Artist ID');
    });

    it('should call getArtistDetails with valid ID', async () => {
        (getArtistDetails as any).mockImplementation(() => Promise.resolve({
            name: 'Test Artist',
            bio: 'A bio',
            thumbnail: null,
            topTracks: []
        }));

        const result = await getArtistDetailsAction('UCvalid123');
        
        expect(getArtistDetails).toHaveBeenCalledWith('UCvalid123');
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe('Test Artist');
    });
});
