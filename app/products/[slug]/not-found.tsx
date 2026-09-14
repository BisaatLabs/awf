import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProductNotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-24 text-center">
      <span className="eyebrow text-[var(--walnut)]">Catalogue</span>
      <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--green)] sm:text-5xl">
        Piece Unavailable
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--charcoal)]/60">
        This piece has been unlisted or is no longer available in our active catalogue. You can explore other pieces or request a bespoke build.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-[var(--green)] px-6 py-3.5 text-xs font-bold uppercase tracking-[.14em] text-[var(--ivory)] transition hover:bg-[var(--walnut)]"
        >
          <ArrowLeft size={14} /> Browse All Pieces
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 border border-[var(--line)] px-6 py-3.5 text-xs font-bold uppercase tracking-[.14em] text-[var(--charcoal)] transition hover:border-[var(--green)]"
        >
          Request Custom Build
        </Link>
      </div>
    </div>
  );
}
