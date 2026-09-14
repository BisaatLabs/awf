'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, ArrowUpRight, Search } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const LOGO_SRC = '/images/logo/logo.png';

const NAV_LINKS: [string, string][] = [
  ['Products', '/products'],
  ['Spaces', '/spaces'],
  ['About', '/about'],
  ['Projects', '/projects'],
  ['Custom Furniture', '/custom-furniture'],
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 z-40 w-full border-b border-[#141A15]/8 bg-[#F5EFE6]/90 backdrop-blur-md transition-colors">
      <div className="container-wide flex h-[82px] items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" aria-label="Al Wahid Furnitures home" className="flex items-center transition-opacity hover:opacity-90">
          <Image
            src={LOGO_SRC}
            alt="Al Wahid Furnitures"
            width={180}
            height={70}
            className="h-[52px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`text-[11px] font-bold uppercase tracking-[0.14em] transition-all duration-200 hover:text-[var(--green)] ${
                pathname === href
                  ? 'text-[var(--green)] font-extrabold'
                  : 'text-[#141A15]/75'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/products"
            className="hidden sm:flex items-center justify-center w-9 h-9 text-[#141A15]/60 hover:text-[var(--green)] hover:bg-[#141A15]/5 rounded-full transition-colors"
            aria-label="Search products"
          >
            <Search size={17} />
          </Link>

          <span className="hidden sm:block h-4 w-px bg-[#141A15]/15" />

          <Link
            href="/contact"
            className="hidden items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)] transition-all hover:text-[#1B3328] hover:translate-x-0.5 sm:flex"
          >
            Request a Quote <ArrowUpRight size={14} />
          </Link>

          {/* Mobile Navigation Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-10 w-10 items-center justify-center border border-[#141A15]/15 rounded-xs lg:hidden hover:border-[var(--green)] transition"
                aria-label="Open navigation"
              >
                <Menu size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full bg-[var(--ivory)] sm:max-w-sm">
              <SheetHeader>
                <SheetTitle className="font-display text-3xl text-[var(--green)]">
                  Al Wahid
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-10 grid gap-5">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="font-display text-3xl text-[var(--charcoal)] hover:text-[var(--green)] transition"
                >
                  Home
                </Link>
                {NAV_LINKS.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl text-[var(--charcoal)] hover:text-[var(--green)] transition"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-5 inline-flex w-fit bg-[var(--green)] px-6 py-4 text-xs font-bold uppercase tracking-[.14em] text-[var(--ivory)] transition hover:bg-[#1B3328]"
                >
                  Request a Quote
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
