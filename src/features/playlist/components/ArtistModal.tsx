'use client';

import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    Typography, 
    Box, 
    CircularProgress, 
    Avatar,
    Divider,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { getArtistDetailsAction } from '../actions';
import { Track } from '@/lib/types';

/**
 * Props for the ArtistModal component.
 */
interface ArtistModalProps {
    /** The ID of the artist to fetch details for. */
    artistId: string | null;
    /** The name of the artist (used for title until details load). */
    artistName: string | null;
    /** Whether the modal is open. */
    open: boolean;
    /** Callback to close the modal. */
    onClose: () => void;
}

interface ArtistDetails {
    name: string;
    bio: string;
    thumbnail?: string | null;
    topTracks?: Track[];
}

/**
 * Modal component to display detailed artist information (Bio, Top Tracks).
 * Fetches data on-demand when opened.
 *
 * @param props - ArtistModalProps
 */
export function ArtistModal({ artistId, artistName, open, onClose }: ArtistModalProps) {
    const [loading, setLoading] = useState(false);
    const [details, setDetails] = useState<ArtistDetails | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchArtistDetails = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const res = await getArtistDetailsAction(id);
            if (res.success && res.data) {
                setDetails(res.data);
            } else {
                setError(res.error || "Failed to load artist details.");
            }
        } catch {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (open && artistId) {
            fetchArtistDetails(artistId);
        } else if (!open) {
            // Reset state when closing
            setDetails(null);
            setError(null);
        }
    }, [open, artistId, fetchArtistDetails]);

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            aria-labelledby="artist-modal-title"
            aria-describedby="artist-modal-description"
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            <DialogTitle id="artist-modal-title" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
                {details?.thumbnail && (
                    <Avatar sx={{ width: 48, height: 48, position: 'relative' }}>
                        <Image 
                            src={details.thumbnail} 
                            alt={details.name} 
                            fill 
                            sizes="48px"
                            style={{ objectFit: 'cover' }}
                        />
                    </Avatar>
                )}
                {artistName || "Artist Intelligence"}
            </DialogTitle>
            <Divider />
            <DialogContent>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center">{error}</Typography>
                ) : details ? (
                    <Box>
                        <Typography id="artist-modal-description" variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, mb: 3 }}>
                            {details.bio}
                        </Typography>

                        {details.topTracks && details.topTracks.length > 0 && (
                            <>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                                    Top Songs
                                </Typography>
                                <List disablePadding>
                                    {details.topTracks.map((track, idx) => (
                                        <ListItem key={track.id || idx} disablePadding sx={{ py: 1 }}>
                                            <ListItemText 
                                                primary={track.title}
                                                secondary={track.album}
                                                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                                                secondaryTypographyProps={{ variant: 'caption' }}
                                            />
                                            {track.thumbnail && (
                                                <Avatar 
                                                    src={track.thumbnail} 
                                                    variant="rounded" 
                                                    sx={{ width: 40, height: 40, ml: 2 }}
                                                />
                                            )}
                                        </ListItem>
                                    ))}
                                </List>
                            </>
                        )}
                    </Box>
                ) : (
                    <Typography variant="body2" color="text.secondary" align="center">
                        No information available for this artist.
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} variant="contained" sx={{ borderRadius: 2 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
