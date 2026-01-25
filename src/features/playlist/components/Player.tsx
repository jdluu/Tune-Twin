'use client';

import YouTube, { YouTubeProps } from 'react-youtube';
import { Box, IconButton, Paper, Slide, useTheme } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface PlayerProps {
    videoId: string | null;
    onClose: () => void;
}

export function Player({ videoId, onClose }: PlayerProps) {
    const theme = useTheme();
    // Derive visibility directly from prop - no need for useState/useEffect
    const isVisible = !!videoId;

    if (!videoId) return null;

    const opts: YouTubeProps['opts'] = {
        height: '80', // Small height for audio-like feel
        width: '100%',
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1,
            modestbranding: 1,
        },
    };

    return (
        <Slide direction="up" in={isVisible} mountOnEnter unmountOnExit>
            <Paper 
                elevation={10} 
                sx={{ 
                    position: 'fixed', 
                    bottom: 0, 
                    left: 0, 
                    right: 0, 
                    zIndex: 1300,
                    p: 1,
                    bgcolor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#fff',
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Box sx={{ width: '100%', maxWidth: 600, position: 'relative', display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flexGrow: 1, overflow: 'hidden', borderRadius: 2 }}>
                         <YouTube videoId={videoId} opts={opts} onEnd={onClose} />
                    </Box>
                    <IconButton 
                        onClick={onClose} 
                        aria-label="Close player"
                        sx={{ position: 'absolute', top: -40, right: 0, bgcolor: 'background.paper', boxShadow: 2 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Slide>
    );
}
