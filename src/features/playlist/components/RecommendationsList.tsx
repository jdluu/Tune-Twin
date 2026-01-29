'use client';

import { 
    Card, 
    CardHeader, 
    CardContent, 
    List, 
    ListItem, 
    ListItemText, 
    Divider, 
    Avatar, 
    Link, 
    IconButton,
    Box,
    Skeleton,
    Typography
} from "@mui/material";
import Image from "next/image";
import { 
    Equalizer as EqualizerIcon, 
    PlayArrow as PlayIcon 
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { Track } from "@/lib/types";
import { useTheme } from "@mui/material/styles";

interface RecommendationsListProps {
    /** Array of recommendation tracks to display. */
    recommendations: Track[];
    /** Whether recommendations are currently being fetched. */
    loading: boolean;
    /** ID of the currently playing video, used to highlight the active track. */
    playingVideoId: string | null;
    /** Callback to play a specific track. */
    onPlay: (id: string) => void;
    /** Callback to play all recommended tracks in sequence. */
    onPlayAll: () => void;
    /** Callback to handle artist selection for modal details. */
    onSelectArtist: (id: string, name: string) => void;
}

/**
 * Displays a list of recommended tracks based on the analysis.
 * Features a "Play All" button and individual track controls.
 *
 * @param props - Component properties.
 */
export function RecommendationsList({ recommendations, loading, playingVideoId, onPlay, onPlayAll, onSelectArtist }: RecommendationsListProps) {
    const theme = useTheme();

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemAnim = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
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
                action={
                    recommendations.length > 0 && (
                        <IconButton onClick={onPlayAll} color="primary" title="Play All">
                            <PlayIcon />
                        </IconButton>
                    )
                }
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
            />
            <Divider sx={{ borderColor: 'rgba(255,0,0,0.1)' }} />
            <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <List sx={{ maxHeight: 600, overflow: 'auto' }} component={motion.ul} variants={container} initial="hidden" animate="show">
                    {loading ? (
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
                                    onClick={() => onPlay(item.id)}
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
                                            onClick={() => item.artistId && onSelectArtist(item.artistId, item.artist)}
                                            sx={{ 
                                                color: 'inherit', 
                                                textDecoration: 'none', 
                                                '&:hover': { color: 'inherit', textDecoration: 'underline' },
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
                                    </span>
                                }
                                primaryTypographyProps={{ component: 'div' }}
                                secondaryTypographyProps={{ noWrap: true, variant: 'caption', component: 'div' }}
                            />
                        </ListItem>
                        ))
                    )}
                    {!loading && recommendations.length === 0 && (
                        <Box sx={{ py: 10, textAlign: 'center', opacity: 0.5 }}>
                            <Image 
                                src="https://media.tenor.com/p0G_kKWJwCEAAAAM/spongebob-waiting.gif" 
                                alt="Waiting" 
                                width={100}
                                height={100}
                                style={{ borderRadius: 8, marginBottom: 16, opacity: 0.8 }} 
                                unoptimized
                            />
                            <Typography variant="body2">No recommendations available.</Typography>
                        </Box>
                    )}
                </List>
            </CardContent>
        </Card>
    );
}
