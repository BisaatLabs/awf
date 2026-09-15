'use client';

import { usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login' || pathname?.startsWith('/admin/login');

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen flex-col md:flex-row overflow-hidden bg-[#F9FAFB] font-sans antialiased text-neutral-900">
      <AdminSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
