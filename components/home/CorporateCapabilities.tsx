import { ArrowUpRight, Ruler, Layers, Palette, Truck } from 'lucide-react';
import { corporateWhatsAppUrl } from '@/lib/whatsapp';

const CAPABILITIES = [
  {
    icon: Ruler,
    title: 'Custom Specifications',
    copy: 'Furniture developed around project dimensions, technical drawings, and spatial requirements.',
  },
  {
    icon: Layers,
    title: 'Bulk Orders',
    copy: 'Scalable furniture manufacturing for corporate floors, educational institutions, and multi-unit projects.',
  },
  {
    icon: Palette,
    title: 'Consistent Finishes',
    copy: 'Coordinated laminates, veneers, powder coats, and joinery language across your entire facility.',
  },
  {
    icon: Truck,
    title: 'Delivery + Installation',
    copy: 'End-to-end workshop-to-site transit, precise on-site leveling, assembly, and quality assurance.',
  },
];

export function CorporateCapabilities() {
  return (
    <section className="section-pad">
      <div className="container-wide">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div>
            <p className="eyebrow">04 / Capabilities</p>
            <h2 className="mt-4 font-display text-5xl leading-[.95] tracking-[-.03em] text-[var(--green)] sm:text-6xl">
              Built for Projects,
              <br />
              Not Just Pieces.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--charcoal)]/65">
              Al Wahid Furnitures supports offices, corporate workplaces, schools, institutions, hospitality, and large furniture packages — built around your architectural project, not guesses.
            </p>
            <a
              href={corporateWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 border-b border-[var(--green)] pb-2 text-xs font-bold uppercase tracking-[.12em] text-[var(--green)] hover:text-[var(--walnut)] transition"
            >
              Discuss a Bulk Order <ArrowUpRight size={15} />
            </a>
          </div>

          <div className="grid gap-px bg-[var(--line)] sm:grid-cols-2">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="bg-[var(--ivory)] p-8">
                <cap.icon size={24} className="text-[var(--walnut)]" />
                <h3 className="mt-6 font-display text-2xl text-[var(--charcoal)]">{cap.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--charcoal)]/60">{cap.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
