import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Star, 
  Eye, 
  Trash2, 
  Check, 
  X, 
  Edit,
  ArrowRight
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { Article } from '../../types/database';

export const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  const loadData = () => {
    setArticles(ReadoraStore.getArticles());
  };

  const handleToggleFeature = (id: string, current: boolean) => {
    ReadoraStore.saveArticle({ id, is_featured: !current } as any);
    loadData();
  };

  const handleUpdateStatus = (id: string, status: any) => {
    ReadoraStore.saveArticle({ id, status } as any);
    loadData();
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      ReadoraStore.deleteArticle(id);
      loadData();
    }
  };

  const filtered = articles.filter(a => {
    const matchesSearch = !search || 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      (a.author?.full_name && a.author.full_name.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-readora-border/60 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Journal & Editorial</span>
          <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Article Management</h1>
          <p className="text-xs text-readora-muted mt-1">
            Review submitted articles, feature pieces on the homepage, and archive content.
          </p>
        </div>

        <Link
          to="/write"
          className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-readora-forest-light transition-all shadow-sm self-start sm:self-auto"
        >
          <span>Write New Editorial</span>
        </Link>
      </div>

      <div className="bg-readora-surface rounded-2xl border border-readora-border shadow-sm overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-readora-border flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-readora-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full pl-9 pr-3 py-1.5 bg-readora-ivory rounded-xl border border-readora-border focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-readora-muted font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-readora-ivory border border-readora-border rounded-lg px-2.5 py-1 focus:outline-none"
            >
              <option value="all">All ({articles.length})</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-readora-ivory text-readora-muted uppercase font-bold tracking-wider text-[10px] border-b border-readora-border">
              <tr>
                <th className="py-3 px-4">Title</th>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-readora-border">
              {filtered.map((art) => (
                <tr key={art.id} className="hover:bg-readora-ivory/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-serif font-bold text-sm text-readora-ink">{art.title}</p>
                    <span className="text-[10px] text-readora-muted">{art.read_time_minutes} min • {new Date(art.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-readora-ink">{art.author?.full_name || 'Author'}</td>
                  <td className="py-3.5 px-4 text-readora-muted">{art.category?.name || 'Essays'}</td>
                  <td className="py-3.5 px-4">
                    <select
                      value={art.status}
                      onChange={(e) => handleUpdateStatus(art.id, e.target.value)}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${
                        art.status === 'published' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleFeature(art.id, art.is_featured)}
                      className={`p-1 rounded ${art.is_featured ? 'text-readora-gold' : 'text-readora-muted'}`}
                      title="Toggle Homepage Feature"
                    >
                      <Star className={`w-4 h-4 ${art.is_featured ? 'fill-readora-gold' : ''}`} />
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <Link
                      to={`/articles/${art.slug || art.id}`}
                      className="p-1 text-readora-forest hover:underline font-semibold"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit/${art.id}`}
                      className="p-1 text-readora-muted hover:text-readora-ink"
                    >
                      <Edit className="w-4 h-4 inline" />
                    </Link>
                    <button
                      onClick={() => handleDelete(art.id, art.title)}
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

      </div>

    </div>
  );
};
