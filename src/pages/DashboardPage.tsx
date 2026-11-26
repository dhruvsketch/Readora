import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Repeat, 
  Bookmark, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  Heart, 
  MessageSquare, 
  ArrowRight,
  Settings,
  PenTool
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReadoraStore } from '../lib/store';
import { ReadingProgress, Article, Bookmark as BookmarkType, BorrowingRequest } from '../types/database';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  const [readingHistory, setReadingHistory] = useState<ReadingProgress[]>([]);
  const [myArticles, setMyArticles] = useState<Article[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [borrowings, setBorrowings] = useState<BorrowingRequest[]>([]);

  useEffect(() => {
    if (user) {
      setReadingHistory(ReadoraStore.getUserReadingHistory(user.id));
      setMyArticles(ReadoraStore.getArticles().filter(a => a.author_id === user.id));
      setBookmarks(ReadoraStore.getBookmarks(user.id));
      setBorrowings(ReadoraStore.getBorrowingRequests(user.id));
    }
  }, [user]);

  if (!user) return null;

  const publishedCount = myArticles.filter(a => a.status === 'published').length;
  const draftsCount = myArticles.filter(a => a.status === 'draft').length;
  const totalViews = myArticles.reduce((sum, a) => sum + (a.views_count || 0), 0);
  const totalLikes = myArticles.reduce((sum, a) => sum + (a.likes_count || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Profile Welcome Header */}
      <div className="bg-readora-surface rounded-3xl p-6 sm:p-8 border border-readora-border shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
            alt={user.full_name}
            className="w-16 h-16 rounded-full object-cover border-2 border-readora-forest/20 shadow-sm"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-readora-ink">{user.full_name}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-readora-forest bg-readora-forest/10 px-2.5 py-0.5 rounded">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-readora-muted mt-0.5">@{user.username} • Member since {new Date(user.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/write"
            className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-readora-forest-light transition-all shadow-sm"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>New Article</span>
          </Link>

          <Link
            to="/settings"
            className="inline-flex items-center space-x-1.5 bg-readora-ivory hover:bg-readora-border/60 text-readora-ink px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-readora-border transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm space-y-1">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <BookOpen className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Books in Progress
          </span>
          <p className="font-serif text-2xl font-bold text-readora-ink">{readingHistory.length}</p>
        </div>

        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm space-y-1">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <FileText className="w-3.5 h-3.5 mr-1 text-readora-gold" /> Published Articles
          </span>
          <p className="font-serif text-2xl font-bold text-readora-ink">{publishedCount}</p>
        </div>

        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm space-y-1">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <Heart className="w-3.5 h-3.5 mr-1 text-red-500" /> Article Likes Received
          </span>
          <p className="font-serif text-2xl font-bold text-readora-ink">{totalLikes}</p>
        </div>

        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm space-y-1">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <Repeat className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Active Book Loans
          </span>
          <p className="font-serif text-2xl font-bold text-readora-ink">
            {borrowings.filter(b => b.status === 'accepted' || b.status === 'borrowed').length}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Currently Reading & Bookmarks */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Currently Reading */}
          <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-readora-border/60 pb-3">
              <h2 className="font-serif font-bold text-lg text-readora-ink flex items-center">
                <BookOpen className="w-4 h-4 mr-2 text-readora-forest" /> Currently Reading
              </h2>
              <Link to="/my-library" className="text-xs font-semibold text-readora-forest hover:underline">
                View All →
              </Link>
            </div>

            {readingHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-readora-muted">No books in progress.</p>
                <Link to="/books" className="text-xs font-semibold text-readora-forest hover:underline mt-1 inline-block">
                  Discover a book to read →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {readingHistory.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-readora-ivory rounded-xl border border-readora-border/60">
                    <img
                      src={item.book?.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=150&q=80'}
                      alt={item.book?.title}
                      className="w-12 h-18 object-cover rounded shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-serif font-bold text-sm text-readora-ink truncate">{item.book?.title}</h4>
                      <p className="text-[11px] text-readora-muted">{item.chapter?.title || 'Chapter in progress'}</p>
                      <div className="w-full bg-readora-border rounded-full h-1.5 overflow-hidden mt-2">
                        <div className="bg-readora-forest h-1.5 rounded-full" style={{ width: `${item.progress_percent}%` }} />
                      </div>
                    </div>
                    <Link
                      to={`/read/${item.book_id}`}
                      className="text-xs font-semibold bg-readora-forest text-readora-ivory px-3 py-1.5 rounded-lg hover:bg-readora-forest-light transition-colors"
                    >
                      Resume
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bookmarks & Saved */}
          <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-readora-border/60 pb-3">
              <h2 className="font-serif font-bold text-lg text-readora-ink flex items-center">
                <Bookmark className="w-4 h-4 mr-2 text-readora-gold" /> Saved Bookmarks ({bookmarks.length})
              </h2>
            </div>

            {bookmarks.length === 0 ? (
              <p className="text-xs text-readora-muted text-center py-6">No saved bookmarks yet.</p>
            ) : (
              <div className="space-y-2">
                {bookmarks.slice(0, 5).map((b) => (
                  <div key={b.id} className="p-3 bg-readora-ivory rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-readora-ink">{b.label}</p>
                      <span className="text-[10px] text-readora-muted">Saved on {new Date(b.created_at).toLocaleDateString()}</span>
                    </div>
                    <Link
                      to={b.book_id ? `/books/${b.book_id}` : `/articles/${b.article_id}`}
                      className="text-xs font-semibold text-readora-forest hover:underline"
                    >
                      Open
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Writing & Articles */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-readora-border/60 pb-3">
              <h2 className="font-serif font-bold text-lg text-readora-ink flex items-center">
                <FileText className="w-4 h-4 mr-2 text-readora-forest" /> Your Articles ({myArticles.length})
              </h2>
              <Link to="/write" className="text-xs font-semibold text-readora-forest hover:underline">
                + Write
              </Link>
            </div>

            {myArticles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-readora-muted">You haven't written any articles yet.</p>
                <Link to="/write" className="text-xs font-semibold text-readora-forest hover:underline mt-1 inline-block">
                  Write your first essay →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {myArticles.map((art) => (
                  <div key={art.id} className="p-3 bg-readora-ivory rounded-xl border border-readora-border/60 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        art.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {art.status}
                      </span>
                      <span className="text-readora-muted text-[10px]">{art.read_time_minutes} min read</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-readora-ink">{art.title}</h4>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-readora-muted text-[10px]">{art.likes_count || 0} Likes</span>
                      <div className="flex space-x-2">
                        <Link to={`/edit/${art.id}`} className="text-readora-muted hover:text-readora-ink font-semibold">
                          Edit
                        </Link>
                        {art.status === 'published' && (
                          <Link to={`/articles/${art.slug || art.id}`} className="text-readora-forest hover:underline font-semibold">
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Borrowing Snapshot */}
          <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-readora-border/60 pb-3">
              <h2 className="font-serif font-bold text-lg text-readora-ink flex items-center">
                <Repeat className="w-4 h-4 mr-2 text-readora-forest" /> Book Lending
              </h2>
              <Link to="/borrowed" className="text-xs font-semibold text-readora-forest hover:underline">
                Manage →
              </Link>
            </div>

            {borrowings.length === 0 ? (
              <p className="text-xs text-readora-muted text-center py-4">No active lending transactions.</p>
            ) : (
              <div className="space-y-2">
                {borrowings.slice(0, 3).map((b) => (
                  <div key={b.id} className="p-2.5 bg-readora-ivory rounded-xl text-xs space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-bold text-readora-ink">{b.listing?.title}</span>
                      <span className="text-readora-forest font-semibold">{b.status}</span>
                    </div>
                    <p className="text-[11px] text-readora-muted">
                      {b.borrower_id === user.id ? `From ${b.lender?.full_name}` : `To ${b.borrower?.full_name}`}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
