'use client';
import { Box, Container, Stack, Typography, Link } from "@mui/material";
import { YouTube as YouTubeIcon, GitHub as GitHubIcon } from "@mui/icons-material";

export function Footer() {
    return (
        <Box component="footer" sx={{ 
            py: 6, 
            bgcolor: 'background.default',
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
                  An experimental music discovery tool powered by Next.js and youtubei.js.
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
              <Typography variant="caption" color="text.secondary">
                © {new Date().getFullYear()} TuneTwin. Not affiliated with Google or YouTube.
              </Typography>
            </Stack>
          </Container>
        </Box>
    );
}
