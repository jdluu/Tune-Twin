import { useState, useMemo, useRef, useEffect } from "react";
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
    Slide,
    Link,
    Stack,
    InputAdornment
} from "@mui/material";
import { 
    Search as SearchIcon, 
    MusicNote as MusicIcon, 
    AutoAwesome as RecommendationIcon, 
    Launch as OpenIcon,
    ErrorOutline as ErrorIcon,
    PlayArrow as PlayIcon,
    Equalizer as EqualizerIcon,
    YouTube as YouTubeIcon,
    Brightness4 as MoonIcon,
    Brightness7 as SunIcon,
    GitHub as GitHubIcon,
    Twitter as TwitterIcon,
    Close as CloseIcon
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
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Theme State
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const resetSearch = () => {
      setUrl("");
      setError(null);
      setData(null);
  };

  // Scroll to results when data is loaded
  useEffect(() => {
    if (data && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  // Define custom theme
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#FF0000', // YouTube Red
        contrastText: '#fff',
      },
      secondary: {
        main: mode === 'dark' ? '#ffffff' : '#000000',
      },
      background: {
        default: mode === 'dark' ? '#0F0F0F' : '#F9F9F9',
        paper: mode === 'dark' ? '#272727' : '#FFFFFF',
      },
      text: {
        primary: mode === 'dark' ? '#ffffff' : '#0f0f0f',
        secondary: mode === 'dark' ? '#aaaaaa' : '#606060',
      },
      action: {
        hover: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.04)',
      }
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
      h3: {
        fontSize: 'var(--step-4)',
        fontWeight: 900,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontSize: 'var(--step-3)',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h5: { 
        fontSize: 'var(--step-2)',
        fontWeight: 700, 
      },
      h6: {
        fontSize: 'var(--step-1)',
        fontWeight: 600,
      },
      body1: {
        fontSize: 'var(--step-0)',
      },
      body2: {
        fontSize: 'var(--step--1)',
      },
      caption: {
        fontSize: 'var(--step--2)',
      },
      button: {
        fontSize: 'var(--step-0)',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: 2,
      },
    },
    shape: {
      borderRadius: 16, // Slightly rounder to match fluid feel
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 50,
            padding: 'var(--space-2xs) var(--space-m)',
            fontSize: 'var(--step-0)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            // Keep specialized styling in component or here? 
            // Setting defaults here helps consistency.
            backgroundImage: 'none',
            boxShadow: mode === 'light' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
            border: mode === 'light' ? '1px solid #eee' : 'none',
            borderRadius: '1.5rem', // Matches shape
            padding: 0,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: mode === 'dark' ? 'rgba(15,15,15,0.9)' : 'rgba(255,255,255,0.9)',
            color: mode === 'dark' ? '#fff' : '#000',
            backdropFilter: 'blur(10px)',
          }
        }
      },
      MuiTextField: {
         styleOverrides: {
             root: {
                 '& .MuiInputBase-input': {
                     color: mode === 'dark' ? 'white' : 'black',
                 },
                 '& .MuiInputBase-input::placeholder': {
                     color: mode === 'dark' ? '#aaaaaa' : '#666666',
                     opacity: 1,
                 }
             }
         }
      }
    },
  }), [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    // Heuristic #5: Error Prevention
    if (!url.includes("list=")) {
        setError("That doesn't look like a valid playlist URL. Please make sure it contains a 'list=' ID.");
        setLoading(false);
        return;
    }

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
        throw new Error(result.error || "Failed to fetch playlist data. Is the playlist public?");
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* Navigation */}
        <HideOnScroll>
          <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Container maxWidth="lg">
              <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <YouTubeIcon color="primary" sx={{ fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                      TuneTwin
                  </Typography>
                </Box>
                <Box>
                    <IconButton onClick={toggleColorMode} color="inherit" aria-label="toggle light/dark mode">
                        {theme.palette.mode === 'dark' ? <SunIcon /> : <MoonIcon />}
                    </IconButton>
                </Box>
              </Toolbar>
            </Container>
          </AppBar>
        </HideOnScroll>

        <Box component="main" sx={{ flexGrow: 1, pt: 8, pb: 12 }}>
          <Container maxWidth="lg">
            {/* Hero Section */}
            <Box sx={{ mb: 10, textAlign: 'center' }}>
              <Typography variant="h3" component="h1" gutterBottom sx={{ 
                  fontWeight: 900,
                  mb: 3,
                  letterSpacing: '-1px'
              }}>
                Discover your music's <span style={{ color: '#FF0000' }}>twin code</span>.
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 650, mx: 'auto', mb: 6, lineHeight: 1.6 }}>
                Unlock the algorithmic DNA of your playlists. Paste a YouTube Music link below to uncover hidden gems that match your vibe perfectly.
              </Typography>

              {/* Search Paper */}
              <Paper elevation={0} component="form" onSubmit={handleSubmit} 
                    sx={{ 
                        p: '6px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1, 
                        maxWidth: 700, 
                        mx: 'auto', 
                        bgcolor: mode === 'dark' ? '#282828' : '#f0f0f0',
                        borderRadius: 50,
                        border: 1,
                        borderColor: mode === 'dark' ? '#3F3F3F' : '#e0e0e0',
                        transition: 'all 0.2s',
                        '&:focus-within': {
                            borderColor: 'primary.main',
                            boxShadow: '0 0 0 2px rgba(255,0,0,0.1)'
                        }
                    }}>
                <Box sx={{ pl: 2, display: 'flex', alignItems: 'center' }}>
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                </Box>
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Paste YouTube Music playlist URL..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  InputProps={{ 
                      disableUnderline: true, 
                      sx: { fontSize: '1.05rem' },
                      "aria-label": "YouTube Music Playlist URL",
                      endAdornment: url ? (
                        <InputAdornment position="end">
                          <IconButton onClick={resetSearch} size="small" aria-label="clear search">
                             <CloseIcon fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      ) : null
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
                      boxShadow: 'none',
                      bgcolor: mode === 'dark' ? '#3F3F3F' : '#fff',
                      color: mode === 'dark' ? '#aaaaaa' : '#555',
                      border: '1px solid transparent',
                      borderColor: mode === 'light' ? '#ddd' : 'transparent',
                      '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          borderColor: 'primary.main'
                      }
                  }}
                >
                  {loading ? "Scanning..." : "Analyze"}
                </Button>
              </Paper>
            </Box>

            {error && (
              <Fade in={!!error}>
                <Alert severity="error" icon={<ErrorIcon />} variant="filled" sx={{ maxWidth: 700, mx: 'auto', mb: 8, borderRadius: 3 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Loading Skeletons */}
            {loading && !data && (
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Skeleton variant="rounded" height={500} sx={{ borderRadius: 4 }} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Skeleton variant="rounded" height={500} sx={{ borderRadius: 4 }} />
                </Grid>
              </Grid>
            )}

            {/* Results Display */}
            <div ref={resultsRef}>
             {data && (
              <Fade in={!!data} timeout={600}>
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
                          {data.original.map((item: any, index: number) => (
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
                      bgcolor: mode === 'dark' ? '#1a0000' : '#fff5f5', // Subtle red tint
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
                          {data.recommendations.map((item: any, index: number) => (
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
             )}
            </div>
          </Container>
        </Box>

        {/* Enhanced Footer */}
        <Box component="footer" sx={{ 
            py: 6, 
            bgcolor: mode === 'dark' ? '#0a0a0a' : '#f5f5f5',
            borderTop: 1,
            borderColor: 'divider',
            mt: 'auto'
        }}>
          <Container maxWidth="lg">
            <Stack spacing={3} alignItems="center" justifyContent="center">
              {/* Branding & Description */}
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                  <YouTubeIcon color="primary" sx={{ fontSize: 24 }} />
                  <Typography variant="h6" fontWeight="bold">TuneTwin</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 500, mx: 'auto' }}>
                  An experimental music discovery tool powered by bun and youtubei.js.
                </Typography>
              </Box>

              {/* Links */}
              <Link 
                href="https://github.com/jdluu/Tune-Twin" 
                target="_blank" 
                rel="noopener"
                color="text.secondary" 
                underline="hover" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5,
                  fontSize: '0.875rem',
                  transition: 'color 0.2s',
                  '&:hover': { color: 'primary.main' }
                }}
              >
                <GitHubIcon fontSize="small" /> Source Code
              </Link>

              {/* Copyright */}
              <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                © {new Date().getFullYear()} TuneTwin. Not affiliated with Google or YouTube.
              </Typography>
            </Stack>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
