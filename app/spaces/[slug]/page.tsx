import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { spaces, products } from '@/data/content';
import { ProductCard } from '@/components/products/ProductCard';

export function generateStaticParams() {
  return spaces.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = spaces.find((s) => s.slug === params.slug);
  if (!s) return { title: 'Space not found | Al Wahid Furnitures' };
  return {
    title: `${s.name} Furniture | Al Wahid Furnitures`,
    description: s.description,
  };
}

export default function SpaceDetail({ params }: { params: { slug: string } }) {
  const space = spaces.find((s) => s.slug === params.slug);
  if (!space) notFound();

  // Find products specifically matching this space or listed in space.products
  const matching = products
    .filter(
      (p) =>
        space.products.includes(p.name) ||
        p.space.toLowerCase() === space.slug.toLowerCase()
    )
    .slice(0, 12);

  return (
    <div className="pt-[82px]">
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
        <Image src={space.image} alt={space.name} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(17,21,18,.6)] to-transparent" />
        <div className="container-wide relative z-10 flex h-full flex-col justify-end pb-12 text-[var(--ivory)]">
          <p className="eyebrow text-[var(--ivory)]/70">{space.eyebrow}</p>
          <h1 className="mt-4 font-display text-6xl leading-[.92] tracking-[-.03em] sm:text-7xl">
            {space.name}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--ivory)]/85">
            {space.description}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="eyebrow">Selected for this space</p>
              <h2 className="mt-4 font-display text-4xl text-[var(--green)] sm:text-5xl">
                Furniture for {space.name}.
              </h2>
            </div>
            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] hover:underline"
            >
              Browse Full Catalogue ({products.length} pieces)
            </Link>
          </div>

          <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {matching.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[var(--green)] px-8 py-5 text-xs font-bold uppercase tracking-[.14em] text-[var(--ivory)] transition hover:bg-[var(--walnut)]"
            >
              Discuss {space.name} Custom Package <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
