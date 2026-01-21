'use client';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error; // Required by Next.js but not used in minimal error handler
  return (
    <html>
      <body>
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <h1>Critical Error</h1>
            <p>A critical system error occurred. Please refresh the page.</p>
            <button onClick={() => reset()}>Refresh</button>
        </div>
      </body>
    </html>
  );
}
