import type { Metadata } from 'next';
import { Suspense } from 'react';
import { PageTransition } from '@/components/ui/page-transition';
import { TrackClient } from '@/components/track/track-client';

export const metadata: Metadata = {
  title: 'Track Your Order — Hearth & Ember',
  description: 'Follow your order from kitchen to doorstep in real time.',
  robots: { index: false, follow: false },
};

export default function TrackOrderPage() {
  return (
    <PageTransition>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brass border-t-transparent" />
          </div>
        }
      >
        <TrackClient />
      </Suspense>
    </PageTransition>
  );
}
