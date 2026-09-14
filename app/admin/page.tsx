// app/admin/page.tsx
// Dashboard — minimal overview with 4 stat cards.

import { createSupabaseServerClient } from '@/lib/supabase/ssr-client';
import { Package, CheckCircle, Tag, Star } from 'lucide-react';

async function getStats() {
  const supabase = createSupabaseServerClient();

  const [
    { count: total },
    { count: active },
    { count: featured },
    { count: categories },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('featured', true),
    supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
  ]);

  return { total, active, featured, categories };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Products',    value: stats.total ?? 0,      icon: Package,      color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Active Products',   value: stats.active ?? 0,     icon: CheckCircle,  color: 'text-green-700',  bg: 'bg-green-50' },
    { label: 'Featured',          value: stats.featured ?? 0,   icon: Star,         color: 'text-amber-600',  bg: 'bg-amber-50' },
    { label: 'Categories',        value: stats.categories ?? 0, icon: Tag,          color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-5xl">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Welcome back. Here&apos;s an overview of your catalogue.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="rounded-xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <div className={`mb-3 inline-flex rounded-lg p-2 ${bg}`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            <p className="mt-0.5 text-xs text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-10 rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h2 className="mb-4 text-sm font-semibold text-gray-900">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/admin/products/new"
            className="rounded-lg bg-[#1B4332] px-4 py-2 text-xs font-medium text-white transition hover:bg-[#14532d]"
          >
            + Add Product
          </a>
          <a
            href="/admin/products"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300"
          >
            Manage Products
          </a>
          <a
            href="/admin/categories"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300"
          >
            Manage Categories
          </a>
          <a
            href="/products"
            target="_blank"
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:border-gray-300"
          >
            View Live Catalogue ↗
          </a>
        </div>
      </div>
    </div>
  );
}
