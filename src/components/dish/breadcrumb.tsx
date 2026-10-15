'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbProps {
  dishName: string;
}

export function Breadcrumb({ dishName }: BreadcrumbProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-4 md:px-8 pt-6"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        <li>
          <Link
            href="/"
            className="font-elite text-[10px] uppercase tracking-[0.15em] text-sepia hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
          >
            Home
          </Link>
        </li>
        <li className="text-brass" aria-hidden="true">
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        </li>
        <li>
          <Link
            href="/menu"
            className="font-elite text-[10px] uppercase tracking-[0.15em] text-sepia hover:text-oxblood transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass rounded"
          >
            Menu
          </Link>
        </li>
        <li className="text-brass" aria-hidden="true">
          <ChevronRight className="h-3 w-3" strokeWidth={1.5} />
        </li>
        <li>
          <span className="font-elite text-[10px] uppercase tracking-[0.15em] text-ink" aria-current="page">
            {dishName}
          </span>
        </li>
      </ol>
    </motion.nav>
  );
}
