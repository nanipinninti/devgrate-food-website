'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function IntroScreen() {
  const prefersReduced = useReducedMotion();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (prefersReduced) return;
    try {
      const seen = sessionStorage.getItem('he-intro-seen');
      if (!seen) {
        setShow(true);
      }
    } catch {
      // sessionStorage may be unavailable
    }
  }, [prefersReduced]);

  const handleComplete = () => {
    setShow(false);
    try {
      sessionStorage.setItem('he-intro-seen', '1');
    } catch {
      // ignore
    }
  };

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && !prefersReduced && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-parchment paper-texture"
          initial={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                <motion.circle
                  cx="48"
                  cy="48"
                  r="44"
                  fill="none"
                  stroke="#B08A3E"
                  strokeWidth="2"
                  strokeDasharray="276"
                  initial={{ strokeDashoffset: 276 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              </svg>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                className="absolute"
              >
                <motion.path
                  d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
                  fill="#7A1F1F"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: 'easeInOut' }}
                />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-2">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-ink">
                {'Hearth & Ember'.split('').map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.04, duration: 0.3 }}
                    className="inline-block"
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </motion.span>
                ))}
              </h1>
              <motion.p
                className="font-elite text-[10px] uppercase tracking-[0.3em] text-sepia"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.6, duration: 0.4 }}
              >
                Est. 1924
              </motion.p>

              <motion.div
                className="h-0.5 bg-brass rounded-full"
                initial={{ width: 0 }}
                animate={{ width: 120 }}
                transition={{ delay: 1.6, duration: 0.6, ease: 'easeInOut' }}
              />
            </div>
          </div>

          <AutoDismiss onComplete={handleComplete} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AutoDismiss({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2400);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return null;
}
