'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Import at top
import { ArrowRight, CheckCircle2, Compass, Layers, Palette } from 'lucide-react';

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Need & Space Discovery',
    copy: 'Understand the architectural flow, ergonomics, and daily demands of your environment.',
    highlight: 'Site measurement & user analysis',
  },
  {
    num: '02',
    title: 'Product Language',
    copy: 'Translate requirements into a durable, cohesive furniture language tailored to the space.',
    highlight: 'Proportion & aesthetic alignment',
  },
  {
    num: '03',
    title: 'Detail & Materiality',
    copy: 'Refine kiln-dried timbers, premium veneers, edge profiles, and structural joinery.',
    highlight: 'Sample boards & hardware selection',
  },
  {
    num: '04',
    title: 'Precision Craft & QA',
    copy: 'Manufacture for the full scale of the project with rigorous bench inspection and tolerance checks.',
    highlight: 'Millimetric joinery calibration',
  },
  {
    num: '05',
    title: 'White-Glove Installation',
    copy: 'Deliver, position, balance, and install with professional precision and ongoing warranty.',
    highlight: 'Turnkey site handover',
  },
];

const MATERIAL_HIGHLIGHTS = [
  {
    title: 'Bespoke Blueprints',
    desc: 'Custom joinery drawings & exact CAD specifications',
    pos: 'top-[22%] left-[4%]',
  },
  {
    title: 'Fluted & Solid Timber',
    desc: 'Kiln-dried walnut, oak & architectural profiles',
    pos: 'top-[12%] right-[12%]',
  },
  {
    title: 'Curated Veneers',
    desc: 'Graded grain alignments & hand-rubbed finishes',
    pos: 'top-[44%] right-[0%]',
  },
  {
    title: 'Architectural Hardware',
    desc: 'Solid brushed metals & heavy-duty mechanisms',
    pos: 'bottom-[14%] right-[22%]',
  },
];

export function MaterialsSection() {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="section-pad relative overflow-hidden bg-[var(--ivory)] text-[var(--charcoal)]">
      {/* Background Architectural Ambient Accents */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, #111512 1px, transparent 1px),
              linear-gradient(to bottom, #111512 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="container-wide relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Visual Material Composition Showcase Stage */}
          <div className="lg:sticky lg:top-28 lg:col-span-6 xl:col-span-6">
            <div className="relative flex flex-col items-center">
              {/* Top Subtitle Badge */}
              <div className="mb-4 flex w-full items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--charcoal)]/10 bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--green)] backdrop-blur-sm">
                  <Layers size={13} />
                  <span>Materiality & Craft</span>
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#7A857E]">
                  AWF Atelier
                </span>
              </div>

              {/* Composition Canvas Stage with Ambient Glow */}
              <div className="group relative flex w-full items-center justify-center rounded-3xl border border-[var(--charcoal)]/8 bg-gradient-to-b from-white/80 via-[#FAF7F2]/60 to-white/40 p-4 sm:p-8 shadow-[0_15px_40px_rgba(41,72,58,0.06)] backdrop-blur-md">
                {/* Radial Glow Underneath Composition */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(123,81,53,0.14)_0%,rgba(41,72,58,0.08)_45%,transparent_70%)] blur-2xl transition-transform duration-1000 group-hover:scale-110" />
                </div>

                {/* Subtle Concentric Alignment Arcs */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.05]">
                  <div className="h-[420px] w-[420px] rounded-full border border-[var(--charcoal)]" />
                  <div className="absolute h-[280px] w-[280px] rounded-full border border-dashed border-[var(--charcoal)]" />
                </div>

                {/* Main 3D Material Palette Image with Gentle Float Animation */}
                <div className="relative z-10 w-full max-w-[540px] py-4 transition-transform duration-700 ease-out group-hover:scale-[1.02]">
                  <div className="animate-float">
                    <Image
                      src="/images/materials/proof-composition.png"
                      alt="Al Wahid Furnitures material composition featuring solid walnut, architectural blueprints, fluted panels, veneers, bouclé fabric and brushed bronze hardware"
                      width={1000}
                      height={680}
                      priority
                      className="h-auto w-full object-contain drop-shadow-[0_20px_35px_rgba(30,20,10,0.18)]"
                    />
                  </div>
                </div>

                {/* Floating Detail Badges */}
                <div className="pointer-events-none absolute bottom-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-[var(--charcoal)]/6 bg-white/90 p-3 text-[11px] shadow-sm backdrop-blur-md">
                  <div className="flex items-center gap-2 text-[var(--charcoal)]/80">
                    <Compass size={14} className="text-[var(--green)]" />
                    <span className="font-semibold">Kiln-Dried Timber</span>
                  </div>
                  <span className="hidden text-[var(--charcoal)]/30 sm:inline">•</span>
                  <div className="flex items-center gap-2 text-[var(--charcoal)]/80">
                    <Palette size={14} className="text-[var(--walnut)]" />
                    <span className="font-semibold">Graded Veneers</span>
                  </div>
                  <span className="hidden text-[var(--charcoal)]/30 sm:inline">•</span>
                  <div className="flex items-center gap-2 text-[var(--charcoal)]/80">
                    <CheckCircle2 size={14} className="text-[var(--green)]" />
                    <span className="font-semibold">Precision QA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Philosophy & Process Steps */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div>
              <p className="eyebrow text-[#5A635B] tracking-[0.2em]">06 / MATERIAL + PROCESS</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-[-0.02em] text-[var(--green)]">
                Proof in Every Detail.
              </h2>
              <p className="mt-5 text-sm sm:text-base leading-relaxed text-[var(--charcoal)]/75">
                We prove quality through the tactile elements you can see, touch, and live with —
                rich timber grains, precision-milled fluting, acoustic bouclé textiles, seamless
                laminates, and heavyweight structural hardware engineered to endure.
              </p>
            </div>

            {/* Step-by-Step Interactive Process Timeline */}
            <div className="mt-10 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {PROCESS_STEPS.map((step, idx) => (
                <div
                  key={step.num}
                  onMouseEnter={() => setActiveStep(idx)}
                  onMouseLeave={() => setActiveStep(null)}
                  className={`group relative flex cursor-default flex-col gap-3 py-6 transition-all duration-300 sm:flex-row sm:items-start sm:gap-6 ${
                    activeStep === idx
                      ? 'bg-white/60 px-4 -mx-4 rounded-xl shadow-xs'
                      : 'hover:bg-white/30'
                  }`}
                >
                  <div className="flex items-center gap-3 sm:block sm:shrink-0">
                    <span
                      className={`font-display text-3xl font-semibold transition-colors duration-300 ${
                        activeStep === idx ? 'text-[var(--green)]' : 'text-[var(--walnut)]'
                      }`}
                    >
                      {step.num}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--green)]/60 sm:hidden">
                      {step.highlight}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col justify-between sm:flex-row sm:items-baseline">
                      <h3 className="font-display text-2xl font-medium text-[var(--charcoal)] transition-colors group-hover:text-[var(--green)]">
                        {step.title}
                      </h3>
                      <span className="hidden text-[11px] font-semibold uppercase tracking-wider text-[var(--green)]/70 sm:inline">
                        {step.highlight}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[var(--charcoal)]/65">
                      {step.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Consultation CTA */}
            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[var(--charcoal)]/10 bg-white/70 p-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-xl text-[var(--green)]">
                  Need a custom finish or material sample?
                </p>
                <p className="mt-1 text-xs text-[var(--charcoal)]/70">
                  We formulate custom timber stains, laminates, and upholstery swatches for projects.
                </p>
              </div>
              <Link
                href="/custom-furniture"
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-[var(--ivory)] transition-all duration-300 hover:bg-[#1A3326] hover:shadow-md"
              >
                <span>Request Swatches</span>
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
