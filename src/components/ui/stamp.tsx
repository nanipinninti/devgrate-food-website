'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StampProps {
  label: string;
  sublabel?: string;
  className?: string;
  color?: 'oxblood' | 'forest' | 'brass';
  size?: 'sm' | 'md' | 'lg';
}

export function Stamp({
  label,
  sublabel,
  className,
  color = 'oxblood',
  size = 'md',
}: StampProps) {
  const colorClasses = {
    oxblood: 'text-oxblood border-oxblood',
    forest: 'text-forest border-forest',
    brass: 'text-brass border-brass',
  };

  const sizeClasses = {
    sm: 'w-16 h-16 text-[8px]',
    md: 'w-24 h-24 text-[10px]',
    lg: 'w-32 h-32 text-xs',
  };

  return (
    <motion.div
      initial={{ rotate: -15, scale: 0.8, opacity: 0 }}
      whileInView={{ rotate: -12, scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
      className={cn(
        'flex flex-col items-center justify-center rounded-full border-2 border-dashed font-elite uppercase tracking-wider',
        colorClasses[color],
        sizeClasses[size],
        className
      )}
      style={{
        filter: 'opacity(0.85)',
      }}
    >
      <span className="font-bold leading-tight text-center px-2">{label}</span>
      {sublabel && (
        <span className="text-[0.65em] leading-tight opacity-80 mt-0.5">
          {sublabel}
        </span>
      )}
    </motion.div>
  );
}
