import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { spaces } from '@/data/content';

export function SpaceGrid() {
  // Grid layout placement mapping for desktop (lg)
  const getGridPlacement = (index: number) => {
    switch (index) {
      case 0:
        return 'lg:col-start-1 lg:row-start-1 lg:row-span-2 min-h-[460px] sm:min-h-[520px] lg:min-h-[640px]';
      case 1:
        return 'lg:col-start-2 lg:row-start-1 min-h-[290px] lg:min-h-[308px]';
      case 2:
        return 'lg:col-start-3 lg:row-start-1 min-h-[290px] lg:min-h-[308px]';
      case 3:
        return 'lg:col-start-2 lg:row-start-2 min-h-[290px] lg:min-h-[308px]';
      case 4:
        return 'lg:col-start-3 lg:row-start-2 min-h-[290px] lg:min-h-[308px]';
      default:
        return 'min-h-[290px]';
    }
  };

  return (
    <section className="section-pad bg-[var(--ivory)]">
      <div className="container-wide">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-6 border-t border-[var(--line)] pt-5 md:flex-row md:items-end sm:mb-12">
          <div>
            <p className="eyebrow text-[#5A635B] tracking-[0.2em]">02 / SHOP BY SPACE</p>
            <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-[-0.02em] text-[var(--green)]">
              Furniture for Every Space.
            </h2>
          </div>
          <Link
            href="/spaces"
            className="group inline-flex shrink-0 items-center gap-2 border-b border-[var(--green)] pb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)] transition-all hover:text-[var(--walnut)] hover:border-[var(--walnut)]"
          >
            <span>VIEW ALL SPACES</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {spaces.map((space, i) => (
            <Link
              key={space.slug}
              href={`/spaces/${space.slug}`}
              className={`group relative flex overflow-hidden rounded-2xl shadow-sm transition duration-500 hover:shadow-xl ${getGridPlacement(
                i
              )}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={space.image}
                  alt={space.name}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transition duration-700 ease-out group-hover:scale-105"
                />
              </div>

              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 via-50% to-black/15 transition-opacity duration-300 group-hover:opacity-95" />

              {/* Content Container */}
              <div className="relative z-10 flex w-full flex-col justify-end p-6 sm:p-7 lg:p-8">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#D5CBC0]">
                  {space.eyebrow}
                </p>
                <h3
                  className={`mt-1 font-display leading-tight text-white ${
                    i === 0
                      ? 'text-3xl sm:text-4xl lg:text-[2.65rem]'
                      : 'text-2xl sm:text-3xl lg:text-[2.1rem]'
                  }`}
                >
                  {space.name}
                </h3>
                <p className="mt-2 max-w-sm text-xs sm:text-[13px] leading-relaxed text-white/80">
                  {space.description}
                </p>

                {/* Explore Action Button */}
                <div className="mt-4 flex items-center gap-2.5 sm:mt-5">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                    EXPLORE
                  </span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 text-white transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black sm:h-8 sm:w-8">
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
