import React, { useState, useEffect } from 'react';
import { 
  FolderTree, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle,
  Layers
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { Category } from '../../types/database';

export const AdminCategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  const loadData = () => {
    setCategories(ReadoraStore.getCategories());
  };

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setShowModal(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory(c);
    setName(c.name);
    setSlug(c.slug);
    setDescription(c.description || '');
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    ReadoraStore.saveCategory({
      id: editingCategory?.id,
      name: name.trim(),
      slug: finalSlug,
      description: description.trim(),
    });

    setShowModal(false);
    loadData();
  };

  const handleDelete = (id: string, catName: string) => {
    if (confirm(`Delete category "${catName}"?`)) {
      ReadoraStore.deleteCategory(id);
      loadData();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-readora-border/60 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Taxonomy & Topics</span>
          <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Category Management</h1>
          <p className="text-xs text-readora-muted mt-1">
            Organize the digital library, literary essays, and community topics.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-readora-forest-light transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="bg-readora-surface rounded-2xl border border-readora-border shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-readora-ivory text-readora-muted uppercase font-bold tracking-wider text-[10px] border-b border-readora-border">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Slug</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-readora-border">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-readora-ivory/50 transition-colors">
                <td className="py-3.5 px-4 font-bold text-readora-ink text-sm">{c.name}</td>
                <td className="py-3.5 px-4 font-mono text-readora-muted">/{c.slug}</td>
                <td className="py-3.5 px-4 text-readora-muted max-w-md">{c.description}</td>
                <td className="py-3.5 px-4 text-right space-x-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1 text-readora-muted hover:text-readora-ink"
                  >
                    <Edit className="w-4 h-4 inline" />
                  </button>
                  <button
                    onClick={() => handleDelete(c.id, c.name)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-readora-surface w-full max-w-md rounded-2xl p-6 border border-readora-border shadow-editorial space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-readora-border">
              <h3 className="font-serif font-bold text-lg text-readora-ink">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-readora-muted hover:text-readora-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-readora-ink block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Science & Nature"
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. science-nature (auto-generated if empty)"
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of this genre or discipline..."
                  rows={3}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-readora-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-readora-border rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-readora-forest text-readora-ivory px-4 py-2 rounded-xl font-semibold hover:bg-readora-forest-light"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
