import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { projects } from '@/data/content';

export function ProjectShowcase() {
  return (
    <section className="section-pad bg-[#efeae0]">
      <div className="container-wide">
        <div className="mb-12 flex flex-col justify-between gap-6 border-t border-[var(--line)] pt-5 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">05 / Projects</p>
            <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[.95] tracking-[-.03em] text-[var(--green)] sm:text-6xl">
              Spaces Built Around People.
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex shrink-0 items-center gap-2 border-b border-[var(--green)] pb-2 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] hover:text-[var(--walnut)] transition"
          >
            View all projects <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 767px) 100vw, 33vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="border-b border-[var(--line)] py-5">
                <p className="text-[10px] font-bold uppercase tracking-[.15em] text-[var(--walnut)]">
                  {p.type}
                </p>
                <h3 className="mt-2 font-display text-3xl text-[var(--charcoal)]">{p.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/55">{p.overview}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)]">
                  View Project{' '}
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
