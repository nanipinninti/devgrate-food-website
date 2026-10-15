'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Search, X, IndianRupee } from 'lucide-react';
import { menu, type MenuItem } from '@/data/menu';
import { cn } from '@/lib/utils';

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MenuItem[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const matches = menu
      .filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
      .slice(0, 5);
    setResults(matches);
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleOutsideClick = useCallback(
    (e: React.MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const handleSelect = (item: MenuItem) => {
    onClose();
    router.push(`/menu/${item.id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-ink/30 backdrop-blur-sm"
          onClick={handleOutsideClick}
        >
          <motion.div
            ref={containerRef}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 left-0 right-0 bg-parchment border-b-2 border-brass shadow-vintage-lift"
          >
            <div className="mx-auto max-w-3xl px-4 py-8 md:px-8">
              <div className="relative">
                <Search
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 text-sepia"
                  strokeWidth={1.5}
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for a dish..."
                  className="w-full bg-transparent pl-10 pr-10 py-3 font-cormorant text-2xl italic text-ink placeholder:text-sepia/60 focus:outline-none"
                  aria-label="Search for a dish"
                />
                <button
                  onClick={onClose}
                  aria-label="Close search"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-sepia hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-parchment rounded"
                >
                  <X className="h-6 w-6" strokeWidth={1.5} />
                </button>
              </div>

              <AnimatePresence>
                {results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 overflow-hidden"
                  >
                    <ul className="space-y-1">
                      {results.map((item, i) => (
                        <motion.li
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <button
                            onClick={() => handleSelect(item)}
                            className={cn(
                              'flex w-full items-center gap-4 rounded-sm p-3 text-left',
                              'hover:bg-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
                              'transition-colors'
                            )}
                          >
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 rounded-sm object-cover border border-brass/40"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-playfair text-base text-ink truncate">
                                {item.name}
                              </p>
                              <p className="font-elite text-[10px] uppercase tracking-wider text-sepia">
                                {item.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 font-elite text-sm text-oxblood">
                              <IndianRupee className="h-3 w-3" />
                              {item.price}
                            </div>
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {query.trim() && results.length === 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 font-cormorant text-lg italic text-sepia"
                  >
                    No dishes found. Try another search.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
