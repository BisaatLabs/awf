import { ArrowUpRight, ExternalLink } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';

interface ShopMapCardProps {
  className?: string;
  heightClass?: string;
  dark?: boolean;
  isSquare?: boolean;
}

export function ShopMapCard({
  className = '',
  heightClass = 'h-[190px] sm:h-[210px]',
  dark = false,
  isSquare = false,
}: ShopMapCardProps) {
  const mapSearchUrl = COMPANY_INFO.address.googleMapsUrl;
  const embedUrl = COMPANY_INFO.address.googleMapsEmbedUrl;

  return (
    <div
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl border transition-all duration-300 ${
        isSquare ? 'aspect-square max-w-[360px]' : ''
      } ${
        dark
          ? 'border-white/15 bg-[#171D18] text-[var(--ivory)] shadow-md hover:border-white/25 hover:shadow-lg'
          : 'border-[#E2DCCE] bg-white text-[var(--charcoal)] shadow-xs hover:border-[var(--green)]/40 hover:shadow-md'
      } ${className}`}
    >
      {/* Map Embed Area with floating 'Open in Maps' button */}
      <div className={`relative w-full overflow-hidden bg-[#E8E3D9] ${isSquare ? 'flex-1' : heightClass}`}>
        <iframe
          title="Al Wahid Furnitures Shop Location"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Floating Top-Left 'Open in Maps ↗' Button (Exact match to reference screenshot) */}
        <div className="absolute left-2.5 top-2.5 z-10">
          <a
            href={mapSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-gray-200/90 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-[#1A73E8] shadow-md backdrop-blur-xs transition-all duration-150 hover:bg-white hover:text-[#1557B0] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]"
          >
            Open in Maps <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Bottom text info (Exact match to reference screenshot) */}
      <div
        className={`shrink-0 p-3 sm:px-4 sm:py-3 border-t transition-colors ${
          dark
            ? 'border-white/10 bg-[#141A15]'
            : 'border-[#EAE5DC] bg-white'
        }`}
      >
        <h3
          className={`font-semibold text-xs sm:text-[13px] leading-snug line-clamp-1 ${
            dark ? 'text-[var(--ivory)]' : 'text-[var(--charcoal)]'
          }`}
          title={COMPANY_INFO.address.full}
        >
          {COMPANY_INFO.address.shop}, {COMPANY_INFO.address.area}, {COMPANY_INFO.address.city}
        </h3>
        <a
          href={mapSearchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`mt-1 inline-flex items-center gap-1 text-[11px] font-medium transition-colors ${
            dark
              ? 'text-[var(--stone)] hover:text-white'
              : 'text-[#5F6368] hover:text-[var(--green)]'
          }`}
        >
          Open in Google Maps <ArrowUpRight size={11} />
        </a>
      </div>
    </div>
  );
}
