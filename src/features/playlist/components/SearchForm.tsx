import { 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper,
    InputAdornment,
    IconButton,
    Chip
} from "@mui/material";
import { 
    Search as SearchIcon, 
    Close as CloseIcon
} from "@mui/icons-material";

/**
 * Properties for the SearchForm component.
 */
interface SearchFormProps {
    /** The current URL or ID input value. */
    url: string;
    /** Callback to update the URL/ID input value. */
    setUrl: (url: string) => void;
    /** The server action to call on form submission. */
    formAction: (formData: FormData) => void;
    /** Whether the submission is currently pending. */
    isPending: boolean;
    /** The current theme mode. */
    mode: 'light' | 'dark';
    /** Array of recent search objects from history. */
    history: { id: string, title: string }[];
    /** Callback to remove an item from the search history. */
    removeFromHistory: (id: string) => void;
    /** Callback to reset the search input. */
    onReset: () => void;
}

/**
 * A specialized form component for inputting YouTube Music playlist URLs or IDs.
 * Features a stylized search bar, validation, and a "Recent Searches" chip cloud.
 * 
 * @param props - SearchFormProps
 */
export function SearchForm({ 
    url, 
    setUrl, 
    formAction, 
    isPending, 
    mode, 
    history, 
    removeFromHistory,
    onReset 
}: SearchFormProps) {
    return (
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
                                <IconButton onClick={onReset} size="small" aria-label="clear search">
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
                        }}
                        onDelete={() => removeFromHistory(item.id)}
                        sx={{ maxWidth: 200 }}
                    />
                ))}
            </Box>
        </Box>
    );
}
