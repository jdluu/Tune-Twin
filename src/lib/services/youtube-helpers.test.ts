import { describe, it, expect } from 'vitest';
import { getText, getThumbnail, sanitizeTrack } from './youtube-helpers';
import { YtMusicItem } from './youtube-types';

describe('youtube-helpers', () => {

    describe('getText', () => {
        it('should handle strings', () => {
            expect(getText('simple string')).toBe('simple string');
        });

        it('should handle YtText with text prop', () => {
             expect(getText({ text: 'text prop' })).toBe('text prop');
        });

        it('should handle YtText with runs', () => {
             expect(getText({ runs: [{ text: 'run ' }, { text: 'string' }] })).toBe('run string');
        });

        it('should handle empty/undefined', () => {
             expect(getText(undefined)).toBe('');
             expect(getText({})).toBe('');
        });
    });

    describe('getThumbnail', () => {
        it('should extract last thumbnail from simple array', () => {
            const item = { thumbnails: [ { url: 'small.jpg', width: 100, height: 100 }, { url: 'large.jpg', width: 200, height: 200 } ] } as unknown as YtMusicItem;
            expect(getThumbnail(item)).toBe('large.jpg');
        });

        it('should return null if no thumbnails found', () => {
            expect(getThumbnail({} as YtMusicItem)).toBeNull();
        });
    });

    describe('sanitizeTrack', () => {
        it('should ignore invalid tracks (missing title/id)', () => {
            const invalidItem = {} as YtMusicItem;
            // TrackSchema.safeParse should fail for empty ID if schema enforces it.
            // If it doesn't return null, it means schema allows empty strings.
            // Let's assume for now we expect it to effectively be treated as valid or invalid based on schema.
            // But wait, the previous test failed with RECEIVED object.
            // Meaning safeParse SUCCESS because id="" was valid?
            expect(sanitizeTrack(invalidItem)).toBeNull();
        });

        it('should sanitize valid track', () => {
             const validItem = {
                videoId: 'vid123',
                title: { text: 'Song Title' },
                artists: [{ name: 'Artist Name', id: 'UC123' }],
                thumbnails: [{ url: 'thumb.jpg', width: 100, height: 100 }]
             } as unknown as YtMusicItem;

             const track = sanitizeTrack(validItem);
             expect(track).toEqual({
                 id: 'vid123',
                 title: 'Song Title',
                 artist: 'Artist Name',
                 artistId: 'UC123',
                 thumbnail: 'thumb.jpg',
                 duration: undefined,
                 album: undefined
             });
        });
    });
});
