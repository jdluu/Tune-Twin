import { Providers } from '@/components/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Box } from '@mui/material';
import './globals.css';

import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'TuneTwin - Discover Your Music Parallel',
    template: '%s | TuneTwin'
  },
  description: 'Analyze your YouTube Music playlists to discover their "Vibe" and find twin tracks. Advanced music analysis powered by AI.',
  applicationName: 'TuneTwin',
  authors: [{ name: 'TuneTwin Team' }],
  keywords: ['music', 'playlist', 'analysis', 'youtube music', 'recommendations', 'vibe', 'mood'],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tunetwin.vercel.app', // Placeholder URL
    title: 'TuneTwin - Discover Your Music Parallel',
    description: 'Analyze your YouTube Music playlists to discover their "Vibe" and find twin tracks.',
    siteName: 'TuneTwin',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuneTwin',
    description: 'Analyze your YouTube Music playlists to discover their "Vibe" and find twin tracks.',
    creator: '@tunetwin',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TuneTwin',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#FF0000',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              {children}
            </Box>
            <Footer />
          </Box>
        </Providers>
      </body>
    </html>
  );
}
