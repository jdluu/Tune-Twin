import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies before importing the module under test
vi.mock('@/lib/services/youtube', () => ({
    getPlaylist: vi.fn(),
    getRecommendationsMulti: vi.fn(),
    getArtistDetails: vi.fn(),
}));

vi.mock('@/lib/security/rate-limiter', () => ({
    isRateLimited: vi.fn(() => Promise.resolve(false)),
}));

vi.mock('next/headers', () => ({
    headers: () => Promise.resolve({
        get: () => '127.0.0.1',
    }),
}));

import { processPlaylistAction, getRecommendationsAction, getArtistDetailsAction } from './actions';
import { getPlaylist, getRecommendationsMulti, getArtistDetails } from '@/lib/services/youtube';
import { isRateLimited } from '@/lib/security/rate-limiter';

describe('processPlaylistAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error for invalid URL format', async () => {
        const formData = new FormData();
        formData.set('url', 'short');

        const result = await processPlaylistAction(null, formData);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('10 characters');
    });

    it('should return error when rate limited', async () => {
        vi.mocked(isRateLimited).mockResolvedValue(true);
        
        const formData = new FormData();
        formData.set('url', 'https://music.youtube.com/playlist?list=PLsomethingvalid');

        const result = await processPlaylistAction(null, formData);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('Too many requests');
    });

    it('should extract playlist ID from URL and call getPlaylist', async () => {
        vi.mocked(isRateLimited).mockResolvedValue(false);
        vi.mocked(getPlaylist).mockResolvedValue({
            tracks: [{ id: '1', title: 'Track 1', artist: 'Artist 1', thumbnail: 'thumb.jpg' }],
            metadata: { id: 'PLtest12345', title: 'Test Playlist', trackCount: 1, thumbnail: 'thumb.jpg' }
        });

        const formData = new FormData();
        formData.set('url', 'https://music.youtube.com/playlist?list=PLtest12345');

        const result = await processPlaylistAction(null, formData);
        
        expect(getPlaylist).toHaveBeenCalledWith('PLtest12345');
        expect(result.success).toBe(true);
        expect(result.data?.original).toHaveLength(1);
    });

    it('should accept raw playlist IDs', async () => {
        vi.mocked(isRateLimited).mockResolvedValue(false);
        vi.mocked(getPlaylist).mockResolvedValue({
            tracks: [{ id: '1', title: 'Track 1', artist: 'Artist 1', thumbnail: 'thumb.jpg' }],
            metadata: { id: 'PLtest12345678', title: 'Test Playlist', trackCount: 1, thumbnail: 'thumb.jpg' }
        });

        const formData = new FormData();
        formData.set('url', 'PLtest12345678');

        const result = await processPlaylistAction(null, formData);
        
        expect(getPlaylist).toHaveBeenCalledWith('PLtest12345678');
        expect(result.success).toBe(true);
    });
});

describe('getRecommendationsAction', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should return error for empty seed IDs', async () => {
        const result = await getRecommendationsAction([]);
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('No seed tracks');
    });

    it('should limit seed IDs to 5', async () => {
        vi.mocked(isRateLimited).mockResolvedValue(false);
        vi.mocked(getRecommendationsMulti).mockResolvedValue([]);

        const seedIds = ['1', '2', '3', '4', '5', '6', '7'];
        await getRecommendationsAction(seedIds);
        
        expect(getRecommendationsMulti).toHaveBeenCalledWith(['1', '2', '3', '4', '5']);
    });
});

describe('getArtistDetailsAction', () => {
    it('should return error for invalid artist ID', async () => {
        const result = await getArtistDetailsAction('x');
        
        expect(result.success).toBe(false);
        expect(result.error).toContain('Invalid Artist ID');
    });

    it('should call getArtistDetails with valid ID', async () => {
        vi.mocked(getArtistDetails).mockResolvedValue({
            name: 'Test Artist',
            bio: 'A bio',
            thumbnail: null,
            topTracks: []
        });

        const result = await getArtistDetailsAction('UCvalid123');
        
        expect(getArtistDetails).toHaveBeenCalledWith('UCvalid123');
        expect(result.success).toBe(true);
        expect(result.data?.name).toBe('Test Artist');
    });
});
