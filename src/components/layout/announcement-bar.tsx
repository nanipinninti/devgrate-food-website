'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, Truck, Tag } from 'lucide-react';

const STORAGE_KEY = 'he-announcement-dismissed';

export function AnnouncementBar() {
  const prefersReduced = useReducedMotion();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (pathname !== '/') return;
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY);
      if (!dismissed) {
        setShow(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  if (!mounted || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={prefersReduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[55] bg-oxblood text-cream overflow-hidden"
        >
          <div className="mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-center gap-2 text-center">
            <Truck className="h-3.5 w-3.5 text-brass shrink-0" strokeWidth={1.5} aria-hidden="true" />
            <p className="font-elite text-[10px] uppercase tracking-wider">
              Free delivery on orders above ₹499
            </p>
            <span className="text-brass/60">·</span>
            <p className="font-elite text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Tag className="h-3 w-3 text-brass" strokeWidth={1.5} aria-hidden="true" />
              Use code FIRSTBITE
            </p>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/70 hover:text-cream transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-0.5"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
