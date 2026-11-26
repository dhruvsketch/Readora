import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Layers, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  X, 
  Eye, 
  BookOpen, 
  Clock,
  CheckCircle 
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { Book, BookChapter } from '../../types/database';

export const AdminChaptersPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const bookFilter = searchParams.get('bookId') || '';

  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<BookChapter[]>([]);
  const [selectedBookId, setSelectedBookId] = useState(bookFilter);

  // Modal / Form state
  const [showModal, setShowModal] = useState(false);
  const [editingChapter, setEditingChapter] = useState<BookChapter | null>(null);

  const [chapterNumber, setChapterNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  useEffect(() => {
    if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id);
    }
  }, [books, selectedBookId]);

  const loadData = () => {
    const bks = ReadoraStore.getBooks();
    setBooks(bks);
    setChapters(ReadoraStore.getChapters());
  };

  const currentBook = books.find(b => b.id === selectedBookId);
  const bookChapters = chapters
    .filter(c => c.book_id === selectedBookId)
    .sort((a, b) => a.chapter_number - b.chapter_number);

  const handleOpenCreate = () => {
    setEditingChapter(null);
    setChapterNumber(bookChapters.length + 1);
    setTitle('');
    setSummary('');
    setContent('<p>Write chapter text here...</p>');
    setIsPublished(true);
    setShowModal(true);
  };

  const handleOpenEdit = (ch: BookChapter) => {
    setEditingChapter(ch);
    setChapterNumber(ch.chapter_number);
    setTitle(ch.title);
    setSummary(ch.summary || '');
    setContent(ch.content);
    setIsPublished(ch.is_published);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId || !title.trim()) return;

    ReadoraStore.saveChapter({
      id: editingChapter?.id,
      book_id: selectedBookId,
      chapter_number: Number(chapterNumber),
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      is_published: isPublished,
    });

    setShowModal(false);
    loadData();
  };

  const handleDelete = (id: string, chapterTitle: string) => {
    if (confirm(`Delete "${chapterTitle}"? This cannot be undone.`)) {
      ReadoraStore.deleteChapter(id);
      loadData();
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= bookChapters.length) return;

    const reordered = [...bookChapters];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    ReadoraStore.reorderChapters(selectedBookId, reordered.map(c => c.id));
    loadData();
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-readora-border/60 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Full-Text Management</span>
          <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Chapters & Volumes</h1>
          <p className="text-xs text-readora-muted mt-1">
            Author and sequence full-text reader content for digital editions.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={!selectedBookId}
          className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-readora-forest-light disabled:opacity-50 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Chapter to Book</span>
        </button>
      </div>

      {/* Book Selector Bar */}
      <div className="bg-readora-surface p-4 rounded-2xl border border-readora-border flex items-center space-x-3 text-xs">
        <span className="font-semibold text-readora-ink flex items-center">
          <BookOpen className="w-4 h-4 mr-1.5 text-readora-forest" /> Select Book:
        </span>
        <select
          value={selectedBookId}
          onChange={(e) => {
            setSelectedBookId(e.target.value);
            setSearchParams({ bookId: e.target.value });
          }}
          className="bg-readora-ivory border border-readora-border rounded-xl px-3 py-1.5 text-xs font-semibold text-readora-forest focus:outline-none"
        >
          {books.map(b => (
            <option key={b.id} value={b.id}>{b.title} (by {b.author})</option>
          ))}
        </select>
      </div>

      {/* Chapters Table */}
      <div className="bg-readora-surface rounded-2xl border border-readora-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-readora-border flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-readora-ink">
            {currentBook?.title} — Chapter Sequence ({bookChapters.length})
          </h3>
          <Link
            to={`/read/${selectedBookId}`}
            className="text-xs font-semibold text-readora-forest hover:underline flex items-center"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> Open Reader View
          </Link>
        </div>

        {bookChapters.length === 0 ? (
          <div className="text-center py-12 text-xs text-readora-muted">
            No chapters created yet for this book. Click "Add Chapter" above to create the first section.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-readora-ivory text-readora-muted uppercase font-bold tracking-wider text-[10px] border-b border-readora-border">
                <tr>
                  <th className="py-3 px-4 w-16">Seq</th>
                  <th className="py-3 px-4">Title & Summary</th>
                  <th className="py-3 px-4">Read Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Reorder</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-readora-border">
                {bookChapters.map((ch, idx) => (
                  <tr key={ch.id} className="hover:bg-readora-ivory/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-readora-muted">
                      #{ch.chapter_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-serif font-bold text-sm text-readora-ink">{ch.title}</p>
                      {ch.summary && <p className="text-[11px] text-readora-muted line-clamp-1">{ch.summary}</p>}
                    </td>
                    <td className="py-3.5 px-4 text-readora-muted flex items-center pt-4">
                      <Clock className="w-3 h-3 mr-1" /> {ch.read_time_minutes} min
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ch.is_published ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {ch.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleMove(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 hover:bg-readora-border rounded disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5 text-readora-ink" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 'down')}
                          disabled={idx === bookChapters.length - 1}
                          className="p-1 hover:bg-readora-border rounded disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5 text-readora-ink" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(ch)}
                        className="p-1 text-readora-muted hover:text-readora-ink"
                        title="Edit chapter"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(ch.id, ch.title)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete chapter"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chapter Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-readora-surface w-full max-w-3xl rounded-3xl p-6 sm:p-8 border border-readora-border shadow-editorial space-y-4 my-8">
            <div className="flex justify-between items-center pb-3 border-b border-readora-border">
              <h3 className="font-serif font-bold text-xl text-readora-ink">
                {editingChapter ? 'Edit Chapter' : 'Add New Chapter'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-readora-muted hover:text-readora-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Number</label>
                  <input
                    type="number"
                    min="1"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(Number(e.target.value))}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="font-semibold text-readora-ink block mb-1">Chapter Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Book I: Debts and Lessons"
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Chapter Summary</label>
                <input
                  type="text"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Short one-line synopsis..."
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Full Chapter Content (HTML) *</label>
                <textarea
                  required
                  rows={12}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="<p>Chapter body paragraphs...</p>"
                  className="w-full p-3 font-mono text-xs bg-readora-ivory border border-readora-border rounded-xl focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pub_ch_cb"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="rounded text-readora-forest"
                />
                <label htmlFor="pub_ch_cb" className="font-semibold text-readora-ink">
                  Published and available in reader
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-readora-border">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-readora-border rounded-xl text-readora-ink font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-readora-forest text-readora-ivory px-5 py-2 rounded-xl font-semibold hover:bg-readora-forest-light"
                >
                  Save Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
