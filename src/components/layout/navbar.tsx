'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Flame, Search, ShoppingCart, Menu, X, Phone, Clock } from 'lucide-react';
import { site } from '@/data/site';
import { useCart } from '@/store/cart';
import { VintageButton } from '@/components/ui/vintage-button';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { SearchOverlay } from './search-overlay';
import { useUIStore } from '@/store/ui';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Track Order', href: '/track' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [prevY, setPrevY] = useState(0);
  const itemCount = useCart((s) => s.getItemCount());
  const prevCount = useRef(itemCount);
  const [cartBounce, setCartBounce] = useState(false);
  const openCart = useUIStore((s) => s.openCart);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 50);
    if (latest > prevY && latest > 120) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setPrevY(latest);
  });

  useEffect(() => {
    if (itemCount !== prevCount.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 600);
      prevCount.current = itemCount;
      return () => clearTimeout(t);
    }
  }, [itemCount]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden && !mobileOpen ? -120 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-cream/95 backdrop-blur-md border-b-2 border-brass shadow-[0_1px_0_0_#B08A3E,0_2px_0_0_#F4EBD9,0_3px_0_0_#B08A3E]'
            : 'bg-transparent'
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl px-4 md:px-8 transition-all duration-300',
            scrolled ? 'py-2' : 'py-4'
          )}
        >
          {/* Desktop layout */}
          <div className="hidden lg:flex items-center justify-between gap-8">
            {/* Left: nav links */}
            <nav className="flex items-center gap-6 flex-1" aria-label="Main navigation">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative font-elite text-[11px] uppercase tracking-[0.15em] transition-colors duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1',
                    isActive(link.href) ? 'text-oxblood' : 'text-ink hover:text-oxblood',
                    scrolled ? '' : 'text-ink hover:text-oxblood'
                  )}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.span
                      layoutId="nav-active-underline"
                      className="absolute left-0 right-0 -bottom-1 h-0.5 bg-brass"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-brass origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </nav>

            {/* Center: logo */}
            <Link
              href="/"
              className="flex flex-col items-center gap-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded-full px-2"
              aria-label={`${site.name} home`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex items-center justify-center rounded-full border-2 transition-all duration-300',
                    scrolled ? 'w-9 h-9 border-brass' : 'w-11 h-11 border-brass'
                  )}
                >
                  <Flame
                    className={cn(
                      'text-oxblood transition-all duration-300',
                      scrolled ? 'h-5 w-5' : 'h-6 w-6'
                    )}
                    strokeWidth={1.5}
                  />
                </div>
                <span
                  className={cn(
                    'font-playfair font-bold text-ink leading-none transition-all duration-300',
                    scrolled ? 'text-lg' : 'text-xl'
                  )}
                >
                  {site.name}
                </span>
              </div>
              <span className="font-cormorant text-[10px] italic text-sepia mt-0.5">
                Est. {site.established}
              </span>
            </Link>

            {/* Right: actions */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="text-ink hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-1"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <button
                onClick={openCart}
                aria-label={`Cart with ${itemCount} items`}
                className="relative text-ink hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-1"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={cartBounce ? 'bounce' : 'idle'}
                      initial={cartBounce ? { scale: 1 } : false}
                      animate={
                        cartBounce
                          ? { scale: [1, 1.5, 1] }
                          : { scale: 1 }
                      }
                      transition={{ duration: 0.5, type: 'spring' }}
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-oxblood text-cream font-elite text-[10px] leading-none"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <Link href="/menu" aria-label="Order now">
                <VintageButton size="sm">Order Now</VintageButton>
              </Link>
            </div>
          </div>

          {/* Mobile layout */}
          <div className="flex lg:hidden items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label={`${site.name} home`}
            >
              <div className="flex items-center justify-center rounded-full border-2 border-brass w-9 h-9">
                <Flame className="h-5 w-5 text-oxblood" strokeWidth={1.5} />
              </div>
              <div className="flex flex-col">
                <span className="font-playfair font-bold text-ink text-base leading-none">
                  {site.name}
                </span>
                <span className="font-cormorant text-[9px] italic text-sepia mt-0.5">
                  Est. {site.established}
                </span>
              </div>
            </Link>

            {/* Right: cart + hamburger */}
            <div className="flex items-center gap-4">
              <button
                onClick={openCart}
                aria-label={`Cart with ${itemCount} items`}
                className="relative text-ink hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-1"
              >
                <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={cartBounce ? 'bounce' : 'idle'}
                      initial={cartBounce ? { scale: 1 } : false}
                      animate={cartBounce ? { scale: [1, 1.5, 1] } : { scale: 1 }}
                      transition={{ duration: 0.5, type: 'spring' }}
                      className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-oxblood text-cream font-elite text-[10px] leading-none"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="text-ink hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-1"
              >
                <Menu className="h-6 w-6" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-parchment paper-texture flex flex-col lg:hidden"
          >
            <div className="flex items-center justify-between px-4 py-4">
              <span className="font-elite text-xs uppercase tracking-[0.2em] text-sepia">
                Menu
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-ink hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-1"
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" strokeWidth={1.5} />
                </motion.div>
              </button>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-2 px-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }}
                  className="w-full max-w-xs flex flex-col items-center"
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'font-playfair text-3xl text-ink hover:text-oxblood transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-2',
                      isActive(link.href) && 'text-oxblood'
                    )}
                  >
                    {link.label}
                  </Link>
                  <OrnamentDivider width="sm" className="my-2" />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="px-8 py-8 border-t border-brass/30"
            >
              <div className="flex items-center justify-center gap-2 text-sepia">
                <Phone className="h-4 w-4 text-brass" strokeWidth={1.5} />
                <span className="font-elite text-xs tracking-wider">{site.phone}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sepia mt-2">
                <Clock className="h-4 w-4 text-brass" strokeWidth={1.5} />
                <span className="font-elite text-[10px] uppercase tracking-wider">
                  {site.hours[0].time}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
