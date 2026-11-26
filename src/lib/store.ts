import { 
  Book, 
  BookChapter, 
  Article, 
  CommunityPost, 
  Comment, 
  Category, 
  Profile, 
  ReadingProgress, 
  Bookmark, 
  PrivateNote, 
  BookListing, 
  BorrowingRequest, 
  NotificationItem, 
  ReportItem,
  Rating
} from '../types/database';
import { 
  INITIAL_BOOKS, 
  INITIAL_CHAPTERS, 
  INITIAL_ARTICLES, 
  INITIAL_POSTS, 
  INITIAL_COMMENTS, 
  INITIAL_CATEGORIES, 
  INITIAL_PROFILES, 
  INITIAL_LISTINGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_REPORTS 
} from './mockData';

// Storage Keys
const KEYS = {
  BOOKS: 'readora_books',
  CHAPTERS: 'readora_chapters',
  ARTICLES: 'readora_articles',
  POSTS: 'readora_posts',
  COMMENTS: 'readora_comments',
  CATEGORIES: 'readora_categories',
  PROFILES: 'readora_profiles',
  PROGRESS: 'readora_reading_progress',
  BOOKMARKS: 'readora_bookmarks',
  NOTES: 'readora_private_notes',
  LISTINGS: 'readora_listings',
  BORROWINGS: 'readora_borrowings',
  NOTIFICATIONS: 'readora_notifications',
  REPORTS: 'readora_reports',
  RATINGS: 'readora_ratings',
  USER_LIKES: 'readora_user_likes',
  USER_FOLLOWS: 'readora_user_follows',
};

// Helper to get from LocalStorage with fallback
function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : JSON.parse(JSON.stringify(fallback));
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return JSON.parse(JSON.stringify(fallback));
  }
}

function setStored<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    // Dispatch custom event for reactive cross-component sync
    window.dispatchEvent(new Event('readora_storage_change'));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

let counter = 0;
function generateId(prefix: string): string {
  counter += 1;
  return `${prefix}_${Date.now()}_${counter}_${Math.random().toString(36).slice(2, 7)}`;
}

export class ReadoraStore {
  // Books
  static getBooks(): Book[] {
    const stored = getStored<Book[]>(KEYS.BOOKS, INITIAL_BOOKS);
    return stored.map(b => {
      const initial = INITIAL_BOOKS.find(ib => ib.id === b.id);
      if (initial) {
        return {
          ...b,
          title: initial.title,
          read_url: initial.read_url !== undefined ? initial.read_url : b.read_url,
          slug: initial.slug || b.slug,
          description: initial.description || b.description,
        };
      }
      return b;
    });
  }

  static getBookById(id: string): Book | undefined {
    return this.getBooks().find(b => b.id === id || b.slug === id);
  }

  static saveBook(book: Partial<Book> & { title: string; author: string }): Book {
    const books = this.getBooks();
    const existingIndex = books.findIndex(b => b.id === book.id);
    
    const slug = book.slug || book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    if (existingIndex >= 0) {
      const updated: Book = {
        ...books[existingIndex],
        ...book,
        slug,
        updated_at: new Date().toISOString(),
      };
      books[existingIndex] = updated;
      setStored(KEYS.BOOKS, books);
      return updated;
    } else {
      const newBook: Book = {
        id: book.id || generateId('book'),
        title: book.title,
        slug,
        description: book.description || '',
        author: book.author,
        cover_image: book.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
        category_id: book.category_id || 'c1',
        language: book.language || 'English',
        publisher: book.publisher || 'Independent Press',
        publication_date: book.publication_date || new Date().toISOString().split('T')[0],
        format: book.format || 'Chapter-based',
        license: book.license || 'Public Domain',
        file_url: book.file_url,
        read_url: book.read_url,
        status: book.status || 'published',
        is_featured: book.is_featured ?? false,
        reading_permissions: book.reading_permissions || 'public',
        created_at: new Date().toISOString(),
        average_rating: 0,
        ratings_count: 0,
        chapters_count: 0,
      };
      books.unshift(newBook);
      setStored(KEYS.BOOKS, books);
      return newBook;
    }
  }

  static deleteBook(id: string): void {
    const books = this.getBooks().filter(b => b.id !== id);
    setStored(KEYS.BOOKS, books);
    // Also delete chapters
    const chapters = this.getChapters().filter(c => c.book_id !== id);
    setStored(KEYS.CHAPTERS, chapters);
  }

  // Chapters
  static getChapters(bookId?: string): BookChapter[] {
    const all = getStored<BookChapter[]>(KEYS.CHAPTERS, INITIAL_CHAPTERS);
    if (!bookId) return all;
    return all.filter(c => c.book_id === bookId).sort((a, b) => a.chapter_number - b.chapter_number);
  }

  static getChapterById(id: string): BookChapter | undefined {
    return this.getChapters().find(c => c.id === id);
  }

  static saveChapter(chapter: Partial<BookChapter> & { book_id: string; title: string; content: string }): BookChapter {
    const chapters = this.getChapters();
    const existingIndex = chapters.findIndex(c => c.id === chapter.id);

    if (existingIndex >= 0) {
      const updated: BookChapter = {
        ...chapters[existingIndex],
        ...chapter,
        updated_at: new Date().toISOString(),
      };
      chapters[existingIndex] = updated;
      setStored(KEYS.CHAPTERS, chapters);
      return updated;
    } else {
      const bookChapters = chapters.filter(c => c.book_id === chapter.book_id);
      const nextNum = chapter.chapter_number || bookChapters.length + 1;
      const newChapter: BookChapter = {
        id: chapter.id || generateId('ch'),
        book_id: chapter.book_id,
        chapter_number: nextNum,
        title: chapter.title,
        content: chapter.content,
        summary: chapter.summary || '',
        read_time_minutes: chapter.read_time_minutes || Math.max(2, Math.ceil(chapter.content.length / 900)),
        is_published: chapter.is_published ?? true,
        created_at: new Date().toISOString(),
      };
      chapters.push(newChapter);
      setStored(KEYS.CHAPTERS, chapters);

      // Update book's chapter count
      const books = this.getBooks();
      const bIdx = books.findIndex(b => b.id === chapter.book_id);
      if (bIdx >= 0) {
        books[bIdx].chapters_count = (books[bIdx].chapters_count || 0) + 1;
        setStored(KEYS.BOOKS, books);
      }

      return newChapter;
    }
  }

  static reorderChapters(bookId: string, orderedIds: string[]): void {
    const all = this.getChapters();
    orderedIds.forEach((id, index) => {
      const idx = all.findIndex(c => c.id === id && c.book_id === bookId);
      if (idx >= 0) {
        all[idx].chapter_number = index + 1;
      }
    });
    setStored(KEYS.CHAPTERS, all);
  }

  static deleteChapter(id: string): void {
    const chapters = this.getChapters();
    const target = chapters.find(c => c.id === id);
    const filtered = chapters.filter(c => c.id !== id);
    setStored(KEYS.CHAPTERS, filtered);
    if (target) {
      const books = this.getBooks();
      const bIdx = books.findIndex(b => b.id === target.book_id);
      if (bIdx >= 0) {
        books[bIdx].chapters_count = Math.max(0, (books[bIdx].chapters_count || 1) - 1);
        setStored(KEYS.BOOKS, books);
      }
    }
  }

  // Articles
  static getArticles(): Article[] {
    const articles = getStored<Article[]>(KEYS.ARTICLES, INITIAL_ARTICLES);
    const profiles = this.getProfiles();
    const categories = this.getCategories();
    return articles.map(art => ({
      ...art,
      author: profiles.find(p => p.id === art.author_id),
      category: categories.find(c => c.id === art.category_id),
    }));
  }

  static getArticleById(idOrSlug: string): Article | undefined {
    const articles = this.getArticles();
    return articles.find(a => a.id === idOrSlug || a.slug === idOrSlug);
  }

  static saveArticle(article: Partial<Article> & { title: string; content: string; author_id: string }): Article {
    const articles = getStored<Article[]>(KEYS.ARTICLES, INITIAL_ARTICLES);
    const existingIndex = articles.findIndex(a => a.id === article.id);
    const slug = article.slug || article.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const readTime = Math.max(1, Math.ceil(article.content.length / 800));

    if (existingIndex >= 0) {
      const updated: Article = {
        ...articles[existingIndex],
        ...article,
        slug,
        read_time_minutes: readTime,
        updated_at: new Date().toISOString(),
      };
      articles[existingIndex] = updated;
      setStored(KEYS.ARTICLES, articles);
      return updated;
    } else {
      const newArticle: Article = {
        id: article.id || `art_${Date.now()}`,
        title: article.title,
        slug,
        subtitle: article.subtitle || '',
        content: article.content,
        excerpt: article.excerpt || article.content.replace(/<[^>]+>/g, '').slice(0, 160) + '...',
        cover_image: article.cover_image || 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
        author_id: article.author_id,
        category_id: article.category_id || 'c6',
        tags: article.tags || ['Literature', 'Ideas'],
        read_time_minutes: readTime,
        status: article.status || 'draft',
        is_featured: article.is_featured ?? false,
        seo_title: article.seo_title || article.title,
        seo_description: article.seo_description || article.excerpt,
        views_count: 0,
        likes_count: 0,
        comments_count: 0,
        average_rating: 0,
        ratings_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      articles.unshift(newArticle);
      setStored(KEYS.ARTICLES, articles);
      return newArticle;
    }
  }

  static deleteArticle(id: string): void {
    const articles = getStored<Article[]>(KEYS.ARTICLES, INITIAL_ARTICLES).filter(a => a.id !== id);
    setStored(KEYS.ARTICLES, articles);
  }

  // Community Posts
  static getPosts(): CommunityPost[] {
    const posts = getStored<CommunityPost[]>(KEYS.POSTS, INITIAL_POSTS);
    const profiles = this.getProfiles();
    const books = this.getBooks();
    const articles = this.getArticles();
    return posts.map(p => ({
      ...p,
      author: profiles.find(pr => pr.id === p.user_id),
      related_book: p.related_book_id ? books.find(b => b.id === p.related_book_id) : undefined,
      related_article: p.related_article_id ? articles.find(a => a.id === p.related_article_id) : undefined,
    }));
  }

  static createPost(post: { user_id: string; content: string; post_type: any; related_book_id?: string }): CommunityPost {
    const posts = getStored<CommunityPost[]>(KEYS.POSTS, INITIAL_POSTS);
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      user_id: post.user_id,
      content: post.content,
      post_type: post.post_type || 'thought',
      related_book_id: post.related_book_id,
      status: 'published',
      likes_count: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
    };
    posts.unshift(newPost);
    setStored(KEYS.POSTS, posts);
    return newPost;
  }

  static deletePost(id: string): void {
    const posts = getStored<CommunityPost[]>(KEYS.POSTS, INITIAL_POSTS).filter(p => p.id !== id);
    setStored(KEYS.POSTS, posts);
  }

  // Comments
  static getComments(target: { postId?: string; articleId?: string; bookId?: string }): Comment[] {
    const all = getStored<Comment[]>(KEYS.COMMENTS, INITIAL_COMMENTS);
    const profiles = this.getProfiles();
    return all
      .filter(c => {
        if (target.postId && c.post_id === target.postId) return true;
        if (target.articleId && c.article_id === target.articleId) return true;
        if (target.bookId && c.book_id === target.bookId) return true;
        return false;
      })
      .map(c => ({
        ...c,
        author: profiles.find(p => p.id === c.user_id),
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }

  static addComment(comment: { user_id: string; content: string; postId?: string; articleId?: string; bookId?: string }): Comment {
    const all = getStored<Comment[]>(KEYS.COMMENTS, INITIAL_COMMENTS);
    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      user_id: comment.user_id,
      post_id: comment.postId,
      article_id: comment.articleId,
      book_id: comment.bookId,
      content: comment.content,
      created_at: new Date().toISOString(),
    };
    all.push(newComment);
    setStored(KEYS.COMMENTS, all);

    // Update parent comment counts
    if (comment.postId) {
      const posts = getStored<CommunityPost[]>(KEYS.POSTS, INITIAL_POSTS);
      const p = posts.find(x => x.id === comment.postId);
      if (p) {
        p.comments_count = (p.comments_count || 0) + 1;
        setStored(KEYS.POSTS, posts);
      }
    }
    if (comment.articleId) {
      const articles = getStored<Article[]>(KEYS.ARTICLES, INITIAL_ARTICLES);
      const a = articles.find(x => x.id === comment.articleId);
      if (a) {
        a.comments_count = (a.comments_count || 0) + 1;
        setStored(KEYS.ARTICLES, articles);
      }
    }

    return newComment;
  }

  static deleteComment(id: string): void {
    const all = getStored<Comment[]>(KEYS.COMMENTS, INITIAL_COMMENTS).filter(c => c.id !== id);
    setStored(KEYS.COMMENTS, all);
  }

  // Likes
  static isLiked(userId: string, targetId: string): boolean {
    const likes = getStored<Record<string, string[]>>(KEYS.USER_LIKES, {});
    return (likes[userId] || []).includes(targetId);
  }

  static toggleLike(userId: string, targetId: string, type: 'post' | 'article'): boolean {
    const likes = getStored<Record<string, string[]>>(KEYS.USER_LIKES, {});
    const userLikes = likes[userId] || [];
    const alreadyLiked = userLikes.includes(targetId);

    if (alreadyLiked) {
      likes[userId] = userLikes.filter(id => id !== targetId);
    } else {
      likes[userId] = [...userLikes, targetId];
    }
    setStored(KEYS.USER_LIKES, likes);

    // Increment/decrement target count
    if (type === 'post') {
      const posts = getStored<CommunityPost[]>(KEYS.POSTS, INITIAL_POSTS);
      const p = posts.find(x => x.id === targetId);
      if (p) {
        p.likes_count = Math.max(0, (p.likes_count || 0) + (alreadyLiked ? -1 : 1));
        setStored(KEYS.POSTS, posts);
      }
    } else if (type === 'article') {
      const articles = getStored<Article[]>(KEYS.ARTICLES, INITIAL_ARTICLES);
      const a = articles.find(x => x.id === targetId);
      if (a) {
        a.likes_count = Math.max(0, (a.likes_count || 0) + (alreadyLiked ? -1 : 1));
        setStored(KEYS.ARTICLES, articles);
      }
    }

    return !alreadyLiked;
  }

  // Follows
  static isFollowing(followerId: string, targetId: string): boolean {
    const follows = getStored<Record<string, string[]>>(KEYS.USER_FOLLOWS, {});
    return (follows[followerId] || []).includes(targetId);
  }

  static toggleFollow(followerId: string, targetId: string): boolean {
    const follows = getStored<Record<string, string[]>>(KEYS.USER_FOLLOWS, {});
    const list = follows[followerId] || [];
    const isFollowed = list.includes(targetId);

    if (isFollowed) {
      follows[followerId] = list.filter(id => id !== targetId);
    } else {
      follows[followerId] = [...list, targetId];
    }
    setStored(KEYS.USER_FOLLOWS, follows);
    return !isFollowed;
  }

  // Ratings
  static getRatings(itemId: string): Rating[] {
    const all = getStored<Rating[]>(KEYS.RATINGS, []);
    const profiles = this.getProfiles();
    return all.filter(r => r.item_id === itemId).map(r => ({
      ...r,
      user: profiles.find(p => p.id === r.user_id),
    }));
  }

  static submitRating(rating: { user_id: string; item_id: string; rating: number; review_title?: string; review_text?: string }): Rating {
    const all = getStored<Rating[]>(KEYS.RATINGS, []);
    const existingIndex = all.findIndex(r => r.user_id === rating.user_id && r.item_id === rating.item_id);

    const record: Rating = {
      id: existingIndex >= 0 ? all[existingIndex].id : `rating_${Date.now()}`,
      user_id: rating.user_id,
      item_id: rating.item_id,
      rating: rating.rating,
      review_title: rating.review_title,
      review_text: rating.review_text,
      created_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      all[existingIndex] = record;
    } else {
      all.push(record);
    }
    setStored(KEYS.RATINGS, all);

    // Recompute average on Book
    const books = this.getBooks();
    const bIdx = books.findIndex(b => b.id === rating.item_id);
    if (bIdx >= 0) {
      const itemRatings = all.filter(r => r.item_id === rating.item_id);
      const avg = itemRatings.reduce((sum, r) => sum + r.rating, 0) / itemRatings.length;
      books[bIdx].average_rating = Number(avg.toFixed(1));
      books[bIdx].ratings_count = itemRatings.length;
      setStored(KEYS.BOOKS, books);
    }

    return record;
  }

  // Reading Progress
  static getReadingProgress(userId: string, bookId: string): ReadingProgress | undefined {
    const all = getStored<ReadingProgress[]>(KEYS.PROGRESS, []);
    return all.find(p => p.user_id === userId && p.book_id === bookId);
  }

  static getUserReadingHistory(userId: string): ReadingProgress[] {
    const all = getStored<ReadingProgress[]>(KEYS.PROGRESS, []);
    const books = this.getBooks();
    const chapters = this.getChapters();
    return all
      .filter(p => p.user_id === userId)
      .map(p => ({
        ...p,
        book: books.find(b => b.id === p.book_id),
        chapter: chapters.find(c => c.id === p.chapter_id),
      }))
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  }

  static saveReadingProgress(userId: string, bookId: string, chapterId: string, percent: number, position?: string): ReadingProgress {
    const all = getStored<ReadingProgress[]>(KEYS.PROGRESS, []);
    const existingIndex = all.findIndex(p => p.user_id === userId && p.book_id === bookId);

    const record: ReadingProgress = {
      id: existingIndex >= 0 ? all[existingIndex].id : `prog_${Date.now()}`,
      user_id: userId,
      book_id: bookId,
      chapter_id: chapterId,
      progress_percent: Math.min(100, Math.max(0, percent)),
      last_read_position: position,
      is_completed: percent >= 100,
      updated_at: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      all[existingIndex] = record;
    } else {
      all.push(record);
    }
    setStored(KEYS.PROGRESS, all);
    return record;
  }

  // Bookmarks
  static getBookmarks(userId: string): Bookmark[] {
    const all = getStored<Bookmark[]>(KEYS.BOOKMARKS, []);
    const books = this.getBooks();
    const articles = this.getArticles();
    return all
      .filter(b => b.user_id === userId)
      .map(b => ({
        ...b,
        book: b.book_id ? books.find(bk => bk.id === b.book_id) : undefined,
        article: b.article_id ? articles.find(a => a.id === b.article_id) : undefined,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static toggleBookmark(userId: string, target: { bookId?: string; articleId?: string; chapterId?: string; label?: string }): boolean {
    const all = getStored<Bookmark[]>(KEYS.BOOKMARKS, []);
    const existingIndex = all.findIndex(b => 
      b.user_id === userId && 
      ((target.bookId && b.book_id === target.bookId) || (target.articleId && b.article_id === target.articleId))
    );

    if (existingIndex >= 0) {
      all.splice(existingIndex, 1);
      setStored(KEYS.BOOKMARKS, all);
      return false;
    } else {
      const newBookmark: Bookmark = {
        id: `bm_${Date.now()}`,
        user_id: userId,
        book_id: target.bookId,
        article_id: target.articleId,
        chapter_id: target.chapterId,
        label: target.label || 'Saved item',
        created_at: new Date().toISOString(),
      };
      all.unshift(newBookmark);
      setStored(KEYS.BOOKMARKS, all);
      return true;
    }
  }

  // Private Notes
  static getPrivateNotes(userId: string, bookId?: string): PrivateNote[] {
    const all = getStored<PrivateNote[]>(KEYS.NOTES, []);
    return all.filter(n => n.user_id === userId && (!bookId || n.book_id === bookId));
  }

  static savePrivateNote(note: { id?: string; user_id: string; book_id: string; chapter_id?: string; selected_text?: string; note_text: string; color?: any }): PrivateNote {
    const all = getStored<PrivateNote[]>(KEYS.NOTES, []);
    const existingIndex = all.findIndex(n => n.id === note.id);

    if (existingIndex >= 0) {
      const updated: PrivateNote = {
        ...all[existingIndex],
        ...note,
        updated_at: new Date().toISOString(),
      };
      all[existingIndex] = updated;
      setStored(KEYS.NOTES, all);
      return updated;
    } else {
      const newNote: PrivateNote = {
        id: `note_${Date.now()}`,
        user_id: note.user_id,
        book_id: note.book_id,
        chapter_id: note.chapter_id,
        selected_text: note.selected_text,
        note_text: note.note_text,
        color: note.color || 'gold',
        created_at: new Date().toISOString(),
      };
      all.unshift(newNote);
      setStored(KEYS.NOTES, all);
      return newNote;
    }
  }

  static deletePrivateNote(id: string): void {
    const all = getStored<PrivateNote[]>(KEYS.NOTES, []).filter(n => n.id !== id);
    setStored(KEYS.NOTES, all);
  }

  // Book Lending & Borrowing
  static getListings(): BookListing[] {
    const listings = getStored<BookListing[]>(KEYS.LISTINGS, INITIAL_LISTINGS);
    const profiles = this.getProfiles();
    return listings.map(l => ({
      ...l,
      lender: profiles.find(p => p.id === l.lender_id),
    }));
  }

  static createListing(listing: Partial<BookListing> & { lender_id: string; title: string; author: string; pickup_location: string; condition: any }): BookListing {
    const all = getStored<BookListing[]>(KEYS.LISTINGS, INITIAL_LISTINGS);
    const newListing: BookListing = {
      id: `listing_${Date.now()}`,
      lender_id: listing.lender_id,
      title: listing.title,
      author: listing.author,
      isbn: listing.isbn,
      condition: listing.condition || 'Very Good',
      lending_period_days: listing.lending_period_days || 14,
      pickup_location: listing.pickup_location,
      terms: listing.terms || 'Handle with care. Return promptly by due date.',
      cover_image: listing.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
      status: 'available',
      created_at: new Date().toISOString(),
    };
    all.unshift(newListing);
    setStored(KEYS.LISTINGS, all);
    return newListing;
  }

  static getBorrowingRequests(userId?: string): BorrowingRequest[] {
    const all = getStored<BorrowingRequest[]>(KEYS.BORROWINGS, []);
    const profiles = this.getProfiles();
    const listings = this.getListings();
    const list = all.map(b => ({
      ...b,
      borrower: profiles.find(p => p.id === b.borrower_id),
      lender: profiles.find(p => p.id === b.lender_id),
      listing: listings.find(l => l.id === b.listing_id),
    }));

    if (!userId) return list;
    return list.filter(b => b.borrower_id === userId || b.lender_id === userId);
  }

  static createBorrowingRequest(borrowerId: string, listingId: string, message?: string): BorrowingRequest {
    const listings = this.getListings();
    const listing = listings.find(l => l.id === listingId);
    if (!listing) throw new Error('Listing not found');

    const all = getStored<BorrowingRequest[]>(KEYS.BORROWINGS, []);
    const newReq: BorrowingRequest = {
      id: `req_${Date.now()}`,
      listing_id: listingId,
      borrower_id: borrowerId,
      lender_id: listing.lender_id,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    all.unshift(newReq);
    setStored(KEYS.BORROWINGS, all);

    // Notify lender
    this.createNotification(
      listing.lender_id,
      'borrow_request',
      'New Book Borrowing Request',
      `A reader has requested to borrow "${listing.title}".`,
      '/borrowed'
    );

    return newReq;
  }

  static updateBorrowingStatus(requestId: string, status: any): BorrowingRequest | undefined {
    const all = getStored<BorrowingRequest[]>(KEYS.BORROWINGS, []);
    const req = all.find(r => r.id === requestId);
    if (!req) return undefined;

    req.status = status;
    req.updated_at = new Date().toISOString();

    if (status === 'accepted') {
      const listing = this.getListings().find(l => l.id === req.listing_id);
      const days = listing?.lending_period_days || 14;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + days);
      req.due_date = dueDate.toISOString();

      this.createNotification(
        req.borrower_id,
        'borrow_status',
        'Borrow Request Accepted!',
        `Your request has been accepted. Coordinate pickup for your book. Due: ${dueDate.toLocaleDateString()}.`,
        '/borrowed'
      );
    } else if (status === 'returned') {
      req.returned_at = new Date().toISOString();
    }

    setStored(KEYS.BORROWINGS, all);
    return req;
  }

  // Notifications
  static getNotifications(userId: string): NotificationItem[] {
    const all = getStored<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => n.user_id === userId).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static markNotificationRead(id: string): void {
    const all = getStored<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const n = all.find(x => x.id === id);
    if (n) {
      n.is_read = true;
      setStored(KEYS.NOTIFICATIONS, all);
    }
  }

  static createNotification(userId: string, type: any, title: string, message: string, link?: string): NotificationItem {
    const all = getStored<NotificationItem[]>(KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      user_id: userId,
      type,
      title,
      message,
      link,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    all.unshift(newNotif);
    setStored(KEYS.NOTIFICATIONS, all);
    return newNotif;
  }

  // Categories
  static getCategories(): Category[] {
    return getStored<Category[]>(KEYS.CATEGORIES, INITIAL_CATEGORIES);
  }

  static saveCategory(category: Partial<Category> & { name: string; slug: string }): Category {
    const all = this.getCategories();
    const idx = all.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...category };
      setStored(KEYS.CATEGORIES, all);
      return all[idx];
    } else {
      const newCat: Category = {
        id: `cat_${Date.now()}`,
        name: category.name,
        slug: category.slug,
        description: category.description,
        icon: category.icon || 'BookOpen',
        display_order: all.length + 1,
      };
      all.push(newCat);
      setStored(KEYS.CATEGORIES, all);
      return newCat;
    }
  }

  static deleteCategory(id: string): void {
    const all = this.getCategories().filter(c => c.id !== id);
    setStored(KEYS.CATEGORIES, all);
  }

  // Profiles & Users
  static getProfiles(): Profile[] {
    return getStored<Profile[]>(KEYS.PROFILES, INITIAL_PROFILES);
  }

  static getProfileById(id: string): Profile | undefined {
    return this.getProfiles().find(p => p.id === id || p.username === id);
  }

  static saveProfile(profile: Partial<Profile> & { id: string }): Profile {
    const all = this.getProfiles();
    const idx = all.findIndex(p => p.id === profile.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...profile, updated_at: new Date().toISOString() };
      setStored(KEYS.PROFILES, all);
      return all[idx];
    } else {
      const newProfile: Profile = {
        id: profile.id,
        username: profile.username || `user_${Date.now()}`,
        full_name: profile.full_name || 'Reader',
        avatar_url: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: profile.bio || '',
        interests: profile.interests || [],
        role: profile.role || 'user',
        created_at: new Date().toISOString(),
      };
      all.push(newProfile);
      setStored(KEYS.PROFILES, all);
      return newProfile;
    }
  }

  // Moderation & Reports
  static getReports(): ReportItem[] {
    const reports = getStored<ReportItem[]>(KEYS.REPORTS, INITIAL_REPORTS);
    const profiles = this.getProfiles();
    return reports.map(r => ({
      ...r,
      reporter: profiles.find(p => p.id === r.reporter_id),
    }));
  }

  static submitReport(report: { reporter_id: string; target_type: any; target_id: string; reason: string; details?: string; target_summary?: string }): ReportItem {
    const all = getStored<ReportItem[]>(KEYS.REPORTS, INITIAL_REPORTS);
    const newReport: ReportItem = {
      id: `rep_${Date.now()}`,
      reporter_id: report.reporter_id,
      target_type: report.target_type,
      target_id: report.target_id,
      target_summary: report.target_summary,
      reason: report.reason,
      details: report.details,
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    all.unshift(newReport);
    setStored(KEYS.REPORTS, all);
    return newReport;
  }

  static updateReportStatus(reportId: string, status: any, notes?: string, resolvedBy?: string): void {
    const all = getStored<ReportItem[]>(KEYS.REPORTS, INITIAL_REPORTS);
    const r = all.find(x => x.id === reportId);
    if (r) {
      r.status = status;
      if (notes) r.moderator_notes = notes;
      if (resolvedBy) r.resolved_by = resolvedBy;
      r.updated_at = new Date().toISOString();
      setStored(KEYS.REPORTS, all);
    }
  }

  // Admin Analytics Overview
  static getMetrics() {
    const books = this.getBooks();
    const chapters = this.getChapters();
    const articles = this.getArticles();
    const posts = this.getPosts();
    const profiles = this.getProfiles();
    const reports = this.getReports();

    return {
      totalUsers: profiles.length,
      publishedBooks: books.filter(b => b.status === 'published').length,
      publishedChapters: chapters.filter(c => c.is_published).length,
      publishedArticles: articles.filter(a => a.status === 'published').length,
      draftArticles: articles.filter(a => a.status === 'draft').length,
      communityPosts: posts.length,
      pendingReports: reports.filter(r => r.status === 'pending').length,
      activeBorrowings: this.getBorrowingRequests().filter(b => b.status === 'accepted' || b.status === 'borrowed').length,
    };
  }
}
