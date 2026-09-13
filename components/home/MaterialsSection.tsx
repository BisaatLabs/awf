import Image from 'next/image';
import { images } from '@/data/content';

const PROCESS_STEPS: [string, string, string][] = [
  ['01', 'Need', 'Understand the space, the people, and the daily functional flow.'],
  ['02', 'Product', 'Translate requirements into a durable, cohesive furniture language.'],
  ['03', 'Detail', 'Refine materials, finishes, edge profiles, and structural joinery.'],
  ['04', 'Scale', 'Manufacture for the full scale of the project with rigorous QA.'],
  ['05', 'Action', 'Deliver, position, level, and install with professional precision.'],
];

export function MaterialsSection() {
  return (
    <section className="section-pad">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm lg:sticky lg:top-32 lg:h-[600px]">
            <Image
              src={images.wood}
              alt="Close-up of furniture joinery and wood grain"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div>
            <p className="eyebrow">06 / Material + Process</p>
            <h2 className="mt-4 font-display text-5xl leading-[.95] tracking-[-.03em] text-[var(--green)] sm:text-6xl">
              Proof in Every Detail.
            </h2>
            <p className="mt-6 text-sm leading-7 text-[var(--charcoal)]/65">
              We prove quality through the elements you can see and feel — timber grain, smooth laminates, precision edges, structural joinery, and heavy-duty hardware.
            </p>

            <div className="mt-10 grid gap-px bg-[var(--line)]">
              {PROCESS_STEPS.map(([num, title, copy]) => (
                <div key={num} className="flex items-baseline gap-6 bg-[var(--ivory)] py-7">
                  <span className="font-display text-3xl text-[var(--walnut)]">{num}</span>
                  <div>
                    <h3 className="font-display text-2xl text-[var(--charcoal)]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--charcoal)]/60">{copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
