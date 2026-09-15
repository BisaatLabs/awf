'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Loader2, Plus, Trash2, Star } from 'lucide-react';
import { createProduct, updateProduct, type ProductFormData } from '@/app/(admin)/admin/actions';

// ─── Types ────────────────────────────────────────────────────
type Category = { id: string; name: string };

type ExistingProduct = {
  id: string;
  sku: string;
  name: string;
  space: string;
  description: string;
  short_description: string;
  materials: string[];
  finish: string;
  width_mm: string;
  depth_mm: string;
  height_mm: string;
  price_display: string;
  customizable: boolean;
  featured: boolean;
  is_active: boolean;
  category_id: string;
  product_images: {
    id: string;
    cloudinary_public_id: string;
    secure_url: string;
    is_primary: boolean;
    sort_order: number;
  }[];
};

type ImageRow = {
  id?:                  string;
  cloudinary_public_id: string;
  secure_url:           string;
  is_primary:           boolean;
  sort_order:           number;
  _delete?:             boolean;
  _preview?:            string;  // local preview URL for new items
};

// ─── Constants ────────────────────────────────────────────────
const MATERIAL_OPTIONS = ['Wood', 'Metal', 'Iron', 'Laminate', 'Upholstery', 'Glass', 'Fabric', 'Marble', 'Plywood'];
const SPACE_OPTIONS    = ['Home', 'Office', 'Corporate', 'School', 'Institutional', 'Dining', 'Bedroom', 'Living'];
const FINISH_OPTIONS   = ['Natural', 'Walnut', 'Dark Walnut', 'White', 'Black', 'Ivory', 'Mahogany', 'Custom'];

// ─── Helpers ──────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-[13px] font-semibold uppercase tracking-wider text-gray-400">
      {children}
    </h2>
  );
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-medium text-gray-700">
        {label}
        {required && <span className="ml-0.5 text-red-400">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-gray-900 outline-none placeholder:text-gray-400 transition focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10';

// ─── Main Component ───────────────────────────────────────────
export function ProductForm({
  product,
  categories,
}: {
  product?: ExistingProduct;
  categories: Category[];
}) {
  const isEdit = Boolean(product);
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  // Form state
  const [name, setName]           = useState(product?.name ?? '');
  const [sku, setSku]             = useState(product?.sku ?? '');
  const [categoryId, setCategoryId] = useState(product?.category_id ?? '');
  const [space, setSpace]         = useState(product?.space ?? '');
  const [description, setDescription] = useState(product?.description ?? '');
  const [shortDesc, setShortDesc] = useState(product?.short_description ?? '');
  const [price, setPrice]         = useState(product?.price_display ?? '');
  const [finish, setFinish]       = useState(product?.finish ?? '');
  const [widthMm, setWidthMm]     = useState(product?.width_mm ?? '');
  const [depthMm, setDepthMm]     = useState(product?.depth_mm ?? '');
  const [heightMm, setHeightMm]   = useState(product?.height_mm ?? '');
  const [materials, setMaterials] = useState<string[]>(product?.materials ?? []);
  const [customizable, setCustomizable] = useState(product?.customizable ?? true);
  const [featured, setFeatured]   = useState(product?.featured ?? false);
  const [isActive, setIsActive]   = useState(product?.is_active ?? true);

  // Images state
  const [images, setImages] = useState<ImageRow[]>(
    product?.product_images.map((img) => ({
      id:                   img.id,
      cloudinary_public_id: img.cloudinary_public_id,
      secure_url:           img.secure_url,
      is_primary:           img.is_primary,
      sort_order:           img.sort_order,
    })) ?? []
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // ─── Material toggle ────────────────────────────────────────
  function toggleMaterial(m: string) {
    setMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  }

  // ─── Image helpers ──────────────────────────────────────────
  function addImage() {
    const url = newImageUrl.trim();
    if (!url) return;

    // Extract public_id from URL (last segment before query string, no extension)
    const parts = url.split('/').pop()?.split('.')[0] ?? url;
    const newImg: ImageRow = {
      cloudinary_public_id: parts,
      secure_url:           url,
      is_primary:           images.filter((i) => !i._delete).length === 0,
      sort_order:           images.filter((i) => !i._delete).length,
    };
    setImages((prev) => [...prev, newImg]);
    setNewImageUrl('');
  }

  function removeImage(idx: number) {
    setImages((prev) =>
      prev.map((img, i) =>
        i === idx ? { ...img, _delete: true } : img
      )
    );
  }

  function setPrimary(idx: number) {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === idx && !img._delete }))
    );
  }

  const visibleImages = images.filter((i) => !i._delete);

  // ─── Submit ─────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Product name is required.'); return; }

    setLoading(true);
    const data: ProductFormData = {
      sku, name, category_id: categoryId, space, description,
      short_description: shortDesc, materials, finish,
      width_mm: widthMm, depth_mm: depthMm, height_mm: heightMm,
      price_display: price, customizable, featured, is_active: isActive,
      images,
    };

    try {
      if (isEdit && product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }
    } catch (err: any) {
      setError(err.message ?? 'An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* ── Basic Info ───────────────────────────────────── */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <SectionTitle>Basic Information</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Product Name" required>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Dark Walnut Gold Filigree Storage Bed"
              required
              className={inputCls}
            />
          </Field>
          <Field label="SKU" hint="Internal reference code">
            <input
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="e.g. AWF-001"
              className={inputCls}
            />
          </Field>
          <Field label="Category">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className={inputCls}
            >
              <option value="">Select category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Space">
            <select
              value={space}
              onChange={(e) => setSpace(e.target.value)}
              className={inputCls}
            >
              <option value="">Select space…</option>
              {SPACE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Price / Availability" hint='e.g. "AED 15,000" or "On Request"'>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="On Request"
              className={inputCls}
            />
          </Field>
          <Field label="Finish">
            <select
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className={inputCls}
            >
              <option value="">Select finish…</option>
              {FINISH_OPTIONS.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </Field>
        </div>
      </section>

      {/* ── Description ──────────────────────────────────── */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <SectionTitle>Description</SectionTitle>
        <div className="space-y-5">
          <Field label="Short Description" hint="Shown on product cards (1–2 lines)">
            <textarea
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              rows={2}
              placeholder="Brief, compelling summary of the product…"
              className={inputCls + ' resize-none'}
            />
          </Field>
          <Field label="Full Description" hint="Shown on the product detail page">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Detailed description of the product…"
              className={inputCls + ' resize-none'}
            />
          </Field>
        </div>
      </section>

      {/* ── Materials ────────────────────────────────────── */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <SectionTitle>Materials</SectionTitle>
        <div className="flex flex-wrap gap-2.5">
          {MATERIAL_OPTIONS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleMaterial(m)}
              className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                materials.includes(m)
                  ? 'border-[#1B4332] bg-[#F0FDF4] text-[#1B4332]'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {materials.length > 0 && (
          <p className="mt-3 text-xs text-gray-500">
            Selected: {materials.join(', ')}
          </p>
        )}
      </section>

      {/* ── Dimensions ───────────────────────────────────── */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <SectionTitle>Dimensions</SectionTitle>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Width" hint='e.g. "1800 mm" or "6 ft"'>
            <input
              value={widthMm}
              onChange={(e) => setWidthMm(e.target.value)}
              placeholder="1800 mm"
              className={inputCls}
            />
          </Field>
          <Field label="Depth">
            <input
              value={depthMm}
              onChange={(e) => setDepthMm(e.target.value)}
              placeholder="2000 mm"
              className={inputCls}
            />
          </Field>
          <Field label="Height">
            <input
              value={heightMm}
              onChange={(e) => setHeightMm(e.target.value)}
              placeholder="1200 mm"
              className={inputCls}
            />
          </Field>
        </div>
      </section>

      {/* ── Options ──────────────────────────────────────── */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <SectionTitle>Options</SectionTitle>
        <div className="space-y-3">
          {[
            {
              label: 'Active',
              hint:  'Active products appear on the public website.',
              checked: isActive,
              onChange: setIsActive,
            },
            {
              label: 'Featured',
              hint:  'Featured products appear in the "Selected Pieces" section on the homepage.',
              checked: featured,
              onChange: setFeatured,
            },
            {
              label: 'Customizable',
              hint:  'Indicates the product can be ordered in custom dimensions.',
              checked: customizable,
              onChange: setCustomizable,
            },
          ].map(({ label, hint, checked, onChange }) => (
            <label
              key={label}
              className="flex cursor-pointer items-start gap-4 rounded-lg border border-gray-100 p-4 transition hover:border-gray-200"
            >
              <div className="relative mt-0.5 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => onChange(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`h-5 w-5 rounded border-2 transition ${
                    checked
                      ? 'border-[#1B4332] bg-[#1B4332]'
                      : 'border-gray-300 bg-white'
                  } flex items-center justify-center`}
                >
                  {checked && (
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{label}</p>
                <p className="text-xs text-gray-500">{hint}</p>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* ── Images ───────────────────────────────────────── */}
      <section className="rounded-xl border border-gray-100 bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <SectionTitle>Images</SectionTitle>

        {/* Existing / added images */}
        {visibleImages.length > 0 && (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {images.map((img, idx) => {
              if (img._delete) return null;
              return (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-lg border-2 ${
                    img.is_primary ? 'border-[#1B4332]' : 'border-gray-100'
                  }`}
                >
                  <div className="relative aspect-square bg-gray-50">
                    <Image
                      src={img.secure_url}
                      alt="Product image"
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-100 px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setPrimary(idx)}
                      title="Set as primary"
                      className={`flex items-center gap-1 text-[11px] font-medium transition ${
                        img.is_primary
                          ? 'text-[#1B4332]'
                          : 'text-gray-400 hover:text-amber-500'
                      }`}
                    >
                      <Star size={12} fill={img.is_primary ? 'currentColor' : 'none'} />
                      {img.is_primary ? 'Primary' : 'Set primary'}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="text-gray-300 hover:text-red-500 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add new image by URL */}
        <div className="rounded-lg border border-dashed border-gray-200 p-4">
          <p className="mb-3 text-xs font-medium text-gray-500">
            Add image by Cloudinary URL
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addImage(); }
              }}
              placeholder="https://res.cloudinary.com/…/image/upload/…"
              className="flex-1 rounded-lg border border-gray-200 px-3.5 py-2 text-sm outline-none placeholder:text-gray-400 focus:border-[#1B4332] focus:ring-2 focus:ring-[#1B4332]/10 transition"
            />
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700"
            >
              <Plus size={15} /> Add
            </button>
          </div>
          <p className="mt-2 text-[11px] text-gray-400">
            Copy the secure URL from the Cloudinary Media Library and paste it above.
          </p>
        </div>
      </section>

      {/* ── Error + Submit ───────────────────────────────── */}
      {error && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-[#1B4332] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#14532d] disabled:opacity-60"
        >
          {loading && <Loader2 size={15} className="animate-spin" />}
          {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Product'}
        </button>
        <a
          href="/admin/products"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
