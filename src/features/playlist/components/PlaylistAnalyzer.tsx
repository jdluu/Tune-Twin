'use client';

import { useState, useRef, useEffect } from "react";
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper,
    InputAdornment,
    IconButton,
    Alert,
    Fade,
    Skeleton,
    Grid
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Close as CloseIcon,
    ErrorOutline as ErrorIcon
} from "@mui/icons-material";
import { ResultsDisplay } from "./ResultsDisplay";
import { useTheme } from "@mui/material/styles";
import { processPlaylistAction } from "../actions";
import type { PlaylistResult } from "@/lib/types";

export function PlaylistAnalyzer() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PlaylistResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const theme = useTheme();
  const mode = theme.palette.mode;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setData(null);

    // Heuristic #5: Error Prevention
    if (!url.includes("list=") && !url.includes("music.youtube.com")) {
        // We allow loose URLs but warn if it looks totally wrong, keeping strict validation for the backend
         if (!url.includes("list=")) {
             setError("That doesn't look like a valid playlist URL. Please make sure it contains a 'list=' ID.");
             setLoading(false);
             return;
         }
    }

    try {
      const result = await processPlaylistAction(url);
      
      if (!result.success) {
          throw new Error(result.error || "Failed to fetch playlist data.");
      }

      if (result.data) {
          setData(result.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
        <Box sx={{ pt: 8, pb: 12 }}>
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
             {data && <ResultsDisplay data={data} />}
            </div>
          </Container>
        </Box>
  );
}
