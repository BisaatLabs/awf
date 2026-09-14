// app/admin/layout.tsx
// Root admin layout — uses AdminShell to selectively display the sidebar shell.

import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = { title: 'Admin — Al Wahid Furnitures' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
