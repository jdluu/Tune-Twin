'use client';
import { 
    Grid, 
    Card, 
    CardHeader, 
    CardContent, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Avatar, 
    Link, 
    Typography,
    IconButton,
    Box,
    Fade
} from "@mui/material";
import Image from "next/image";
import { 
    MusicNote as MusicIcon, 
    Equalizer as EqualizerIcon, 
    PlayArrow as PlayIcon 
} from "@mui/icons-material";
import type { PlaylistResult, Track } from "@/lib/types";
import { useTheme } from "@mui/material/styles";

import { motion } from "framer-motion";
import { useState, useEffect, Suspense, useCallback } from "react";
import dynamic from "next/dynamic";

const Player = dynamic(() => import("./Player").then(mod => mod.Player), { ssr: false });
const ArtistModal = dynamic(() => import("./ArtistModal").then(mod => mod.ArtistModal), { ssr: false });
import { Chip, Skeleton } from "@mui/material";
import { getRecommendationsAction } from "../actions";

interface ResultsDisplayProps {
    data: PlaylistResult;
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
    const theme = useTheme();
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
    const [selectedArtist, setSelectedArtist] = useState<{ id: string; name: string } | null>(null);
    const [recommendations, setRecommendations] = useState<Track[]>([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    const fetchRecommendations = useCallback(async (tracks: Track[]) => {
        setLoadingRecs(true);
        // Pick up to 3 random seeds from original
        const seedIds = tracks
            .filter(t => t.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3)
            .map(t => t.id);

        try {
            const res = await getRecommendationsAction(seedIds);
            if (res.success && res.data) {
                setRecommendations(res.data.recommendations);
            }
        } finally {
            setLoadingRecs(false);
        }
    }, []);

    useEffect(() => {
        if (data.original.length > 0) {
            fetchRecommendations(data.original);
        }
    }, [data.original, fetchRecommendations]);

    const vibes = data.vibes || [];

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
        <Fade in={true} timeout={600}>
        <Grid container spacing={4}>
            {/* Original Vibe Column */}
            <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardHeader 
                title="Source Playlist" 
                subheader={`${data.original.length} tracks found`}
                avatar={<Avatar sx={{ bgcolor: 'transparent', color: 'text.primary' }}><MusicIcon /></Avatar>}
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                />
                
                {vibes.length > 0 && (
                    <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {vibes.map((tag, idx: number) => (
                            <Chip 
                                key={idx} 
                                label={tag.label} 
                                size="small" 
                                sx={{ 
                                    bgcolor: tag.color, 
                                    color: '#fff',
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                }} 
                            />
                        ))}
                    </Box>
                )}

                <Divider />
                <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <List sx={{ maxHeight: 600, overflow: 'auto' }} component={motion.ul} variants={container} initial="hidden" animate="show">
                    {data.original.map((item: Track, index: number) => (
                    <ListItem 
                        key={item.id || index} 
                        divider 
                        component={motion.li} 
                        variants={itemAnim}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                onClick={() => setPlayingVideoId(item.id)}
                                aria-label={`Play ${item.title || "song"}`}
                                sx={{ 
                                    color: playingVideoId === item.id ? 'primary.main' : 'text.secondary',
                                    '&:hover': { color: 'primary.main' }
                                }}
                            >
                                <PlayIcon />
                            </IconButton>
                        }
                    >
                        <Typography variant="body2" sx={{ minWidth: 30, color: 'text.secondary', mr: 2, fontFamily: 'monospace' }}>
                        {(index + 1).toString().padStart(2, '0')}
                        </Typography>
                        <ListItemText 
                        primary={
                        <Link 
                            href={`https://music.youtube.com/watch?v=${item.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            underline="hover"
                            sx={{ 
                            fontWeight: 600, 
                            display: 'block',
                            '&:hover': { color: 'primary.main' }
                            }}
                        >
                            {item.title || "Unknown Track"}
                        </Link>
                        }
                        secondary={
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                                <Link 
                                    component="button"
                                    onClick={() => item.artistId && setSelectedArtist({ id: item.artistId, name: item.artist })}
                                    sx={{ 
                                        color: 'inherit', 
                                        textDecoration: 'none', 
                                        '&:hover': { color: 'primary.main', textDecoration: 'underline' },
                                        cursor: item.artistId ? 'pointer' : 'default',
                                        fontSize: 'inherit',
                                        textAlign: 'left'
                                    }}
                                >
                                    {item.artist || "Unknown Artist"}
                                </Link>
                                {item.album && (
                                <>
                                    <span>•</span>
                                    <span>{item.album}</span>
                                </>
                                )}
                                {item.duration && (
                                <>
                                    <span>•</span>
                                    <span>{item.duration}</span>
                                </>
                                )}
                            </span>
                        }
                        primaryTypographyProps={{ component: 'div' }}
                        secondaryTypographyProps={{ noWrap: true, variant: 'caption', component: 'div' }}
                    />
                    </ListItem>
                ))}
                </List>
                </CardContent>
            </Card>
            </Grid>

            {/* Recommendations Column */}
            <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ 
                bgcolor: theme.palette.mode === 'dark' ? '#1a0000' : '#fff5f5', // Subtle red tint
                border: '1px solid',
                borderColor: 'primary.main',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
            <CardHeader 
                title="Twin Matches" 
                subheader="Algorithmic suggestions"
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><EqualizerIcon /></Avatar>}
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
            />
                <Divider sx={{ borderColor: 'rgba(255,0,0,0.1)' }} />
                <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <List sx={{ maxHeight: 600, overflow: 'auto' }} component={motion.ul} variants={container} initial="hidden" animate="show">
                    {loadingRecs ? (
                        Array.from(new Array(5)).map((_, index) => (
                            <ListItem key={index} divider sx={{ borderColor: 'rgba(255,0,0,0.1)' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
                                    <Skeleton variant="rounded" width={40} height={40} />
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Skeleton variant="text" width="60%" />
                                        <Skeleton variant="text" width="40%" />
                                    </Box>
                                </Box>
                            </ListItem>
                        ))
                    ) : (
                        recommendations.map((item: Track, index: number) => (
                        <ListItem 
                            key={item.id || index} 
                            divider 
                            sx={{ borderColor: 'rgba(255,0,0,0.1)' }}
                            component={motion.li} 
                            variants={itemAnim}
                            secondaryAction={
                                <IconButton 
                                    edge="end" 
                                    onClick={() => setPlayingVideoId(item.id)}
                                    aria-label={`Play ${item.title || "song"}`}
                                    sx={{ 
                                        color: playingVideoId === item.id ? 'primary.main' : 'text.primary',
                                        '&:hover': { color: 'primary.main' }
                                    }}
                                >
                                    <PlayIcon />
                                </IconButton>
                            }
                        >
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            mr: 2,
                            minWidth: 40
                            }}>
                            {item.thumbnail && (
                            <Box sx={{ width: 40, height: 40, position: 'relative', borderRadius: 1.5, overflow: 'hidden' }}>
                                <Image 
                                    src={item.thumbnail} 
                                    alt={item.title || "Album Art"}
                                    fill
                                    sizes="40px"
                                    style={{ objectFit: 'cover' }}
                                />
                            </Box>
                        )}
                        </Box>
                            <ListItemText 
                            primary={
                                <Link 
                                href={`https://music.youtube.com/watch?v=${item.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                color="inherit"
                                underline="hover"
                                sx={{ 
                                    fontWeight: 600, 
                                    display: 'block',
                                    cursor: 'pointer',
                                    '&:hover': { color: 'primary.main' }
                                }}
                                >
                                {item.title || "Unknown Discovery"}
                                </Link>
                            }
                            secondary={
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                                    <Link 
                                        component="button"
                                        onClick={() => item.artistId && setSelectedArtist({ id: item.artistId, name: item.artist })}
                                        sx={{ 
                                            color: 'inherit', 
                                            textDecoration: 'none', 
                                            '&:hover': { color: 'white', textDecoration: 'underline' },
                                            cursor: item.artistId ? 'pointer' : 'default',
                                            fontSize: 'inherit',
                                            textAlign: 'left'
                                        }}
                                    >
                                        {item.artist || "TuneTwin Suggestion"}
                                    </Link>
                                    {item.album && (
                                    <>
                                        <span>•</span>
                                        <span>{item.album}</span>
                                    </>
                                    )}
                                    {item.duration && (
                                    <>
                                        <span>•</span>
                                        <span>{item.duration}</span>
                                    </>
                                    )}
                                </span>
                            }
                            primaryTypographyProps={{ component: 'div' }}
                            secondaryTypographyProps={{ noWrap: true, variant: 'caption', color: 'primary.main', component: 'div' }}
                            />
                        </ListItem>
                        ))
                    )}
                    {!loadingRecs && recommendations.length === 0 && (
                        <Box sx={{ py: 10, textAlign: 'center', opacity: 0.5 }}>
                            <Typography variant="body2">No recommendations available.</Typography>
                        </Box>
                    )}
                </List>
                </CardContent>
            </Card>
            </Grid>
        </Grid>
        </Fade>
        <Suspense fallback={null}>
            <Player videoId={playingVideoId} onClose={() => setPlayingVideoId(null)} />
            <ArtistModal 
                artistId={selectedArtist?.id || null} 
                artistName={selectedArtist?.name || null} 
                open={!!selectedArtist} 
                onClose={() => setSelectedArtist(null)} 
            />
        </Suspense>
        </>
    );
}
