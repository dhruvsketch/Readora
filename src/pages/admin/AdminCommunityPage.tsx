import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  EyeOff, 
  Eye, 
  Trash2, 
  CheckCircle, 
  AlertTriangle 
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { CommunityPost } from '../../types/database';

export const AdminCommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  const loadData = () => {
    setPosts(ReadoraStore.getPosts());
  };

  const handleUpdateStatus = (id: string, status: any) => {
    const all = ReadoraStore.getPosts();
    const p = all.find(x => x.id === id);
    if (p) {
      p.status = status;
      localStorage.setItem('readora_posts', JSON.stringify(all));
      window.dispatchEvent(new Event('readora_storage_change'));
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Permanently delete this community post?')) {
      ReadoraStore.deletePost(id);
      loadData();
    }
  };

  const filtered = posts.filter(p => {
    const matchSearch = !search || 
      p.content.toLowerCase().includes(search.toLowerCase()) || 
      (p.author?.full_name && p.author.full_name.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl">
      
      <div className="border-b border-readora-border/60 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Community Oversight</span>
        <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Community Feed Moderation</h1>
        <p className="text-xs text-readora-muted mt-1">
          Review user reflections, hide violating posts, restore flagged entries, and manage discourse.
        </p>
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
              placeholder="Search post text or author..."
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
              <option value="all">All Posts ({posts.length})</option>
              <option value="published">Published</option>
              <option value="under_review">Under Review</option>
              <option value="hidden">Hidden</option>
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-readora-ivory text-readora-muted uppercase font-bold tracking-wider text-[10px] border-b border-readora-border">
              <tr>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Content Snippet</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Engagement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-readora-border">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-readora-ivory/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-2">
                      <img
                        src={post.author?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'}
                        alt="Author"
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-semibold text-readora-ink">{post.author?.full_name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 max-w-sm">
                    <p className="font-serif italic text-readora-ink line-clamp-2">"{post.content}"</p>
                    <span className="text-[10px] text-readora-muted">{new Date(post.created_at).toLocaleDateString()}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="bg-readora-ivory px-2 py-0.5 rounded text-[10px] uppercase font-bold text-readora-forest">
                      {post.post_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-readora-muted">
                    {post.likes_count || 0} Likes • {post.comments_count || 0} Comments
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      post.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                      post.status === 'hidden' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {post.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {post.status === 'published' ? (
                      <button
                        onClick={() => handleUpdateStatus(post.id, 'hidden')}
                        className="p-1 text-amber-700 hover:underline font-semibold"
                        title="Hide from feed"
                      >
                        Hide
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(post.id, 'published')}
                        className="p-1 text-emerald-700 hover:underline font-semibold"
                        title="Restore to feed"
                      >
                        Restore
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Permanently Delete"
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
