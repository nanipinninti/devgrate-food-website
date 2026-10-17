import type { Metadata } from 'next';
import { Suspense } from 'react';
import { TrackClient } from '@/components/track/track-client';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description: 'Follow your order from kitchen to doorstep in real time.',
  robots: { index: false, follow: false },
};

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
        </div>
      }
    >
      <TrackClient />
    </Suspense>
  );
}
