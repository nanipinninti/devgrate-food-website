'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Copy, Check } from 'lucide-react';
import { site } from '@/data/site';
import { cn } from '@/lib/utils';

function parseTime(timeStr: string): { openH: number; openM: number; closeH: number; closeM: number } | null {
  const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)\s*[–-]\s*(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  const [, oh, om, oap, ch, cm, cap] = match;
  let openH = parseInt(oh);
  if (oap.toUpperCase() === 'PM' && openH !== 12) openH += 12;
  if (oap.toUpperCase() === 'AM' && openH === 12) openH = 0;
  let closeH = parseInt(ch);
  if (cap.toUpperCase() === 'PM' && closeH !== 12) closeH += 12;
  if (cap.toUpperCase() === 'AM' && closeH === 12) closeH = 0;
  return { openH, openM: parseInt(om), closeH, closeM: parseInt(cm) };
}

function getOpenStatus(): { open: boolean; nextTime: string } | null {
  const now = new Date();
  const dayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;
  const today = site.hours[dayIdx];
  if (!today) return null;
  const parsed = parseTime(today.time);
  if (!parsed) return null;

  const currentMin = now.getHours() * 60 + now.getMinutes();
  const openMin = parsed.openH * 60 + parsed.openM;
  const closeMin = parsed.closeH * 60 + parsed.closeM;

  if (currentMin >= openMin && currentMin < closeMin) {
    return { open: true, nextTime: '' };
  }

  const openTimeStr = `${parsed.openH % 12 || 12}:${String(parsed.openM).padStart(2, '0')} ${parsed.openH >= 12 ? 'PM' : 'AM'}`;
  return { open: false, nextTime: openTimeStr };
}

export function InfoCards() {
  const prefersReduced = useReducedMotion();
  const [openStatus, setOpenStatus] = useState<{ open: boolean; nextTime: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOpenStatus(getOpenStatus());
    const interval = setInterval(() => setOpenStatus(getOpenStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  const fullAddress = `${site.address.line1}, ${site.address.line2}, ${site.address.city}, ${site.address.state} — ${site.address.pincode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(fullAddress).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const cards = [
    {
      icon: Phone,
      title: 'Call Us',
      lines: [site.phone],
      action: { type: 'link' as const, href: `tel:${site.phone.replace(/\s/g, '')}`, label: 'Tap to call' },
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: [site.email],
      action: { type: 'link' as const, href: `mailto:${site.email}`, label: 'Send an email' },
    },
    {
      icon: MapPin,
      title: 'Visit the Kitchen',
      lines: [site.address.line1, `${site.address.city} — ${site.address.pincode}`],
      action: { type: 'copy' as const, label: 'Copy address' },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Standard info cards */}
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-5 flex flex-col"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brass bg-cream mb-3">
            <card.icon className="h-5 w-5 text-brass" strokeWidth={1.5} />
          </div>
          <h3 className="font-playfair text-base font-semibold text-ink mb-1">{card.title}</h3>
          <div className="flex-1">
            {card.lines.map((line, j) => (
              <p key={j} className="font-lora text-sm text-sepia leading-relaxed">{line}</p>
            ))}
          </div>

          {card.action.type === 'link' && (
            <a
              href={card.action.href}
              className="font-elite text-[10px] uppercase tracking-wider text-oxblood hover:text-brass transition-colors mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              {card.action.label} &rarr;
            </a>
          )}
          {card.action.type === 'copy' && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 font-elite text-[10px] uppercase tracking-wider text-oxblood hover:text-brass transition-colors mt-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass self-start"
              aria-label="Copy address to clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-forest" strokeWidth={2} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" strokeWidth={1.5} />
                  {card.action.label}
                </>
              )}
            </button>
          )}
        </motion.div>
      ))}

      {/* Opening Hours card */}
      <motion.div
        initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ delay: 0.24, duration: 0.4 }}
        className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-5 flex flex-col"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-brass bg-cream mb-3">
          <Clock className="h-5 w-5 text-brass" strokeWidth={1.5} />
        </div>
        <h3 className="font-playfair text-base font-semibold text-ink mb-2">Opening Hours</h3>

        {/* Open/Closed badge */}
        {openStatus && (
          <div className="flex items-center gap-2 mb-3">
            {openStatus.open ? (
              <span className="flex items-center gap-1.5 px-2 py-1 border border-forest/40 bg-forest/5">
                {!prefersReduced && (
                  <motion.span
                    className="h-2 w-2 rounded-full bg-forest"
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                {prefersReduced && <span className="h-2 w-2 rounded-full bg-forest" />}
                <span className="font-elite text-[9px] uppercase tracking-wider text-forest">Open Now</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2 py-1 border border-sepia/40 bg-sepia/5">
                <span className="h-2 w-2 rounded-full bg-sepia" />
                <span className="font-elite text-[9px] uppercase tracking-wider text-sepia">
                  Closed · Opens at {openStatus.nextTime}
                </span>
              </span>
            )}
          </div>
        )}

        <div className="flex-1 space-y-1">
          {site.hours.map((entry) => (
            <div key={entry.day} className="flex justify-between">
              <span className="font-lora text-xs text-sepia">{entry.day.slice(0, 3)}</span>
              <span className="font-elite text-[10px] text-ink/70">{entry.time}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
