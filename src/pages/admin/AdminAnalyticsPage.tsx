import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  Users, 
  Star,
  Eye
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';

export const AdminAnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState(ReadoraStore.getMetrics());
  const [books, setBooks] = useState(ReadoraStore.getBooks());
  const [articles, setArticles] = useState(ReadoraStore.getArticles());

  useEffect(() => {
    setMetrics(ReadoraStore.getMetrics());
    setBooks(ReadoraStore.getBooks());
    setArticles(ReadoraStore.getArticles());
  }, []);

  const totalArticleViews = articles.reduce((sum, a) => sum + (a.views_count || 0), 0);
  const totalArticleLikes = articles.reduce((sum, a) => sum + (a.likes_count || 0), 0);

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="border-b border-readora-border/60 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Performance & Engagement</span>
        <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Platform Analytics</h1>
        <p className="text-xs text-readora-muted mt-1">
          Detailed metrics across reader engagement, content consumption, and publication health.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <Eye className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Total Article Impressions
          </span>
          <p className="font-serif text-3xl font-bold text-readora-ink mt-2">{totalArticleViews.toLocaleString()}</p>
        </div>

        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <Star className="w-3.5 h-3.5 mr-1 text-readora-gold" /> Average Book Rating
          </span>
          <p className="font-serif text-3xl font-bold text-readora-ink mt-2">4.8 / 5.0</p>
        </div>

        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <TrendingUp className="w-3.5 h-3.5 mr-1 text-purple-600" /> Total Likes & Reactions
          </span>
          <p className="font-serif text-3xl font-bold text-readora-ink mt-2">{totalArticleLikes}</p>
        </div>

        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm">
          <span className="text-xs text-readora-muted font-medium flex items-center">
            <BookOpen className="w-3.5 h-3.5 mr-1 text-emerald-700" /> Digital Library Volumes
          </span>
          <p className="font-serif text-3xl font-bold text-readora-ink mt-2">{metrics.publishedBooks}</p>
        </div>
      </div>

      {/* Top Titles Table */}
      <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-readora-ink">Most Popular Books</h3>
        <div className="space-y-3">
          {books.map(b => (
            <div key={b.id} className="flex items-center justify-between p-3 bg-readora-ivory rounded-xl text-xs">
              <div className="flex items-center space-x-3">
                <img src={b.cover_image} alt={b.title} className="w-8 h-12 object-cover rounded shadow-sm" />
                <div>
                  <p className="font-bold text-readora-ink">{b.title}</p>
                  <p className="text-[11px] text-readora-muted">{b.author} • {b.format}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-readora-gold font-bold flex items-center">
                  <Star className="w-3.5 h-3.5 fill-readora-gold mr-1" /> {b.average_rating || 4.9}
                </span>
                <span className="text-readora-muted">{b.ratings_count || 12} reviews</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
