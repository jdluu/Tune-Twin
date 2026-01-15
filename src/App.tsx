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
    Alert, 
    ThemeProvider, 
    createTheme, 
    CssBaseline, 
    Paper,
    Divider,
    Avatar,
    AppBar,
    Toolbar,
    Skeleton,
    Fade,
    useScrollTrigger,
    Slide
} from "@mui/material";
import { 
    Search as SearchIcon, 
    MusicNote as MusicIcon, 
    AutoAwesome as RecommendationIcon, 
    LaunchIcon as OpenIcon,
    ErrorOutline as ErrorIcon,
    PlayArrow as PlayIcon,
    Equalizer as EqualizerIcon
} from "@mui/icons-material";
import "./index.css";

// Hide App Bar on scroll component
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide控制="in" appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

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
        main: '#1DB954', // Spotify Green
        contrastText: '#fff',
      },
      secondary: {
        main: '#ffffff',
      },
      background: {
        default: '#000000',
        paper: '#121212',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b3b3b3',
      },
      action: {
        hover: 'rgba(255, 255, 255, 0.08)',
      }
    },
    typography: {
      fontFamily: '"Inter", "system-ui", "-apple-system", sans-serif',
      h4: {
        fontWeight: 900,
        letterSpacing: '-0.02em',
      },
      subtitle1: {
        color: '#b3b3b3',
      },
      button: {
        fontWeight: 700,
        textTransform: 'none',
        borderRadius: 50,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 24,
            padding: '10px 24px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#181818',
            backgroundImage: 'none',
            '&:hover': {
              backgroundColor: '#282828',
            },
            transition: 'background-color 0.3s ease',
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
      
      {/* Navigation */}
      <HideOnScroll>
        <AppBar position="sticky" elevation={0} sx={{ 
            bgcolor: 'rgba(0,0,0,0.8)', 
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <MusicIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>
                    TuneTwin
                </Typography>
              </Box>
              <Box>
                <Button color="inherit" size="small" sx={{ color: 'text.secondary' }}>How it works</Button>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      <Box sx={{ minHeight: '100vh', pt: 6, pb: 10 }}>
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Box sx={{ mb: 10, textAlign: 'center' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
                fontWeight: 900,
                mb: 2
            }}>
              Your playlist's biological twin.
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 700, mx: 'auto', mb: 6 }}>
              Unlock new musical textures. Paste your YouTube Music playlist and let TuneTwin find the missing pieces of your vibe.
            </Typography>

            {/* Search Paper */}
            <Paper elevation={0} component="form" onSubmit={handleSubmit} 
                   sx={{ 
                       p: 1.5, 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: 2, 
                       maxWidth: 800, 
                       mx: 'auto', 
                       bgcolor: '#282828',
                       borderRadius: 10,
                   }}>
              <SearchIcon sx={{ ml: 2, color: 'text.secondary' }} />
              <TextField
                fullWidth
                variant="standard"
                placeholder="Paste YouTube Music playlist URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                InputProps={{ 
                    disableUnderline: true, 
                    sx: { fontSize: '1.1rem', color: 'white' } 
                }}
                required
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ 
                    height: 52, 
                    px: 6,
                    fontSize: '1rem',
                    boxShadow: '0 4px 14px 0 rgba(29, 185, 84, 0.39)'
                }}
              >
                {loading ? "Analyzing..." : "Find Twins"}
              </Button>
            </Paper>
          </Box>

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" icon={<ErrorIcon />} sx={{ maxWidth: 800, mx: 'auto', mb: 8, borderRadius: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {/* Loading Skeletons */}
          {loading && !data && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                 <Skeleton variant="rounded" height={600} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                 <Skeleton variant="rounded" height={600} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.05)' }} />
              </Grid>
            </Grid>
          )}

          {/* Results Display */}
          {data && (
            <Fade in={!!data} timeout={800}>
              <Grid container spacing={4}>
                {/* Original Vibe Column */}
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ borderRadius: 3 }}>
                    <CardHeader 
                      title="Current Vibe" 
                      subheader={`${data.original.length} tracks selected`}
                      avatar={<Avatar sx={{ bgcolor: 'rgba(29,185,84,0.1)', color: 'primary.main' }}><MusicIcon /></Avatar>}
                      titleTypographyProps={{ variant: 'h6', fontWeight: 800 }}
                    />
                    <CardContent sx={{ p: 0 }}>
                      <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                        {data.original.map((item: any, index: number) => (
                          <ListItem key={item.id || index} divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                            <ListItemIcon sx={{ minWidth: 40, color: 'rgba(255,255,255,0.2)' }}>
                              {(index + 1).toString().padStart(2, '0')}
                            </ListItemIcon>
                            <ListItemText 
                              primary={item.title?.runs?.[0]?.text || item.title?.text || "Unknown Track"}
                              secondary={item.subtitle?.runs?.[0]?.text || item.subtitle?.text || "Unknown Artist"}
                              primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                              secondaryTypographyProps={{ noWrap: true, variant: 'caption' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Recommendations Column */}
                <Grid item xs={12} md={6}>
                  <Card elevation={10} sx={{ 
                      borderRadius: 3, 
                      bgcolor: '#181818',
                      border: '1px solid rgba(29, 185, 84, 0.2)',
                  }}>
                    <CardHeader 
                      title="TuneTwins" 
                      subheader="Discovered matches"
                      avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><EqualizerIcon /></Avatar>}
                      titleTypographyProps={{ variant: 'h6', fontWeight: 800, color: 'primary.main' }}
                      action={
                          <Box sx={{ mt: 1, mr: 1, px: 2, py: 0.5, bgcolor: 'primary.main', color: 'black', borderRadius: 10, fontSize: '0.7rem', fontWeight: 800 }}>
                              AI TWINS
                          </Box>
                      }
                    />
                    <CardContent sx={{ p: 0 }}>
                      <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                        {getTrackItems(data.recommendations).map((item: any, index: number) => (
                          <ListItem 
                              key={item.id || index} 
                              divider 
                              sx={{ borderColor: 'rgba(255,255,255,0.05)' }}
                              secondaryAction={
                                  <IconButton 
                                      edge="end" 
                                      component="a" 
                                      href={`https://music.youtube.com/watch?v=${item.videoId || item.id}`} 
                                      target="_blank"
                                      sx={{ 
                                          color: 'black', 
                                          bgcolor: 'primary.main',
                                          '&:hover': { bgcolor: '#1ed760' }
                                      }}
                                  >
                                      <PlayIcon fontSize="small" />
                                  </IconButton>
                              }
                          >
                            <ListItemText 
                              primary={item.title?.runs?.[0]?.text || item.title?.text || item.title?.toString() || "Unknown Discovery"}
                              secondary={item.short_byline?.runs?.[0]?.text || item.subtitle?.runs?.[0]?.text || "TuneTwin Suggestion"}
                              primaryTypographyProps={{ fontWeight: 700, noWrap: true }}
                              secondaryTypographyProps={{ noWrap: true, variant: 'caption', color: 'primary.main' }}
                            />
                          </ListItem>
                        ))}
                        {getTrackItems(data.recommendations).length === 0 && (
                            <Box sx={{ py: 10, textAlign: 'center', opacity: 0.5 }}>
                                <Typography variant="body2">No twins found for this vibe yet.</Typography>
                            </Box>
                        )}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Fade>
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ 
          pt: 10, 
          pb: 6, 
          textAlign: 'center', 
          borderTop: '1px solid rgba(255,255,255,0.05)',
          bgcolor: 'black'
      }}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>
          TuneTwin v2.0 • Build for the auditory curious • {new Date().getFullYear()}
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
控制="in" -> appear={true} or something? Wait, I made a mistake in the HideOnScroll Slide prop. 
HideOnScroll uses `控制="in"`. That was a typo. It should be `appear={false}` and `in={!trigger}`. 
Let me fix that in the write_to_file call immediately.
Actually, let me re-check the MUI docs for Slide. 
<Slide appear={false} direction="down" in={!trigger}>

Wait, I also used "Find Twins" twice.
The code above has a few polish items.
I'll fix the HideOnScroll Slide prop.
