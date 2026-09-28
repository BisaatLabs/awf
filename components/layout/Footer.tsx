'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Mail, Phone, Instagram, Facebook } from 'lucide-react';
import { COMPANY_INFO } from '@/data/company';
import { PaymentBadges } from '@/components/ui/PaymentBadges';
import { ShopMapCard } from '@/components/contact/ShopMapCard';

const LOGO_SRC = '/images/logo/logo.png';

const EXPLORE_LINKS: [string, string][] = [
  ['Products', '/products'],
  ['Spaces', '/spaces'],
  ['Projects', '/projects'],
  ['Custom Furniture', '/custom-furniture'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

const SPACES_LIST = ['Home', 'Office', 'Corporate', 'Institutional', 'School'];

export function Footer() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[var(--charcoal)] text-[var(--ivory)]">
      <div className="container-wide grid gap-10 py-16 sm:gap-12 md:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.7fr_1.5fr]">
        {/* Brand & Social Column */}
        <div>
          <Link
            href="/"
            aria-label="Al Wahid Furnitures home"
            className="inline-flex transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--stone)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--charcoal)]"
          >
            <Image
              src={LOGO_SRC}
              alt="Al Wahid Furnitures"
              width={180}
              height={130}
              className="h-auto w-36 object-contain sm:w-40"
            />
          </Link>
          <p className="mt-4 max-w-xs font-display text-2xl leading-tight text-[var(--ivory)]">
            {COMPANY_INFO.tagline}
          </p>
          <p className="mt-2 text-xs text-[var(--stone)] leading-relaxed">
            Thoughtfully engineered furniture crafted for homes, offices, schools, and institutional spaces. Established {COMPANY_INFO.established}.
          </p>

          {/* Social Links */}
          <div className="mt-6 flex flex-col gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--stone)]">
              Follow Us
            </span>
            <div className="flex items-center gap-3">
              <a
                href={COMPANY_INFO.social.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Al Wahid Furnitures on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-[var(--ivory)] transition-all duration-200 hover:bg-[#E1306C] hover:text-white hover:scale-105"
              >
                <Instagram size={17} />
              </a>
              <a
                href={COMPANY_INFO.social.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Al Wahid Furnitures on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-sm bg-white/10 text-[var(--ivory)] transition-all duration-200 hover:bg-[#1877F2] hover:text-white hover:scale-105"
              >
                <Facebook size={17} />
              </a>
              <span className="text-xs text-[var(--stone)] font-medium">@furnitureawf</span>
            </div>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <p className="eyebrow text-[var(--stone)]">Explore</p>
          <div className="mt-4 grid gap-2.5 text-sm text-[var(--ivory)]/70">
            {EXPLORE_LINKS.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-[var(--ivory)]"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Spaces & Quick Contacts */}
        <div>
          <p className="eyebrow text-[var(--stone)]">For Spaces</p>
          <div className="mt-4 grid gap-2.5 text-sm text-[var(--ivory)]/70">
            {SPACES_LIST.map((space) => (
              <Link
                key={space}
                href={`/spaces/${space.toLowerCase()}`}
                className="transition-colors hover:text-[var(--ivory)]"
              >
                {space}
              </Link>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--walnut)] transition hover:text-[var(--ivory)]"
            >
              Get a Free Quote <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>

        {/* Map Interface in Footer (Shop #19 & 20 Zeenat Square Liaquatabad Karachi) */}
        <div>
          <p className="eyebrow text-[var(--stone)]">Shop & Showroom Map</p>
          
          {/* Map Card Component with 'Open in Maps' button & address title */}
          <div className="mt-4">
            <ShopMapCard dark isSquare />
          </div>

          {/* Direct Email & Phone contact */}
          <div className="mt-4 space-y-2 text-xs text-[var(--ivory)]/80">
            <div className="flex items-center gap-2">
              <Mail size={14} className="shrink-0 text-[var(--walnut)]" />
              <a
                href={`mailto:${COMPANY_INFO.contact.email}`}
                className="transition hover:text-white underline underline-offset-2 break-all"
              >
                {COMPANY_INFO.contact.email}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Phone size={14} className="shrink-0 text-[var(--walnut)]" />
              <a
                href={`tel:${COMPANY_INFO.contact.phoneRaw}`}
                className="transition hover:text-white"
              >
                {COMPANY_INFO.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Centered Payment Badges in the Middle with 'Click for details' hint */}
      <div className="border-t border-white/10 py-8 bg-black/15">
        <div className="container-wide flex flex-col items-center justify-center text-center gap-4">
          {/* Payment Logos right in the middle */}
          <div className="flex items-center justify-center">
            <PaymentBadges />
          </div>

          {/* Centered Copyright & Tagline */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] tracking-[.08em] text-[var(--ivory)]/50 pt-1">
            <span>© 2026 {COMPANY_INFO.name}. All rights reserved.</span>
            <span className="opacity-40">•</span>
            <span>{COMPANY_INFO.tagline}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
