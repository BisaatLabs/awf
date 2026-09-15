'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tag, LogOut, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

const nav = [
  { label: 'Dashboard',  href: '/admin',            icon: LayoutDashboard },
  { label: 'Products',   href: '/admin/products',   icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Tag },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <aside className="flex w-full md:h-screen md:w-[220px] shrink-0 flex-col border-r border-gray-100 bg-white">
      {/* Brand */}
      <div className="hidden md:flex flex-col items-center justify-center px-4 py-5 border-b border-gray-100">
        <Image
          src="/images/logo/logo.png"
          alt="Al Wahid Furnitures"
          width={130}
          height={70}
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex md:block md:flex-1 space-y-0.5 px-3 py-2 md:py-4">
        {nav.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#F0FDF4] text-[#1B4332]'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-[#1B4332]' : 'text-gray-400'} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex md:block border-t border-gray-100 px-3 py-2 md:py-4 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ExternalLink size={15} className="text-gray-400" />
          View Website
        </Link>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={15} className="text-gray-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
