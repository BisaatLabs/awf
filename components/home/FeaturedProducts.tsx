import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getFeaturedProducts } from '@/lib/supabase/queries';
import { FeaturedProductsClient } from './FeaturedProductsClient';

export async function FeaturedProducts() {
  const featured = await getFeaturedProducts(6);

  return (
    <section className="section-pad bg-gradient-to-b from-[#F7F4EE] via-[#F4EFE6] to-[#ECE6D8] relative overflow-hidden">
      {/* Decorative Watermarks */}
      <div className="hidden xl:flex absolute top-20 right-12 text-[10px] font-bold uppercase tracking-[0.25em] text-[#141A15]/35 pointer-events-none select-none">
        — Spaces for a better tomorrow
      </div>

      <div className="container-wide relative z-10">
        <FeaturedProductsClient initialProducts={featured} />

        {/* Section Bottom Footer Row */}
        <div className="mt-14 pt-8 border-t border-[#141A15]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#7B5135]/80">
            — Furnishing a brighter tomorrow
          </span>

          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#141A15] hover:text-[var(--green)] transition-colors"
          >
            View All Products
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
