'use client';
import { 
    AppBar, 
    Toolbar, 
    Box, 
    Typography, 
    IconButton, 
    Container, 
    Slide, 
    useScrollTrigger 
} from "@mui/material";
import { 
    YouTube as YouTubeIcon, 
    Brightness4 as MoonIcon, 
    Brightness7 as SunIcon 
} from "@mui/icons-material";
import { useColorMode } from "../providers/Providers";
import { useTheme } from "@mui/material/styles";

function HideOnScroll(props: { children: React.ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

export function Navbar() {
    const { toggleColorMode } = useColorMode();
    const theme = useTheme();

    return (
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
    );
}
