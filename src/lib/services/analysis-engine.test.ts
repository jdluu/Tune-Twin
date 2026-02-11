
import { describe, it, expect } from 'vitest';
import { analyzePlaylist, vectorizeTrack } from './analysis-engine';
import { Track } from '../types';

describe('Analysis Engine', () => {
    
    it('vectorizeTrack returns correct vector for known keywords', () => {
        const track: Track = { id: '1', title: 'Heavy Metal Rock', artist: 'Slayer', thumbnail: '' };
        const vector = vectorizeTrack(track);
        
        expect(vector).toBeDefined();
        // Metal: energy 0.95, mood 0.2, dance 0.4
        // Rock: energy 0.8, mood 0.5, dance 0.6
        // Avg Energy: (0.95 + 0.8) / 2 = 0.875
        expect(vector?.energy).toBeCloseTo(0.875);
    });

    it('analyzePlaylist finds cohesion in a uniform playlist', () => {
        const tracks: Track[] = [
            { id: '1', title: 'Lofi Study Beats', artist: 'Unknown', thumbnail: '' },
            { id: '2', title: 'Chill Lofi Hip Hop', artist: 'Unknown', thumbnail: '' },
            { id: '3', title: 'Relaxing Lofi', artist: 'Unknown', thumbnail: '' }
        ];

        const { analysis } = analyzePlaylist(tracks);
        expect(analysis.cohesionScore).toBeGreaterThan(70);
        expect(analysis.dominantVibes.energy).toBeLessThan(0.4); // Should be chill
    });

    it('analyzePlaylist detects low cohesion in mixed playlist', () => {
        const tracks: Track[] = [
            { id: '1', title: 'Death Metal', artist: 'Cannibal Corpse', thumbnail: '' },
            { id: '2', title: 'Lofi Study', artist: 'Lofi Girl', thumbnail: '' },
            { id: '3', title: 'Mozart Symphony', artist: 'Classical', thumbnail: '' }
        ];

        const { analysis } = analyzePlaylist(tracks);
        expect(analysis.cohesionScore).toBeLessThan(50);
        expect(analysis.details.text).toContain('Scattered');
    });

    it('detects outliers correctly', () => {
        const tracks: Track[] = [
            { id: '1', title: 'Lofi 1', artist: 'A', thumbnail: '' },
            { id: '2', title: 'Lofi 2', artist: 'B', thumbnail: '' },
            { id: '3', title: 'Lofi 3', artist: 'C', thumbnail: '' },
            { id: '4', title: 'Lofi 4', artist: 'D', thumbnail: '' },
            { id: '5', title: 'SUPER HEAVY DEATH METAL', artist: 'E', thumbnail: '' } // The outlier
        ];

        const { analysis } = analyzePlaylist(tracks);
        expect(analysis.outliers).toHaveLength(1);
        expect(analysis.outliers[0].title).toBe('SUPER HEAVY DEATH METAL');
    });

    it('handles empty or unknown playlists gracefully', () => {
        const tracks: Track[] = [
            { id: '1', title: 'Unknown Song 1', artist: 'Unknown', thumbnail: '' },
            { id: '2', title: 'asdfasdf', artist: 'Unknown', thumbnail: '' }
        ];

        const { analysis } = analyzePlaylist(tracks);
        expect(analysis.cohesionScore).toBe(0);
        expect(analysis.details.text).toContain('Insufficient');
    });

});
