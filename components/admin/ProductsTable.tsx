'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { deleteProduct, toggleProductActive } from '@/app/admin/actions';

type AdminProduct = {
  id: string;
  sku: string | null;
  name: string;
  slug: string;
  price_display: string | null;
  featured: boolean;
  is_active: boolean;
  categories: { id: string; name: string } | null;
  product_images: { secure_url: string | null; is_primary: boolean; sort_order: number }[];
};

export function ProductsTable({ products }: { products: AdminProduct[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleToggle(id: string, current: boolean) {
    await toggleProductActive(id, !current);
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-gray-500">No products found.</p>
        <Link
          href="/admin/products/new"
          className="mt-4 inline-block text-sm font-medium text-[#1B4332] hover:underline"
        >
          Add your first product →
        </Link>
      </div>
    );
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">Product</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">Category</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">Price</th>
          <th className="px-5 py-3.5 text-left text-xs font-medium text-gray-500">Status</th>
          <th className="px-5 py-3.5 text-right text-xs font-medium text-gray-500">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-50">
        {products.map((p) => {
          const thumb = p.product_images.find((i) => i.is_primary)?.secure_url
            ?? p.product_images.sort((a, b) => a.sort_order - b.sort_order)[0]?.secure_url
            ?? null;

          return (
            <tr key={p.id} className="group hover:bg-gray-50/60 transition-colors">
              {/* Thumbnail + Name + SKU */}
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={p.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-gray-400">
                        —
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900 max-w-[240px]">{p.name}</p>
                    {p.sku && (
                      <p className="mt-0.5 font-mono text-[11px] text-gray-400">{p.sku}</p>
                    )}
                    {p.featured && (
                      <span className="mt-1 inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </td>

              {/* Category */}
              <td className="px-5 py-4">
                <span className="text-gray-600">
                  {p.categories?.name ?? <span className="text-gray-300">—</span>}
                </span>
              </td>

              {/* Price */}
              <td className="px-5 py-4">
                <span className="text-gray-700">{p.price_display ?? '—'}</span>
              </td>

              {/* Status toggle */}
              <td className="px-5 py-4">
                <button
                  onClick={() => handleToggle(p.id, p.is_active)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    p.is_active
                      ? 'bg-green-50 text-green-700 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${p.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {p.is_active ? 'Active' : 'Inactive'}
                </button>
              </td>

              {/* Actions */}
              <td className="px-5 py-4">
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/admin/products/${p.id}/edit`}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-900 transition"
                    title="Edit"
                  >
                    <Pencil size={14} />
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    disabled={deletingId === p.id}
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-500 transition disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
