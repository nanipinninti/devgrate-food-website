'use client';

import { motion } from 'framer-motion';

export function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="bg-cream border border-brass/30 shadow-vintage-card rounded-sm overflow-hidden"
        >
          <div className="relative h-48 overflow-hidden bg-sepia/10">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-parchment/50 to-transparent"
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          </div>
          <div className="p-4 space-y-3">
            <div className="h-5 w-3/4 bg-sepia/15 rounded-sm" />
            <div className="h-3 w-full bg-sepia/10 rounded-sm" />
            <div className="h-3 w-2/3 bg-sepia/10 rounded-sm" />
            <div className="flex justify-between items-center pt-2">
              <div className="h-6 w-16 bg-sepia/15 rounded-sm" />
              <div className="h-7 w-16 bg-sepia/15 rounded-sm" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
