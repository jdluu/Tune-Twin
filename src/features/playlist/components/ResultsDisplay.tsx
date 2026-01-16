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
import { 
    MusicNote as MusicIcon, 
    Equalizer as EqualizerIcon, 
    PlayArrow as PlayIcon 
} from "@mui/icons-material";
import type { PlaylistResult, Track } from "@/lib/types";
import { useTheme } from "@mui/material/styles";

interface ResultsDisplayProps {
    data: PlaylistResult;
}

export function ResultsDisplay({ data }: ResultsDisplayProps) {
    const theme = useTheme();

    return (
        <Fade in={true} timeout={600}>
        <Grid container spacing={4}>
            {/* Original Vibe Column */}
            <Grid size={{ xs: 12, md: 6 }}>
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <CardHeader 
                title="Source Playlist" 
                subheader={`${data.original.length} tracks found`}
                avatar={<Avatar sx={{ bgcolor: 'transparent', color: 'text.primary' }}><MusicIcon /></Avatar>}
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                />
                <Divider />
                <CardContent sx={{ p: 0 }}>
                <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                    {data.original.map((item: Track, index: number) => (
                    <ListItem key={item.id || index} divider>
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
                                <span>{item.artist || "Unknown Artist"}</span>
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
            }}>
            <CardHeader 
                title="Twin Matches" 
                subheader="Algorithmic suggestions"
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><EqualizerIcon /></Avatar>}
                titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
            />
                <Divider sx={{ borderColor: 'rgba(255,0,0,0.1)' }} />
                <CardContent sx={{ p: 0 }}>
                <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                    {data.recommendations.map((item: Track, index: number) => (
                    <ListItem 
                        key={item.id || index} 
                        divider 
                        sx={{ borderColor: 'rgba(255,0,0,0.1)' }}
                        secondaryAction={
                            <IconButton 
                                edge="end" 
                                component="a" 
                                href={`https://music.youtube.com/watch?v=${item.id}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Play ${item.title || "song"}`}
                                sx={{ 
                                    color: 'text.primary',
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
                            <img 
                            src={item.thumbnail} 
                            alt={item.title || "Album Art"}
                            loading="lazy"
                            style={{ width: 40, height: 40, borderRadius: 6, objectFit: 'cover' }} 
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                            />
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
                                <span>{item.artist || "TuneTwin Suggestion"}</span>
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
                    ))}
                    {data.recommendations.length === 0 && (
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
    );
}
