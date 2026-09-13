import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { products } from '@/data/content';
import { ProductCard } from '@/components/products/ProductCard';

export function FeaturedProducts() {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="section-pad bg-[#efeae0]">
      <div className="container-wide">
        <div className="mb-12 flex flex-col justify-between gap-6 border-t border-[var(--line)] pt-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">03 / Selected Pieces</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[.95] tracking-[-.03em] text-[var(--green)] sm:text-6xl">
              Selected Pieces.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--charcoal)]/65">
              Explore furniture designed with purposeful proportions, durable materials, and considered details.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex shrink-0 items-center gap-2 border-b border-[var(--green)] pb-2 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] hover:text-[var(--walnut)] transition"
          >
            View Full Catalogue <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
