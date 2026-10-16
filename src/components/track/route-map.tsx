'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame, Home, Bike } from 'lucide-react';

interface RouteMapProps {
  riderProgress: number;
  showMap: boolean;
}

export function RouteMap({ riderProgress, showMap }: RouteMapProps) {
  const prefersReduced = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [pathLength, setPathLength] = useState(0);

  const PATH_D = 'M 60 180 C 60 130, 120 120, 180 100 S 280 80, 340 60';

  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength();
      setPathLength(len);
    }
  }, []);

  useEffect(() => {
    if (!pathRef.current || !showMap) return;
    const clamped = Math.min(1, Math.max(0, riderProgress));
    const len = pathRef.current.getTotalLength();
    const pt = pathRef.current.getPointAtLength(len * clamped);
    setPoint({ x: pt.x, y: pt.y });
  }, [riderProgress, showMap, pathLength]);

  return (
    <div className="bg-parchment paper-texture border-2 border-brass/30 shadow-vintage-card p-4">
      <div className="relative aspect-[4/3] overflow-hidden">
        <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Parchment grid lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={(i + 1) * 37.5} x2="400" y2={(i + 1) * 37.5} stroke="#B08A3E" strokeOpacity="0.08" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={`v${i}`} x1={(i + 1) * 40} y1="0" x2={(i + 1) * 40} y2="300" stroke="#B08A3E" strokeOpacity="0.08" strokeWidth="0.5" />
          ))}

          {/* Compass rose */}
          <g transform="translate(350, 40)" opacity="0.5">
            <circle cx="0" cy="0" r="18" fill="none" stroke="#B08A3E" strokeWidth="0.8" />
            <path d="M0 -14L3 0L0 14L-3 0Z" fill="#B08A3E" opacity="0.6" />
            <text x="0" y="-8" fontSize="7" fill="#8B6B4A" textAnchor="middle" fontFamily="serif">N</text>
          </g>

          {/* Route path */}
          <path
            ref={pathRef}
            d={PATH_D}
            fill="none"
            stroke={showMap ? '#B08A3E' : '#B08A3E'}
            strokeOpacity={showMap ? 0.6 : 0.25}
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />

          {/* Kitchen marker (flame) */}
          <g transform="translate(60, 180)">
            <circle cx="0" cy="0" r="14" fill="#7A1F1F" opacity="0.15" />
            <circle cx="0" cy="0" r="9" fill="#7A1F1F" />
            <text x="0" y="3" fontSize="10" fill="#FBF6EA" textAnchor="middle">
              <FlameIcon />
            </text>
          </g>
          <text x="60" y="205" fontSize="8" fill="#8B6B4A" textAnchor="middle" fontFamily="serif" fontStyle="italic">Kitchen</text>

          {/* Customer marker (home) */}
          <g transform="translate(340, 60)">
            <circle cx="0" cy="0" r="14" fill="#2F4A3A" opacity="0.15" />
            <circle cx="0" cy="0" r="9" fill="#2F4A3A" />
          </g>
          <text x="340" y="85" fontSize="8" fill="#8B6B4A" textAnchor="middle" fontFamily="serif" fontStyle="italic">Your Home</text>

          {/* Rider marker */}
          {showMap && (
            <motion.g
              animate={prefersReduced ? {} : { x: point.x - 60, y: point.y - 180 }}
              transition={{ duration: 0.3 }}
              style={{ transform: `translate(${point.x - 60}px, ${point.y - 180}px)` }}
            >
              {/* Trailing dotted line */}
              {riderProgress > 0.05 && (
                <line
                  x1="60"
                  y1="180"
                  x2={point.x - 60}
                  y2={point.y - 180}
                  stroke="#B08A3E"
                  strokeWidth="1.5"
                  strokeDasharray="2 3"
                  opacity="0.4"
                />
              )}
              <circle cx="60" cy="180" r="10" fill="#B08A3E" />
              <circle cx="60" cy="180" r="6" fill="#FBF6EA" />
            </motion.g>
          )}
        </svg>

        {/* Faded overlay when not showing map */}
        {!showMap && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-cream/40">
            <p className="font-cormorant text-sm italic text-sepia text-center px-4">
              The map unfolds once your rider sets off
            </p>
          </div>
        )}
      </div>

      {showMap && (
        <p className="font-elite text-[9px] uppercase tracking-wider text-sepia text-center mt-2">
          Live tracking — simulated for demo
        </p>
      )}
    </div>
  );
}

function FlameIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline' }}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
