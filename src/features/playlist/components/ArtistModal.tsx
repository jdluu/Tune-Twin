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
    Divider
} from '@mui/material';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { getArtistDetailsAction } from '../actions';

interface ArtistModalProps {
    artistId: string | null;
    artistName: string | null;
    open: boolean;
    onClose: () => void;
}

interface ArtistDetails {
    name: string;
    bio: string;
    thumbnail?: string | null;
}

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
            PaperProps={{
                sx: { borderRadius: 3, p: 1 }
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 2 }}>
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
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                            {details.bio}
                        </Typography>
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
