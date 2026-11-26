import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Star, 
  Clock, 
  Bookmark, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { useAuth } from '../context/AuthContext';
import { Book, BookChapter, Rating, ReadingProgress } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // User review state
  const [userRating, setUserRating] = useState<number>(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [hasSubmittedReview, setHasSubmittedReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    const foundBook = ReadoraStore.getBookById(id);
    if (foundBook) {
      setBook(foundBook);
      const chs = ReadoraStore.getChapters(foundBook.id);
      setChapters(chs);
      const rts = ReadoraStore.getRatings(foundBook.id);
      setRatings(rts);

      if (user) {
        const prog = ReadoraStore.getReadingProgress(user.id, foundBook.id);
        setProgress(prog || null);

        const bms = ReadoraStore.getBookmarks(user.id);
        setIsBookmarked(bms.some(b => b.book_id === foundBook.id));

        const existingReview = rts.find(r => r.user_id === user.id);
        if (existingReview) {
          setUserRating(existingReview.rating);
          setReviewTitle(existingReview.review_title || '');
          setReviewText(existingReview.review_text || '');
          setHasSubmittedReview(true);
        }
      }
    }
  }, [id, user]);

  if (!book) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-readora-ink">Book Not Found</h2>
        <p className="text-sm text-readora-muted mt-2">The requested edition could not be located in our catalogue.</p>
        <Link to="/books" className="mt-4 inline-flex items-center text-xs font-semibold text-readora-forest hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Catalogue
        </Link>
      </div>
    );
  }

  const handleToggleBookmark = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const bookmarked = ReadoraStore.toggleBookmark(user.id, {
      bookId: book.id,
      label: book.title,
    });
    setIsBookmarked(bookmarked);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    ReadoraStore.submitRating({
      user_id: user.id,
      item_id: book.id,
      rating: userRating,
      review_title: reviewTitle,
      review_text: reviewText,
    });

    const updatedRatings = ReadoraStore.getRatings(book.id);
    setRatings(updatedRatings);
    setHasSubmittedReview(true);
    // Reload book to update average rating
    const b = ReadoraStore.getBookById(book.id);
    if (b) setBook(b);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <Link to="/books" className="inline-flex items-center text-xs font-semibold text-readora-muted hover:text-readora-forest transition-colors">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Catalogue
      </Link>

      {/* Main Book Hero Section */}
      <div className="bg-readora-surface rounded-3xl p-6 sm:p-10 border border-readora-border shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Cover Column */}
        <div className="md:col-span-4 lg:col-span-4">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-book-lg bg-readora-ivory relative">
            <img src={book.cover_image} alt={book.title} className="w-full h-full object-cover" />
            <span className="absolute top-3 right-3 text-xs font-semibold bg-readora-surface/90 backdrop-blur-sm text-readora-forest px-2.5 py-1 rounded-full shadow-sm">
              {book.format}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-3">
            <CTAButton
              to={book.read_url ? undefined : `/read/${book.id}`}
              href={book.read_url}
              target={book.read_url ? "_blank" : undefined}
              rel={book.read_url ? "noopener noreferrer" : undefined}
              variant="primary"
              size="md"
              shape="rounded"
              fullWidth
              withArrow
              icon={<BookOpen className="w-4 h-4" />}
              ctaName={`Book Detail Read - ${book.title}`}
              ctaSection="book_detail_hero"
            >
              {book.read_url ? 'Read Online' : progress ? 'Resume Reading' : 'Start Reading'}
            </CTAButton>

            <CTAButton
              onClick={handleToggleBookmark}
              variant={isBookmarked ? 'gold' : 'secondary'}
              size="md"
              shape="rounded"
              fullWidth
              icon={<Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-readora-ink text-readora-ink' : 'text-readora-forest'}`} />}
              ctaName={`Book Detail Bookmark - ${book.title}`}
              ctaSection="book_detail_hero"
            >
              {isBookmarked ? 'Saved in Personal Library' : 'Save to Library'}
            </CTAButton>
          </div>
        </div>

        {/* Metadata & Narrative Column */}
        <div className="md:col-span-8 lg:col-span-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-bold tracking-wider text-readora-forest bg-readora-forest/10 px-2.5 py-1 rounded">
                {book.language} Edition
              </span>
              <span className="text-xs text-readora-muted flex items-center bg-readora-ivory px-2.5 py-1 rounded border border-readora-border/60">
                <ShieldCheck className="w-3.5 h-3.5 text-readora-forest mr-1" />
                {book.license}
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-readora-ink leading-tight">
              {book.title}
            </h1>

            <p className="text-base text-readora-forest font-medium">
              By <span className="underline underline-offset-4 decoration-readora-gold">{book.author}</span>
            </p>

            {/* Ratings Summary */}
            <div className="flex items-center space-x-2 text-sm text-readora-ink pt-1">
              <div className="flex text-readora-gold">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-readora-gold text-readora-gold" />
                ))}
              </div>
              <span className="font-bold">{book.average_rating || '4.9'}</span>
              <span className="text-xs text-readora-muted">({ratings.length || book.ratings_count || 12} community reviews)</span>
            </div>

            <p className="text-sm text-readora-ink/80 leading-relaxed font-sans pt-2">
              {book.description}
            </p>
          </div>

          {/* Reading Progress banner if active */}
          {progress && (
            <div className="bg-readora-ivory p-4 rounded-2xl border border-readora-border space-y-2">
              <div className="flex justify-between text-xs text-readora-ink">
                <span className="font-semibold">Your Current Reading Progress</span>
                <span className="font-bold text-readora-forest">{Math.round(progress.progress_percent)}% Complete</span>
              </div>
              <div className="w-full bg-readora-border rounded-full h-2 overflow-hidden">
                <div className="bg-readora-forest h-2 rounded-full" style={{ width: `${progress.progress_percent}%` }} />
              </div>
            </div>
          )}

          {/* Publication Metadata details */}
          <div className="pt-6 border-t border-readora-border/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-readora-muted block">Format</span>
              <span className="font-semibold text-readora-ink mt-0.5 block">{book.format}</span>
            </div>
            <div>
              <span className="text-readora-muted block">Publisher</span>
              <span className="font-semibold text-readora-ink mt-0.5 block">{book.publisher || 'Readora Editions'}</span>
            </div>
            <div>
              <span className="text-readora-muted block">Published</span>
              <span className="font-semibold text-readora-ink mt-0.5 block">{book.publication_date || 'N/A'}</span>
            </div>
            <div>
              <span className="text-readora-muted block">Permissions</span>
              <span className="font-semibold text-readora-forest mt-0.5 block capitalize">{book.reading_permissions}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Table of Contents Section */}
      <section className="bg-readora-surface rounded-3xl p-6 sm:p-10 border border-readora-border space-y-6">
        <div className="border-b border-readora-border/60 pb-4 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-readora-ink">Table of Contents</h2>
            <p className="text-xs text-readora-muted mt-1">{chapters.length} available chapters in this digital edition.</p>
          </div>
          <span className="text-xs font-semibold text-readora-forest bg-readora-forest/10 px-3 py-1 rounded-full">
            Full Text Available
          </span>
        </div>

        <div className="divide-y divide-readora-border/60">
          {chapters.map((ch) => (
            <div key={ch.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-readora-gold uppercase tracking-wider">
                  Chapter {ch.chapter_number}
                </span>
                <h3 className="font-serif font-bold text-base text-readora-ink group-hover:text-readora-forest transition-colors">
                  {ch.title}
                </h3>
                {ch.summary && (
                  <p className="text-xs text-readora-muted max-w-xl">{ch.summary}</p>
                )}
              </div>

              <div className="flex items-center space-x-4 flex-shrink-0">
                <span className="text-xs text-readora-muted flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" /> {ch.read_time_minutes} min
                </span>
                <CTAButton
                  to={`/read/${book.id}?ch=${ch.id}`}
                  variant="secondary"
                  size="sm"
                  shape="rounded"
                  withArrow
                  ctaName={`Read Chapter ${ch.chapter_number} - ${book.title}`}
                  ctaSection="book_detail_toc"
                >
                  Read
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ratings and Reviews Section */}
      <section className="bg-readora-surface rounded-3xl p-6 sm:p-10 border border-readora-border space-y-8">
        <div className="border-b border-readora-border/60 pb-4">
          <h2 className="font-serif text-2xl font-bold text-readora-ink">Reader Reviews & Ratings</h2>
          <p className="text-xs text-readora-muted mt-1">Real ratings submitted by registered community readers.</p>
        </div>

        {/* Submit Review Form */}
        <div className="bg-readora-ivory p-6 rounded-2xl border border-readora-border">
          <h3 className="font-serif font-bold text-base text-readora-ink mb-3">
            {hasSubmittedReview ? 'Update Your Review' : 'Leave Your Review'}
          </h3>

          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-readora-ink mb-1.5">Rating (1 to 5 Stars):</label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 text-readora-gold hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= userRating ? 'fill-readora-gold text-readora-gold' : 'text-readora-border'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-readora-ink ml-2">{userRating} / 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-readora-ink mb-1">Headline (Optional):</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="A brief summary of your impression..."
                className="w-full text-xs bg-readora-surface border border-readora-border rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-readora-ink mb-1">Written Review:</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your thoughts on the translation, readability, or ideas in this book..."
                rows={3}
                className="w-full text-xs bg-readora-surface border border-readora-border rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
            </div>

            <CTAButton
              type="submit"
              variant="primary"
              size="sm"
              shape="rounded"
              ctaName="Submit Book Review"
              ctaSection="book_detail_review"
            >
              {hasSubmittedReview ? 'Update Review' : 'Submit Review'}
            </CTAButton>
          </form>
        </div>

        {/* Existing Community Reviews */}
        <div className="space-y-4">
          {ratings.length === 0 ? (
            <p className="text-xs text-readora-muted text-center py-6">No community reviews submitted yet. Be the first to review!</p>
          ) : (
            ratings.map((r) => (
              <div key={r.id} className="p-4 rounded-2xl bg-readora-ivory/50 border border-readora-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img
                      src={r.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                      alt={r.user?.full_name || 'Reader'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-readora-ink">{r.user?.full_name || 'Reader'}</span>
                  </div>
                  <div className="flex text-readora-gold">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= r.rating ? 'fill-readora-gold text-readora-gold' : 'text-readora-border'}`}
                      />
                    ))}
                  </div>
                </div>
                {r.review_title && (
                  <h4 className="text-xs font-semibold text-readora-ink">{r.review_title}</h4>
                )}
                {r.review_text && (
                  <p className="text-xs text-readora-muted leading-relaxed font-sans">{r.review_text}</p>
                )}
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
};
