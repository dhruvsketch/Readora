import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Book, FileText, User, X, ArrowRight } from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { Book as BookType, Article, Profile } from '../../types/database';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    books: BookType[];
    articles: Article[];
    authors: Profile[];
  }>({ books: [], articles: [], authors: [] });
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ books: [], articles: [], authors: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger handled in parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ books: [], articles: [], authors: [] });
      return;
    }

    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const allBooks = ReadoraStore.getBooks().filter(b => b.status === 'published');
      const allArticles = ReadoraStore.getArticles().filter(a => a.status === 'published');
      const allProfiles = ReadoraStore.getProfiles();

      const matchedBooks = allBooks.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.author.toLowerCase().includes(q) || 
        b.description.toLowerCase().includes(q)
      ).slice(0, 4);

      const matchedArticles = allArticles.filter(a => 
        a.title.toLowerCase().includes(q) || 
        (a.excerpt && a.excerpt.toLowerCase().includes(q)) || 
        a.tags.some(t => t.toLowerCase().includes(q))
      ).slice(0, 4);

      const matchedAuthors = allProfiles.filter(p => 
        p.full_name.toLowerCase().includes(q) || 
        p.username.toLowerCase().includes(q) || 
        (p.bio && p.bio.toLowerCase().includes(q))
      ).slice(0, 3);

      setResults({
        books: matchedBooks,
        articles: matchedArticles,
        authors: matchedAuthors,
      });
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.books.length + results.articles.length + results.authors.length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-readora-ink/40 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div 
        className="relative bg-readora-surface w-full max-w-2xl rounded-2xl shadow-editorial border border-readora-border overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-readora-border">
          <Search className="w-5 h-5 text-readora-muted mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books, chapters, articles, topics, or authors..."
            className="flex-1 bg-transparent text-sm sm:text-base text-readora-ink placeholder:text-readora-muted/60 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-readora-muted hover:text-readora-ink">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline text-[10px] bg-readora-ivory px-2 py-0.5 rounded border border-readora-border text-readora-muted ml-2">ESC</kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {query && totalResults === 0 && (
            <div className="text-center py-10">
              <p className="text-sm text-readora-muted">No results found for "{query}".</p>
              <p className="text-xs text-readora-muted/80 mt-1">Try searching by author name, book title, or topic tags.</p>
            </div>
          )}

          {!query && (
            <div className="py-6 text-center">
              <p className="text-xs text-readora-muted uppercase tracking-wider font-semibold">Suggested Topics</p>
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {['Philosophy', 'Stoicism', 'Solitude', 'Technology', 'Libraries', 'Marcus Aurelius', 'Reading Habits'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="text-xs bg-readora-ivory hover:bg-readora-border/60 text-readora-ink px-3 py-1 rounded-full transition-colors border border-readora-border/60"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Books */}
          {results.books.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-readora-muted uppercase tracking-wider flex items-center">
                  <Book className="w-3.5 h-3.5 mr-1.5 text-readora-forest" /> Books ({results.books.length})
                </span>
              </div>
              <div className="space-y-2">
                {results.books.map(b => (
                  <div
                    key={b.id}
                    onClick={() => {
                      onClose();
                      navigate(`/books/${b.slug || b.id}`);
                    }}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-readora-ivory cursor-pointer transition-colors"
                  >
                    <img src={b.cover_image} alt={b.title} className="w-10 h-14 object-cover rounded shadow-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-serif font-semibold text-readora-ink truncate">{b.title}</p>
                      <p className="text-xs text-readora-muted">{b.author} • {b.format}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-readora-muted opacity-0 group-hover:opacity-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {results.articles.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-readora-muted uppercase tracking-wider flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1.5 text-readora-gold" /> Articles & Essays ({results.articles.length})
                </span>
              </div>
              <div className="space-y-2">
                {results.articles.map(a => (
                  <div
                    key={a.id}
                    onClick={() => {
                      onClose();
                      navigate(`/articles/${a.slug || a.id}`);
                    }}
                    className="p-2.5 rounded-xl hover:bg-readora-ivory cursor-pointer transition-colors"
                  >
                    <p className="text-sm font-serif font-semibold text-readora-ink">{a.title}</p>
                    <p className="text-xs text-readora-muted line-clamp-1 mt-0.5">{a.excerpt}</p>
                    <div className="flex items-center space-x-2 mt-1 text-[11px] text-readora-muted">
                      <span>{a.read_time_minutes} min read</span>
                      <span>•</span>
                      <span>{a.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Authors */}
          {results.authors.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-readora-muted uppercase tracking-wider flex items-center">
                  <User className="w-3.5 h-3.5 mr-1.5 text-readora-ink" /> Authors & Creators ({results.authors.length})
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {results.authors.map(p => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onClose();
                      navigate(`/authors/${p.username || p.id}`);
                    }}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-readora-ivory cursor-pointer transition-colors"
                  >
                    <img src={p.avatar_url} alt={p.full_name} className="w-9 h-9 rounded-full object-cover border border-readora-border" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-readora-ink truncate">{p.full_name}</p>
                      <p className="text-[11px] text-readora-muted truncate">@{p.username}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
