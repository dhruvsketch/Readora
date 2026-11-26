import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Filter, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { Book } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const BooksPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'title'>('rating');

  const categories = useMemo(() => ReadoraStore.getCategories(), []);
  const allBooks = useMemo(() => ReadoraStore.getBooks().filter(b => b.status === 'published'), []);

  const filteredBooks = useMemo(() => {
    return allBooks
      .filter(b => {
        const matchesSearch = !search || 
          b.title.toLowerCase().includes(search.toLowerCase()) || 
          b.author.toLowerCase().includes(search.toLowerCase()) || 
          b.description.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = categoryFilter === 'all' || b.category_id === categoryFilter;
        const matchesFormat = formatFilter === 'all' || b.format === formatFilter;
        return matchesSearch && matchesCategory && matchesFormat;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.average_rating || 0) - (a.average_rating || 0);
        if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        return a.title.localeCompare(b.title);
      });
  }, [allBooks, search, categoryFilter, formatFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Introduction */}
      <div className="border-b border-readora-border/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Digital Library</span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-readora-ink mt-1">Book Catalogue</h1>
          <p className="text-sm text-readora-muted mt-1 max-w-xl">
            Read authorized open editions, classic philosophy, and foundational literature with our distraction-free reader.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-full md:w-64 relative">
            <Search className="w-4 h-4 text-readora-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search titles or authors..."
              className="w-full pl-9 pr-3 py-2 bg-readora-surface rounded-xl border border-readora-border text-xs focus:outline-none focus:ring-1 focus:ring-readora-forest"
            />
          </div>

          <CTAButton
            to="/discover"
            variant="secondary"
            size="sm"
            shape="pill"
            ctaName="Books Header Explore Library"
            ctaSection="books_header"
          >
            Explore Library
          </CTAButton>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-readora-surface p-4 rounded-2xl border border-readora-border flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <span className="text-readora-muted font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-readora-ivory border border-readora-border rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-readora-muted font-medium">Format:</span>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="bg-readora-ivory border border-readora-border rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="all">All Formats</option>
              <option value="Chapter-based">Chapter-based Reader</option>
              <option value="EPUB">EPUB</option>
              <option value="PDF">PDF</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-readora-muted font-medium">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-readora-ivory border border-readora-border rounded-lg px-2.5 py-1.5 focus:outline-none font-semibold text-readora-forest"
          >
            <option value="rating">Highest Rated</option>
            <option value="newest">Recently Added</option>
            <option value="title">Alphabetical (Title)</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-20 bg-readora-surface rounded-2xl border border-readora-border">
          <BookOpen className="w-12 h-12 text-readora-muted mx-auto mb-3 opacity-50" />
          <h3 className="font-serif text-lg font-bold text-readora-ink">No books found</h3>
          <p className="text-xs text-readora-muted mt-1">Try resetting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-readora-surface rounded-2xl border border-readora-border p-4 shadow-sm hover:shadow-editorial hover:border-readora-forest/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 bg-readora-ivory shadow-book relative">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 text-[10px] font-semibold bg-readora-surface/90 backdrop-blur-sm text-readora-forest px-2 py-0.5 rounded shadow-sm">
                    {book.format}
                  </span>
                </div>

                <div className="flex items-center space-x-1 text-xs text-readora-gold mb-1">
                  <Star className="w-3.5 h-3.5 fill-readora-gold" />
                  <span className="font-semibold text-readora-ink">{book.average_rating || '5.0'}</span>
                  <span className="text-readora-muted text-[11px]">({book.ratings_count || 12})</span>
                </div>

                <h3 className="font-serif font-bold text-base text-readora-ink line-clamp-1 group-hover:text-readora-forest transition-colors">
                  <Link to={`/books/${book.slug || book.id}`}>
                    {book.title}
                  </Link>
                </h3>
                <p className="text-xs text-readora-muted mt-0.5">{book.author}</p>
                <p className="text-xs text-readora-ink/70 line-clamp-2 mt-2 leading-relaxed">
                  {book.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-readora-border/60 flex items-center justify-between gap-2">
                <CTAButton
                  to={`/books/${book.slug || book.id}`}
                  variant="text"
                  size="sm"
                  ctaName={`Books View Details - ${book.title}`}
                  ctaSection="books_grid_card"
                >
                  View Details
                </CTAButton>

                <CTAButton
                  to={book.read_url ? undefined : `/read/${book.id}`}
                  href={book.read_url}
                  target={book.read_url ? "_blank" : undefined}
                  rel={book.read_url ? "noopener noreferrer" : undefined}
                  variant="primary"
                  size="sm"
                  shape="rounded"
                  withArrow
                  ctaName={`Books Read Now - ${book.title}`}
                  ctaSection="books_grid_card"
                >
                  Read Now
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
