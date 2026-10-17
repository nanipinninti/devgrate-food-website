'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

export default function Error({
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
    <div className="mx-auto max-w-2xl px-4 md:px-8 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-playfair text-5xl md:text-7xl font-bold text-oxblood"
      >
        Oops!
      </motion.h1>

      <div className="my-6">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <circle cx="30" cy="30" r="26" fill="none" stroke="#B08A3E" strokeWidth="2" />
          <path d="M22 24 Q30 14 38 24" stroke="#7A1F1F" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="22" cy="32" r="2" fill="#7A1F1F" />
          <circle cx="38" cy="32" r="2" fill="#7A1F1F" />
          <path d="M22 42 Q30 36 38 42" stroke="#7A1F1F" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <h2 className="font-playfair text-2xl font-semibold text-ink mb-2">
        Something burnt in the kitchen
      </h2>
      <p className="font-cormorant text-lg italic text-sepia mb-6">
        An unexpected error occurred. Our chefs are working to fix it.
      </p>

      <OrnamentDivider width="sm" className="my-4" />

      <div className="flex flex-col sm:flex-row gap-3">
        <VintageButton onClick={reset}>Try Again</VintageButton>
        <Link href="/">
          <VintageButton variant="outline">Go Home</VintageButton>
        </Link>
      </div>
    </div>
  );
}
