'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Flame, Home } from 'lucide-react';

interface KitchenMapProps {
  selectedZone: string | null;
  onSelectZone: (zone: string) => void;
}

interface ZonePosition {
  name: string;
  x: number;
  y: number;
  r: number;
  eta: string;
}

const ZONES: ZonePosition[] = [
  { name: 'MG Road', x: 180, y: 150, r: 32, eta: '25-30 min' },
  { name: 'Indiranagar', x: 280, y: 110, r: 30, eta: '30-35 min' },
  { name: 'Koramangala', x: 240, y: 220, r: 28, eta: '30-40 min' },
  { name: 'HSR Layout', x: 320, y: 260, r: 26, eta: '35-40 min' },
  { name: 'Whitefield', x: 340, y: 80, r: 34, eta: '40-45 min' },
  { name: 'Jayanagar', x: 160, y: 250, r: 26, eta: '35-40 min' },
  { name: 'BTM Layout', x: 220, y: 280, r: 24, eta: '35-40 min' },
  { name: 'Ashok Nagar', x: 200, y: 180, r: 24, eta: '25-30 min' },
];

const KITCHEN = { x: 200, y: 160 };

export function KitchenMap({ selectedZone, onSelectZone }: KitchenMapProps) {
  const prefersReduced = useReducedMotion();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ zone: ZonePosition; x: number; y: number } | null>(null);

  const activeZone = hoveredZone || selectedZone;

  return (
    <div className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-4">
      <h3 className="font-playfair text-lg font-bold text-ink mb-3 text-center">Our Delivery Map</h3>

      <div className="relative aspect-[4/3] overflow-hidden">
        <svg viewBox="0 0 400 320" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * 40} x2="400" y2={(i + 1) * 40} stroke="#B08A3E" strokeOpacity="0.08" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 40} y1="0" x2={(i + 1) * 40} y2="320" stroke="#B08A3E" strokeOpacity="0.08" strokeWidth="0.5" />
          ))}

          {/* Compass rose */}
          <g transform="translate(360, 30)" opacity="0.5">
            <circle cx="0" cy="0" r="16" fill="none" stroke="#B08A3E" strokeWidth="0.8" />
            <path d="M0 -12L2.5 0L0 12L-2.5 0Z" fill="#B08A3E" opacity="0.6" />
            <text x="0" y="-6" fontSize="6" fill="#8B6B4A" textAnchor="middle" fontFamily="serif">N</text>
          </g>

          {/* Roads (dashed brass lines) */}
          <path d="M 50 160 L 380 160" stroke="#B08A3E" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.3" fill="none" />
          <path d="M 200 40 L 200 300" stroke="#B08A3E" strokeWidth="1.5" strokeDasharray="5 3" strokeOpacity="0.3" fill="none" />
          <path d="M 100 260 L 350 80" stroke="#B08A3E" strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.2" fill="none" />

          {/* Zone circles */}
          {ZONES.map((zone) => {
            const isActive = activeZone === zone.name;
            const isKitchen = zone.name === 'MG Road' || zone.name === 'Ashok Nagar';
            return (
              <g key={zone.name}>
                <circle
                  cx={zone.x}
                  cy={zone.y}
                  r={zone.r}
                  fill={isActive ? '#B08A3E' : '#B08A3E'}
                  fillOpacity={isActive ? 0.25 : 0.1}
                  stroke="#B08A3E"
                  strokeWidth={isActive ? 1.5 : 0.8}
                  strokeOpacity={isActive ? 0.7 : 0.4}
                  strokeDasharray={isActive ? '0' : '3 2'}
                  className="cursor-pointer transition-all"
                  onClick={() => onSelectZone(zone.name)}
                  onMouseEnter={() => { setHoveredZone(zone.name); setTooltip({ zone, x: zone.x, y: zone.y }); }}
                  onMouseLeave={() => { setHoveredZone(null); setTooltip(null); }}
                />
                <text
                  x={zone.x}
                  y={zone.y + 3}
                  fontSize="7"
                  fill={isActive ? '#2B1D14' : '#8B6B4A'}
                  textAnchor="middle"
                  fontFamily="serif"
                  fontStyle="italic"
                  opacity={isActive ? 1 : 0.6}
                  className="pointer-events-none"
                >
                  {zone.name}
                </text>
              </g>
            );
          })}

          {/* Kitchen marker */}
          <g transform={`translate(${KITCHEN.x}, ${KITCHEN.y})`}>
            <circle cx="0" cy="0" r="12" fill="#7A1F1F" opacity="0.15" />
            <circle cx="0" cy="0" r="8" fill="#7A1F1F" />
            <foreignObject x="-7" y="-7" width="14" height="14">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <Flame className="h-3.5 w-3.5 text-cream" strokeWidth={1.5} />
              </div>
            </foreignObject>
          </g>
          <text x={KITCHEN.x} y={KITCHEN.y + 22} fontSize="7" fill="#7A1F1F" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontWeight="bold">
            Kitchen
          </text>
        </svg>

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip && (
            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none bg-cream border border-brass/40 shadow-vintage-card px-3 py-1.5 z-20"
              style={{
                left: `${(tooltip.x / 400) * 100}%`,
                top: `${(tooltip.y / 320) * 100}%`,
                transform: 'translate(-50%, -120%)',
              }}
            >
              <p className="font-elite text-[9px] uppercase tracking-wider text-ink">{tooltip.zone.name}</p>
              <p className="font-cormorant text-xs italic text-sepia">~{tooltip.zone.eta}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="font-elite text-[9px] uppercase tracking-wider text-sepia/60 text-center mt-2">
        Tap a zone to check delivery
      </p>
    </div>
  );
}
