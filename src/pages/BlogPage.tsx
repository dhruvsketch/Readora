import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../data/blogData';

export const BlogPage: React.FC = () => {
  useEffect(() => {
    document.title = 'The Readora Journal — Stories, Ideas & Perspectives | Readora';
    window.scrollTo(0, 0);

    // Update meta tags for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Explore thoughtful editorial articles about digital reading, discovering books, sharing knowledge, and building a community of readers on The Readora Journal.'
      );
    }
  }, []);

  return (
    <main className="min-h-screen bg-readora-ivory pt-12 pb-24 md:pt-16 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. EDITORIAL HEADER */}
        <header className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-readora-gold/10 border border-readora-gold/25 text-readora-gold-dark text-xs font-semibold uppercase tracking-[0.22em] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-readora-gold" />
            <span>The Readora Journal</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-readora-ink leading-[1.14]">
            Stories, Ideas & <span className="text-readora-forest italic">Perspectives</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-readora-ink/75 leading-relaxed font-normal max-w-2xl mx-auto">
            Explore thoughtful articles about digital reading, discovering books, sharing knowledge, and building a community of readers.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="w-16 h-0.5 bg-readora-gold/40 rounded-full" />
          </div>
        </header>

        {/* 2. THE 3 + 2 CENTERED EDITORIAL GRID */}
        {/*
          Breakpoint layout:
          - Desktop (lg:): 6-column grid.
            Row 1: Card 1 (cols 1-2), Card 2 (cols 3-4), Card 3 (cols 5-6) -> 3 equal cards.
            Row 2: Card 4 (cols 2-3 with lg:col-start-2), Card 5 (cols 4-5) -> 2 equal cards perfectly centered, identical width to Row 1!
          - Tablet (md:): 4-column grid.
            Row 1: Card 1 (cols 1-2), Card 2 (cols 3-4) -> 2 equal cards.
            Row 2: Card 3 (cols 1-2), Card 4 (cols 3-4) -> 2 equal cards.
            Row 3: Card 5 (cols 2-3 with md:col-start-2) -> 1 card centered!
          - Mobile: 1 column grid, comfortable full width.
        */}
        <section aria-label="Editorial Articles Grid">
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {BLOG_POSTS.map((post: BlogPost, index: number) => {
              // Custom responsive column span & start per position to achieve 3 + 2 centered layout
              let gridClasses = 'col-span-1';

              if (index === 0 || index === 1) {
                // Row 1 items on tablet and desktop
                gridClasses = 'col-span-1 md:col-span-2 lg:col-span-2';
              } else if (index === 2) {
                // 3rd item: fills row 1 on desktop; starts row 2 on tablet
                gridClasses = 'col-span-1 md:col-span-2 lg:col-span-2';
              } else if (index === 3) {
                // 4th item: finishes row 2 on tablet; starts row 2 on desktop (col-start-2 centers the 2 cards)
                gridClasses = 'col-span-1 md:col-span-2 lg:col-start-2 lg:col-span-2';
              } else if (index === 4) {
                // 5th item: row 3 centered on tablet (md:col-start-2); continues row 2 on desktop (cols 4-5)
                gridClasses = 'col-span-1 md:col-start-2 md:col-span-2 lg:col-start-auto lg:col-span-2';
              }

              return (
                <div key={post.id} className={`${gridClasses} flex`}>
                  <article className="group bg-white rounded-2xl border border-readora-border/80 shadow-editorial hover:shadow-book-lg hover:border-readora-forest/30 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between w-full overflow-hidden">
                    <div>
                      {/* Image Section (4:3 aspect ratio) */}
                      {post.externalUrl ? (
                        <a
                          href={post.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block relative aspect-[4/3] overflow-hidden bg-readora-ivory-dark"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading={index < 3 ? 'eager' : 'lazy'}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="absolute top-3 right-3 text-[11px] font-semibold tracking-wider uppercase bg-white/95 backdrop-blur-sm text-readora-forest px-3 py-1 rounded-full shadow-sm border border-readora-border/60">
                            {post.category}
                          </span>
                        </a>
                      ) : (
                        <Link
                          to={`/blog/${post.slug}`}
                          className="block relative aspect-[4/3] overflow-hidden bg-readora-ivory-dark"
                          tabIndex={-1}
                          aria-hidden="true"
                        >
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                            loading={index < 3 ? 'eager' : 'lazy'}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <span className="absolute top-3 right-3 text-[11px] font-semibold tracking-wider uppercase bg-white/95 backdrop-blur-sm text-readora-forest px-3 py-1 rounded-full shadow-sm border border-readora-border/60">
                            {post.category}
                          </span>
                        </Link>
                      )}

                      {/* Content Section */}
                      <div className="p-6 pb-2">
                        {/* Meta info */}
                        <div className="flex items-center gap-3 text-xs text-readora-muted mb-2.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-readora-gold" />
                            {post.readTime}
                          </span>
                          <span className="text-readora-border-dark">•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-readora-muted/80" />
                            {post.publishDate}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-readora-ink leading-snug group-hover:text-readora-forest transition-colors line-clamp-2">
                          {post.externalUrl ? (
                            <a
                              href={post.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="focus:outline-none focus-visible:underline"
                            >
                              {post.title}
                            </a>
                          ) : (
                            <Link to={`/blog/${post.slug}`} className="focus:outline-none focus-visible:underline">
                              {post.title}
                            </Link>
                          )}
                        </h2>

                        {/* Description (2-3 lines) */}
                        <p className="mt-3 text-sm text-readora-ink/75 leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer with CTA Button: exactly 'More →' */}
                    <div className="px-6 pt-4 pb-6 mt-2 border-t border-readora-border/50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-readora-border"
                        />
                        <span className="text-xs text-readora-muted font-medium truncate max-w-[140px]">
                          {post.author.name}
                        </span>
                      </div>

                      {post.externalUrl ? (
                        <a
                          href={post.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/btn inline-flex items-center gap-1 text-sm font-semibold text-readora-forest hover:text-readora-forest-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-readora-forest focus-visible:ring-offset-2 rounded px-2 py-1 -mr-2"
                          aria-label={`Read more about ${post.title}`}
                        >
                          <span>More</span>
                          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                        </a>
                      ) : (
                        <Link
                          to={`/blog/${post.slug}`}
                          className="group/btn inline-flex items-center gap-1 text-sm font-semibold text-readora-forest hover:text-readora-forest-dark transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-readora-forest focus-visible:ring-offset-2 rounded px-2 py-1 -mr-2"
                          aria-label={`Read more about ${post.title}`}
                        >
                          <span>More</span>
                          <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-200" />
                        </Link>
                      )}
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. EDITORIAL FOOTNOTE CALLOUT */}
        <div className="mt-20 pt-12 border-t border-readora-border/60 text-center max-w-2xl mx-auto">
          <p className="font-serif italic text-base text-readora-ink/80">
            "The Readora Journal publishes perspectives dedicated to the defense of deep attention, open knowledge, and literary curiosity."
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-readora-gold font-semibold">
            <span>Readora Publishing</span>
            <span>•</span>
            <span>Independent & Non-Algorithmic</span>
          </div>
        </div>

      </div>
    </main>
  );
};
