'use client';

import { useState, useMemo } from 'react';
import type { DisplayProduct } from '@/lib/supabase/queries';
import { ProductCard } from '@/components/products/ProductCard';

const FEATURED_TABS = ['All', 'Beds', 'Benches', 'Desks', 'Storage'] as const;

export function FeaturedProductsClient({ initialProducts }: { initialProducts: DisplayProduct[] }) {
  const [activeTab, setActiveTab] = useState<string>('All');

  const filtered = useMemo(() => {
    if (activeTab === 'All') return initialProducts;
    const tabLower = activeTab.toLowerCase();
    return initialProducts.filter((p) => {
      const cat = p.category.toLowerCase();
      const name = p.name.toLowerCase();
      if (tabLower === 'beds') return cat.includes('bed') || name.includes('bed');
      if (tabLower === 'benches') return cat.includes('bench') || name.includes('bench');
      if (tabLower === 'desks') return cat.includes('desk') || cat.includes('study') || name.includes('desk');
      if (tabLower === 'storage') return cat.includes('storage') || cat.includes('wardrobe') || name.includes('wardrobe') || name.includes('storage');
      return cat.includes(tabLower);
    });
  }, [initialProducts, activeTab]);

  return (
    <div className="space-y-10">
      {/* Centered Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#7B5135]">
          Quality Furniture For Every Space
        </p>
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[#141A15] tracking-[-0.03em] leading-tight">
          Featured Furniture
        </h2>
        <p className="text-xs sm:text-sm text-[#141A15]/65 font-medium tracking-wide">
          Functional. Durable. Beautifully Designed.
        </p>

        {/* Filter Tabs matching reference pill style */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5">
          {FEATURED_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#7B5135] text-white shadow-sm scale-105'
                    : 'bg-transparent text-[#141A15]/70 border border-[#141A15]/15 hover:border-[#7B5135] hover:text-[#7B5135]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Product Cards */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center text-xs font-medium uppercase tracking-wider text-[#141A15]/40 bg-white/40 rounded-3xl border border-[#141A15]/5">
          No featured pieces under {activeTab} yet.
        </div>
      )}
    </div>
  );
}
