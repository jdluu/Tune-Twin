import { useState, useMemo } from "react";
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    CardHeader, 
    Grid, 
    List, 
    ListItem, 
    ListItemText, 
    ListItemIcon, 
    IconButton, 
    CircularProgress, 
    Alert, 
    ThemeProvider, 
    createTheme, 
    CssBaseline, 
    Paper,
    Divider,
    Avatar
} from "@mui/material";
import { 
    Search as SearchIcon, 
    MusicNote as MusicIcon, 
    AutoAwesome as RecommendationIcon, 
    ExternalLink as LaunchIcon,
    ErrorOutline as ErrorIcon,
    PlayArrow as PlayIcon
} from "@mui/icons-material";
import "./index.css";

export function App() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{ original: any[]; recommendations: any } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Define custom theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1DB954', // Spotify-esque green for "Music" vibe
      },
      secondary: {
        main: '#ffffff',
      },
      background: {
        default: '#000000',
        paper: '#121212',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
    },
  }), []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    try {
      let playlistId = "";
      try {
        const urlObj = new URL(url);
        playlistId = urlObj.searchParams.get("list") || "";
      } catch (err) {
        playlistId = url;
      }

      if (!playlistId) {
        throw new Error("Please enter a valid YouTube Music Playlist URL or ID");
      }

      const response = await fetch("/api/process-playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ playlistId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch playlist data");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTrackItems = (recData: any) => {
    return recData?.items || recData?.contents || [];
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', py: 8 }}>
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 8, textAlign: 'center' }}>
            <Avatar sx={{ m: '0 auto', mb: 2, bgcolor: 'primary.main', width: 64, height: 64 }}>
                <MusicIcon fontSize="large" />
            </Avatar>
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
                background: 'linear-gradient(45deg, #1DB954 30%, #1ed760 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 900
            }}>
              TuneTwin
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Generate recommendations from your favorite YouTube Music playlists.
            </Typography>
          </Box>

          {/* Search Form */}
          <Paper elevation={0} component="form" onSubmit={handleSubmit} 
                 sx={{ p: 1, mb: 8, display: 'flex', alignItems: 'center', gap: 1, maxWidth: 700, mx: 'auto', border: '1px solid rgba(255,255,255,0.1)' }}>
            <SearchIcon sx={{ ml: 2, color: 'text.secondary' }} />
            <TextField
              fullWidth
              variant="standard"
              placeholder="Paste YouTube Music playlist URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              InputProps={{ disableUnderline: true, sx: { px: 1 } }}
              required
            />
            <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ px: 4, height: 48 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Find Twins"}
            </Button>
          </Paper>

          {error && (
            <Alert severity="error" icon={<ErrorIcon />} sx={{ maxWidth: 700, mx: 'auto', mb: 8 }}>
              {error}
            </Alert>
          )}

          {/* Results Results grid */}
          {data && (
            <Grid container spacing={4}>
              {/* Original Vibe */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ bgcolor: 'background.paper', borderColor: 'rgba(255,255,255,0.1)' }}>
                  <CardHeader 
                    title="Your Vibe" 
                    subheader={`${data.original.length} tracks found`}
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><MusicIcon /></Avatar>}
                    titleTypographyProps={{ fontWeight: 700 }}
                  />
                  <Divider sx={{ opacity: 0.1 }} />
                  <CardContent sx={{ p: 0 }}>
                    <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {data.original.map((item: any, index: number) => (
                        <ListItem key={item.id || index} divider>
                          <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary', fontSize: '0.8rem' }}>
                            {(index + 1).toString().padStart(2, '0')}
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.title?.runs?.[0]?.text || item.title?.text || "Unknown Title"}
                            secondary={item.subtitle?.runs?.[0]?.text || item.subtitle?.text || "Unknown Artist"}
                            primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recommendations */}
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ 
                    bgcolor: 'background.paper', 
                    borderColor: 'primary.main',
                    boxShadow: '0 0 20px rgba(29, 185, 84, 0.1)'
                }}>
                  <CardHeader 
                    title="TuneTwins" 
                    subheader="AI-curated recommendations"
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><RecommendationIcon /></Avatar>}
                    titleTypographyProps={{ fontWeight: 700 }}
                    action={
                        <Box sx={{ mt: 1, mr: 1, px: 1.5, py: 0.5, bgcolor: 'rgba(29,185,84,0.1)', color: 'primary.main', borderRadius: 10, fontSize: '0.75rem', fontWeight: 700 }}>
                            RECOMMENDED
                        </Box>
                    }
                  />
                  <Divider sx={{ opacity: 0.1 }} />
                  <CardContent sx={{ p: 0 }}>
                    <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                      {getTrackItems(data.recommendations).map((item: any, index: number) => (
                        <ListItem 
                            key={item.id || index} 
                            divider
                            secondaryAction={
                                <IconButton 
                                    edge="end" 
                                    component="a" 
                                    href={`https://music.youtube.com/watch?v=${item.videoId || item.id}`} 
                                    target="_blank"
                                    sx={{ color: 'primary.main' }}
                                >
                                    <PlayIcon />
                                </IconButton>
                            }
                        >
                          <ListItemText 
                            primary={item.title?.runs?.[0]?.text || item.title?.text || item.title?.toString() || "Unknown Title"}
                            secondary={item.short_byline?.runs?.[0]?.text || item.subtitle?.runs?.[0]?.text || "Unknown Artist"}
                            primaryTypographyProps={{ fontWeight: 600, noWrap: true, color: 'primary.main' }}
                          />
                        </ListItem>
                      ))}
                      {getTrackItems(data.recommendations).length === 0 && (
                          <Box sx={{ p: 8, textAlign: 'center', color: 'text.secondary' }}>
                              <Typography variant="body2">No recommendations found for this playlist.</Typography>
                          </Box>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ py: 4, textAlign: 'center', opacity: 0.5 }}>
        <Typography variant="caption">
          TuneTwin &copy; {new Date().getFullYear()} • Powered by Bun, React 19 & Material UI v7
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
