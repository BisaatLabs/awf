'use client';

import { useState, useEffect, useTransition } from 'react';
import { Search, SlidersHorizontal, X, Loader2, RotateCcw, Sparkles } from 'lucide-react';
import type { DisplayProduct, PaginatedProductsResult } from '@/lib/supabase/queries';
import { fetchProductsAction } from '@/app/actions/products';
import { ProductCard } from './ProductCard';

const SPACES = ['All', 'Home', 'Office', 'Corporate', 'School', 'Institutional', 'Dining'] as const;
const MATERIALS = ['All', 'Wood', 'Metal', 'Iron', 'Laminate', 'Upholstery', 'Fabric'] as const;

interface ProductBrowserProps {
  initialResult: PaginatedProductsResult;
  categoriesList?: { id: string; name: string; slug: string }[];
}

export function ProductBrowser({ initialResult, categoriesList = [] }: ProductBrowserProps) {
  const [products, setProducts] = useState<DisplayProduct[]>(initialResult.products);
  const [totalCount, setTotalCount] = useState(initialResult.totalCount);
  const [hasMore, setHasMore] = useState(initialResult.hasMore);
  const [page, setPage] = useState(initialResult.currentPage);
  
  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [space, setSpace] = useState<string>('All');
  const [material, setMaterial] = useState<string>('All');

  // Loading states
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isFiltering, startTransition] = useTransition();

  // Dynamic category list from DB + fallback static items
  const categoryNames = [
    'All',
    ...Array.from(new Set(categoriesList.map((c) => c.name))),
  ];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Refetch when filters or search change
  useEffect(() => {
    let isMounted = true;
    startTransition(async () => {
      const result = await fetchProductsAction({
        page: 1,
        pageSize: 18,
        category,
        space,
        material,
        search: searchQuery,
      });

      if (isMounted) {
        setProducts(result.products);
        setTotalCount(result.totalCount);
        setHasMore(result.hasMore);
        setPage(1);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [category, space, material, searchQuery]);

  // Load more pages
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;

    try {
      const result = await fetchProductsAction({
        page: nextPage,
        pageSize: 18,
        category,
        space,
        material,
        search: searchQuery,
      });

      setProducts((prev) => [...prev, ...result.products]);
      setPage(nextPage);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Failed to load more products:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const hasActiveFilters = Boolean(
    searchQuery || category !== 'All' || space !== 'All' || material !== 'All'
  );

  const handleReset = () => {
    setSearchInput('');
    setSearchQuery('');
    setCategory('All');
    setSpace('All');
    setMaterial('All');
  };

  return (
    <div>
      {/* Search & Category Filter Toolbar */}
      <div className="mb-10 border-y border-[var(--line)] py-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative flex flex-1 items-center gap-3 border-b border-[var(--line)] pb-3 lg:max-w-sm">
            <Search size={17} className="text-[var(--walnut)]" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search catalogue by name, SKU, or specs..."
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
            {categoryNames.map((item) => (
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

        {/* Space & Material Sub-filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--charcoal)]/40">Space:</span>
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

          <span className="mr-1 text-[10px] font-bold uppercase tracking-[.12em] text-[var(--charcoal)]/40">Material:</span>
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
          Showing <span className="font-semibold text-[var(--charcoal)]">{products.length}</span> of{' '}
          <span className="font-semibold text-[var(--charcoal)]">{totalCount}</span> pieces
          {category !== 'All' && ` in ${category}`}
        </p>

        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[.1em] text-[var(--green)] hover:underline"
          >
            <RotateCcw size={12} /> Clear Filters
          </button>
        )}
      </div>

      {/* Loading Skeleton Transition Overlay */}
      {isFiltering && (
        <div className="py-4 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-medium text-[var(--charcoal)]/50">
            <Loader2 size={14} className="animate-spin text-[var(--green)]" />
            Updating catalogue...
          </span>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="mt-14 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="group inline-flex items-center gap-2 border border-[var(--green)] bg-transparent px-8 py-4 text-xs font-bold uppercase tracking-[.14em] text-[var(--green)] transition hover:bg-[var(--green)] hover:text-[var(--ivory)] disabled:opacity-50 cursor-pointer"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Loading More Pieces…
                  </>
                ) : (
                  <>
                    Load More Pieces ({totalCount - products.length} remaining)
                  </>
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="border border-[var(--line)] bg-[#faf8f5] py-20 px-6 text-center rounded-sm">
          <div className="mx-auto w-12 h-12 rounded-full bg-[var(--green)]/10 text-[var(--green)] flex items-center justify-center mb-4">
            <Sparkles size={22} />
          </div>
          <h3 className="font-display text-3xl text-[var(--charcoal)]">No furniture pieces found</h3>
          <p className="mt-2 text-sm text-[var(--charcoal)]/60 max-w-md mx-auto">
            We couldn&apos;t find any pieces matching your current filter selection. Every piece at Al Wahid can also be manufactured custom to your specifications.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 border border-[var(--green)] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] transition hover:bg-[var(--green)] hover:text-[var(--ivory)]"
            >
              <RotateCcw size={13} /> Reset Filters
            </button>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-[var(--green)] px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-[var(--ivory)] transition hover:bg-[var(--walnut)]"
            >
              Request Custom Build
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
