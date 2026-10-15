'use client';

import { cn } from '@/lib/utils';

interface OrnamentDividerProps {
  className?: string;
  width?: 'sm' | 'md' | 'lg' | 'full';
}

export function OrnamentDivider({
  className,
  width = 'md',
}: OrnamentDividerProps) {
  const widthClass = {
    sm: 'w-24',
    md: 'w-48',
    lg: 'w-72',
    full: 'w-full',
  }[width];

  return (
    <div
      className={cn('flex items-center justify-center gap-3', widthClass, className)}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-brass to-brass" />
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0 text-brass"
      >
        <path
          d="M8 1L9.5 5.5L14 7L9.5 8.5L8 13L6.5 8.5L2 7L6.5 5.5L8 1Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="8" cy="7" r="1.2" fill="#F4EBD9" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-brass to-brass" />
    </div>
  );
}
