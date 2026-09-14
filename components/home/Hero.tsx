import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Leaf, Settings2, ShieldCheck } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-[92svh] pt-[82px] overflow-hidden bg-gradient-to-b from-[#F7F4EE] via-[#F3EEE6] to-[#EFE8DC] flex items-center">
      {/* Ambient background soft light glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--green)]/5 rounded-full blur-3xl pointer-events-none animate-glow" />
      <div className="absolute top-1/4 right-0 w-[550px] h-[550px] bg-[var(--walnut)]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative vertical watermark slogan top right */}
      <div className="hidden lg:flex absolute top-28 right-8 xl:right-16 flex-col items-end text-right pointer-events-none select-none z-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#141A15]/40 leading-tight">Better</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#141A15]/40 leading-tight">Spaces</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#141A15]/40 leading-tight">Brighter</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#141A15]/40 leading-tight">Tomorrows</span>
      </div>

      <div className="container-wide relative z-10 py-10 lg:py-16">
        <div className="grid lg:grid-cols-[1fr_1.35fr] gap-8 lg:gap-10 items-center">
          
          {/* Left Content Column */}
          <div className="space-y-6 lg:space-y-7 z-10 max-w-xl">
            {/* Eyebrow */}
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--walnut)]">
                <span className="w-5 h-px bg-[var(--walnut)]/60" />
                Built for every space
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-[4.5rem] leading-[1.0] tracking-[-0.03em] text-[#141A15] animate-fade-in-up-delay-1">
              Furniture designed <br />
              for modern living.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base leading-relaxed text-[#141A15]/75 max-w-lg animate-fade-in-up-delay-2">
              Thoughtfully crafted beds, sofa-cum-beds, wardrobes, cupboards, chairs and tables for homes, workplaces and institutions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 animate-fade-in-up-delay-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 bg-[#1B3328] hover:bg-[#14261e] text-[var(--ivory)] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] rounded-xs shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
              >
                View Collection
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-[#141A15]/20 hover:border-[var(--green)] bg-white/70 hover:bg-white text-[#141A15] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] rounded-xs transition-all duration-300 hover:-translate-y-0.5 shadow-2xs"
              >
                Request a Quote
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-[#141A15]/10 grid grid-cols-3 gap-3 animate-fade-in-up-delay-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--green)]/10 text-[var(--green)] flex items-center justify-center shrink-0">
                  <Leaf size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#141A15] leading-tight">Quality</p>
                  <p className="text-[10px] text-[#141A15]/60">Craftsmanship</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--walnut)]/10 text-[var(--walnut)] flex items-center justify-center shrink-0">
                  <Settings2 size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#141A15] leading-tight">Custom</p>
                  <p className="text-[10px] text-[#141A15]/60">Solutions</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[var(--green)]/10 text-[var(--green)] flex items-center justify-center shrink-0">
                  <ShieldCheck size={15} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#141A15] leading-tight">Trusted by</p>
                  <p className="text-[10px] text-[#141A15]/60">Homes &amp; Offices</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Transparent Cutout Furniture Suite */}
          <div className="relative flex items-center justify-center animate-fade-in-up-delay-1">
            {/* Soft ground shadow beneath furniture */}
            <div className="absolute -bottom-6 w-5/6 h-12 bg-black/15 blur-2xl rounded-full pointer-events-none" />
            
            {/* Cutout Image with micro floating interaction */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[16/8.5] lg:aspect-[1.65/1] transition-transform duration-700 hover:scale-[1.02] drop-shadow-xl">
              <Image
                src="/images/hero/hero-furniture-cutout.png"
                alt="Al Wahid Modern Furniture Suite (Bed, Wardrobe, Sofa, Desk, Chair)"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain object-center"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
