'use client';

import { useState, useTransition } from 'react';
import { Plus, Pencil, Trash2, Loader2, FolderKanban } from 'lucide-react';
import { createCategory, updateCategory, deleteCategory } from '@/app/admin/actions';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  product_count: number;
}

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isPending, startTransition] = useTransition();

  // Modal / Form state
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });
  const [error, setError] = useState('');

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setError('');
    setIsOpen(true);
  };

  const handleOpenEdit = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, slug: cat.slug, description: cat.description || '' });
    setError('');
    setIsOpen(true);
  };

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');
    
    // Only auto-generate slug if adding or slug matches auto format
    if (!editingCategory) {
      setFormData((prev) => ({ ...prev, name, slug }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      setError('Name and Slug are required.');
      return;
    }

    setError('');
    startTransition(async () => {
      let res;
      if (editingCategory) {
        res = await updateCategory(editingCategory.id, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res.error) {
        setError(res.error);
      } else {
        setIsOpen(false);
        // Optimistic refresh window reload / server revalidation
        window.location.reload();
      }
    });
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (cat.product_count > 0) {
      alert(`Cannot delete category "${cat.name}" because it contains ${cat.product_count} products. Reassign or delete the products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;

    startTransition(async () => {
      const res = await deleteCategory(cat.id);
      if (res.error) {
        alert(res.error);
      } else {
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Categories Grid / Table */}
      <div className="bg-white border border-neutral-200/80 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-50/80 border-b border-neutral-200/80 text-neutral-500 font-medium">
            <tr>
              <th className="py-3 px-4">Category Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">Products</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200/60">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-neutral-400">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-neutral-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <FolderKanban className="w-4 h-4" />
                    </div>
                    {cat.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-neutral-500">{cat.slug}</td>
                  <td className="py-3.5 px-4 text-neutral-600 max-w-xs truncate">
                    {cat.description || <span className="text-neutral-300 italic">No description</span>}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                      {cat.product_count} {cat.product_count === 1 ? 'product' : 'products'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Edit category"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg hover:bg-neutral-100 transition-colors"
                        title="Delete category"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h2 className="text-lg font-semibold text-neutral-900">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>

            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-600 border border-red-100 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Luxury Sofas"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Slug *</label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g. luxury-sofas"
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional category description..."
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
