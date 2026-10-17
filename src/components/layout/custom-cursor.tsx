'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useSpring } from 'framer-motion';

export function CustomCursor() {
  const prefersReduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [overInteractive, setOverInteractive] = useState(false);
  const [inInput, setInInput] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const x = useSpring(0, { stiffness: 500, damping: 40 });
  const y = useSpring(0, { stiffness: 500, damping: 40 });

  useEffect(() => {
    if (prefersReduced) return;
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(mq.matches);
    const handler = (e: MediaQueryListEvent) => setEnabled(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [prefersReduced]);

  useEffect(() => {
    if (!enabled) return;

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, [role="button"], .cursor-pointer');
      const isInput = !!target.closest('input, textarea, select, [contenteditable]');
      setOverInteractive(isInteractive);
      setInInput(isInput);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [enabled, x, y]);

  if (!enabled || prefersReduced) return null;

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed z-[250] hidden md:block"
      style={{ x, y }}
      aria-hidden="true"
    >
      <motion.div
        className="rounded-full border border-brass"
        animate={{
          width: overInteractive ? 32 : 16,
          height: overInteractive ? 32 : 16,
          opacity: inInput ? 0 : 0.5,
          x: overInteractive ? -16 : -8,
          y: overInteractive ? -16 : -8,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      />
    </div>
  );
}
