import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Hearth & Ember — Cooked with fire. Delivered with care.';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F4EBD9',
          backgroundImage:
            'radial-gradient(ellipse at center, transparent 40%, rgba(43, 29, 20, 0.15) 100%)',
          position: 'relative',
        }}
      >
        {/* Brass border */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: '2px solid #B08A3E',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: '3px solid #B08A3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 20,
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#7A1F1F">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: '#2B1D14',
              fontFamily: 'serif',
              marginBottom: 8,
            }}
          >
            Hearth &amp; Ember
          </div>
          <div
            style={{
              fontSize: 24,
              fontStyle: 'italic',
              color: '#8B6B4A',
              fontFamily: 'serif',
            }}
          >
            Cooked with fire. Delivered with care.
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: 14,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#B08A3E',
              fontFamily: 'monospace',
            }}
          >
            Est. 1924
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
