import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Feather,
  Clock,
  Heart,
  MessageSquare,
  CheckCircle,
  Star,
  Repeat,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReadoraStore } from '../lib/store';
import { Book, Article, CommunityPost, ReadingProgress, BookListing } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [communityHighlights, setCommunityHighlights] = useState<CommunityPost[]>([]);
  const [readingHistory, setReadingHistory] = useState<ReadingProgress[]>([]);
  const [availableListings, setAvailableListings] = useState<BookListing[]>([]);

  useEffect(() => {
    const books = ReadoraStore.getBooks().filter(b => b.status === 'published');
    setFeaturedBooks(books.slice(0, 4));

    const articles = ReadoraStore.getArticles().filter(a => a.status === 'published');
    setRecentArticles(articles.slice(0, 3));

    const posts = ReadoraStore.getPosts().filter(p => p.status === 'published');
    setCommunityHighlights(posts.slice(0, 3));

    const listings = ReadoraStore.getListings().filter(l => l.status === 'available');
    setAvailableListings(listings.slice(0, 3));

    if (user) {
      setReadingHistory(ReadoraStore.getUserReadingHistory(user.id));
    }
  }, [user]);

  return (
    <div className="space-y-24 pb-16">

      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-readora-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 bg-readora-forest/10 border border-readora-forest/20 text-readora-forest px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-readora-gold" />
                <span>The Independent Editorial & Digital Library</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-readora-ink leading-[1.12]">
                Every Great Idea Begins With a Page.
              </h1>

              <p className="text-base sm:text-lg text-readora-ink/80 leading-relaxed max-w-2xl font-normal">
                Discover books, explore thoughtful writing, share your ideas, and find a community that loves learning as much as you do.
              </p>

              {/* Prominent Hero CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <CTAButton
                  to="/discover"
                  variant="primary"
                  size="lg"
                  shape="pill"
                  withArrow
                  ctaName="Hero Start Reading"
                  ctaSection="hero"
                >
                  Start Reading
                </CTAButton>

                <CTAButton
                  to={isAuthenticated ? '/write' : '/login'}
                  state={isAuthenticated ? undefined : { from: { pathname: '/write' } }}
                  variant="secondary"
                  size="lg"
                  shape="pill"
                  icon={<Feather className="w-4 h-4 text-readora-forest" />}
                  ctaName="Hero Share Your Ideas"
                  ctaSection="hero"
                >
                  Share Your Ideas
                </CTAButton>
              </div>

              {/* Editorial Trust badges */}
              <div className="pt-6 border-t border-readora-border/60 flex flex-wrap items-center gap-6 text-xs text-readora-muted">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-readora-forest" />
                  <span>Curated Public Domain & Open Access</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-readora-forest" />
                  <span>Distraction-Free Digital Reader</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-readora-forest" />
                  <span>Peer-to-Peer Physical Book Lending</span>
                </span>
              </div>
            </div>

            {/* Right Visual Composition */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm lg:max-w-none">

                {/* Main Feature Book Card */}
                <div className="bg-readora-surface rounded-2xl p-6 shadow-book-lg border border-readora-border/80 transform hover:-translate-y-1 transition-transform">
                  <div className="flex space-x-4">
                    <img
                      src="https://covers.openlibrary.org/b/id/15212970-M.jpg?auto=format&fit=crop&w=400&q=80"
                      alt="Meditations"
                      className="w-24 h-36 object-cover rounded-lg shadow-book flex-shrink-0"
                    />
                    <div className="flex flex-col justify-between py-1">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-readora-gold bg-readora-gold/10 px-2 py-0.5 rounded">
                          Editor's Choice
                        </span>
                        <h3 className="font-serif text-lg font-bold text-readora-ink mt-1.5 leading-snug">
                          {featuredBooks[0]?.title || "Vanish Culture"}
                        </h3>
                        <p className="text-xs text-readora-muted">{featuredBooks[0]?.author || "Marcus Aurelius"}</p>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-readora-gold">
                        <Star className="w-3.5 h-3.5 fill-readora-gold text-readora-gold" />
                        <span className="font-semibold text-readora-ink">4.9</span>
                        <span className="text-readora-muted">(142 reviews)</span>
                      </div>
                      <div className="mt-2">
                        <CTAButton
                          to={featuredBooks[0]?.read_url ? undefined : "/read/b1"}
                          href={featuredBooks[0]?.read_url || "https://archive.org/details/vanishing-culture-2026/mode/2up?ref=ol"}
                          target={featuredBooks[0]?.read_url || !featuredBooks.length ? "_blank" : undefined}
                          variant="text"
                          size="sm"
                          withArrow
                          ctaName="Hero Featured Card Read Now"
                          ctaSection="hero_book_card"
                        >
                          Read Now
                        </CTAButton>
                      </div>
                    </div>
                  </div>

                  {/* Reading Quote Snippet */}
                  <div className="mt-5 pt-4 border-t border-readora-border/60">
                    <p className="font-serif italic text-xs text-readora-ink/80 leading-relaxed">
                      "When you wake up in the morning, tell yourself: The people I deal with today will be meddling, ungrateful, arrogant... none can hurt me."
                    </p>
                  </div>
                </div>

                {/* Floating Secondary Mini Card */}
                <div className="absolute -bottom-6 -left-6 bg-readora-ivory/95 backdrop-blur-md p-4 rounded-xl shadow-editorial border border-readora-border/80 max-w-xs hidden sm:flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-readora-forest/10 flex items-center justify-center text-readora-forest flex-shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-readora-ink">Read Anywhere</p>
                    <p className="text-[11px] text-readora-muted">Saved progress, notes & custom fonts</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CONTINUE READING (for authenticated users with reading history) */}
      {isAuthenticated && readingHistory.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-semibold text-readora-forest uppercase tracking-wider">Welcome Back</span>
              <h2 className="font-serif text-2xl font-bold text-readora-ink">Continue Reading</h2>
            </div>
            <CTAButton
              to="/my-library"
              variant="text"
              size="sm"
              withArrow
              ctaName="Continue Reading View Library"
              ctaSection="continue_reading"
            >
              View My Library
            </CTAButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readingHistory.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="bg-readora-surface rounded-xl p-4 border border-readora-border flex items-center space-x-4 shadow-sm hover:border-readora-forest/40 transition-colors"
              >
                <img
                  src={item.book?.cover_image || 'https://covers.openlibrary.org/b/id/15212970-M.jpg?auto=format&fit=crop&w=200&q=80'}
                  alt={item.book?.title}
                  className="w-16 h-24 object-cover rounded shadow-sm flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-base text-readora-ink truncate">{item.book?.title}</h3>
                  <p className="text-xs text-readora-muted">{item.book?.author}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] text-readora-muted mb-1">
                      <span>Progress</span>
                      <span>{Math.round(item.progress_percent)}%</span>
                    </div>
                    <div className="w-full bg-readora-ivory rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-readora-forest h-1.5 rounded-full transition-all"
                        style={{ width: `${item.progress_percent}%` }}
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <CTAButton
                      to={`/read/${item.book_id}`}
                      variant="text"
                      size="sm"
                      withArrow
                      ctaName={`Resume Reading - ${item.book?.title}`}
                      ctaSection="continue_reading_card"
                    >
                      Resume Reading
                    </CTAButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. FEATURED BOOKS / DISCOVER BOOKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-readora-border/60">
          <div>
            <span className="text-xs font-semibold text-readora-gold uppercase tracking-wider">Curated Catalogue</span>
            <h2 className="font-serif text-3xl font-bold text-readora-ink mt-1">Discover Books</h2>
            <p className="text-xs sm:text-sm text-readora-muted mt-1">Authorized open editions, philosophy, and foundational texts.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <CTAButton
              to="/discover"
              variant="secondary"
              size="sm"
              shape="pill"
              withArrow
              ctaName="Explore Library"
              ctaSection="discover_books_header"
            >
              Explore Library
            </CTAButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.map((book) => (
            <div
              key={book.id}
              className="group bg-readora-surface rounded-2xl border border-readora-border p-4 shadow-sm hover:shadow-editorial hover:border-readora-forest/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-readora-ivory shadow-book">
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 text-[10px] font-semibold bg-readora-surface/90 backdrop-blur-sm text-readora-forest px-2 py-0.5 rounded shadow-sm">
                    {book.format}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-readora-ink line-clamp-1 group-hover:text-readora-forest transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-readora-muted mt-0.5">{book.author}</p>
                <p className="text-xs text-readora-ink/70 line-clamp-2 mt-2 leading-relaxed">
                  {book.description}
                </p>
              </div>

              {/* Book Card CTA Buttons: Read Now and View Details */}
              <div className="mt-4 pt-3 border-t border-readora-border/60 flex items-center justify-between gap-2">
                <CTAButton
                  to={`/books/${book.slug || book.id}`}
                  variant="text"
                  size="sm"
                  ctaName={`View Details - ${book.title}`}
                  ctaSection="book_card"
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
                  ctaName={`Read Now - ${book.title}`}
                  ctaSection="book_card"
                >
                  Read Now
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. ARTICLES WORTH READING / WRITING & PUBLISHING */}
      <section className="bg-readora-surface py-20 border-y border-readora-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold text-readora-forest uppercase tracking-wider">Literary Journal</span>
              <h2 className="font-serif text-3xl font-bold text-readora-ink mt-1">Articles Worth Reading</h2>
              <p className="text-xs sm:text-sm text-readora-muted mt-1">In-depth essays, reflections on cognition, and literature reviews.</p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
              <CTAButton
                to="/articles"
                variant="secondary"
                size="sm"
                shape="pill"
                withArrow
                ctaName="Explore Stories"
                ctaSection="articles_header"
              >
                Explore Stories
              </CTAButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recentArticles.map((article) => (
              <article
                key={article.id}
                className="group flex flex-col justify-between bg-readora-ivory/50 rounded-2xl p-5 border border-readora-border/80 hover:border-readora-forest/40 hover:bg-readora-ivory transition-all shadow-sm"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden rounded-xl mb-4 bg-readora-ivory">
                    <img
                      src={article.cover_image || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80'}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-readora-muted mb-2">
                    <span className="text-readora-forest font-semibold">{article.category?.name || 'Essays'}</span>
                    <span>•</span>
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1" /> {article.read_time_minutes} min read</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-readora-ink leading-snug group-hover:text-readora-forest transition-colors">
                    <Link to={`/articles/${article.slug || article.id}`}>
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-readora-muted mt-2 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-readora-border/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={article.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={article.author?.full_name}
                      className="w-7 h-7 rounded-full object-cover border border-readora-border"
                    />
                    <span className="text-xs font-medium text-readora-ink">{article.author?.full_name}</span>
                  </div>

                  <CTAButton
                    to={`/articles/${article.slug || article.id}`}
                    variant="text"
                    size="sm"
                    withArrow
                    ctaName={`Read Article - ${article.title}`}
                    ctaSection="home_article_card"
                  >
                    Read Article
                  </CTAButton>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. COMMUNITY HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-readora-border/60">
          <div>
            <span className="text-xs font-semibold text-readora-forest uppercase tracking-wider">Discourse & Reflections</span>
            <h2 className="font-serif text-3xl font-bold text-readora-ink mt-1">Community Highlights</h2>
            <p className="text-xs sm:text-sm text-readora-muted mt-1">Short thoughts, reading quotes, and peer discussions.</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
            <CTAButton
              to={isAuthenticated ? '/community' : '/signup'}
              state={isAuthenticated ? undefined : { from: { pathname: '/community' } }}
              variant="primary"
              size="sm"
              shape="pill"
              ctaName="Join the Community"
              ctaSection="community_header"
            >
              Join the Community
            </CTAButton>

            <CTAButton
              to="/community?compose=true"
              variant="secondary"
              size="sm"
              shape="pill"
              icon={<MessageSquare className="w-3.5 h-3.5 text-readora-forest" />}
              ctaName="Share Your Thoughts"
              ctaSection="community_header"
            >
              Share Your Thoughts
            </CTAButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityHighlights.map((post) => (
            <div
              key={post.id}
              className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2.5">
                    <img
                      src={post.author?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'}
                      alt={post.author?.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-xs font-semibold text-readora-ink">{post.author?.full_name}</p>
                      <p className="text-[10px] text-readora-muted">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-readora-forest bg-readora-forest/10 px-2 py-0.5 rounded">
                    {post.post_type}
                  </span>
                </div>

                <p className="text-sm font-serif text-readora-ink/90 leading-relaxed italic">
                  "{post.content}"
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-readora-border/60 flex items-center justify-between text-xs text-readora-muted">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Heart className="w-3.5 h-3.5 text-red-500/70" />
                    <span>{post.likes_count}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-readora-muted" />
                    <span>{post.comments_count}</span>
                  </span>
                </div>

                <CTAButton
                  to="/community"
                  variant="text"
                  size="sm"
                  withArrow
                  ctaName={`Join Discussion - ${post.id}`}
                  ctaSection="community_card"
                >
                  Join Discussion
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. BOOK LENDING & BORROWING SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-readora-border/60">
          <div>
            <span className="text-xs font-semibold text-readora-forest uppercase tracking-wider">
              Peer-to-Peer Physical Library
            </span>
            <h2 className="font-serif text-3xl font-bold text-readora-ink mt-1">Book Lending & Exchange</h2>
            <p className="text-xs sm:text-sm text-readora-muted mt-1">
              Borrow real physical books from readers in your community, or share editions from your own shelf.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-wrap items-center gap-3">
            <CTAButton
              to="/borrowed"
              variant="primary"
              size="sm"
              shape="pill"
              icon={<Repeat className="w-3.5 h-3.5" />}
              ctaName="Borrow a Book"
              ctaSection="book_lending_header"
            >
              Borrow a Book
            </CTAButton>

            <CTAButton
              to={isAuthenticated ? '/borrowed?tab=create' : '/login'}
              state={isAuthenticated ? undefined : { from: { pathname: '/borrowed', search: '?tab=create' } }}
              variant="secondary"
              size="sm"
              shape="pill"
              ctaName="List a Book"
              ctaSection="book_lending_header"
            >
              List a Book
            </CTAButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-readora-surface rounded-2xl p-5 border border-readora-border shadow-sm flex flex-col justify-between space-y-4 hover:border-readora-forest/40 transition-colors"
            >
              <div className="flex space-x-4">
                <img
                  src={listing.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'}
                  alt={listing.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-book flex-shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-readora-forest bg-readora-forest/10 px-2 py-0.5 rounded">
                    {listing.condition}
                  </span>
                  <h3 className="font-serif font-bold text-base text-readora-ink truncate mt-1">{listing.title}</h3>
                  <p className="text-xs text-readora-muted">{listing.author}</p>
                  <p className="text-xs text-readora-ink/80 flex items-center pt-1 truncate">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-readora-forest shrink-0" />
                    <span className="truncate">{listing.pickup_location}</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-readora-border/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={listing.lender?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt="Lender"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-readora-muted truncate max-w-[100px]">{listing.lender?.full_name}</span>
                </div>

                <CTAButton
                  to={`/borrowed?request=${listing.id}`}
                  variant="primary"
                  size="sm"
                  shape="rounded"
                  ctaName={`Request to Borrow - ${listing.title}`}
                  ctaSection="home_lending_card"
                >
                  Request to Borrow
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CREATOR / PUBLISHER CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-readora-forest text-readora-ivory rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-book-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-readora-gold">
              Writers, Scholars & Creators
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Your Ideas Deserve to Be Read.
            </h2>
            <p className="text-sm sm:text-base text-readora-ivory/80 leading-relaxed font-normal">
              Publish long-form essays, book reviews, research notes, and stories on a platform dedicated to thoughtful readers without invasive algorithms or clickbait.
            </p>
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <CTAButton
                to={isAuthenticated ? '/write' : '/login'}
                state={isAuthenticated ? undefined : { from: { pathname: '/write' } }}
                variant="gold"
                size="md"
                shape="pill"
                withArrow
                ctaName="Callout Start Writing"
                ctaSection="creator_callout"
              >
                Start Writing
              </CTAButton>

              <CTAButton
                to="/articles"
                variant="secondary"
                size="md"
                shape="pill"
                className="bg-transparent text-white border-white/60 hover:bg-white/10 hover:border-white"
                ctaName="Callout Explore Stories"
                ctaSection="creator_callout"
              >
                Explore Stories
              </CTAButton>
            </div>
          </div>

          {/* Decorative SVG Quill in background */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Feather className="w-96 h-96 text-white" />
          </div>
        </div>
      </section>

    </div>
  );
};
