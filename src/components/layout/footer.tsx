'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Flame,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ArrowUp,
  Clock,
  Check,
} from 'lucide-react';
import { OrnamentDivider } from '@/components/ui/ornament-divider';
import { VintageButton } from '@/components/ui/vintage-button';
import { Stamp } from '@/components/ui/stamp';
import { site } from '@/data/site';
import { cn } from '@/lib/utils';

const QUICK_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Full Menu', href: '/menu' },
  { label: 'Our Story', href: '/our-story' },
  { label: 'Track Order', href: '/track-order' },
  { label: 'Contact', href: '/contact' },
];

const SOCIAL_ICONS = [
  { Icon: Instagram, url: site.social.instagram, label: 'Instagram' },
  { Icon: Facebook, url: site.social.facebook, label: 'Facebook' },
  { Icon: Twitter, url: site.social.twitter, label: 'Twitter' },
];

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [currentYear, setCurrentYear] = useState('2025');

  useEffect(() => {
    setCurrentYear(String(new Date().getFullYear()));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative">
      {/* Newsletter band */}
      <div className="bg-forest text-cream relative overflow-hidden">
        <div className="paper-texture absolute inset-0 opacity-20" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-3xl px-4 py-12 text-center md:px-8"
        >
          <OrnamentDivider width="md" className="mb-6" />
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-3">
            Join the Supper Club
          </h2>
          <p className="font-cormorant text-lg italic text-cream/80 mb-6">
            Get exclusive offers, secret menu items, and a taste of what is cooking behind our doors — delivered to your inbox.
          </p>

          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center gap-3 justify-center"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                aria-label="Email address"
                className="w-full sm:w-72 bg-cream/10 border-2 border-brass/50 px-4 py-3 font-lora text-sm text-cream placeholder:text-cream/50 focus:outline-none focus:border-brass focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
              />
              <VintageButton variant="forest" size="md" type="submit">
                Subscribe
              </VintageButton>
            </form>

            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 flex items-center justify-center gap-3"
              >
                <span className="font-cormorant text-lg italic text-cream/90">
                  Welcome to the Supper Club!
                </span>
                <Stamp label="Sealed" sublabel="Welcome" size="sm" color="brass" className="opacity-90" />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Main footer */}
      <div className="bg-ink text-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Column 1: Logo + tagline + socials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center md:items-start gap-3"
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center rounded-full border-2 border-brass w-10 h-10">
                  <Flame className="h-5 w-5 text-brass" strokeWidth={1.5} />
                </div>
                <h3 className="font-playfair text-2xl font-bold">
                  {site.name}
                </h3>
              </div>
              <p className="font-cormorant text-lg italic text-sepia">
                {site.tagline}
              </p>
              <p className="font-elite text-[10px] uppercase tracking-[0.2em] text-brass mt-1">
                Est. {site.established}
              </p>
              <div className="flex gap-4 mt-3">
                {SOCIAL_ICONS.map(({ Icon, url, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="text-brass transition-all duration-200 hover:-translate-y-1 hover:text-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded p-1"
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Column 2: Quick links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex flex-col items-center md:items-start gap-3"
            >
              <h4 className="font-elite text-xs uppercase tracking-[0.2em] text-brass mb-1">
                Quick Links
              </h4>
              <ul className="space-y-2">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-lora text-sm text-cream/80 hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 3: Opening hours */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center md:items-start gap-2"
            >
              <h4 className="font-elite text-xs uppercase tracking-[0.2em] text-brass mb-1">
                Opening Hours
              </h4>
              <ul className="space-y-1.5">
                {site.hours.map((entry) => (
                  <li
                    key={entry.day}
                    className="flex items-center gap-2 font-elite text-[11px] uppercase tracking-wider text-cream/70"
                  >
                    <Clock className="h-3 w-3 text-brass shrink-0" strokeWidth={1.5} />
                    <span className="w-20">{entry.day.slice(0, 3)}</span>
                    <span className="text-cream/60 normal-case tracking-normal font-lora text-xs">
                      {entry.time}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Column 4: Contact + delivery zones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center md:items-start gap-3"
            >
              <h4 className="font-elite text-xs uppercase tracking-[0.2em] text-brass mb-1">
                Contact &amp; Delivery
              </h4>
              <div className="space-y-2">
                <a
                  href={`tel:${site.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-2 text-sm font-lora text-cream/80 hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1"
                >
                  <Phone className="h-4 w-4 text-brass shrink-0" strokeWidth={1.5} />
                  {site.phone}
                </a>
                <a
                  href={`mailto:${site.email}`}
                  className="flex items-center gap-2 text-sm font-lora text-cream/80 hover:text-brass transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded px-1"
                >
                  <Mail className="h-4 w-4 text-brass shrink-0" strokeWidth={1.5} />
                  {site.email}
                </a>
                <div className="flex items-start gap-2 text-sm font-lora text-cream/80">
                  <MapPin className="h-4 w-4 text-brass shrink-0 mt-0.5" strokeWidth={1.5} />
                  <span>
                    {site.address.line1}, {site.address.line2}, {site.address.city},{' '}
                    {site.address.state} {site.address.pincode}
                  </span>
                </div>
              </div>

              <div className="mt-2">
                <p className="font-elite text-[10px] uppercase tracking-wider text-brass mb-1.5">
                  We Deliver To
                </p>
                <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                  {site.deliveryZones.map((zone) => (
                    <span
                      key={zone}
                      className="font-elite text-[9px] uppercase tracking-wider text-cream/60 border border-brass/30 px-1.5 py-0.5"
                    >
                      {zone}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brass/20">
          <div className="mx-auto max-w-7xl px-4 py-5 md:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex items-center gap-3">
                <span className="text-brass" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                  </svg>
                </span>
                <p className="font-elite text-[10px] uppercase tracking-wider text-sepia">
                  © 1924–{currentYear} {site.name}. All rights reserved.
                </p>
              </div>
              <button
                onClick={scrollToTop}
                aria-label="Back to top"
                className={cn(
                  'flex items-center gap-2 font-elite text-[10px] uppercase tracking-wider text-brass',
                  'hover:text-cream transition-colors focus:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-brass rounded px-2 py-1'
                )}
              >
                Back to Top
                <ArrowUp className="h-3 w-3" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
