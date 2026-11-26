import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Users, 
  Compass, 
  Sparkles, 
  Clock, 
  Star, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { Book, Article, Profile, Category } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const DiscoverPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'all' | 'books' | 'articles' | 'authors'>('all');

  const categories = useMemo(() => ReadoraStore.getCategories(), []);
  const allBooks = useMemo(() => ReadoraStore.getBooks().filter(b => b.status === 'published'), []);
  const allArticles = useMemo(() => ReadoraStore.getArticles().filter(a => a.status === 'published'), []);
  const allAuthors = useMemo(() => ReadoraStore.getProfiles(), []);

  // Filtered lists
  const filteredBooks = useMemo(() => {
    return allBooks.filter(book => {
      const matchCat = selectedCategory === 'all' || book.category_id === selectedCategory;
      const matchQuery = !searchQuery || 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [allBooks, selectedCategory, searchQuery]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(art => {
      const matchCat = selectedCategory === 'all' || art.category_id === selectedCategory;
      const matchQuery = !searchQuery || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (art.excerpt && art.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchQuery;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  const filteredAuthors = useMemo(() => {
    if (!searchQuery) return allAuthors;
    return allAuthors.filter(p => 
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.bio && p.bio.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [allAuthors, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header & Big Search Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">
          Explore the Library
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-readora-ink">
          Discover Books, Essays & Ideas
        </h1>
        <p className="text-sm sm:text-base text-readora-muted max-w-xl mx-auto">
          Explore classic philosophy, digital publications, contemporary essays, and thoughtful literary thinkers.
        </p>

        {/* Search Bar Input */}
        <div className="pt-4 relative max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-readora-muted absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, topic, or keyword..."
              className="w-full pl-12 pr-4 py-3.5 bg-readora-surface rounded-full border border-readora-border shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-readora-forest/20 focus:border-readora-forest"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-readora-muted hover:text-readora-ink"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
            selectedCategory === 'all'
              ? 'bg-readora-forest text-readora-ivory border-readora-forest'
              : 'bg-readora-surface text-readora-ink border-readora-border hover:bg-readora-ivory'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              selectedCategory === cat.id
                ? 'bg-readora-forest text-readora-ivory border-readora-forest'
                : 'bg-readora-surface text-readora-ink border-readora-border hover:bg-readora-ivory'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* View Tabs */}
      <div className="border-b border-readora-border flex space-x-8 text-sm">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 font-medium transition-colors ${
            activeTab === 'all' 
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold' 
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('books')}
          className={`pb-3 font-medium transition-colors ${
            activeTab === 'books' 
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold' 
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Books ({filteredBooks.length})
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 font-medium transition-colors ${
            activeTab === 'articles' 
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold' 
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Articles ({filteredArticles.length})
        </button>
        <button
          onClick={() => setActiveTab('authors')}
          className={`pb-3 font-medium transition-colors ${
            activeTab === 'authors' 
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold' 
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Authors ({filteredAuthors.length})
        </button>
      </div>

      {/* Main Results View */}
      <div className="space-y-12">
        
        {/* Books Section */}
        {(activeTab === 'all' || activeTab === 'books') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-readora-ink flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-readora-forest" />
                Books & Foundational Works
              </h2>
              {activeTab === 'all' && (
                <button 
                  onClick={() => setActiveTab('books')}
                  className="text-xs font-semibold text-readora-forest hover:underline"
                >
                  View All ({filteredBooks.length})
                </button>
              )}
            </div>

            {filteredBooks.length === 0 ? (
              <p className="text-sm text-readora-muted py-6">No books match your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredBooks.slice(0, activeTab === 'all' ? 4 : 16).map(book => (
                  <div 
                    key={book.id}
                    className="bg-readora-surface rounded-2xl border border-readora-border p-4 shadow-sm hover:shadow-editorial hover:border-readora-forest/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-readora-ivory shadow-book">
                        <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
                      </div>
                      <h3 className="font-serif font-bold text-base text-readora-ink line-clamp-1">{book.title}</h3>
                      <p className="text-xs text-readora-muted mt-0.5">{book.author}</p>
                      <p className="text-xs text-readora-ink/70 line-clamp-2 mt-2">{book.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-readora-border/60 flex items-center justify-between gap-2">
                      <CTAButton
                        to={`/books/${book.slug || book.id}`}
                        variant="text"
                        size="sm"
                        ctaName={`Discover View Details - ${book.title}`}
                        ctaSection="discover_book_card"
                      >
                        View Details
                      </CTAButton>
                      <CTAButton
                        to={`/read/${book.id}`}
                        variant="primary"
                        size="sm"
                        shape="rounded"
                        withArrow
                        ctaName={`Discover Read Now - ${book.title}`}
                        ctaSection="discover_book_card"
                      >
                        Read Now
                      </CTAButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Articles Section */}
        {(activeTab === 'all' || activeTab === 'articles') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-readora-ink flex items-center">
                <FileText className="w-5 h-5 mr-2 text-readora-gold" />
                Featured Articles & Essays
              </h2>
              {activeTab === 'all' && (
                <button 
                  onClick={() => setActiveTab('articles')}
                  className="text-xs font-semibold text-readora-forest hover:underline"
                >
                  View All ({filteredArticles.length})
                </button>
              )}
            </div>

            {filteredArticles.length === 0 ? (
              <p className="text-sm text-readora-muted py-6">No articles match your criteria.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredArticles.slice(0, activeTab === 'all' ? 3 : 12).map(art => (
                  <article 
                    key={art.id}
                    className="bg-readora-surface rounded-2xl p-5 border border-readora-border shadow-sm hover:border-readora-forest/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-readora-ivory">
                        <img src={art.cover_image} alt={art.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] font-semibold text-readora-forest uppercase tracking-wider">{art.category?.name || 'Essays'}</span>
                      <h3 className="font-serif font-bold text-base text-readora-ink mt-1 line-clamp-2">
                        <Link to={`/articles/${art.slug || art.id}`} className="hover:text-readora-forest transition-colors">
                          {art.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-readora-muted mt-2 line-clamp-2">{art.excerpt}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-readora-border/60 flex items-center justify-between text-xs text-readora-muted">
                      <span>{art.read_time_minutes} min read</span>
                      <CTAButton
                        to={`/articles/${art.slug || art.id}`}
                        variant="text"
                        size="sm"
                        withArrow
                        ctaName={`Discover Read Article - ${art.title}`}
                        ctaSection="discover_article_card"
                      >
                        Read Article
                      </CTAButton>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Authors Section */}
        {(activeTab === 'all' || activeTab === 'authors') && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-readora-ink flex items-center">
                <Users className="w-5 h-5 mr-2 text-readora-ink" />
                Featured Thinkers & Writers
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredAuthors.map(author => (
                <div 
                  key={author.id}
                  className="bg-readora-surface rounded-2xl p-5 border border-readora-border shadow-sm text-center flex flex-col items-center justify-between"
                >
                  <img 
                    src={author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                    alt={author.full_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-readora-forest/20 mb-3"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-base text-readora-ink">{author.full_name}</h3>
                    <p className="text-xs text-readora-muted">@{author.username}</p>
                    <p className="text-xs text-readora-ink/80 mt-2 line-clamp-2">{author.bio}</p>
                  </div>
                  <Link
                    to={`/authors/${author.username || author.id}`}
                    className="mt-4 text-xs font-semibold text-readora-forest hover:bg-readora-forest/10 px-3 py-1.5 rounded-full border border-readora-forest/30 transition-colors"
                  >
                    View Profile
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};
