'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          whileHover={prefersReduced ? {} : { y: -3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-4 left-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border-2 border-brass bg-cream text-oxblood shadow-vintage-card hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
        >
          <ArrowUp className="h-5 w-5" strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
