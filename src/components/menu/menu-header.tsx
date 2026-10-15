'use client';

import { motion } from 'framer-motion';
import { SectionHeading } from '@/components/ui/section-heading';
import { OrnamentDivider } from '@/components/ui/ornament-divider';

export function MenuHeader() {
  return (
    <div className="relative bg-parchment py-16 md:py-24">
      <div className="paper-texture absolute inset-0 opacity-20" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto max-w-3xl px-4 md:px-8"
      >
        {/* Framed menu card */}
        <div className="relative border-2 border-brass bg-cream/50 px-6 py-10 md:px-12 md:py-14">
          {/* Inner border */}
          <div className="absolute inset-2 border border-brass/40 pointer-events-none" aria-hidden="true" />

          {/* Corner flourishes */}
          {[
            'top-2 left-2',
            'top-2 right-2 rotate-90',
            'bottom-2 left-2 -rotate-90',
            'bottom-2 right-2 rotate-180',
          ].map((pos) => (
            <svg
              key={pos}
              className={`absolute ${pos} text-brass`}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path d="M2 2H8M2 2V8M2 2L6 6" stroke="currentColor" strokeWidth="1" />
              <circle cx="6" cy="6" r="1.5" fill="currentColor" opacity="0.6" />
            </svg>
          ))}

          <div className="relative flex flex-col items-center gap-4">
            <SectionHeading
              eyebrow="The Bill of Fare"
              title="Our Menu"
            />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="font-cormorant text-lg md:text-xl italic text-sepia text-center"
            >
              Every dish cooked to order, never reheated.
            </motion.p>
            <OrnamentDivider width="md" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
