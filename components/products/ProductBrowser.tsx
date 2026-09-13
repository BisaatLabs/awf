'use client';

import { useMemo, useState, useEffect, useTransition } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '@/data/content';
import { ProductCard } from './ProductCard';

const CATEGORIES = [
  'All',
  'Bedroom Sets',
  'Wardrobes & Storage',
  'Tables',
  'Study & Seating',
  'Iron Beds',
  'Benches',
  'Desks',
  'Bunk Beds',
  'Sofas',
  'Swings',
] as const;

const SPACES = ['All', 'Home', 'Office', 'Corporate', 'School', 'Institutional', 'Dining'] as const;
const MATERIALS = ['All', 'Wood', 'Metal', 'Iron', 'Laminate', 'Upholstery'] as const;

const PAGE_SIZE = 24;

interface ProductBrowserProps {
  products: Product[];
}

export function ProductBrowser({ products }: ProductBrowserProps) {
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [space, setSpace] = useState<string>('All');
  const [material, setMaterial] = useState<string>('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [, startTransition] = useTransition();

  // Debounce search query to prevent lag on rapid keystrokes
  useEffect(() => {
    const handler = setTimeout(() => {
      startTransition(() => {
        setActiveQuery(searchInput.trim());
      });
    }, 200);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Reset visible count when any filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeQuery, category, space, material]);

  // Pre-indexed search map for maximum performance
  const searchIndex = useMemo(() => {
    return products.map((p) => ({
      product: p,
      searchContent: `${p.name} ${p.category} ${p.space} ${p.materials.join(' ')}`.toLowerCase(),
    }));
  }, [products]);

  // Fast memoized filtering
  const filtered = useMemo(() => {
    const q = activeQuery.toLowerCase();

    return searchIndex
      .filter(({ product: p, searchContent }) => {
        if (q && !searchContent.includes(q)) return false;
        if (
          category !== 'All' &&
          p.category !== category &&
          !(category === 'Wardrobes & Storage' && p.category === 'Storage')
        ) {
          return false;
        }
        if (space !== 'All' && p.space !== space) return false;
        if (material !== 'All' && !p.materials.includes(material)) return false;

        return true;
      })
      .map(({ product }) => product);
  }, [searchIndex, activeQuery, category, space, material]);

  const visibleProducts = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const hasActiveFilters = Boolean(
    searchInput || category !== 'All' || space !== 'All' || material !== 'All'
  );

  const handleReset = () => {
    setSearchInput('');
    setActiveQuery('');
    setCategory('All');
    setSpace('All');
    setMaterial('All');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      {/* Search & Filter Toolbar */}
      <div className="mb-10 border-y border-[var(--line)] py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex flex-1 items-center gap-3 border-b border-[var(--line)] pb-3 lg:max-w-sm">
            <Search size={17} className="text-[var(--walnut)]" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, category, or material..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--charcoal)]/40"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="text-[var(--charcoal)]/40 hover:text-[var(--charcoal)]"
                aria-label="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </label>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal size={16} className="mr-1 shrink-0 text-[var(--walnut)]" />
            {CATEGORIES.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap border px-3 py-2 text-[10px] font-bold uppercase tracking-[.1em] transition ${
                  category === item
                    ? 'border-[var(--green)] bg-[var(--green)] text-[var(--ivory)]'
                    : 'border-[var(--line)] text-[var(--charcoal)]/60 hover:border-[var(--green)]'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-filters for Space and Material */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--charcoal)]/40">
            Space:
          </span>
          {SPACES.map((item) => (
            <button
              key={item}
              onClick={() => setSpace(item)}
              className={`text-xs transition ${
                space === item
                  ? 'font-bold text-[var(--green)] underline underline-offset-4'
                  : 'text-[var(--charcoal)]/45 hover:text-[var(--charcoal)]'
              }`}
            >
              {item}
            </button>
          ))}

          <span className="mx-3 text-[var(--stone)]">|</span>

          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--charcoal)]/40">
            Material:
          </span>
          {MATERIALS.map((item) => (
            <button
              key={item}
              onClick={() => setMaterial(item)}
              className={`text-xs transition ${
                material === item
                  ? 'font-bold text-[var(--walnut)] underline underline-offset-4'
                  : 'text-[var(--charcoal)]/45 hover:text-[var(--charcoal)]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[.12em] text-[var(--charcoal)]/50">
          Showing{' '}
          <span className="font-semibold text-[var(--charcoal)]">
            {Math.min(visibleCount, filtered.length)}
          </span>{' '}
          of <span className="font-semibold text-[var(--charcoal)]">{filtered.length}</span> pieces
          {category !== 'All' && ` in ${category}`}
        </p>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-bold uppercase tracking-[.1em] text-[var(--green)] hover:underline"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Grid of Product Cards */}
      {filtered.length > 0 ? (
        <>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {visibleProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {visibleCount < filtered.length && (
            <div className="mt-14 flex justify-center">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="group inline-flex items-center gap-2 border border-[var(--green)] bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-[.14em] text-[var(--green)] transition hover:bg-[var(--green)] hover:text-[var(--ivory)]"
              >
                Load More Pieces ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="border border-[var(--line)] py-24 text-center">
          <p className="font-display text-3xl">No pieces found.</p>
          <p className="mt-2 text-sm text-[var(--charcoal)]/60">
            Try adjusting your search terms or clearing the selected filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-6 inline-flex items-center border border-[var(--green)] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] transition hover:bg-[var(--green)] hover:text-[var(--ivory)]"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
