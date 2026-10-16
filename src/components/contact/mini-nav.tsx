'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'info', label: 'Info' },
  { id: 'write', label: 'Write to Us' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'faq', label: 'FAQ' },
];

export function MiniNav() {
  const [activeSection, setActiveSection] = useState('info');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -10 }}
      transition={{ duration: 0.3 }}
      className="sticky top-20 z-40 hidden md:flex justify-center"
    >
      <div className="bg-parchment/95 backdrop-blur-sm border border-brass/30 shadow-vintage-card flex gap-1 px-2 py-1.5">
        {SECTIONS.map(({ id, label }) => (
          <button
            key={id}
            onClick={(e) => handleClick(e, id)}
            className={cn(
              'px-4 py-1.5 font-elite text-[10px] uppercase tracking-wider transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
              activeSection === id
                ? 'bg-oxblood text-cream'
                : 'text-sepia hover:text-oxblood'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
