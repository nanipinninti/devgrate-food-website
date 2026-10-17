'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Search } from 'lucide-react';

export function Search404() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/menu?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-xs w-full mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search our menu..."
        aria-label="Search menu"
        className="checkout-input"
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex items-center justify-center border-2 border-brass px-3 text-oxblood hover:bg-brass/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brass"
      >
        <Search className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </form>
  );
}
