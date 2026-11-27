import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  Calendar, 
  Share2, 
  Check, 
  BookOpen, 
  Sparkles,
  Tag
} from 'lucide-react';
import { getBlogPostBySlug, getRelatedBlogPosts } from '../data/blogData';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const post = slug ? getBlogPostBySlug(slug) : undefined;
  const relatedPosts = post ? getRelatedBlogPosts(post.id, 3) : [];

  useEffect(() => {
    window.scrollTo(0, 0);

    if (post) {
      document.title = `${post.title} — The Readora Journal`;

      // Update meta tags
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.seo.metaDescription);
      }

      // Add Article structured data
      const scriptId = 'article-structured-data';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt,
        image: post.coverImage,
        datePublished: post.publishDate,
        author: {
          '@type': 'Person',
          name: post.author.name,
          jobTitle: post.author.role,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Readora',
          logo: {
            '@type': 'ImageObject',
            url: 'https://readora.vercel.app/favicon.svg',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': window.location.href,
        },
      };

      script.textContent = JSON.stringify(structuredData);
    }
  }, [post, slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!post) {
    return (
      <main className="min-h-[70vh] bg-readora-ivory flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full bg-white rounded-2xl border border-readora-border p-8 text-center shadow-editorial">
          <BookOpen className="w-12 h-12 text-readora-gold mx-auto mb-4" />
          <h1 className="font-serif text-2xl font-bold text-readora-ink mb-2">Article Not Found</h1>
          <p className="text-sm text-readora-muted mb-6">
            The essay you are looking for does not exist or has been relocated within the journal archives.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-readora-forest text-white text-sm font-semibold hover:bg-readora-forest-light transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Journal</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-readora-ivory pt-8 pb-24 md:pt-12 md:pb-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back Link */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-readora-forest hover:text-readora-forest-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to The Readora Journal</span>
          </Link>
        </nav>

        {/* Article Header */}
        <header className="mb-10 sm:mb-12">
          {/* Category & Keyword Pill */}
          <div className="flex flex-wrap items-center gap-2.5 mb-5">
            <span className="text-xs font-semibold uppercase tracking-wider bg-readora-forest/10 border border-readora-forest/20 text-readora-forest px-3.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-readora-gold-dark font-medium bg-readora-gold/10 px-2.5 py-0.5 rounded-full border border-readora-gold/20">
              <Tag className="w-3 h-3 text-readora-gold" />
              {post.keyword}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-readora-ink leading-[1.18] tracking-tight">
            {post.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-lg sm:text-xl text-readora-ink/80 font-serif italic leading-relaxed">
            {post.subtitle}
          </p>

          {/* Metadata Bar */}
          <div className="mt-8 pt-6 border-t border-readora-border/70 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border border-readora-border shadow-sm"
              />
              <div>
                <p className="text-sm font-semibold text-readora-ink">{post.author.name}</p>
                <p className="text-xs text-readora-muted">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-readora-muted">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-readora-gold" />
                {post.publishDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-readora-gold" />
                {post.readTime}
              </span>
              <span>•</span>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-readora-border bg-white text-readora-ink hover:text-readora-forest hover:border-readora-forest/40 transition-colors shadow-sm cursor-pointer"
                title="Copy article link"
                aria-label="Share this article"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Large Featured Editorial Image */}
        <figure className="mb-12 sm:mb-16">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-readora-ivory-dark shadow-book border border-readora-border/60">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption className="text-xs text-readora-muted italic mt-2.5 text-center">
            The Readora Journal • Editorial Feature
          </figcaption>
        </figure>

        {/* Article Body */}
        <article className="bg-white rounded-3xl border border-readora-border/80 p-8 sm:p-12 lg:p-16 shadow-editorial">
          {/* Introduction Paragraph */}
          <p className="text-lg sm:text-xl text-readora-ink/90 font-serif leading-relaxed first-letter:text-5xl first-letter:font-bold first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-readora-forest first-letter:leading-none">
            {post.content.intro}
          </p>

          <div className="my-10 border-t border-readora-border/60" />

          {/* Content Sections */}
          <div className="space-y-10 text-base sm:text-lg text-readora-ink/85 leading-relaxed font-sans font-normal">
            {post.content.sections.map((section, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-readora-ink tracking-tight pt-2">
                  {section.heading}
                </h2>
                {section.body.map((para, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>

          {/* Editorial Pull Quote */}
          <div className="my-12 pl-6 sm:pl-8 border-l-4 border-readora-gold py-3 bg-readora-gold/5 rounded-r-2xl">
            <blockquote className="font-serif italic text-xl sm:text-2xl text-readora-ink leading-snug">
              "{post.content.pullQuote.quote}"
            </blockquote>
            {post.content.pullQuote.author && (
              <p className="mt-3 text-xs uppercase tracking-widest text-readora-gold-dark font-semibold">
                — {post.content.pullQuote.author}
              </p>
            )}
          </div>

          {/* Key Takeaways Box */}
          <div className="my-12 bg-readora-forest/[0.04] border border-readora-forest/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-readora-forest mb-4">
              <Sparkles className="w-4 h-4 text-readora-gold" />
              <span>Key Editorial Insights</span>
            </div>
            <ul className="space-y-3 text-sm sm:text-base text-readora-ink/85">
              {post.content.takeaways.map((takeaway, tIdx) => (
                <li key={tIdx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-readora-forest mt-2 shrink-0" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Conclusion */}
          <div className="mt-10 pt-8 border-t border-readora-border/60">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-readora-ink mb-3">
              Looking Forward
            </h3>
            <p className="text-base sm:text-lg text-readora-ink/85 leading-relaxed font-sans">
              {post.content.conclusion}
            </p>
          </div>

          {/* Author Bio Box */}
          <div className="mt-14 pt-8 border-t border-readora-border/60 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-6 bg-readora-ivory/60 rounded-2xl border border-readora-border/40">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-16 h-16 rounded-full object-cover border border-readora-border shadow-sm shrink-0"
            />
            <div className="text-center sm:text-left">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-readora-gold-dark">
                About the Author
              </span>
              <h4 className="font-serif text-lg font-bold text-readora-ink mt-0.5">
                {post.author.name}
              </h4>
              <p className="text-xs text-readora-muted mt-1 leading-relaxed">
                {post.author.role} contributing regularly to The Readora Journal on cognitive humanities, reading culture, and digital archives.
              </p>
            </div>
          </div>
        </article>

        {/* Read Next / Related Recommendations */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-readora-border/70" aria-label="Related Articles">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-readora-gold-dark">
                  Continue Reading
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-readora-ink mt-1">
                  More from the Journal
                </h2>
              </div>
              <Link
                to="/blog"
                className="text-xs font-semibold text-readora-forest hover:text-readora-forest-dark uppercase tracking-wider inline-flex items-center gap-1"
              >
                <span>All Articles</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <article
                  key={related.id}
                  className="group bg-white rounded-2xl border border-readora-border/80 p-5 shadow-editorial hover:shadow-book-lg hover:border-readora-forest/30 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-readora-ivory-dark">
                      <img
                        src={related.coverImage}
                        alt={related.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 text-[10px] font-semibold uppercase tracking-wider bg-white/95 text-readora-forest px-2 py-0.5 rounded shadow-sm">
                        {related.category}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base text-readora-ink group-hover:text-readora-forest transition-colors line-clamp-2 leading-snug">
                      <Link to={`/blog/${related.slug}`}>{related.title}</Link>
                    </h3>

                    <p className="mt-2 text-xs text-readora-ink/70 line-clamp-2 leading-relaxed">
                      {related.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-readora-border/50 flex items-center justify-between">
                    <span className="text-[11px] text-readora-muted">{related.readTime}</span>
                    <Link
                      to={`/blog/${related.slug}`}
                      className="group/btn inline-flex items-center gap-1 text-xs font-semibold text-readora-forest hover:text-readora-forest-dark"
                    >
                      <span>More</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
};
