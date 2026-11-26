import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Bookmark, 
  Share2, 
  MessageSquare, 
  Clock, 
  ArrowLeft, 
  Flag, 
  Star, 
  CheckCircle,
  Tag,
  Send,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { useAuth } from '../context/AuthContext';
import { Article, Comment, Rating } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [newComment, setNewComment] = useState('');
  
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

  // Article rating state
  const [userRating, setUserRating] = useState(5);
  const [hasRated, setHasRated] = useState(false);

  // Report Modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate Content');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    const art = ReadoraStore.getArticleById(id);
    if (art) {
      setArticle(art);
      setComments(ReadoraStore.getComments({ articleId: art.id }));
      setRatings(ReadoraStore.getRatings(art.id));

      if (user) {
        setIsLiked(ReadoraStore.isLiked(user.id, art.id));
        const bms = ReadoraStore.getBookmarks(user.id);
        setIsBookmarked(bms.some(b => b.article_id === art.id));
        setIsFollowing(ReadoraStore.isFollowing(user.id, art.author_id));

        const rts = ReadoraStore.getRatings(art.id);
        const myRating = rts.find(r => r.user_id === user.id);
        if (myRating) {
          setUserRating(myRating.rating);
          setHasRated(true);
        }
      }
    }
  }, [id, user]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-readora-ink">Article Not Found</h2>
        <p className="text-sm text-readora-muted mt-2">The essay or article could not be found.</p>
        <Link to="/articles" className="mt-4 inline-flex items-center text-xs font-semibold text-readora-forest hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Articles
        </Link>
      </div>
    );
  }

  const handleToggleLike = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const liked = ReadoraStore.toggleLike(user.id, article.id, 'article');
    setIsLiked(liked);
    const updated = ReadoraStore.getArticleById(article.id);
    if (updated) setArticle(updated);
  };

  const handleToggleBookmark = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const bookmarked = ReadoraStore.toggleBookmark(user.id, {
      articleId: article.id,
      label: article.title,
    });
    setIsBookmarked(bookmarked);
  };

  const handleToggleFollow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    const following = ReadoraStore.toggleFollow(user.id, article.author_id);
    setIsFollowing(following);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    ReadoraStore.addComment({
      user_id: user.id,
      articleId: article.id,
      content: newComment.trim(),
    });

    setComments(ReadoraStore.getComments({ articleId: article.id }));
    setNewComment('');
  };

  const handleSubmitRating = (ratingVal: number) => {
    if (!user) {
      navigate('/login');
      return;
    }
    ReadoraStore.submitRating({
      user_id: user.id,
      item_id: article.id,
      rating: ratingVal,
    });
    setUserRating(ratingVal);
    setHasRated(true);
    setRatings(ReadoraStore.getRatings(article.id));
  };

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    ReadoraStore.submitReport({
      reporter_id: user.id,
      target_type: 'article',
      target_id: article.id,
      target_summary: article.title,
      reason: reportReason,
      details: reportDetails,
    });

    setReportSubmitted(true);
    setTimeout(() => {
      setShowReportModal(false);
      setReportSubmitted(false);
    }, 1500);
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back button */}
      <Link to="/articles" className="inline-flex items-center text-xs font-semibold text-readora-muted hover:text-readora-forest transition-colors">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Articles
      </Link>

      {/* Header Info */}
      <header className="space-y-6 text-center border-b border-readora-border/60 pb-10">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest bg-readora-forest/10 px-3 py-1 rounded-full">
            {article.category?.name || 'Essays'}
          </span>
          <span className="text-xs text-readora-muted flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" /> {article.read_time_minutes} min read
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-readora-ink tracking-tight leading-[1.15]">
          {article.title}
        </h1>

        {article.subtitle && (
          <p className="text-base sm:text-xl text-readora-muted font-serif italic max-w-2xl mx-auto">
            {article.subtitle}
          </p>
        )}

        {/* Author byline */}
        <div className="flex items-center justify-center space-x-4 pt-4">
          <img
            src={article.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={article.author?.full_name}
            className="w-11 h-11 rounded-full object-cover border-2 border-readora-border shadow-sm"
          />
          <div className="text-left">
            <Link to={`/authors/${article.author?.username || article.author?.id}`} className="font-serif font-bold text-sm text-readora-ink hover:underline">
              {article.author?.full_name}
            </Link>
            <p className="text-[11px] text-readora-muted">
              Published on {new Date(article.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={handleToggleFollow}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors flex items-center space-x-1 ${
              isFollowing 
                ? 'bg-readora-ivory text-readora-forest border-readora-forest/40' 
                : 'bg-readora-forest text-readora-ivory border-transparent hover:bg-readora-forest-light'
            }`}
          >
            {isFollowing ? <UserCheck className="w-3 h-3" /> : <UserPlus className="w-3 h-3" />}
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
        </div>
      </header>

      {/* Cover Image */}
      {article.cover_image && (
        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-book bg-readora-ivory">
          <img src={article.cover_image} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Floating Reading Utility Toolbar */}
      <div className="sticky top-24 z-20 flex items-center justify-between p-3 bg-readora-surface/90 backdrop-blur-md rounded-2xl border border-readora-border shadow-sm">
        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={handleToggleLike}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
              isLiked ? 'bg-red-50 text-red-600 border-red-200' : 'bg-readora-ivory text-readora-ink border-readora-border hover:bg-readora-border/60'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : 'text-readora-muted'}`} />
            <span className="font-semibold">{article.likes_count || 0}</span>
          </button>

          <button
            onClick={handleToggleBookmark}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border transition-colors ${
              isBookmarked ? 'bg-readora-gold/15 text-readora-ink border-readora-gold' : 'bg-readora-ivory text-readora-ink border-readora-border hover:bg-readora-border/60'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-readora-gold text-readora-gold' : 'text-readora-muted'}`} />
            <span>{isBookmarked ? 'Saved' : 'Bookmark'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowReportModal(true)}
            className="p-2 text-readora-muted hover:text-red-600 transition-colors"
            title="Report this article"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Prose Content */}
      <div 
        className="prose-editorial max-w-none text-readora-ink leading-relaxed"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Article Tags */}
      {article.tags.length > 0 && (
        <div className="pt-6 border-t border-readora-border/60 flex flex-wrap items-center gap-2">
          <Tag className="w-4 h-4 text-readora-muted mr-1" />
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-readora-surface border border-readora-border px-3 py-1 rounded-full text-readora-ink"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Author Bio Box */}
      <div className="bg-readora-surface rounded-2xl p-6 sm:p-8 border border-readora-border flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 text-center sm:text-left">
        <img
          src={article.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
          alt={article.author?.full_name}
          className="w-16 h-16 rounded-full object-cover border-2 border-readora-forest/20 flex-shrink-0"
        />
        <div className="space-y-2">
          <div>
            <h3 className="font-serif font-bold text-lg text-readora-ink">{article.author?.full_name}</h3>
            <p className="text-xs text-readora-muted">@{article.author?.username}</p>
          </div>
          <p className="text-xs text-readora-ink/80 leading-relaxed font-sans">{article.author?.bio}</p>
          <div className="pt-2">
            <Link
              to={`/authors/${article.author?.username || article.author?.id}`}
              className="text-xs font-semibold text-readora-forest hover:underline"
            >
              View Full Profile & All Articles →
            </Link>
          </div>
        </div>
      </div>

      {/* Rating the Article */}
      <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border text-center space-y-3">
        <h4 className="font-serif font-bold text-base text-readora-ink">Was this essay insightful?</h4>
        <div className="flex items-center justify-center space-x-1 text-readora-gold">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleSubmitRating(star)}
              className="p-1 hover:scale-125 transition-transform"
            >
              <Star
                className={`w-6 h-6 ${star <= userRating ? 'fill-readora-gold text-readora-gold' : 'text-readora-border'}`}
              />
            </button>
          ))}
        </div>
        <p className="text-xs text-readora-muted">
          {hasRated ? `You rated this ${userRating} stars. Thanks for your feedback!` : 'Click a star to rate.'}
        </p>
      </div>

      {/* Comments Section */}
      <section className="bg-readora-surface rounded-3xl p-6 sm:p-10 border border-readora-border space-y-6">
        <div className="border-b border-readora-border/60 pb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-readora-ink flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-readora-forest" />
            Discussion ({comments.length})
          </h2>
        </div>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your perspective, constructive critique, or reflections on this essay..."
            rows={3}
            className="w-full text-xs bg-readora-ivory border border-readora-border rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-readora-forest leading-relaxed"
          />
          <div className="flex justify-end">
            <CTAButton
              type="submit"
              disabled={!newComment.trim()}
              variant="primary"
              size="sm"
              shape="rounded"
              icon={<Send className="w-3.5 h-3.5" />}
              ctaName={`Post Article Comment - ${article.title}`}
              ctaSection="article_comments"
            >
              Post Comment
            </CTAButton>
          </div>
        </form>

        {/* Comments Feed */}
        <div className="space-y-4 pt-4 divide-y divide-readora-border/60">
          {comments.length === 0 ? (
            <p className="text-xs text-readora-muted text-center py-6">No comments yet. Start the conversation!</p>
          ) : (
            comments.map((cm) => (
              <div key={cm.id} className="pt-4 first:pt-0 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={cm.author?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'}
                    alt={cm.author?.full_name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-bold text-readora-ink">{cm.author?.full_name || 'Reader'}</span>
                    <span className="text-[10px] text-readora-muted ml-2">{new Date(cm.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <p className="text-xs text-readora-ink/90 leading-relaxed font-sans pl-9.5">
                  {cm.content}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-readora-surface w-full max-w-md rounded-2xl p-6 border border-readora-border shadow-editorial space-y-4">
            <h3 className="font-serif font-bold text-lg text-readora-ink">Report Article to Moderators</h3>
            <p className="text-xs text-readora-muted">
              Readora upholds thoughtful literary discourse. Help our team maintain quality by specifying the concern.
            </p>

            {reportSubmitted ? (
              <div className="py-6 text-center text-readora-forest font-semibold text-xs flex flex-col items-center">
                <CheckCircle className="w-8 h-8 mb-2" />
                <span>Thank you. Your report has been submitted for administrative review.</span>
              </div>
            ) : (
              <form onSubmit={handleSendReport} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  >
                    <option value="Plagiarism or Copyright Infringement">Plagiarism / Copyright</option>
                    <option value="Inappropriate or Offensive Content">Inappropriate Content</option>
                    <option value="Misleading Information or Spam">Spam / Low Quality</option>
                    <option value="Harassment or Defamation">Harassment</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Details (Optional)</label>
                  <textarea
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide additional context for moderation staff..."
                    rows={3}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-xl border border-readora-border text-readora-ink font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </article>
  );
};
