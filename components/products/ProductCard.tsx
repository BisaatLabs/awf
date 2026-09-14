'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart } from 'lucide-react';
import type { DisplayProduct } from '@/lib/supabase/queries';
import { createProductWhatsAppUrl } from '@/lib/whatsapp';
import { imagePresets } from '@/lib/images';

export function ProductCard({ product }: { product: DisplayProduct }) {
  const [imgSrc, setImgSrc] = useState<string | null>(product.primaryImage);
  const [imgError, setImgError] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const optimizedUrl = imgSrc && !imgError ? imagePresets.card(imgSrc) : null;

  // Format materials & dimension string
  const materialsStr = product.materials.length > 0 ? product.materials.slice(0, 3).join(' / ') : 'SOLID WOOD';
  const widthStr = product.dimensions.width ? ` · ${product.dimensions.width}` : '';

  return (
    <article className="group relative flex flex-col justify-between bg-white rounded-3xl p-5 md:p-6 border border-[#ECE8E0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(41,72,58,0.09)] transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
      
      {/* ── TOP: Stage with Arch Backdrop & Wireframe Sketch ──── */}
      <div className="relative">
        <div className="relative aspect-[1.2/1] w-full rounded-2xl bg-gradient-to-b from-[#FAF7F2] via-[#F5EFE6] to-[#EFE8DC]/80 overflow-hidden flex items-center justify-center p-2 border border-[#F0EBE1]">
          
          {/* Decorative Architectural Sun / Arch Backdrop */}
          <div className="absolute top-2 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-b from-[#EBE2D3]/80 to-transparent blur-xs pointer-events-none" />
          
          {/* Subtle Blueprint Wireframe Grid Lines */}
          <svg
            className="absolute inset-0 w-full h-full opacity-25 pointer-events-none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 240"
            fill="none"
          >
            <rect x="25" y="30" width="250" height="180" rx="8" stroke="#D3C9B8" strokeWidth="0.75" strokeDasharray="3 3" />
            <line x1="25" y1="120" x2="275" y2="120" stroke="#D3C9B8" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="150" y1="30" x2="150" y2="210" stroke="#D3C9B8" strokeWidth="0.5" strokeDasharray="2 2" />
          </svg>

          {/* Product Image with blend-mode for transparent harmony */}
          <Link
            href={`/products/${product.slug}`}
            className="relative w-full h-full flex items-center justify-center z-10"
            aria-label={`View ${product.name}`}
          >
            {optimizedUrl ? (
              <div className="relative w-full h-full">
                <Image
                  src={optimizedUrl}
                  alt={product.name || 'Furniture piece'}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-contain p-1.5 transition-transform duration-700 ease-out group-hover:scale-108 drop-shadow-md mix-blend-multiply"
                  loading="lazy"
                  onError={() => setImgError(true)}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7B5135]/40">
                  Al Wahid Studio
                </span>
                <span className="mt-1 text-[11px] text-[#141A15]/40">
                  Image coming soon
                </span>
              </div>
            )}
          </Link>

          {/* Category Tag (Top Left) */}
          <span className="absolute left-3.5 top-3.5 z-20 bg-[#F5EFE6]/95 backdrop-blur-xs text-[#7B5135] text-[9.5px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border border-[#E8DFCFC] shadow-2xs">
            {product.category || 'Piece'}
          </span>

          {/* Heart Favorite Button (Top Right) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsLiked((v) => !v);
            }}
            className="absolute right-3.5 top-3.5 z-20 w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-xs flex items-center justify-center text-[#7B5135] transition-all duration-200 hover:scale-110 shadow-2xs cursor-pointer"
            aria-label="Save piece to favorites"
          >
            <Heart
              size={15}
              className={`transition-colors ${isLiked ? 'fill-[#7B5135] text-[#7B5135]' : 'text-[#7B5135]/70'}`}
            />
          </button>
        </div>
      </div>

      {/* ── MIDDLE: Product Info & Materials ─────────────────── */}
      <div className="mt-5 space-y-1.5">
        <h3 className="font-display text-xl md:text-2xl text-[#141A15] leading-snug font-medium line-clamp-1 transition-colors group-hover:text-[var(--green)]">
          <Link href={`/products/${product.slug}`}>
            {product.name}
          </Link>
        </h3>
        
        <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#7B5135]/80">
          {materialsStr}
          <span className="text-[#141A15]/40 font-normal">{widthStr}</span>
        </p>
      </div>

      {/* ── BOTTOM: Enquire Button ───────────────────────────── */}
      <div className="mt-6 pt-4 border-t border-[#F2ECE1] flex items-center justify-between gap-3">
        <a
          href={createProductWhatsAppUrl(product)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#7B5135] hover:bg-[#633F27] text-white px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] transition-all duration-300 shadow-xs hover:shadow-md hover:scale-[1.02]"
        >
          Enquire Now
          <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </a>

        <Link
          href={`/products/${product.slug}`}
          className="text-xs font-semibold text-[#141A15]/55 hover:text-[var(--green)] transition-colors"
        >
          View Details →
        </Link>
      </div>

    </article>
  );
}
