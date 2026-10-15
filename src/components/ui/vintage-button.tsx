'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VintageButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'forest';
  size?: 'sm' | 'md' | 'lg';
}

const VintageButton = forwardRef<HTMLButtonElement, VintageButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles =
      'relative inline-flex items-center justify-center font-elite uppercase tracking-wider transition-colors duration-200 select-none';

    const variants = {
      primary:
        'bg-oxblood text-cream border-2 border-brass shadow-[inset_0_0_0_3px_#7A1F1F,inset_0_0_0_4px_#B08A3E] hover:bg-[#6B1A1A] hover:shadow-[inset_0_0_0_3px_#6B1A1A,inset_0_0_0_4px_#B08A3E,0_4px_12px_rgba(122,31,31,0.3)]',
      outline:
        'bg-transparent text-oxblood border-2 border-brass hover:bg-oxblood hover:text-cream',
      forest:
        'bg-forest text-cream border-2 border-brass hover:bg-[#243a2e] shadow-[inset_0_0_0_3px_#2F4A3A,inset_0_0_0_4px_#B08A3E]',
    };

    const sizes = {
      sm: 'text-xs px-4 py-2',
      md: 'text-sm px-6 py-3',
      lg: 'text-base px-8 py-4',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
      </motion.button>
    );
  }
);

VintageButton.displayName = 'VintageButton';

export { VintageButton };
