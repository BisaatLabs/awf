import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/data/content';
import { createProductWhatsAppUrl } from '@/lib/whatsapp';

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-[1.12] overflow-hidden rounded-sm bg-[#f5f2eb] p-3 transition duration-500 hover:shadow-md"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-contain p-2 transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 bg-[var(--ivory)]/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.15em] text-[var(--green)] shadow-sm">
          {product.category}
        </span>
        <span className="absolute bottom-4 right-4 flex h-10 w-10 translate-y-2 items-center justify-center bg-[var(--ivory)] shadow-sm opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight size={17} />
        </span>
      </Link>
      <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] py-5">
        <div>
          <h3 className="font-display text-xl text-[var(--charcoal)] leading-snug">
            <Link href={`/products/${product.slug}`} className="hover:text-[var(--green)] transition">
              {product.name}
            </Link>
          </h3>
          <p className="mt-2 text-xs uppercase tracking-[.1em] text-[var(--charcoal)]/45">
            {product.materials.join(' / ')} &middot; {product.dimensions.width}
          </p>
        </div>
        <a
          href={createProductWhatsAppUrl(product)}
          target="_blank"
          rel="noreferrer"
          className="shrink-0 pt-1 text-[10px] font-bold uppercase tracking-[.1em] text-[var(--green)] transition-colors hover:text-[var(--walnut)]"
        >
          Enquire
        </a>
      </div>
    </article>
  );
}

