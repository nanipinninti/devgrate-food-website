'use client';

import { useState, useCallback } from 'react';
import { FilterBar, DEFAULT_FILTERS, type FilterState } from './filter-bar';
import { MenuGrid } from './menu-grid';

export function MenuClient() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const handleClear = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return (
    <>
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onClear={handleClear}
      />
      <MenuGrid filters={filters} onClear={handleClear} />
    </>
  );
}
