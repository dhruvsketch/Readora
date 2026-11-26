import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Library, 
  Bookmark, 
  Clock, 
  MessageSquare, 
  Trash2, 
  ArrowRight, 
  BookOpen 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReadoraStore } from '../lib/store';
import { ReadingProgress, Bookmark as BookmarkType, PrivateNote } from '../types/database';

export const MyLibraryPage: React.FC = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState<'reading' | 'bookmarks' | 'notes'>('reading');

  const [history, setHistory] = useState<ReadingProgress[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>([]);
  const [notes, setNotes] = useState<PrivateNote[]>([]);

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, [user]);

  const loadData = () => {
    if (!user) return;
    setHistory(ReadoraStore.getUserReadingHistory(user.id));
    setBookmarks(ReadoraStore.getBookmarks(user.id));
    setNotes(ReadoraStore.getPrivateNotes(user.id));
  };

  const handleDeleteNote = (noteId: string) => {
    ReadoraStore.deletePrivateNote(noteId);
    loadData();
  };

  const handleRemoveBookmark = (b: BookmarkType) => {
    if (!user) return;
    ReadoraStore.toggleBookmark(user.id, {
      bookId: b.book_id,
      articleId: b.article_id,
    });
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-readora-border/60 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Personal Shelf</span>
          <h1 className="font-serif text-3xl font-bold text-readora-ink mt-1">My Reading Library</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-readora-border space-x-8 text-sm">
        <button
          onClick={() => setTab('reading')}
          className={`pb-3 font-medium transition-colors ${
            tab === 'reading'
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold'
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Reading Progress ({history.length})
        </button>
        <button
          onClick={() => setTab('bookmarks')}
          className={`pb-3 font-medium transition-colors ${
            tab === 'bookmarks'
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold'
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Saved Bookmarks ({bookmarks.length})
        </button>
        <button
          onClick={() => setTab('notes')}
          className={`pb-3 font-medium transition-colors ${
            tab === 'notes'
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold'
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Private Notes & Quotes ({notes.length})
        </button>
      </div>

      {/* Tab 1: Reading Progress */}
      {tab === 'reading' && (
        <div>
          {history.length === 0 ? (
            <div className="text-center py-16 bg-readora-surface rounded-2xl border border-readora-border">
              <BookOpen className="w-12 h-12 text-readora-muted mx-auto mb-2 opacity-40" />
              <p className="text-sm font-serif text-readora-ink font-semibold">Your shelf is quiet.</p>
              <p className="text-xs text-readora-muted mt-1">Start reading any book in our catalogue and your progress will appear here.</p>
              <Link to="/books" className="mt-4 inline-flex items-center text-xs font-semibold text-readora-forest hover:underline">
                Explore Catalogue →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-readora-surface rounded-2xl p-5 border border-readora-border shadow-sm flex items-center space-x-5"
                >
                  <img
                    src={item.book?.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                    alt={item.book?.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-sm flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-2">
                    <div>
                      <h3 className="font-serif font-bold text-base text-readora-ink truncate">{item.book?.title}</h3>
                      <p className="text-xs text-readora-muted">{item.book?.author}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-readora-muted">
                        <span>Progress</span>
                        <span className="font-semibold text-readora-forest">{Math.round(item.progress_percent)}%</span>
                      </div>
                      <div className="w-full bg-readora-ivory rounded-full h-1.5 overflow-hidden border border-readora-border/60">
                        <div className="bg-readora-forest h-1.5 rounded-full" style={{ width: `${item.progress_percent}%` }} />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[10px] text-readora-muted">
                        Updated {new Date(item.updated_at).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/read/${item.book_id}`}
                        className="text-xs font-semibold text-readora-forest hover:underline inline-flex items-center"
                      >
                        Resume <ArrowRight className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Bookmarks */}
      {tab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="text-center py-16 bg-readora-surface rounded-2xl border border-readora-border text-xs text-readora-muted">
              No saved bookmarks. Click bookmark on any book or article to save it for later.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookmarks.map((b) => (
                <div key={b.id} className="bg-readora-surface p-4 rounded-xl border border-readora-border flex items-center justify-between text-xs">
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-readora-forest">
                      {b.book_id ? 'Book Bookmark' : 'Article Bookmark'}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-readora-ink truncate">{b.label}</h4>
                    <span className="text-[10px] text-readora-muted block">{new Date(b.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center space-x-3 flex-shrink-0">
                    <Link
                      to={b.book_id ? `/books/${b.book_id}` : `/articles/${b.article_id}`}
                      className="font-semibold text-readora-forest hover:underline"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => handleRemoveBookmark(b)}
                      className="p-1 text-readora-muted hover:text-red-600 transition-colors"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Notes */}
      {tab === 'notes' && (
        <div>
          {notes.length === 0 ? (
            <div className="text-center py-16 bg-readora-surface rounded-2xl border border-readora-border text-xs text-readora-muted">
              No private notes recorded. Highlight text while using the Digital Reader to save personal reflections.
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((n) => (
                <div key={n.id} className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-readora-muted">{new Date(n.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={() => handleDeleteNote(n.id)}
                      className="text-readora-muted hover:text-red-600 transition-colors"
                      title="Delete note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {n.selected_text && (
                    <blockquote className="border-l-2 border-readora-gold pl-3 py-1 font-serif italic text-readora-ink/80 bg-readora-ivory/60 rounded-r">
                      "{n.selected_text}"
                    </blockquote>
                  )}

                  <p className="font-medium text-readora-ink pt-1 text-sm font-sans">{n.note_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
