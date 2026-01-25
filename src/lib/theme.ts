'use client';
import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#d32f2f', // Accessible Red (>4.5:1 contrast)
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
      secondary: mode === 'dark' ? '#aaaaaa' : '#424242',
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
    borderRadius: 16,
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
          backgroundImage: 'none',
          boxShadow: mode === 'light' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
          border: mode === 'light' ? '1px solid #eee' : 'none',
          borderRadius: '1.5rem',
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
});
