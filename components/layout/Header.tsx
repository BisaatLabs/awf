'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ArrowUpRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const LOGO_SRC = '/images/logo/logo.png';

const NAV_LINKS: [string, string][] = [
  ['Home', '/'],
  ['Products', '/products'],
  ['Spaces', '/spaces'],
  ['About', '/about'],
  ['Projects', '/projects'],
  ['Custom Furniture', '/custom-furniture'],
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-40 w-full border-b border-transparent bg-[rgba(244,240,231,.92)] backdrop-blur-md transition-colors">
      <div className="container-wide flex h-[82px] items-center justify-between">
        <Link href="/" aria-label="Al Wahid Furnitures home" className="flex items-center">
          <Image
            src={LOGO_SRC}
            alt="Al Wahid Furnitures"
            width={180}
            height={70}
            className="h-[56px] w-auto object-contain"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.slice(1).map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="text-[12px] font-semibold uppercase tracking-[.08em] text-[var(--charcoal)]/75 transition-colors hover:text-[var(--green)]"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden items-center gap-2 border-b border-[var(--green)] pb-1 text-[12px] font-bold uppercase tracking-[.12em] text-[var(--green)] sm:flex hover:text-[var(--walnut)] transition"
          >
            Request a Quote <ArrowUpRight size={14} />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex h-11 w-11 items-center justify-center border border-[var(--line)] lg:hidden hover:border-[var(--green)] transition"
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
                {NAV_LINKS.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl text-[var(--charcoal)] hover:text-[var(--green)] transition"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-5 inline-flex w-fit bg-[var(--green)] px-5 py-4 text-xs font-bold uppercase tracking-[.14em] text-[var(--ivory)] transition hover:bg-[var(--walnut)]"
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
