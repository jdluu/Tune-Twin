import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PlaylistAnalyzer } from './PlaylistAnalyzer';
import { Providers } from '@/components/providers/Providers';

// Mock the server action
vi.mock('../actions', () => ({
    processPlaylistAction: vi.fn(),
}));

// We need to wrap in Providers for Theme
const renderWithProviders = (ui: React.ReactNode) => {
    return render(
        <Providers>
            {ui}
        </Providers>
    );
};

describe('PlaylistAnalyzer', () => {
    it('renders the hero section', () => {
        renderWithProviders(<PlaylistAnalyzer />);
        expect(screen.getByText(/Find your playlist's/i)).toBeInTheDocument();
        expect(screen.getByText(/perfect matches/i)).toBeInTheDocument();
    });

    it('renders the input field', () => {
        renderWithProviders(<PlaylistAnalyzer />);
        const input = screen.getByLabelText('YouTube Music Playlist URL');
        expect(input).toBeInTheDocument();
    });

    it.skip('updates input value when typing', async () => {
        const user = userEvent.setup();
        renderWithProviders(<PlaylistAnalyzer />);
        const input = screen.getByLabelText('YouTube Music Playlist URL') as HTMLInputElement;
        
        await user.type(input, 'https://music.youtube.com/playlist?list=Test');
        expect(input.value).toBe('https://music.youtube.com/playlist?list=Test');
    });
});
