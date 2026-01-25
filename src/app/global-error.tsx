'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error; // Required by Next.js
  
  return (
    <html lang="en">
      <body style={{ 
        margin: 0, 
        padding: 0, 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#121212', 
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh'
      }}>
        <div style={{ 
            padding: '40px', 
            maxWidth: '500px',
            textAlign: 'center',
            backgroundColor: '#1e1e1e',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            border: '1px solid #333'
        }}>
            <h1 style={{ marginBottom: '16px', color: '#ff4444' }}>System Error</h1>
            <p style={{ marginBottom: '24px', color: '#aaa', lineHeight: '1.5' }}>
                A critical error occurred that prevented the application from loading. 
                Please verify your connection and try refreshing.
            </p>
            <button 
                onClick={() => reset()}
                style={{
                    padding: '12px 24px',
                    backgroundColor: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s'
                }}
            >
                Refresh Application
            </button>
        </div>
      </body>
    </html>
  );
}
