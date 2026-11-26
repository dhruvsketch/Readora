import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Save, 
  Send, 
  Eye, 
  ArrowLeft, 
  Image, 
  Tag, 
  BookOpen, 
  Clock, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  List,
  ListOrdered
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ReadoraStore } from '../lib/store';
import { Article, Category, Book } from '../types/database';

export const WritePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [categoryId, setCategoryId] = useState('c6');
  const [tagInput, setTagInput] = useState('Reading, Philosophy');
  const [relatedBookId, setRelatedBookId] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [showPreview, setShowPreview] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  // Load existing article if editing
  useEffect(() => {
    setCategories(ReadoraStore.getCategories());
    setBooks(ReadoraStore.getBooks());

    if (id) {
      const art = ReadoraStore.getArticleById(id);
      if (art) {
        setTitle(art.title);
        setSubtitle(art.subtitle || '');
        setContent(art.content);
        setCoverImage(art.cover_image || '');
        setCategoryId(art.category_id || 'c6');
        setTagInput(art.tags.join(', '));
        setRelatedBookId(art.related_book_id || '');
        setSeoTitle(art.seo_title || '');
        setSeoDescription(art.seo_description || '');
        setStatus(art.status as any);
      }
    }
  }, [id]);

  // Autosave draft debounce
  useEffect(() => {
    if (!title && !content) return;
    if (!user) return;

    setSaveStatus('unsaved');
    const timer = setTimeout(() => {
      setSaveStatus('saving');
      const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
      ReadoraStore.saveArticle({
        id,
        author_id: user.id,
        title: title || 'Untitled Draft',
        subtitle,
        content: content || '<p></p>',
        cover_image: coverImage || undefined,
        category_id: categoryId,
        tags,
        related_book_id: relatedBookId || undefined,
        status: 'draft',
        seo_title: seoTitle,
        seo_description: seoDescription,
      });
      setSaveStatus('saved');
    }, 1500);

    return () => clearTimeout(timer);
  }, [title, subtitle, content, coverImage, categoryId, tagInput, relatedBookId, seoTitle, seoDescription, id, user]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!title.trim()) {
      alert('Please provide an article title before publishing.');
      return;
    }
    if (!content.trim()) {
      alert('Please write article content before publishing.');
      return;
    }

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);
    const published = ReadoraStore.saveArticle({
      id,
      author_id: user.id,
      title: title.trim(),
      subtitle: subtitle.trim(),
      content: content.trim(),
      cover_image: coverImage.trim() || undefined,
      category_id: categoryId,
      tags,
      related_book_id: relatedBookId || undefined,
      status: 'published',
      seo_title: seoTitle || title,
      seo_description: seoDescription || subtitle,
    });

    navigate(`/articles/${published.slug || published.id}`);
  };

  // Helper toolbar actions for rich content formatting
  const insertFormatting = (tag: string, closingTag: string) => {
    const textarea = document.getElementById('article-content-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end);
    const replacement = `${tag}${selected || 'Sample text'}${closingTag}`;
    const newContent = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
    setContent(newContent);
  };

  const calculatedReadTime = Math.max(1, Math.ceil((content.replace(/<[^>]+>/g, '').length) / 800));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-readora-border">
        <div className="flex items-center space-x-3">
          <Link to="/articles" className="p-2 rounded-full hover:bg-readora-surface text-readora-muted hover:text-readora-ink">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="font-serif font-bold text-2xl text-readora-ink">
              {id ? 'Edit Article' : 'Writing Studio'}
            </h1>
            <p className="text-xs text-readora-muted flex items-center space-x-2 mt-0.5">
              <span>{saveStatus === 'saved' ? 'Draft autosaved' : saveStatus === 'saving' ? 'Saving changes...' : 'Unsaved edits'}</span>
              <span>•</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {calculatedReadTime} min read</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border border-readora-border bg-readora-surface hover:bg-readora-ivory text-readora-ink transition-colors"
          >
            <Eye className="w-4 h-4 text-readora-muted" />
            <span>{showPreview ? 'Edit Mode' : 'Preview'}</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex items-center space-x-2 bg-readora-forest text-readora-ivory px-6 py-2.5 rounded-xl text-xs font-semibold hover:bg-readora-forest-light transition-all shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {showPreview ? (
        /* Preview Mode */
        <article className="bg-readora-surface rounded-3xl p-8 sm:p-14 border border-readora-border max-w-3xl mx-auto space-y-8 shadow-sm">
          {coverImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-readora-ivory">
              <img src={coverImage} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="space-y-3 text-center border-b border-readora-border/60 pb-8">
            <span className="text-xs uppercase font-bold tracking-wider text-readora-forest bg-readora-forest/10 px-3 py-1 rounded-full">
              Preview Mode
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-readora-ink leading-tight">{title || 'Untitled Article'}</h1>
            {subtitle && <p className="text-base text-readora-muted italic">{subtitle}</p>}
          </div>
          <div className="prose-editorial" dangerouslySetInnerHTML={{ __html: content }} />
        </article>
      ) : (
        /* Writing Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Editorial Canvas */}
          <div className="lg:col-span-8 bg-readora-surface rounded-3xl p-6 sm:p-10 border border-readora-border space-y-6 shadow-sm">
            
            {/* Title Input */}
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title of your essay or story..."
                className="w-full font-serif text-2xl sm:text-4xl font-bold text-readora-ink placeholder:text-readora-muted/40 focus:outline-none bg-transparent"
              />
            </div>

            {/* Subtitle Input */}
            <div>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="A compelling subtitle or thesis statement..."
                className="w-full font-sans text-sm sm:text-base text-readora-muted placeholder:text-readora-muted/40 focus:outline-none bg-transparent"
              />
            </div>

            {/* Quick Formatting Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-readora-ivory rounded-xl border border-readora-border text-xs">
              <button
                type="button"
                onClick={() => insertFormatting('<h2>', '</h2>')}
                className="p-1.5 hover:bg-readora-surface rounded text-readora-ink font-bold"
                title="Heading 2"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<h3>', '</h3>')}
                className="p-1.5 hover:bg-readora-surface rounded text-readora-ink"
                title="Heading 3"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<strong>', '</strong>')}
                className="p-1.5 hover:bg-readora-surface rounded text-readora-ink"
                title="Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<em>', '</em>')}
                className="p-1.5 hover:bg-readora-surface rounded text-readora-ink"
                title="Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<blockquote>', '</blockquote>')}
                className="p-1.5 hover:bg-readora-surface rounded text-readora-ink"
                title="Blockquote"
              >
                <Quote className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => insertFormatting('<ul><li>', '</li></ul>')}
                className="p-1.5 hover:bg-readora-surface rounded text-readora-ink"
                title="Bulleted List"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Content Textarea */}
            <div>
              <textarea
                id="article-content-editor"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing your narrative, philosophical reflection, or literary criticism here..."
                rows={18}
                className="w-full text-base sm:text-lg font-serif text-readora-ink placeholder:text-readora-muted/40 focus:outline-none bg-transparent leading-relaxed resize-y"
              />
            </div>

          </div>

          {/* Metadata & Publishing Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border space-y-5 shadow-sm text-xs">
              <h3 className="font-serif font-bold text-sm text-readora-ink border-b border-readora-border/60 pb-3">
                Article Metadata
              </h3>

              {/* Cover Image */}
              <div>
                <label className="font-semibold text-readora-ink block mb-1.5 flex items-center">
                  <Image className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Cover Image URL
                </label>
                <input
                  type="url"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
                />
              </div>

              {/* Category */}
              <div>
                <label className="font-semibold text-readora-ink block mb-1.5">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="font-semibold text-readora-ink block mb-1.5 flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Philosophy, Reading, Stoicism"
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
                />
              </div>

              {/* Optional Related Book */}
              <div>
                <label className="font-semibold text-readora-ink block mb-1.5 flex items-center">
                  <BookOpen className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Optional Related Book
                </label>
                <select
                  value={relatedBookId}
                  onChange={(e) => setRelatedBookId(e.target.value)}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                >
                  <option value="">None / Standalone</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SEO & Optimization Settings */}
            <div className="bg-readora-surface rounded-2xl p-6 border border-readora-border space-y-4 shadow-sm text-xs">
              <h3 className="font-serif font-bold text-sm text-readora-ink border-b border-readora-border/60 pb-3 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-readora-gold" /> SEO & Search Meta
              </h3>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">SEO Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Custom search headline..."
                  className="w-full p-2 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Brief summary for search indexing..."
                  rows={2}
                  className="w-full p-2 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
