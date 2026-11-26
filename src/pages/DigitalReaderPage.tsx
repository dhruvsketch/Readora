import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  Bookmark, 
  List, 
  MessageSquare, 
  Sun, 
  Moon, 
  Maximize2, 
  Minimize2, 
  CheckCircle,
  X,
  Plus
} from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { useAuth } from '../context/AuthContext';
import { Book, BookChapter, PrivateNote } from '../types/database';

export const DigitalReaderPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  // Reader Settings
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [theme, setTheme] = useState<'ivory' | 'sepia' | 'dark' | 'purewhite'>('ivory');
  const [showSettings, setShowSettings] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Bookmarks & Notes
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [notes, setNotes] = useState<PrivateNote[]>([]);
  const [newNoteText, setNewNoteText] = useState('');
  const [selectedQuote, setSelectedQuote] = useState('');

  const contentRef = useRef<HTMLDivElement>(null);

  // Load Book and Chapters
  useEffect(() => {
    if (!bookId) return;
    const b = ReadoraStore.getBookById(bookId);
    if (!b) return;
    setBook(b);

    const chs = ReadoraStore.getChapters(b.id);
    setChapters(chs);

    // Chapter parameter from query string or reading progress
    const queryChapterId = searchParams.get('ch');
    if (queryChapterId) {
      const idx = chs.findIndex(c => c.id === queryChapterId);
      if (idx >= 0) setCurrentChapterIndex(idx);
    } else if (user) {
      const prog = ReadoraStore.getReadingProgress(user.id, b.id);
      if (prog && prog.chapter_id) {
        const idx = chs.findIndex(c => c.id === prog.chapter_id);
        if (idx >= 0) setCurrentChapterIndex(idx);
      }
    }
  }, [bookId, searchParams, user]);

  const currentChapter = chapters[currentChapterIndex];

  // Load bookmarks & notes for current chapter
  useEffect(() => {
    if (user && book && currentChapter) {
      const bms = ReadoraStore.getBookmarks(user.id);
      setIsBookmarked(bms.some(b => b.book_id === book.id && b.chapter_id === currentChapter.id));

      const nts = ReadoraStore.getPrivateNotes(user.id, book.id);
      setNotes(nts.filter(n => n.chapter_id === currentChapter.id || !n.chapter_id));

      // Save reading progress in store
      const percent = Math.round(((currentChapterIndex + 1) / chapters.length) * 100);
      ReadoraStore.saveReadingProgress(user.id, book.id, currentChapter.id, percent);
    }
  }, [user, book, currentChapter, currentChapterIndex, chapters.length]);

  // Handle Text Selection for Notes
  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedQuote(selection.toString().trim());
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !book || !newNoteText.trim()) return;

    const saved = ReadoraStore.savePrivateNote({
      user_id: user.id,
      book_id: book.id,
      chapter_id: currentChapter?.id,
      selected_text: selectedQuote,
      note_text: newNoteText.trim(),
      color: 'gold',
    });

    setNotes([...notes, saved]);
    setNewNoteText('');
    setSelectedQuote('');
  };

  const handleToggleBookmark = () => {
    if (!user || !book || !currentChapter) return;
    const res = ReadoraStore.toggleBookmark(user.id, {
      bookId: book.id,
      chapterId: currentChapter.id,
      label: `${book.title} — ${currentChapter.title}`,
    });
    setIsBookmarked(res);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  if (!book || chapters.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-readora-ivory">
        <p className="text-sm text-readora-muted font-serif">Opening volume...</p>
      </div>
    );
  }

  // Theme styling mapping
  const themeClasses = {
    ivory: 'bg-readora-ivory text-readora-ink',
    sepia: 'bg-[#F4ECD8] text-[#382C1E]',
    dark: 'bg-[#191B1A] text-[#E2DFD8]',
    purewhite: 'bg-white text-[#111111]',
  }[theme];

  const fontSizeClasses = {
    sm: 'text-base leading-relaxed',
    base: 'text-lg leading-relaxed',
    lg: 'text-xl leading-loose',
    xl: 'text-2xl leading-loose',
  }[fontSize];

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${themeClasses}`}>
      
      {/* Reader Top Bar */}
      <header className="sticky top-0 z-30 border-b border-black/10 backdrop-blur-md px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Back & Title */}
        <div className="flex items-center space-x-4">
          <Link
            to={`/books/${book.slug || book.id}`}
            className="p-1.5 rounded-full hover:bg-black/5 transition-colors"
            title="Return to Book Overview"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="hidden sm:block">
            <h1 className="font-serif font-bold text-sm truncate max-w-xs md:max-w-md">{book.title}</h1>
            <p className="text-[11px] opacity-75">{currentChapter?.title}</p>
          </div>
        </div>

        {/* Center: Progress Indicator */}
        <div className="hidden md:flex items-center space-x-2 text-xs opacity-75">
          <span>Chapter {currentChapterIndex + 1} of {chapters.length}</span>
          <span>•</span>
          <span>{Math.round(((currentChapterIndex + 1) / chapters.length) * 100)}%</span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Table of contents trigger */}
          <button
            onClick={() => setShowToc(!showToc)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            title="Table of Contents"
          >
            <List className="w-5 h-5" />
          </button>

          {/* Bookmark */}
          <button
            onClick={handleToggleBookmark}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            title={isBookmarked ? "Remove Bookmark" : "Bookmark this chapter"}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-readora-gold text-readora-gold' : ''}`} />
          </button>

          {/* Private Notes drawer */}
          <button
            onClick={() => setShowNotesDrawer(!showNotesDrawer)}
            className="relative p-2 rounded-full hover:bg-black/5 transition-colors"
            title="Private Annotations & Notes"
          >
            <MessageSquare className="w-5 h-5" />
            {notes.length > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-readora-gold text-[9px] font-bold text-readora-ink flex items-center justify-center">
                {notes.length}
              </span>
            )}
          </button>

          {/* Appearance Settings */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
            title="Typography & Themes"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="hidden sm:block p-2 rounded-full hover:bg-black/5 transition-colors"
            title="Toggle Distraction-free Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* Settings Dropdown Popover */}
      {showSettings && (
        <div className="fixed top-18 right-4 sm:right-8 z-40 bg-readora-surface text-readora-ink p-5 rounded-2xl shadow-editorial border border-readora-border w-72 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-readora-border">
            <span className="font-serif font-bold text-sm">Reading Preferences</span>
            <button onClick={() => setShowSettings(false)} className="text-readora-muted hover:text-readora-ink">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Themes */}
          <div>
            <label className="text-xs font-semibold text-readora-muted uppercase tracking-wider block mb-2">Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'ivory', label: 'Ivory', bg: 'bg-[#F8F6F1] border-[#E7E4DC]' },
                { id: 'sepia', label: 'Sepia', bg: 'bg-[#F4ECD8] border-[#DFCFA8]' },
                { id: 'dark', label: 'Dark', bg: 'bg-[#191B1A] text-white border-[#333]' },
                { id: 'purewhite', label: 'White', bg: 'bg-white border-[#DDD]' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as any)}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-medium border ${t.bg} ${
                    theme === t.id ? 'ring-2 ring-readora-forest font-bold' : ''
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font Sizes */}
          <div>
            <label className="text-xs font-semibold text-readora-muted uppercase tracking-wider block mb-2">Font Size</label>
            <div className="grid grid-cols-4 gap-2">
              {(['sm', 'base', 'lg', 'xl'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`py-2 text-center rounded-xl text-xs font-semibold border ${
                    fontSize === size 
                      ? 'bg-readora-forest text-readora-ivory border-readora-forest' 
                      : 'bg-readora-ivory text-readora-ink border-readora-border'
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents Drawer */}
      {showToc && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-start">
          <div className="w-80 sm:w-96 bg-readora-surface text-readora-ink h-full shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex justify-between items-center border-b border-readora-border pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-readora-ink">Table of Contents</h3>
                <p className="text-xs text-readora-muted">{book.title}</p>
              </div>
              <button onClick={() => setShowToc(false)} className="p-1 rounded-full hover:bg-readora-ivory">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {chapters.map((ch, idx) => (
                <div
                  key={ch.id}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setShowToc(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-3 rounded-xl cursor-pointer transition-colors text-xs ${
                    idx === currentChapterIndex
                      ? 'bg-readora-forest text-readora-ivory font-semibold'
                      : 'hover:bg-readora-ivory text-readora-ink'
                  }`}
                >
                  <span className="block text-[10px] uppercase tracking-wider opacity-80">Chapter {ch.chapter_number}</span>
                  <p className="text-sm font-serif mt-0.5">{ch.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Private Notes Drawer */}
      {showNotesDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex justify-end">
          <div className="w-80 sm:w-96 bg-readora-surface text-readora-ink h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-readora-border pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-readora-ink">Private Notes</h3>
                  <p className="text-xs text-readora-muted">Encrypted & restricted to your account</p>
                </div>
                <button onClick={() => setShowNotesDrawer(false)} className="p-1 rounded-full hover:bg-readora-ivory">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3 bg-readora-ivory p-3.5 rounded-xl border border-readora-border">
                {selectedQuote && (
                  <div className="p-2 bg-readora-gold/15 border-l-2 border-readora-gold rounded text-xs italic">
                    "{selectedQuote}"
                  </div>
                )}
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder={selectedQuote ? "Write your insight on this quote..." : "Highlight text in reader or type an insight..."}
                  rows={3}
                  className="w-full text-xs bg-readora-surface border border-readora-border rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-readora-forest"
                />
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="w-full bg-readora-forest text-readora-ivory text-xs font-semibold py-2 rounded-lg hover:bg-readora-forest-light disabled:opacity-50 transition-colors"
                >
                  Save Private Note
                </button>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                {notes.length === 0 ? (
                  <p className="text-xs text-readora-muted text-center py-6">No notes added for this chapter yet.</p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="p-3 bg-readora-ivory rounded-xl border border-readora-border text-xs space-y-1.5">
                      {n.selected_text && (
                        <p className="italic text-readora-muted border-l-2 border-readora-gold pl-2">
                          "{n.selected_text}"
                        </p>
                      )}
                      <p className="font-medium text-readora-ink">{n.note_text}</p>
                      <span className="text-[10px] text-readora-muted block">{new Date(n.created_at).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Reading Flow Container */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 sm:px-10 py-12 sm:py-20" onMouseUp={handleMouseUp}>
        {currentChapter ? (
          <article className="space-y-8">
            
            {/* Chapter Header */}
            <header className="text-center space-y-3 pb-8 border-b border-black/10">
              <span className="text-xs uppercase font-bold tracking-widest text-readora-gold">
                Chapter {currentChapter.chapter_number}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                {currentChapter.title}
              </h2>
              {currentChapter.summary && (
                <p className="text-xs sm:text-sm opacity-75 italic max-w-lg mx-auto">
                  {currentChapter.summary}
                </p>
              )}
            </header>

            {/* Chapter Text Body */}
            <div 
              ref={contentRef}
              className={`prose-editorial ${fontSizeClasses}`}
              dangerouslySetInnerHTML={{ __html: currentChapter.content }}
            />

            {/* End of Chapter Navigation Controls */}
            <nav className="pt-16 mt-16 border-t border-black/10 flex items-center justify-between">
              {currentChapterIndex > 0 ? (
                <button
                  onClick={() => {
                    setCurrentChapterIndex(currentChapterIndex - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-semibold px-4 py-2.5 rounded-full border border-black/20 hover:bg-black/5 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous: Chapter {currentChapterIndex}</span>
                </button>
              ) : <div />}

              {currentChapterIndex < chapters.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentChapterIndex(currentChapterIndex + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center space-x-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-readora-forest text-readora-ivory hover:bg-readora-forest-light transition-colors shadow-sm"
                >
                  <span>Next: Chapter {currentChapterIndex + 2}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  to={`/books/${book.id}`}
                  className="inline-flex items-center space-x-2 text-xs font-semibold px-5 py-2.5 rounded-full bg-readora-forest text-readora-ivory hover:bg-readora-forest-light transition-colors shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed Book! Return to Overview</span>
                </Link>
              )}
            </nav>

          </article>
        ) : (
          <p className="text-center text-sm text-readora-muted font-serif">No content available for this section.</p>
        )}
      </main>

    </div>
  );
};
