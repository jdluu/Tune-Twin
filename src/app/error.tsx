'use client';

import { useEffect } from 'react';
import { Typography, Button, Container, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon } from '@mui/icons-material';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Container maxWidth="sm" sx={{ py: 10 }}>
        <Paper 
            elevation={0}
            sx={{ 
                p: 4, 
                textAlign: 'center', 
                border: 1, 
                borderColor: 'error.light',
                bgcolor: 'background.paper',
                borderRadius: 4
            }}
        >
            <ErrorIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
                Something went wrong!
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
                We encountered an unexpected error while processing your request. 
                Please try again later.
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={reset}
            >
                Try again
            </Button>
        </Paper>
    </Container>
  );
}
