'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ backgroundColor: '#F4EBD9', color: '#2B1D14', fontFamily: 'serif', margin: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'serif', fontSize: '3rem', fontWeight: 700, color: '#7A1F1F', marginBottom: '1rem' }}>
            Something went wrong
          </h1>
          <p style={{ fontStyle: 'italic', color: '#8B6B4A', marginBottom: '2rem', fontSize: '1.125rem' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: '#7A1F1F',
              color: '#FBF6EA',
              border: '2px solid #B08A3E',
              padding: '0.75rem 2rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
