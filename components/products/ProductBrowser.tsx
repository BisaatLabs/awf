'use client';

import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/data/content';
import { ProductCard } from './ProductCard';

const categories = [
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
];

const spaces = ['All', 'Home', 'Office', 'Corporate', 'School', 'Institutional', 'Dining'];
const materials = ['All', 'Wood', 'Metal', 'Iron', 'Laminate', 'Upholstery'];

const PAGE_SIZE = 24;

export function ProductBrowser({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [space, setSpace] = useState('All');
  const [material, setMaterial] = useState('All');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when any filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, category, space, material]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        !query ||
        `${p.name} ${p.category} ${p.materials.join(' ')}`
          .toLowerCase()
          .includes(query.toLowerCase());
      const matchesCategory =
        category === 'All' ||
        p.category === category ||
        (category === 'Wardrobes & Storage' && p.category === 'Storage');
      const matchesSpace = space === 'All' || p.space === space;
      const matchesMaterial = material === 'All' || p.materials.includes(material);
      return matchesQuery && matchesCategory && matchesSpace && matchesMaterial;
    });
  }, [products, query, category, space, material]);

  const visibleProducts = useMemo(() => {
    return filtered.slice(0, visibleCount);
  }, [filtered, visibleCount]);

  const handleReset = () => {
    setQuery('');
    setCategory('All');
    setSpace('All');
    setMaterial('All');
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <div>
      <div className="mb-10 border-y border-[var(--line)] py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="flex flex-1 items-center gap-3 border-b border-[var(--line)] pb-3 lg:max-w-sm">
            <Search size={17} className="text-[var(--walnut)]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or material..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--charcoal)]/40"
            />
          </label>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <SlidersHorizontal size={16} className="mr-1 shrink-0 text-[var(--walnut)]" />
            {categories.map((item) => (
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

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--charcoal)]/40 mr-1">
            Space:
          </span>
          {spaces.map((item) => (
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

          <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[var(--charcoal)]/40 mr-1">
            Material:
          </span>
          {materials.map((item) => (
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

      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs uppercase tracking-[.12em] text-[var(--charcoal)]/50">
          Showing <span className="font-semibold text-[var(--charcoal)]">{Math.min(visibleCount, filtered.length)}</span> of{' '}
          <span className="font-semibold text-[var(--charcoal)]">{filtered.length}</span> pieces
          {category !== 'All' && ` in ${category}`}
        </p>
        {(query || category !== 'All' || space !== 'All' || material !== 'All') && (
          <button
            onClick={handleReset}
            className="text-xs uppercase tracking-[.1em] text-[var(--green)] hover:underline font-bold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filtered.length ? (
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
            Try adjusting your search keywords or clearing the category filters.
          </p>
          <button
            onClick={handleReset}
            className="mt-6 inline-flex items-center border border-[var(--green)] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] hover:bg-[var(--green)] hover:text-[var(--ivory)] transition"
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
