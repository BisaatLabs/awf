import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ArrowLeft } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { createProductWhatsAppUrl, customWhatsAppUrl } from '@/lib/whatsapp';
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from '@/lib/supabase/queries';
import { imagePresets } from '@/lib/images';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug((await params).slug);
  if (!p) return { title: 'Product not found | Al Wahid Furnitures' };
  return {
    title: `${p.name} | Al Wahid Furnitures`,
    description: p.shortDescription || p.description,
  };
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug((await params).slug);
  if (!product || !product.is_active) notFound();

  const related = await getRelatedProducts(product.category, product.slug, 3);

  const details = [
    ['Category',      product.category || 'Bespoke Collection'],
    ['Space',         product.space || 'Custom Spaces'],
    ['Material',      product.materials.length > 0 ? product.materials.join(', ') : 'Solid Hardwood & Steel'],
    ['Finish',        product.finish || 'Custom Polish / Finish'],
    [
      'Dimensions',
      [product.dimensions.width, product.dimensions.depth, product.dimensions.height]
        .filter(Boolean)
        .join(' × ') || 'Built to custom measurements',
    ],
    ['Construction',  'Engineered joinery with heavy-duty structural reinforcement'],
    ['Customization', product.customizable ? 'Available in custom dimensions' : 'Standard sizes only'],
  ].filter(([, v]) => v);

  const heroImageUrl = product.primaryImage ? imagePresets.hero(product.primaryImage) : null;
  const secondaryImageUrl = product.images[1] ? imagePresets.hero(product.images[1]) : null;

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
            {/* Images Gallery */}
            <div className="grid gap-4">
              <div className="relative aspect-[1.15] overflow-hidden rounded-sm bg-[#f5f2eb] p-6 shadow-xs">
                {heroImageUrl ? (
                  <Image
                    src={heroImageUrl}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    className="object-contain p-4"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center p-6">
                    <span className="text-xs uppercase tracking-widest text-[var(--charcoal)]/40 font-semibold">
                      Al Wahid Furnitures
                    </span>
                    <span className="mt-2 text-xs text-[var(--charcoal)]/30">
                      Studio photography coming soon
                    </span>
                  </div>
                )}
              </div>

              {secondaryImageUrl && (
                <div className="relative aspect-[2/1] overflow-hidden rounded-sm bg-[#f5f2eb]">
                  <Image
                    src={secondaryImageUrl}
                    alt={`${product.name} detail`}
                    fill
                    sizes="(max-width: 1023px) 100vw, 55vw"
                    className="object-contain p-4"
                  />
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="lg:pt-4">
              <p className="eyebrow">{product.category}</p>
              <h1 className="mt-4 font-display text-4xl leading-[1.05] tracking-[-.03em] text-[var(--green)] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-6 text-sm leading-7 text-[var(--charcoal)]/75">
                {product.description || product.shortDescription || 'Crafted with premium materials and bespoke proportions.'}
              </p>

              <div className="mt-8 grid gap-px bg-[var(--line)] sm:grid-cols-2">
                {details.map(([k, v]) => (
                  <div key={k} className="bg-[var(--ivory)] p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[.13em] text-[var(--walnut)]">{k}</p>
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

          {/* Related products */}
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
