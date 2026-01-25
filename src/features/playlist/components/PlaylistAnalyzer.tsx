'use client';

import { useState, useRef, useEffect, useActionState } from "react";
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
    Grid,
    Chip
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Close as CloseIcon,
    ErrorOutline as ErrorIcon
} from "@mui/icons-material";
import { ResultsDisplay } from "./ResultsDisplay";
import { useTheme } from "@mui/material/styles";
import { processPlaylistAction } from "../actions";
import type { ActionResponse } from "@/lib/types";
import { useSearchHistory } from "@/hooks/useSearchHistory";

/**
 * Main feature component for analyzing playlists.
 * Handles the input form, server action submission, and displays results.
 * Manages "Recent Searches" history in localStorage.
 */
export function PlaylistAnalyzer() {
  const [url, setUrl] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [state, formAction, isPending] = useActionState<ActionResponse | null, FormData>(
    processPlaylistAction,
    null
  );

  const data = state?.success ? state.data : null;
  const error = !state?.success ? state?.error : null;
  
  const theme = useTheme();
  const mode = theme.palette.mode;

  const resetSearch = () => {
      setUrl("");
  };

  const { history, addToHistory, removeFromHistory } = useSearchHistory();

  // Scroll to results when data is loaded
  useEffect(() => {
    if (data && resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

    // Update history when data is received
    useEffect(() => {
        if (data && data.metadata) {
            addToHistory({
                id: data.metadata.id,
                title: data.metadata.title
            });
        }
    }, [data, addToHistory]);

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
                Find your playlist&apos;s <span style={{ color: '#FF0000' }}>perfect matches</span>.
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 400, maxWidth: 650, mx: 'auto', mb: 6, lineHeight: 1.6 }}>
                Analyze any YouTube Music playlist to understand its vibe and discover new tracks that fit seamlessly with your current favorites.
              </Typography>

              {/* Search Paper */}
              <Paper elevation={0} component="form" action={formAction} 
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
                  name="url"
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
                  disabled={isPending}
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
                  {isPending ? "Scanning..." : "Analyze"}
                </Button>
              </Paper>

              {/* Recent Searches */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
                  {history.length > 0 && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', width: '100%', mb: 0.5 }}>
                          Recent Searches:
                      </Typography>
                  )}
                  {history.map((item) => (
                      <Chip 
                          key={item.id}
                          label={item.title}
                          size="small"
                          onClick={() => {
                              setUrl(`https://music.youtube.com/playlist?list=${item.id}`);
                              // Optional: auto-submit or just fill
                          }}
                          onDelete={() => removeFromHistory(item.id)}
                          sx={{ maxWidth: 200 }}
                      />
                  ))}
              </Box>
            </Box>

            {error && (
              <Fade in={!!error}>
                <Alert severity="error" icon={<ErrorIcon />} variant="filled" sx={{ maxWidth: 700, mx: 'auto', mb: 8, borderRadius: 3 }}>
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Loading Skeletons */}
            {isPending && !data && (
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
