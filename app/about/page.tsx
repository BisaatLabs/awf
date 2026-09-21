import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About | Al Wahid Furnitures — Established 1974',
  description:
    'Established in 1974, Al Wahid Furnitures brings a considered approach to furniture for homes, workplaces, and shared spaces. Discover our perspective.',
};

const principles = [
  {
    number: '01',
    title: 'Purpose in every piece.',
    description:
      'Good furniture belongs to the way a space is used. Comfort, proportion, and everyday practicality guide the conversation.',
  },
  {
    number: '02',
    title: 'Care in the details.',
    description:
      'The character of a piece comes from the whole: its material, its finish, and the small details that bring it together.',
  },
  {
    number: '03',
    title: 'Room for your ideas.',
    description:
      'Every space has its own requirements. We start with what matters to you, from a particular dimension to the feeling of a room.',
  },
];

const linkFocus = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--walnut)] focus-visible:ring-offset-4';

export default function AboutPage() {
  return (
    <div className="pt-[82px]">
      <section aria-labelledby="about-heading" className="container-wide pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pt-24">
        <div className="mb-10 flex items-center justify-between border-b border-[var(--line)] pb-5 sm:mb-16">
          <p className="eyebrow">About Al Wahid</p>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--charcoal)]/60">Est. 1974</span>
        </div>

        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <h1 id="about-heading" className="max-w-2xl font-display text-[clamp(3.5rem,6.4vw,6.75rem)] leading-[0.98] tracking-[-0.045em] text-[var(--green)]">
              A considered<br />approach to<br />everyday living.
            </h1>
            <p className="mt-7 max-w-md text-sm leading-7 text-[var(--charcoal)]/70 sm:text-base sm:leading-8">
              Furniture becomes part of the way we live. A place to gather,
              a space to work, a moment to feel at home. At Al Wahid Furnitures,
              that is where our thinking begins.
            </p>
            <Link href="/products" className={`mt-8 inline-flex items-center gap-5 border-b border-[var(--green)] pb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)] transition-colors hover:text-[var(--walnut)] ${linkFocus}`}>
              Explore our furniture <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="relative flex min-h-[340px] flex-col justify-between overflow-hidden bg-[var(--green)] px-8 py-8 text-[var(--ivory)] sm:min-h-[420px] sm:px-10 sm:py-10 lg:min-h-[470px]">
            <div aria-hidden="true" className="pointer-events-none absolute inset-5 border border-[#F4F0E7]/15" />
            <p className="relative text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F4F0E7]/75">Al Wahid Furnitures</p>
            <div className="relative py-8">
              <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.3em] text-[#F4F0E7]/75">Established</p>
              <p className="font-display text-[clamp(6.5rem,13vw,11.5rem)] leading-none tracking-[-0.055em]">1974<span className="text-[#C4A477]">.</span></p>
            </div>
            <div className="relative flex items-center justify-between gap-4 border-t border-[#F4F0E7]/25 pt-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em]">Built for every space.</span>
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#C4A477]" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="perspective-heading" className="border-y border-[var(--line)] bg-[#ECE7DC]/50">
        <div className="container-wide grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_2fr] lg:gap-20">
          <p className="eyebrow lg:pt-2">Our perspective</p>
          <div className="max-w-3xl">
            <h2 id="perspective-heading" className="font-display text-4xl leading-[1.1] tracking-[-0.025em] text-[var(--green)] sm:text-5xl">
              Rooted in 1974.<br />Considered for today.
            </h2>
            <div className="mt-7 grid gap-5 text-sm leading-7 text-[var(--charcoal)]/70 sm:grid-cols-2 sm:gap-10">
              <p>
                Established in 1974, Al Wahid Furnitures is a name with a history.
                Our focus today is simple: furniture that feels right in its
                surroundings and serves a purpose in everyday life.
              </p>
              <p>
                From a personal corner at home to a shared workplace, each setting
                asks for something different. We bring the conversation back to
                your space, your needs, and the details that matter to you.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-heading" className="container-wide py-16 sm:py-24">
        <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">What matters to us</p>
            <h2 id="principles-heading" className="mt-4 font-display text-4xl tracking-[-0.025em] text-[var(--green)] sm:text-5xl">Thoughtful by design.</h2>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[var(--charcoal)]/60">A few simple principles.<br />A clear point of view.</p>
        </div>
        <div className="grid gap-10 md:grid-cols-3 md:gap-10 lg:gap-16">
          {principles.map(principle => (
            <div key={principle.number} className="border-t border-[var(--line)] pt-6">
              <span className="text-[11px] font-semibold tracking-[0.12em] text-[var(--walnut)]">{principle.number}</span>
              <h3 className="mb-4 mt-8 font-display text-3xl leading-tight text-[var(--charcoal)]">{principle.title}</h3>
              <p className="max-w-sm text-sm leading-7 text-[var(--charcoal)]/70">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="conversation-heading" className="container-wide pb-16 sm:pb-24">
        <div className="flex flex-col gap-8 border-t border-[var(--line)] pt-10 sm:flex-row sm:items-center sm:justify-between sm:pt-12">
          <div>
            <p className="eyebrow">Your space. Your starting point.</p>
            <h2 id="conversation-heading" className="mt-3 font-display text-4xl leading-tight tracking-[-0.025em] text-[var(--green)] sm:text-5xl">Let’s find the right fit.</h2>
          </div>
          <Link href="/contact" className={`inline-flex w-fit shrink-0 items-center gap-8 bg-[var(--green)] px-6 py-5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--ivory)] transition-colors hover:bg-[var(--green-dark)] ${linkFocus}`}>
            Start a conversation <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
