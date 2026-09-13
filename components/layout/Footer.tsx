import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const LOGO_SRC = '/images/logo/logo.png';

const EXPLORE_LINKS: [string, string][] = [
  ['Products', '/products'],
  ['Spaces', '/spaces'],
  ['Projects', '/projects'],
  ['About', '/about'],
  ['Contact', '/contact'],
];

const SPACES_LIST = ['Home', 'Office', 'Corporate', 'Institutional', 'School'];

export function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-[var(--ivory)]">
      <div className="container-wide grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_auto]">
        <div>
          <Image
            src={LOGO_SRC}
            alt="Al Wahid Furnitures"
            width={180}
            height={70}
            className="h-14 w-auto object-contain object-left [filter:brightness(0)_invert(1)] opacity-90"
          />
          <p className="mt-5 max-w-xs font-display text-2xl leading-tight text-[var(--ivory)]">
            Built for Every Space.
          </p>
          <p className="mt-2 text-xs text-[var(--stone)] leading-relaxed">
            Thoughtfully engineered furniture crafted for homes, offices, schools, and institutional spaces.
          </p>
        </div>

        <div>
          <p className="eyebrow text-[var(--stone)]">Explore</p>
          <div className="mt-5 grid gap-3 text-sm text-[var(--ivory)]/70">
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

        <div>
          <p className="eyebrow text-[var(--stone)]">For Spaces</p>
          <div className="mt-5 grid gap-3 text-sm text-[var(--ivory)]/70">
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
        </div>

        <div className="md:text-right">
          <p className="eyebrow text-[var(--stone)]">Start a conversation</p>
          <Link
            href="/contact"
            className="mt-5 inline-flex items-center gap-2 border-b border-[var(--walnut)] pb-2 text-sm font-semibold transition hover:border-[var(--ivory)]"
          >
            Request a Quote <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      <div className="container-wide flex flex-col justify-between gap-3 border-t border-white/10 py-5 text-[10px] uppercase tracking-[.14em] text-[var(--ivory)]/40 sm:flex-row">
        <span>© 2026 Al Wahid Furnitures</span>
        <span>Built for Every Space.</span>
      </div>
    </footer>
  );
}
