'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Armchair, ArrowUpRight } from 'lucide-react';

const destinations = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/products', label: 'Collection', icon: Armchair },
  { href: '/contact', label: 'Get a quote', icon: ArrowUpRight },
];

export function MobileExperience() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px) and (prefers-reduced-motion: no-preference)');
    let observer: IntersectionObserver | undefined;
    const clear = () => {
      observer?.disconnect();
      document.querySelectorAll('[data-mobile-reveal]').forEach((element) => {
        element.removeAttribute('data-mobile-reveal');
      });
    };
    const setup = () => {
      clear();
      if (!media.matches || !('IntersectionObserver' in window)) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-mobile-reveal', 'visible');
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.08 });
      document.querySelectorAll('.storefront-main > section:not(.hero-section), .product-card, .space-grid > a, .capability-grid > div').forEach((element) => {
        observer?.observe(element);
      });
    };
    setup();
    media.addEventListener('change', setup);
    return () => { clear(); media.removeEventListener('change', setup); };
  }, [pathname]);

  return (
    <nav aria-label="Mobile quick navigation" className="mobile-dock">
      {destinations.map(({ href, label, icon: Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} aria-current={active ? 'page' : undefined}>
            <Icon size={19} strokeWidth={1.7} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
