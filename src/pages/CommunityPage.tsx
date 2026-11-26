import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  MessageSquare, 
  Heart, 
  Bookmark, 
  Send, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Flag, 
  Filter, 
  Plus,
  HelpCircle,
  Users
} from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { useAuth } from '../context/AuthContext';
import { CommunityPost, Book, PostType } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const CommunityPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  // Post form state
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState<PostType>('thought');
  const [relatedBookId, setRelatedBookId] = useState('');
  const [filterTab, setFilterTab] = useState<'latest' | 'popular' | 'questions' | 'quotes'>('latest');
  const [isPosting, setIsPosting] = useState(false);
  const [isCommenting, setIsCommenting] = useState<string | null>(null);

  // Comment expand state
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const composerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  useEffect(() => {
    if (searchParams.get('compose') === 'true') {
      composerRef.current?.scrollIntoView({ behavior: 'smooth' });
      textareaRef.current?.focus();
    }
  }, [searchParams]);

  const loadData = () => {
    setPosts(ReadoraStore.getPosts().filter(p => p.status === 'published'));
    setBooks(ReadoraStore.getBooks().filter(b => b.status === 'published'));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/community', search: '?compose=true' } } });
      return;
    }
    if (!content.trim() || isPosting) return;

    setIsPosting(true);
    ReadoraStore.createPost({
      user_id: user.id,
      content: content.trim(),
      post_type: postType,
      related_book_id: relatedBookId || undefined,
    });

    setContent('');
    setRelatedBookId('');
    loadData();
    setIsPosting(false);
  };

  const handleToggleLike = (postId: string) => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/community' } } });
      return;
    }
    ReadoraStore.toggleLike(user.id, postId, 'post');
    loadData();
  };

  const handleToggleComment = (postId: string) => {
    setExpandedComments(prev => {
      const next = !prev[postId];
      return { ...prev, [postId]: next };
    });
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/community' } } });
      return;
    }
    if (!text?.trim() || isCommenting === postId) return;

    setIsCommenting(postId);
    ReadoraStore.addComment({
      user_id: user.id,
      postId,
      content: text.trim(),
    });

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    loadData();
    setIsCommenting(null);
  };

  const filteredPosts = posts.filter(p => {
    if (filterTab === 'questions') return p.post_type === 'question';
    if (filterTab === 'quotes') return p.post_type === 'quote';
    return true;
  }).sort((a, b) => {
    if (filterTab === 'popular') return (b.likes_count || 0) - (a.likes_count || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Community Actions */}
      <div className="text-center space-y-3 border-b border-readora-border/60 pb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">
          Reflective Discourse
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-readora-ink">
          The Community Commons
        </h1>
        <p className="text-sm text-readora-muted max-w-lg mx-auto">
          Share short reflections, notable literary quotes, book recommendations, and contemplative questions.
        </p>

        {/* Community Header CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
          {!isAuthenticated ? (
            <CTAButton
              to="/signup"
              state={{ from: { pathname: '/community' } }}
              variant="primary"
              size="sm"
              shape="pill"
              ctaName="Community Join the Community"
              ctaSection="community_page_header"
            >
              Join the Community
            </CTAButton>
          ) : (
            <div className="inline-flex items-center space-x-1.5 text-xs text-readora-forest bg-readora-forest/10 px-3 py-1.5 rounded-full font-semibold">
              <Users className="w-3.5 h-3.5" />
              <span>Active Community Member</span>
            </div>
          )}

          <CTAButton
            onClick={() => {
              composerRef.current?.scrollIntoView({ behavior: 'smooth' });
              textareaRef.current?.focus();
            }}
            variant="secondary"
            size="sm"
            shape="pill"
            icon={<MessageSquare className="w-3.5 h-3.5 text-readora-forest" />}
            ctaName="Community Share Your Thoughts"
            ctaSection="community_page_header"
          >
            Share Your Thoughts
          </CTAButton>
        </div>
      </div>

      {/* Post Composer Card */}
      <div ref={composerRef} className="bg-readora-surface rounded-3xl p-6 sm:p-8 border border-readora-border shadow-sm space-y-4">
        <div className="flex items-center space-x-3">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border border-readora-border"
          />
          <div>
            <p className="text-xs font-bold text-readora-ink">{user ? user.full_name : 'Guest Reader'}</p>
            <p className="text-[11px] text-readora-muted">Share a passage or spark an inquiry</p>
          </div>
        </div>

        <form onSubmit={handleCreatePost} className="space-y-4">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What idea or paragraph captured your thoughts today? Type a reflection, quote, or prompt..."
            rows={3}
            className="w-full text-sm font-serif bg-readora-ivory border border-readora-border rounded-2xl p-4 focus:outline-none focus:ring-1 focus:ring-readora-forest leading-relaxed placeholder:font-sans placeholder:text-xs"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            
            {/* Post Type Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-readora-muted font-medium">Topic:</span>
              <select
                value={postType}
                onChange={(e) => setPostType(e.target.value as PostType)}
                className="text-xs bg-readora-ivory border border-readora-border rounded-xl px-3 py-1.5 focus:outline-none font-medium"
              >
                <option value="thought">Short Thought</option>
                <option value="reflection">Reading Reflection</option>
                <option value="quote">Literary Quote</option>
                <option value="question">Discussion Question</option>
                <option value="recommendation">Book Recommendation</option>
              </select>
            </div>

            {/* Optional Related Book */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-readora-muted font-medium">Link Book:</span>
              <select
                value={relatedBookId}
                onChange={(e) => setRelatedBookId(e.target.value)}
                className="text-xs bg-readora-ivory border border-readora-border rounded-xl px-3 py-1.5 focus:outline-none"
              >
                <option value="">None</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>

            <CTAButton
              type="submit"
              disabled={!content.trim()}
              isLoading={isPosting}
              loadingText="Publishing..."
              variant="primary"
              size="sm"
              shape="rounded"
              icon={<Send className="w-3.5 h-3.5" />}
              ctaName="Community Composer Submit"
              ctaSection="community_composer"
            >
              Share
            </CTAButton>
          </div>
        </form>
      </div>

      {/* Feed Filters Bar */}
      <div className="flex items-center space-x-3 text-xs border-b border-readora-border pb-3">
        <button
          onClick={() => setFilterTab('latest')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterTab === 'latest' ? 'bg-readora-forest text-white' : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Latest
        </button>
        <button
          onClick={() => setFilterTab('popular')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterTab === 'popular' ? 'bg-readora-forest text-white' : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => setFilterTab('quotes')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterTab === 'quotes' ? 'bg-readora-forest text-white' : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Quotes
        </button>
        <button
          onClick={() => setFilterTab('questions')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
            filterTab === 'questions' ? 'bg-readora-forest text-white' : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Questions
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {filteredPosts.map((post) => {
          const isLiked = user ? ReadoraStore.isLiked(user.id, post.id) : false;
          const comments = ReadoraStore.getComments({ postId: post.id });
          const isExpanded = expandedComments[post.id];

          return (
            <div
              key={post.id}
              className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4"
            >
              {/* Author Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.author?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80'}
                    alt={post.author?.full_name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-readora-ink">{post.author?.full_name}</h3>
                    <p className="text-[11px] text-readora-muted">{new Date(post.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold tracking-wider text-readora-forest bg-readora-forest/10 px-2.5 py-0.5 rounded">
                  {post.post_type}
                </span>
              </div>

              {/* Main Text */}
              <p className="text-sm font-serif text-readora-ink leading-relaxed">
                {post.content}
              </p>

              {/* Optional linked book pill */}
              {post.related_book && (
                <div className="p-3 bg-readora-ivory rounded-xl border border-readora-border flex items-center space-x-3">
                  <img
                    src={post.related_book.cover_image}
                    alt={post.related_book.title}
                    className="w-8 h-12 object-cover rounded shadow-sm"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-readora-gold tracking-wider">Referenced Book</span>
                    <Link
                      to={`/books/${post.related_book.slug || post.related_book.id}`}
                      className="block text-xs font-serif font-bold text-readora-ink hover:underline truncate"
                    >
                      {post.related_book.title}
                    </Link>
                    <p className="text-[11px] text-readora-muted">{post.related_book.author}</p>
                  </div>
                </div>
              )}

              {/* Interaction Bar */}
              <div className="pt-3 border-t border-readora-border/60 flex items-center justify-between text-xs text-readora-muted">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center space-x-1.5 transition-colors ${
                      isLiked ? 'text-red-600 font-bold' : 'hover:text-readora-ink'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{post.likes_count || 0}</span>
                  </button>

                  <button
                    onClick={() => handleToggleComment(post.id)}
                    className="flex items-center space-x-1.5 hover:text-readora-ink transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{comments.length || post.comments_count || 0}</span>
                  </button>
                </div>

                {/* Join Discussion CTA Button */}
                <CTAButton
                  variant="text"
                  size="sm"
                  withArrow
                  onClick={() => handleToggleComment(post.id)}
                  ctaName={`Join Discussion - ${post.id}`}
                  ctaSection="community_feed_card"
                >
                  Join Discussion
                </CTAButton>
              </div>

              {/* Expanded Comments */}
              {isExpanded && (
                <div className="pt-4 border-t border-readora-border/60 space-y-3">
                  {/* Comments list */}
                  <div className="space-y-2">
                    {comments.length === 0 ? (
                      <p className="text-xs text-readora-muted py-2">No comments yet. Be the first to join the conversation!</p>
                    ) : (
                      comments.map((c) => (
                        <div key={c.id} className="p-2.5 bg-readora-ivory/60 rounded-xl text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-readora-ink">{c.author?.full_name || 'Reader'}</span>
                            <span className="text-[10px] text-readora-muted">{new Date(c.created_at).toLocaleDateString()}</span>
                          </div>
                          <p className="text-readora-ink/90 font-sans">{c.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment row */}
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      placeholder="Write a constructive response..."
                      className="flex-1 text-xs bg-readora-ivory border border-readora-border rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-readora-forest"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <CTAButton
                      onClick={() => handleAddComment(post.id)}
                      disabled={!commentInputs[post.id]?.trim()}
                      isLoading={isCommenting === post.id}
                      loadingText="Sending..."
                      variant="primary"
                      size="sm"
                      shape="rounded"
                      ctaName="Comment Reply"
                      ctaSection="community_comment"
                    >
                      Reply
                    </CTAButton>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
