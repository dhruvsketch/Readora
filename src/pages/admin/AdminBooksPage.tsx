import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Star, 
  CheckCircle, 
  X, 
  Layers, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { Book, Category } from '../../types/database';

export const AdminBooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('c1');
  const [language, setLanguage] = useState('English');
  const [publisher, setPublisher] = useState('');
  const [publicationDate, setPublicationDate] = useState('2025-01-01');
  const [format, setFormat] = useState<'Chapter-based' | 'EPUB' | 'PDF'>('Chapter-based');
  const [license, setLicense] = useState('Public Domain');
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [readingPermissions, setReadingPermissions] = useState<'public' | 'members' | 'premium'>('public');

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  const loadData = () => {
    setBooks(ReadoraStore.getBooks());
    setCategories(ReadoraStore.getCategories());
  };

  const handleOpenCreate = () => {
    setEditingBook(null);
    setTitle('');
    setAuthor('');
    setDescription('');
    setCoverImage('https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80');
    setCategoryId('c1');
    setLanguage('English');
    setPublisher('Readora Editions');
    setPublicationDate('2025-01-01');
    setFormat('Chapter-based');
    setLicense('Public Domain');
    setStatus('published');
    setIsFeatured(false);
    setReadingPermissions('public');
    setShowModal(true);
  };

  const handleOpenEdit = (b: Book) => {
    setEditingBook(b);
    setTitle(b.title);
    setAuthor(b.author);
    setDescription(b.description);
    setCoverImage(b.cover_image);
    setCategoryId(b.category_id || 'c1');
    setLanguage(b.language);
    setPublisher(b.publisher || '');
    setPublicationDate(b.publication_date || '');
    setFormat(b.format);
    setLicense(b.license);
    setStatus(b.status);
    setIsFeatured(b.is_featured);
    setReadingPermissions(b.reading_permissions);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) return;

    ReadoraStore.saveBook({
      id: editingBook?.id,
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      cover_image: coverImage.trim(),
      category_id: categoryId,
      language,
      publisher: publisher.trim(),
      publication_date: publicationDate,
      format,
      license,
      status,
      is_featured: isFeatured,
      reading_permissions: readingPermissions,
    });

    setShowModal(false);
    loadData();
  };

  const handleDelete = (id: string, bookTitle: string) => {
    if (confirm(`Are you sure you want to delete "${bookTitle}" and all its chapters?`)) {
      ReadoraStore.deleteBook(id);
      loadData();
    }
  };

  const filtered = books.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) || 
    b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Title & Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-readora-border/60 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Catalogue Management</span>
          <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Books & Works</h1>
          <p className="text-xs text-readora-muted mt-1">
            Add books, configure licensing, manage covers, and assign chapters.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-readora-forest-light transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Book</span>
        </button>
      </div>

      {/* Search and Table */}
      <div className="bg-readora-surface rounded-2xl border border-readora-border shadow-sm overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-readora-border flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-readora-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books by title or author..."
              className="w-full pl-9 pr-3 py-1.5 bg-readora-ivory rounded-xl border border-readora-border text-xs focus:outline-none"
            />
          </div>
          <span className="text-xs text-readora-muted">{filtered.length} total books</span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-readora-ivory text-readora-muted uppercase font-bold tracking-wider text-[10px] border-b border-readora-border">
              <tr>
                <th className="py-3 px-4">Book</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Format</th>
                <th className="py-3 px-4">Licensing</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-readora-border">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-readora-ivory/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img src={b.cover_image} alt={b.title} className="w-9 h-12 object-cover rounded shadow-sm" />
                      <div>
                        <Link to={`/books/${b.slug || b.id}`} className="font-serif font-bold text-sm text-readora-ink hover:underline">
                          {b.title}
                        </Link>
                        <p className="text-[10px] text-readora-muted">Slug: /{b.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-readora-ink">{b.author}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-readora-ivory px-2 py-0.5 rounded text-[11px] border border-readora-border">
                      {b.format}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-readora-muted">{b.license}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      b.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {b.is_featured ? (
                      <span className="text-readora-gold font-bold flex items-center">
                        <Star className="w-3.5 h-3.5 fill-readora-gold mr-1" /> Yes
                      </span>
                    ) : (
                      <span className="text-readora-muted">No</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/admin/chapters?bookId=${b.id}`}
                      className="p-1 text-readora-forest hover:underline font-semibold"
                      title="Manage Chapters"
                    >
                      Chapters ({b.chapters_count || 0})
                    </Link>
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1 text-readora-muted hover:text-readora-ink transition-colors"
                      title="Edit book"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                      title="Delete book"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Book Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-readora-surface w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-readora-border shadow-editorial space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-readora-border">
              <h3 className="font-serif font-bold text-xl text-readora-ink">
                {editingBook ? 'Edit Book Details' : 'Add New Book'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-readora-muted hover:text-readora-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Book Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  >
                    <option value="Chapter-based">Chapter-based Reader</option>
                    <option value="EPUB">EPUB</option>
                    <option value="PDF">PDF</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Licensing</label>
                  <input
                    type="text"
                    value={license}
                    onChange={(e) => setLicense(e.target.value)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Permissions</label>
                  <select
                    value={readingPermissions}
                    onChange={(e) => setReadingPermissions(e.target.value as any)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  >
                    <option value="public">Public</option>
                    <option value="members">Members Only</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_featured_cb"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded text-readora-forest"
                  />
                  <label htmlFor="is_featured_cb" className="font-semibold text-readora-ink">
                    Feature on Homepage
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-readora-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-readora-border rounded-xl text-readora-ink font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-readora-forest text-readora-ivory px-5 py-2 rounded-xl font-semibold hover:bg-readora-forest-light"
                >
                  Save Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
