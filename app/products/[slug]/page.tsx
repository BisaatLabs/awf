import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ArrowLeft } from 'lucide-react';
import { products } from '@/data/content';
import { ProductCard } from '@/components/products/ProductCard';
import { createProductWhatsAppUrl, customWhatsAppUrl } from '@/lib/whatsapp';
import { getProductImage } from '@/lib/images';

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = products.find((p) => p.slug === params.slug);
  if (!p) return { title: 'Product not found | Al Wahid Furnitures' };
  return {
    title: `${p.name} | Al Wahid Furnitures`,
    description: p.shortDescription,
  };
}

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const details = [
    ['Category', product.category],
    ['Space', product.space],
    ['Material', product.materials.join(', ')],
    ['Finish', product.finish],
    [
      'Dimensions',
      `${product.dimensions.width} × ${product.dimensions.depth} × ${product.dimensions.height}`,
    ],
    ['Construction', 'Engineered joinery with heavy-duty structural reinforcement'],
    ['Customization', product.customizable ? 'Available in custom dimensions' : 'Standard sizes only'],
  ];

  // Related products from same category
  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="pt-[82px]">
      <section className="section-pad">
        <div className="container-wide">
          <div className="mb-8">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[.12em] text-[var(--charcoal)]/60 hover:text-[var(--green)] transition"
            >
              <ArrowLeft size={14} /> Back to Catalogue
            </Link>
          </div>

          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <div className="grid gap-4">
              <div className="relative aspect-[1.15] overflow-hidden rounded-sm bg-[#f5f2eb] p-6 shadow-sm">
                <Image
                  src={getProductImage(product.images[0], { width: 1000 })}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  className="object-contain p-4"
                />
              </div>
              {product.images[1] && (
                <div className="relative aspect-[2/1] overflow-hidden rounded-sm bg-[#f5f2eb]">
                  <Image
                    src={getProductImage(product.images[1], { width: 800 })}
                    alt={`${product.name} detail`}
                    fill
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    className="object-contain p-4"
                  />
                </div>
              )}
            </div>

            <div className="lg:pt-4">
              <p className="eyebrow">{product.category}</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-[-.03em] text-[var(--green)] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-6 text-sm leading-7 text-[var(--charcoal)]/75">{product.description}</p>

              <div className="mt-8 grid gap-px bg-[var(--line)] sm:grid-cols-2">
                {details.map(([k, v]) => (
                  <div key={k} className="bg-[var(--ivory)] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)]">
                      {k}
                    </p>
                    <p className="mt-2 text-sm text-[var(--charcoal)]">{v}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={createProductWhatsAppUrl(product)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[var(--green)] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-[var(--ivory)] transition hover:bg-[var(--walnut)]"
                >
                  <MessageCircle size={15} /> Enquire on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-[var(--line)] px-6 py-4 text-xs font-bold uppercase tracking-[.13em] text-[var(--charcoal)] transition hover:border-[var(--green)]"
                >
                  Request Custom Dimensions <ArrowRight size={15} />
                </Link>
              </div>

              <div className="mt-8 border-t border-[var(--line)] pt-6">
                <p className="font-display text-2xl text-[var(--charcoal)]">Need a custom dimension or finish?</p>
                <p className="mt-2 text-sm text-[var(--charcoal)]/60">
                  Every piece in our catalogue can be built to your exact specifications, space measurements, and finish requirements.
                </p>
                <a
                  href={customWhatsAppUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-2 border-b border-[var(--green)] pb-1 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)]"
                >
                  Discuss Custom Manufacturing <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-24 border-t border-[var(--line)] pt-12">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="eyebrow">Related Pieces</p>
                  <h2 className="font-display text-3xl text-[var(--green)]">More in {product.category}</h2>
                </div>
                <Link
                  href="/products"
                  className="text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
