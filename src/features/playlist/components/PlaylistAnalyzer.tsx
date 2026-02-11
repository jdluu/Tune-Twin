'use client';

import { useState, useRef, useEffect, useActionState } from "react";
import { 
    Container, 
    Box, 
    Alert,
    Fade,
    Skeleton,
    Grid
} from "@mui/material";
import { 
    ErrorOutline as ErrorIcon
} from "@mui/icons-material";
import { ResultsDisplay } from "./ResultsDisplay";
import { useTheme } from "@mui/material/styles";
import { processPlaylistAction } from "../actions";
import type { ActionResponse } from "@/lib/types";
import { useSearchHistory } from "@/hooks/useSearchHistory";
import { SearchForm } from "./SearchForm";

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
  const mode = theme.palette.mode as 'light' | 'dark';

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
            <SearchForm 
                url={url}
                setUrl={setUrl}
                formAction={formAction}
                isPending={isPending}
                mode={mode}
                history={history}
                removeFromHistory={removeFromHistory}
                onReset={resetSearch}
            />

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
