import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Layers, 
  FileText, 
  MessageSquare, 
  AlertTriangle, 
  Repeat, 
  ArrowRight,
  Plus,
  ShieldCheck,
  CheckCircle,
  Clock
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';

export const AdminOverviewPage: React.FC = () => {
  const [metrics, setMetrics] = useState(ReadoraStore.getMetrics());

  useEffect(() => {
    const handleUpdate = () => setMetrics(ReadoraStore.getMetrics());
    window.addEventListener('readora_storage_change', handleUpdate);
    return () => window.removeEventListener('readora_storage_change', handleUpdate);
  }, []);

  const stats = [
    { label: 'Registered Users', value: metrics.totalUsers, icon: Users, to: '/admin/users', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Published Books', value: metrics.publishedBooks, icon: BookOpen, to: '/admin/books', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { label: 'Book Chapters', value: metrics.publishedChapters, icon: Layers, to: '/admin/chapters', color: 'text-amber-700', bg: 'bg-amber-50' },
    { label: 'Published Articles', value: metrics.publishedArticles, icon: FileText, to: '/admin/articles', color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Community Posts', value: metrics.communityPosts, icon: MessageSquare, to: '/admin/community', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Pending Reports', value: metrics.pendingReports, icon: AlertTriangle, to: '/admin/reports', color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Active Loans', value: metrics.activeBorrowings, icon: Repeat, to: '/admin/borrowings', color: 'text-cyan-700', bg: 'bg-cyan-50' },
    { label: 'Article Drafts', value: metrics.draftArticles, icon: Clock, to: '/admin/articles', color: 'text-stone-600', bg: 'bg-stone-100' },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-readora-border/60 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Administration Console</span>
          <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Platform Overview</h1>
          <p className="text-xs text-readora-muted mt-1">
            Real database metrics, active moderation alerts, and administrative shortcuts.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/books"
            className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-4 py-2 rounded-xl text-xs font-semibold hover:bg-readora-forest-light transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Book</span>
          </Link>
          <Link
            to="/admin/chapters"
            className="inline-flex items-center space-x-1.5 bg-readora-surface border border-readora-border hover:bg-readora-ivory text-readora-ink px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Chapter</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              to={s.to}
              className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm hover:shadow-editorial hover:border-readora-forest/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-readora-muted">{s.label}</span>
                <div className={`p-2 rounded-xl ${s.bg}`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="font-serif text-3xl font-bold text-readora-ink">{s.value}</span>
                <ArrowRight className="w-3.5 h-3.5 text-readora-muted group-hover:translate-x-1 group-hover:text-readora-forest transition-all" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Content Management Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Editorial Operations */}
        <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-lg text-readora-ink flex items-center">
            <BookOpen className="w-4 h-4 mr-2 text-readora-forest" /> Content Operations
          </h2>
          <div className="space-y-2 text-xs">
            <Link to="/admin/books" className="p-3 bg-readora-ivory rounded-xl flex items-center justify-between hover:bg-readora-border/60 transition-colors">
              <div>
                <p className="font-bold text-readora-ink">Manage Books & Editions</p>
                <p className="text-[11px] text-readora-muted">Add titles, upload covers, configure reading permissions & licensing</p>
              </div>
              <ArrowRight className="w-4 h-4 text-readora-muted" />
            </Link>

            <Link to="/admin/chapters" className="p-3 bg-readora-ivory rounded-xl flex items-center justify-between hover:bg-readora-border/60 transition-colors">
              <div>
                <p className="font-bold text-readora-ink">Manage Book Chapters & Volumes</p>
                <p className="text-[11px] text-readora-muted">Draft chapters, reorder sequences, edit full-text reader content</p>
              </div>
              <ArrowRight className="w-4 h-4 text-readora-muted" />
            </Link>

            <Link to="/admin/articles" className="p-3 bg-readora-ivory rounded-xl flex items-center justify-between hover:bg-readora-border/60 transition-colors">
              <div>
                <p className="font-bold text-readora-ink">Review & Feature Articles</p>
                <p className="text-[11px] text-readora-muted">Approve essays, feature stories on homepage, manage editorial journal</p>
              </div>
              <ArrowRight className="w-4 h-4 text-readora-muted" />
            </Link>
          </div>
        </div>

        {/* Moderation & Governance */}
        <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-lg text-readora-ink flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-readora-gold" /> Moderation & Governance
          </h2>
          <div className="space-y-2 text-xs">
            <Link to="/admin/reports" className="p-3 bg-readora-ivory rounded-xl flex items-center justify-between hover:bg-readora-border/60 transition-colors">
              <div>
                <p className="font-bold text-readora-ink">Pending Community Reports ({metrics.pendingReports})</p>
                <p className="text-[11px] text-readora-muted">Review reported content, record moderation verdicts & actions</p>
              </div>
              <ArrowRight className="w-4 h-4 text-readora-muted" />
            </Link>

            <Link to="/admin/community" className="p-3 bg-readora-ivory rounded-xl flex items-center justify-between hover:bg-readora-border/60 transition-colors">
              <div>
                <p className="font-bold text-readora-ink">Community Feed Moderation</p>
                <p className="text-[11px] text-readora-muted">Hide inappropriate reflections, manage spam, feature discussions</p>
              </div>
              <ArrowRight className="w-4 h-4 text-readora-muted" />
            </Link>

            <Link to="/admin/users" className="p-3 bg-readora-ivory rounded-xl flex items-center justify-between hover:bg-readora-border/60 transition-colors">
              <div>
                <p className="font-bold text-readora-ink">User Directory & Roles</p>
                <p className="text-[11px] text-readora-muted">Inspect account timestamps, assign moderator privileges, suspend abusive accounts</p>
              </div>
              <ArrowRight className="w-4 h-4 text-readora-muted" />
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};
