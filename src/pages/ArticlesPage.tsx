import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Clock, Tag, ArrowRight, PenTool, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReadoraStore } from '../lib/store';
import { Article, Category } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const ArticlesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = useMemo(() => ReadoraStore.getCategories(), []);
  const allArticles = useMemo(() => ReadoraStore.getArticles().filter(a => a.status === 'published'), []);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(art => {
      const matchSearch = !search || 
        art.title.toLowerCase().includes(search.toLowerCase()) || 
        (art.excerpt && art.excerpt.toLowerCase().includes(search.toLowerCase())) ||
        art.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = categoryFilter === 'all' || art.category_id === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [allArticles, search, categoryFilter]);

  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Editorial Title & Actions */}
      <div className="border-b border-readora-border/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-gold">Literary Journal & Essays</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-readora-ink mt-1">Articles Worth Reading</h1>
          <p className="text-sm text-readora-muted mt-1 max-w-xl">
            Thoughtful long-form essays, literary critiques, intellectual reflections, and cultural discourse.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-full sm:w-56 md:w-64 relative">
            <Search className="w-4 h-4 text-readora-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search essays or tags..."
              className="w-full pl-9 pr-3 py-2 bg-readora-surface rounded-xl border border-readora-border text-xs focus:outline-none focus:ring-1 focus:ring-readora-forest"
            />
          </div>

          <CTAButton
            to={isAuthenticated ? '/write' : '/login'}
            state={isAuthenticated ? undefined : { from: { pathname: '/write' } }}
            variant="primary"
            size="sm"
            shape="pill"
            icon={<PenTool className="w-3.5 h-3.5" />}
            ctaName="Articles Header Start Writing"
            ctaSection="articles_header"
          >
            Start Writing
          </CTAButton>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setCategoryFilter('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
            categoryFilter === 'all'
              ? 'bg-readora-forest text-readora-ivory border-readora-forest'
              : 'bg-readora-surface text-readora-ink border-readora-border hover:bg-readora-ivory'
          }`}
        >
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryFilter(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border ${
              categoryFilter === cat.id
                ? 'bg-readora-forest text-readora-ivory border-readora-forest'
                : 'bg-readora-surface text-readora-ink border-readora-border hover:bg-readora-ivory'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-readora-surface rounded-2xl border border-readora-border">
          <FileText className="w-12 h-12 text-readora-muted mx-auto mb-3 opacity-50" />
          <h3 className="font-serif text-lg font-bold text-readora-ink">No articles found</h3>
          <p className="text-xs text-readora-muted mt-1">Try resetting your filter or search keywords.</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Main Featured Editorial Story */}
          {featured && (
            <div className="bg-readora-surface rounded-3xl p-6 sm:p-10 border border-readora-border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 aspect-[16/10] rounded-2xl overflow-hidden bg-readora-ivory shadow-book">
                <img
                  src={featured.cover_image || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80'}
                  alt={featured.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center space-x-2 text-xs text-readora-muted">
                  <span className="font-semibold text-readora-forest uppercase tracking-wider">{featured.category?.name || 'Essays'}</span>
                  <span>•</span>
                  <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {featured.read_time_minutes} min read</span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-readora-ink leading-tight hover:text-readora-forest transition-colors">
                  <Link to={`/articles/${featured.slug || featured.id}`}>
                    {featured.title}
                  </Link>
                </h2>

                <p className="text-sm text-readora-ink/80 leading-relaxed font-sans line-clamp-3">
                  {featured.excerpt}
                </p>

                <div className="pt-4 border-t border-readora-border/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={featured.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={featured.author?.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-xs font-semibold text-readora-ink">{featured.author?.full_name}</span>
                  </div>

                  <CTAButton
                    to={`/articles/${featured.slug || featured.id}`}
                    variant="text"
                    size="sm"
                    withArrow
                    ctaName={`Articles Featured Read Article - ${featured.title}`}
                    ctaSection="articles_featured"
                  >
                    Read Article
                  </CTAButton>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {rest.map((art) => (
                <article
                  key={art.id}
                  className="group bg-readora-surface rounded-2xl p-5 border border-readora-border shadow-sm hover:border-readora-forest/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-readora-ivory">
                      <img
                        src={art.cover_image || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex items-center space-x-2 text-[11px] text-readora-muted mb-2">
                      <span className="text-readora-forest font-semibold">{art.category?.name || 'Essays'}</span>
                      <span>•</span>
                      <span>{art.read_time_minutes} min read</span>
                    </div>

                    <h3 className="font-serif font-bold text-lg text-readora-ink leading-snug group-hover:text-readora-forest transition-colors">
                      <Link to={`/articles/${art.slug || art.id}`}>
                        {art.title}
                      </Link>
                    </h3>

                    <p className="text-xs text-readora-muted mt-2 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-readora-border/60 flex items-center justify-between text-xs">
                    <span className="text-readora-muted">{art.author?.full_name}</span>
                    <CTAButton
                      to={`/articles/${art.slug || art.id}`}
                      variant="text"
                      size="sm"
                      withArrow
                      ctaName={`Articles Grid Read Article - ${art.title}`}
                      ctaSection="articles_grid"
                    >
                      Read Article
                    </CTAButton>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
