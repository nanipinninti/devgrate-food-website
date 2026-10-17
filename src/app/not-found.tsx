import Link from 'next/link';
import { motion } from 'framer-motion';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { Search404 } from '@/components/layout/search-404';
import { menu } from '@/data/menu';

export default function NotFound() {
  const popularDishes = menu.filter((d) => d.isBestseller).slice(0, 3);

  return (
    <div className="mx-auto max-w-2xl px-4 md:px-8 py-20 text-center min-h-[70vh] flex flex-col items-center justify-center">
      {/* 404 */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="font-playfair text-7xl md:text-9xl font-bold text-oxblood"
      >
        404
      </motion.h1>

      {/* Cloche illustration */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="my-6"
      >
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          <ellipse cx="40" cy="52" rx="28" ry="4" fill="#8B6B4A" opacity="0.2" />
          <motion.g
            initial={{ y: 0 }}
            animate={{ y: [-2, -6, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <path d="M16 48 Q40 20 64 48" stroke="#B08A3E" strokeWidth="2" fill="none" />
            <circle cx="40" cy="22" r="3" fill="#B08A3E" />
          </motion.g>
          <line x1="14" y1="50" x2="66" y2="50" stroke="#B08A3E" strokeWidth="2" />
        </svg>
      </motion.div>

      <h2 className="font-playfair text-2xl font-semibold text-ink mb-2">
        This page has gone out of the kitchen
      </h2>
      <p className="font-cormorant text-lg italic text-sepia mb-6">
        We searched the hearth but could not find what you were looking for.
      </p>

      <Search404 />

      <OrnamentDivider width="sm" className="my-6" />

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <Link href="/">
          <VintageButton>Back to Home</VintageButton>
        </Link>
        <Link href="/menu">
          <VintageButton variant="outline">Browse the Menu</VintageButton>
        </Link>
      </div>

      {/* Popular dishes */}
      <div className="w-full">
        <p className="font-elite text-[10px] uppercase tracking-wider text-sepia mb-3">
          Popular Dishes
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {popularDishes.map((dish) => (
            <Link
              key={dish.id}
              href={`/menu/${dish.id}`}
              className="font-cormorant text-sm italic text-oxblood hover:text-brass transition-colors border border-brass/20 px-3 py-1.5 hover:border-brass/50"
            >
              {dish.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
