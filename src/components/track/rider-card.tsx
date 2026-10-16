'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Phone, MessageSquare, Star, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Rider } from '@/data/riders';
import { cn } from '@/lib/utils';

interface RiderCardProps {
  rider: Rider;
}

const QUICK_REPLIES = [
  'Please leave at the door',
  'I am on my way down',
  'Please call when you arrive',
  'Thank you for the delivery!',
];

export function RiderCard({ rider }: RiderCardProps) {
  const prefersReduced = useReducedMotion();
  const { toast } = useToast();
  const [showMessages, setShowMessages] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMessages(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCall = () => {
    toast({
      title: 'Calling rider',
      description: rider.phone,
    });
  };

  const handleSendMessage = (msg: string) => {
    toast({
      title: 'Message sent',
      description: msg,
    });
    setShowMessages(false);
  };

  return (
    <motion.div
      initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-4"
    >
      <div className="flex items-center gap-4">
        {/* Photo in brass oval frame */}
        <div className="shrink-0 w-16 h-16 rounded-full border-2 border-brass overflow-hidden bg-cream">
          <img src={rider.photo} alt={rider.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h4 className="font-playfair text-base font-semibold text-ink truncate">{rider.name}</h4>
          <div className="flex items-center gap-1 mt-0.5">
            <Star className="h-3 w-3 fill-brass text-brass" />
            <span className="font-elite text-[10px] text-sepia">{rider.rating}</span>
            <span className="font-cormorant text-xs italic text-sepia/70 ml-2">{rider.vehicleNumber}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCall}
            aria-label={`Call ${rider.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brass bg-cream text-oxblood hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
          >
            <Phone className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMessages(!showMessages)}
              aria-label={`Message ${rider.name}`}
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-brass bg-cream text-oxblood hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
            >
              <MessageSquare className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <AnimatePresence>
              {showMessages && (
                <motion.div
                  initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-11 z-20 w-56 bg-cream border-2 border-brass/40 shadow-vintage-lift"
                >
                  <div className="flex items-center justify-between border-b border-brass/20 px-3 py-2">
                    <span className="font-elite text-[9px] uppercase tracking-wider text-sepia">Quick Reply</span>
                    <button onClick={() => setShowMessages(false)} aria-label="Close messages" className="text-sepia hover:text-oxblood">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="py-1">
                    {QUICK_REPLIES.map((msg) => (
                      <button
                        key={msg}
                        onClick={() => handleSendMessage(msg)}
                        className="block w-full text-left px-3 py-2 font-cormorant text-sm italic text-ink/80 hover:bg-brass/5 transition-colors"
                      >
                        {msg}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
