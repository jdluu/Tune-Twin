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
    Typography,
    IconButton
} from "@mui/material";
import { 
    MusicNote as MusicIcon, 
    PlayArrow as PlayIcon 
} from "@mui/icons-material";
import { motion } from "framer-motion";
import type { Track, VibeTag } from "@/lib/types";
import { VibeVisualizer } from "./VibeVisualizer";

interface ResultsListProps {
    /** Array of original tracks from the user's playlist. */
    tracks: Track[];
    /** Extracted VibeTags associated with the playlist. */
    vibes: VibeTag[];
    /** ID of the currently playing video, used to highlight the active track. */
    playingVideoId: string | null;
    /** Callback to play a specific track. */
    onPlay: (id: string) => void;
    /** Callback to play all original tracks in sequence. */
    onPlayAll: () => void;
    /** Callback to handle artist selection for modal details. */
    onSelectArtist: (id: string, name: string) => void;
}

/**
 * Displays the original source playlist and its associated vibes.
 * Features a "Play All" button and individual track controls.
 *
 * @param props - Component properties.
 */
export function ResultsList({ tracks, vibes, playingVideoId, onPlay, onPlayAll, onSelectArtist }: ResultsListProps) {
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
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardHeader 
                title="Source Playlist" 
                subheader={`${tracks.length} tracks found`}
                avatar={<Avatar sx={{ bgcolor: 'transparent', color: 'text.primary' }}><MusicIcon /></Avatar>}
                action={
                    tracks.length > 0 && (
                        <IconButton onClick={onPlayAll} color="primary" title="Play All">
                            <PlayIcon />
                        </IconButton>
                    )
                }
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
            />
            
            <VibeVisualizer vibes={vibes} />

            <Divider />
            <CardContent sx={{ p: 0, flexGrow: 1 }}>
                <List sx={{ maxHeight: 600, overflow: 'auto' }} component={motion.ul} variants={container} initial="hidden" animate="show">
                    {tracks.map((item: Track, index: number) => (
                    <ListItem 
                        key={item.id || index} 
                        divider 
                        component={motion.li} 
                        variants={itemAnim}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                onClick={() => onPlay(item.id)}
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
                                        onClick={() => item.artistId && onSelectArtist(item.artistId, item.artist)}
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
    );
}
