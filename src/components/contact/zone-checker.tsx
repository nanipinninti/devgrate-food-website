'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { MapPin, Check, Search } from 'lucide-react';
import { site } from '@/data/site';
import { useToast } from '@/hooks/use-toast';
import { VintageButton } from '@/components/ui/vintage-button';
import { cn } from '@/lib/utils';

interface ZoneCheckerProps {
  selectedZone: string | null;
  onSelectZone: (zone: string) => void;
}

const ZONE_PINCODES: Record<string, string> = {
  'MG Road': '560001',
  Indiranagar: '560038',
  Koramangala: '560034',
  'HSR Layout': '560102',
  Whitefield: '560066',
  Jayanagar: '560011',
  'BTM Layout': '560076',
  'Ashok Nagar': '560025',
};

export function ZoneChecker({ selectedZone, onSelectZone }: ZoneCheckerProps) {
  const prefersReduced = useReducedMotion();
  const { toast } = useToast();
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<'found' | 'notFound' | null>(null);
  const [foundZone, setFoundZone] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState('');

  const handleCheck = (code?: string) => {
    const value = (code || pincode).trim();
    if (value.length !== 6) {
      setResult(null);
      return;
    }
    setChecking(true);
    setResult(null);

    setTimeout(() => {
      setChecking(false);
      const zone = Object.entries(ZONE_PINCODES).find(([, pc]) => pc === value);
      if (zone) {
        setResult('found');
        setFoundZone(zone[0]);
        onSelectZone(zone[0]);
      } else {
        setResult('notFound');
        setFoundZone(null);
      }
    }, 800);
  };

  const handleChipClick = (zone: string) => {
    const pc = ZONE_PINCODES[zone];
    if (pc) {
      setPincode(pc);
      handleCheck(pc);
    }
  };

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyEmail) return;
    toast({
      title: 'You are on the list!',
      description: 'We will notify you when we start delivering to your area.',
    });
    setNotifyEmail('');
  };

  return (
    <div className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-6">
      <h3 className="font-playfair text-lg font-bold text-ink mb-1">Do We Deliver to You?</h3>
      <p className="font-cormorant text-sm italic text-sepia mb-4">
        Enter your 6-digit pincode to find out.
      </p>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
            setPincode(val);
            setResult(null);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
          placeholder="560001"
          aria-label="Enter your pincode"
          className="checkout-input"
        />
        <VintageButton size="sm" onClick={() => handleCheck()} disabled={checking}>
          {checking ? (
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-cream border-t-transparent" />
              Checking
            </span>
          ) : (
            <>
              <Search className="h-4 w-4 mr-1" strokeWidth={1.5} />
              Check
            </>
          )}
        </VintageButton>
      </div>

      {/* Results */}
      <div aria-live="polite">
        <AnimatePresence mode="wait">
          {result === 'found' && foundZone && (
            <motion.div
              key="found"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-2 border-forest/40 bg-forest/5 p-4 mb-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-5 w-5 text-forest" strokeWidth={2} />
                <span className="font-playfair text-base font-semibold text-forest">
                  Yes! We deliver to {foundZone}
                </span>
              </div>
              <p className="font-cormorant text-sm italic text-ink/70">
                Usually delivered in about 35 to 45 minutes. Delivery fee: ₹49 (free on orders above ₹499).
              </p>
            </motion.div>
          )}

          {result === 'notFound' && (
            <motion.div
              key="notFound"
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-2 border-oxblood/40 bg-oxblood/5 p-4 mb-4"
            >
              <p className="font-playfair text-base font-semibold text-oxblood mb-2">
                Not yet, but we are growing!
              </p>
              <p className="font-cormorant text-sm italic text-sepia mb-3">
                Leave your email and we will notify you when we start delivering to your area.
              </p>
              <form onSubmit={handleNotifySubmit} className="flex gap-2">
                <input
                  type="email"
                  value={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.value)}
                  placeholder="your@email.com"
                  aria-label="Email for notifications"
                  className="checkout-input flex-1"
                />
                <button
                  type="submit"
                  className="font-elite text-[10px] uppercase tracking-wider border border-brass/40 px-3 py-2 text-oxblood hover:bg-brass/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
                >
                  Notify Me
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zone chips */}
      <div className="pt-2 border-t border-brass/15">
        <p className="font-elite text-[9px] uppercase tracking-wider text-sepia/60 mb-2 mt-3">
          Areas We Serve
        </p>
        <div className="flex flex-wrap gap-2">
          {site.deliveryZones.map((zone) => (
            <button
              key={zone}
              onClick={() => handleChipClick(zone)}
              className={cn(
                'px-3 py-1.5 border font-elite text-[10px] uppercase tracking-wider transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brass',
                selectedZone === zone
                  ? 'border-brass bg-brass/10 text-oxblood'
                  : 'border-brass/25 text-sepia hover:border-brass/50 hover:text-oxblood'
              )}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
