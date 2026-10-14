'use client';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { SmoothScroll } from './SmoothScroll';
import { WhatsAppFloat } from './WhatsAppFloat';
import { MobileExperience } from './MobileExperience';
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return <>{children}</>;
  return <><SmoothScroll /><Header /><main className="storefront-main">{children}</main><MobileExperience /><Footer /><WhatsAppFloat /></>;
}
