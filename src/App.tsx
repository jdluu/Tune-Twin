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
    Equalizer as EqualizerIcon,
    YouTube as YouTubeIcon
} from "@mui/icons-material";
import "./index.css";

// Hide App Bar on scroll component
function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
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
        main: '#FF0000', // YouTube Red
        contrastText: '#fff',
      },
      secondary: {
        main: '#ffffff',
      },
      background: {
        default: '#0F0F0F', // YouTube Dark Mode bg
        paper: '#272727', // YouTube Card bg roughly
      },
      text: {
        primary: '#ffffff',
        secondary: '#aaaaaa',
      },
      action: {
        hover: 'rgba(255, 255, 255, 0.1)',
      }
    },
    typography: {
      fontFamily: '"Roboto", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      subtitle1: {
        color: '#aaaaaa',
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 18, // Pill shape
            padding: '8px 20px',
            '&:hover': {
              backgroundColor: '#cc0000',
            }
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#1F1F1F',
            backgroundImage: 'none',
            borderRadius: 16, 
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
      MuiTextField: {
         styleOverrides: {
             root: {
                 '& .MuiInputBase-input': {
                     color: 'white',
                 }
             }
         }
      }
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
            bgcolor: 'rgba(15,15,15,0.95)', 
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid rgba(255,255,255,0.1)' 
        }}>
          <Container maxWidth="lg">
            <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <YouTubeIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-1px' }}>
                    TuneTwin
                </Typography>
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
                fontWeight: 800,
                mb: 2
            }}>
              Discover your music's <span style={{ color: '#FF0000' }}>twin code</span>.
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 650, mx: 'auto', mb: 6 }}>
              Unlock the algorithmic DNA of your playlists. Paste your YouTube Music link and see what the recommendation engine is thinking.
            </Typography>

            {/* Search Paper */}
            <Paper elevation={0} component="form" onSubmit={handleSubmit} 
                   sx={{ 
                       p: '4px', 
                       display: 'flex', 
                       alignItems: 'center', 
                       gap: 1, 
                       maxWidth: 700, 
                       mx: 'auto', 
                       bgcolor: '#282828',
                       borderRadius: 50,
                       border: '1px solid #3F3F3F'
                   }}>
              <Box sx={{ pl: 2, display: 'flex', alignItems: 'center' }}>
                  <SearchIcon sx={{ color: '#AAAAAA' }} />
              </Box>
              <TextField
                fullWidth
                variant="standard"
                placeholder="Paste YouTube Music playlist URL..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                InputProps={{ 
                    disableUnderline: true, 
                    sx: { fontSize: '1rem', color: 'white' } 
                }}
                required
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                sx={{ 
                    height: 48, 
                    px: 4,
                    fontSize: '0.95rem',
                    borderRadius: 50,
                    boxShadow: 'none',
                    bgcolor: '#282828',
                    color: '#aaaaaa',
                    '&:hover': {
                        bgcolor: '#3F3F3F',
                        color: 'white'
                    }
                }}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </Button>
            </Paper>
          </Box>

          {error && (
            <Fade in={!!error}>
              <Alert severity="error" icon={<ErrorIcon />} variant="filled" sx={{ maxWidth: 700, mx: 'auto', mb: 8, borderRadius: 2 }}>
                {error}
              </Alert>
            </Fade>
          )}

          {/* Loading Skeletons */}
          {loading && !data && (
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                 <Skeleton variant="rounded" height={500} sx={{ borderRadius: 4, bgcolor: '#272727' }} />
              </Grid>
              <Grid item xs={12} md={6}>
                 <Skeleton variant="rounded" height={500} sx={{ borderRadius: 4, bgcolor: '#272727' }} />
              </Grid>
            </Grid>
          )}

          {/* Results Display */}
          {data && (
            <Fade in={!!data} timeout={600}>
              <Grid container spacing={3}>
                {/* Original Vibe Column */}
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ border: '1px solid #3F3F3F' }}>
                    <CardHeader 
                      title="Source Playlist" 
                      subheader={`${data.original.length} videos`}
                      avatar={<Avatar sx={{ bgcolor: 'transparent', color: 'white' }}><MusicIcon /></Avatar>}
                      titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                    />
                    <Divider sx={{ borderColor: '#3F3F3F' }} />
                    <CardContent sx={{ p: 0 }}>
                      <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                        {data.original.map((item: any, index: number) => (
                          <ListItem key={item.id || index} divider sx={{ borderColor: '#3F3F3F' }}>
                            <Typography variant="body2" sx={{ minWidth: 30, color: '#aaaaaa', mr: 2 }}>
                              {index + 1}
                            </Typography>
                            <ListItemText 
                              primary={item.title?.runs?.[0]?.text || item.title?.text || "Unknown Track"}
                              secondary={item.subtitle?.runs?.[0]?.text || item.subtitle?.text || "Unknown Artist"}
                              primaryTypographyProps={{ fontWeight: 500, noWrap: true }}
                              secondaryTypographyProps={{ noWrap: true, variant: 'caption', color: '#aaaaaa' }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Recommendations Column */}
                <Grid item xs={12} md={6}>
                  <Card elevation={0} sx={{ 
                      bgcolor: '#1F1F1F',
                      border: '1px solid rgba(255, 0, 0, 0.3)',
                  }}>
                    <CardHeader 
                      title="Up Next" 
                      subheader="Algorithmic suggestions"
                      avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><YouTubeIcon /></Avatar>}
                      titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                    />
                     <Divider sx={{ borderColor: '#3F3F3F' }} />
                    <CardContent sx={{ p: 0 }}>
                      <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                        {getTrackItems(data.recommendations).map((item: any, index: number) => (
                          <ListItem 
                              key={item.id || index} 
                              divider 
                              sx={{ borderColor: '#3F3F3F' }}
                              secondaryAction={
                                  <IconButton 
                                      edge="end" 
                                      component="a" 
                                      href={`https://music.youtube.com/watch?v=${item.videoId || item.id}`} 
                                      target="_blank"
                                      sx={{ 
                                          color: 'white',
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
                               <img 
                                src={item.thumbnail?.thumbnails?.[0]?.url} 
                                alt="" 
                                style={{ width: 40, height: 40, borderRadius: 4, objectFit: 'cover' }} 
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                               />
                           </Box>
                            <ListItemText 
                              primary={item.title?.runs?.[0]?.text || item.title?.text || item.title?.toString() || "Unknown Discovery"}
                              secondary={item.short_byline?.runs?.[0]?.text || item.subtitle?.runs?.[0]?.text || "TuneTwin Suggestion"}
                              primaryTypographyProps={{ fontWeight: 600, noWrap: true }}
                              secondaryTypographyProps={{ noWrap: true, variant: 'caption', color: '#aaaaaa' }}
                            />
                          </ListItem>
                        ))}
                        {getTrackItems(data.recommendations).length === 0 && (
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
          )}
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ 
          py: 4, 
          textAlign: 'center', 
          bgcolor: '#0F0F0F',
          borderTop: '1px solid #3F3F3F'
      }}>
        <Typography variant="caption" sx={{ color: '#555555', fontWeight: 500 }}>
          TuneTwin • Powered by YouTube Music Intelligence
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
