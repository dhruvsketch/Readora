import { describe, it, expect, beforeEach } from 'vitest';
import { ReadoraStore } from '../lib/store';

describe('Readora Store & Platform Workflows', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 1. Books & Chapters
  describe('Book & Chapter Management', () => {
    it('creates and retrieves books with valid slugs and defaults', () => {
      const book = ReadoraStore.saveBook({
        title: 'Beyond Good and Evil',
        author: 'Friedrich Nietzsche',
        description: 'Prelude to a Philosophy of the Future.',
        license: 'Public Domain',
      });

      expect(book.id).toBeDefined();
      expect(book.slug).toBe('beyond-good-and-evil');
      expect(book.status).toBe('published');

      const retrieved = ReadoraStore.getBookById(book.id);
      expect(retrieved?.title).toBe('Beyond Good and Evil');
    });

    it('creates chapters, reorders them, and updates book chapter counts', () => {
      const book = ReadoraStore.saveBook({
        title: 'Stoic Letters',
        author: 'Seneca',
      });

      const ch1 = ReadoraStore.saveChapter({
        book_id: book.id,
        chapter_number: 1,
        title: 'On Disillusionment',
        content: '<p>Content 1</p>',
      });

      const ch2 = ReadoraStore.saveChapter({
        book_id: book.id,
        chapter_number: 2,
        title: 'On True Tranquility',
        content: '<p>Content 2</p>',
      });

      expect(ReadoraStore.getChapters(book.id).length).toBe(2);

      // Reorder
      ReadoraStore.reorderChapters(book.id, [ch2.id, ch1.id]);
      const reordered = ReadoraStore.getChapters(book.id);
      expect(reordered[0].id).toBe(ch2.id);
      expect(reordered[0].chapter_number).toBe(1);
      expect(reordered[1].id).toBe(ch1.id);
      expect(reordered[1].chapter_number).toBe(2);
    });
  });

  // 2. Reading Progress & Notes
  describe('Digital Reader & Annotations', () => {
    it('persists and restores reading progress accurately', () => {
      const progress = ReadoraStore.saveReadingProgress('user-1', 'b1', 'ch1', 65);
      expect(progress.progress_percent).toBe(65);
      expect(progress.is_completed).toBe(false);

      const retrieved = ReadoraStore.getReadingProgress('user-1', 'b1');
      expect(retrieved?.progress_percent).toBe(65);

      // Mark 100%
      const finished = ReadoraStore.saveReadingProgress('user-1', 'b1', 'ch3', 100);
      expect(finished.is_completed).toBe(true);
    });

    it('isolates private notes and bookmarks to their owner', () => {
      ReadoraStore.savePrivateNote({
        user_id: 'user-1',
        book_id: 'b1',
        note_text: 'Introspective insight on Marcus Aurelius',
      });

      const user1Notes = ReadoraStore.getPrivateNotes('user-1', 'b1');
      const user2Notes = ReadoraStore.getPrivateNotes('user-2', 'b1');

      expect(user1Notes.length).toBe(1);
      expect(user1Notes[0].note_text).toBe('Introspective insight on Marcus Aurelius');
      expect(user2Notes.length).toBe(0); // Strictly isolated
    });

    it('toggles bookmarks reliably', () => {
      const added = ReadoraStore.toggleBookmark('user-1', { bookId: 'b1', label: 'Meditations' });
      expect(added).toBe(true);
      expect(ReadoraStore.getBookmarks('user-1').length).toBe(1);

      const removed = ReadoraStore.toggleBookmark('user-1', { bookId: 'b1' });
      expect(removed).toBe(false);
      expect(ReadoraStore.getBookmarks('user-1').length).toBe(0);
    });
  });

  // 3. Articles & Publishing
  describe('Writing Studio & Articles', () => {
    it('saves drafts and publishes with computed reading time and tags', () => {
      const article = ReadoraStore.saveArticle({
        author_id: 'user-1',
        title: 'The Art of Attention',
        content: '<p>A deep essay on focus and literature.</p>',
        tags: ['Attention', 'Essays'],
        status: 'published',
      });

      expect(article.id).toBeDefined();
      expect(article.status).toBe('published');
      expect(article.read_time_minutes).toBeGreaterThanOrEqual(1);

      const fetched = ReadoraStore.getArticleById(article.id);
      expect(fetched?.title).toBe('The Art of Attention');
    });
  });

  // 4. Community Feed & Comments
  describe('Community & Discourse', () => {
    it('creates posts, toggles likes, and handles discussions', () => {
      const post = ReadoraStore.createPost({
        user_id: 'user-1',
        content: 'Reading in quiet hours transforms the imagination.',
        post_type: 'reflection',
      });

      expect(post.likes_count).toBe(0);

      // Like
      const liked = ReadoraStore.toggleLike('user-2', post.id, 'post');
      expect(liked).toBe(true);
      expect(ReadoraStore.isLiked('user-2', post.id)).toBe(true);

      // Comment
      const comment = ReadoraStore.addComment({
        user_id: 'user-2',
        postId: post.id,
        content: 'I agree completely.',
      });

      const comments = ReadoraStore.getComments({ postId: post.id });
      expect(comments.length).toBe(1);
      expect(comments[0].content).toBe('I agree completely.');
    });
  });

  // 5. Ratings & Calculation
  describe('Ratings & Reviews', () => {
    it('accurately updates book average ratings upon submission', () => {
      const book = ReadoraStore.saveBook({
        title: 'Epictetus Discourses',
        author: 'Epictetus',
      });

      ReadoraStore.submitRating({
        user_id: 'user-1',
        item_id: book.id,
        rating: 5,
        review_text: 'Brilliant translation.',
      });

      ReadoraStore.submitRating({
        user_id: 'user-2',
        item_id: book.id,
        rating: 4,
      });

      const updatedBook = ReadoraStore.getBookById(book.id);
      expect(updatedBook?.ratings_count).toBe(2);
      expect(updatedBook?.average_rating).toBe(4.5);
    });
  });

  // 6. Book Lending & Borrowing Workflow
  describe('Book Lending & Borrowing Workflow', () => {
    it('executes request -> accept with due date -> return cycle', () => {
      const listing = ReadoraStore.createListing({
        lender_id: 'user-lender',
        title: 'Kantian Ethics',
        author: 'Immanuel Kant',
        condition: 'Like New',
        lending_period_days: 14,
        pickup_location: 'Central Library',
      });

      // Borrower requests
      const req = ReadoraStore.createBorrowingRequest('user-borrower', listing.id, 'Would love to read this!');
      expect(req.status).toBe('pending');

      // Lender accepts
      const accepted = ReadoraStore.updateBorrowingStatus(req.id, 'accepted');
      expect(accepted?.status).toBe('accepted');
      expect(accepted?.due_date).toBeDefined();

      // Return confirmed
      const returned = ReadoraStore.updateBorrowingStatus(req.id, 'returned');
      expect(returned?.status).toBe('returned');
      expect(returned?.returned_at).toBeDefined();
    });
  });

  // 7. Moderation Reports
  describe('Moderation & Reports', () => {
    it('creates and resolves moderation reports with audit notes', () => {
      const report = ReadoraStore.submitReport({
        reporter_id: 'user-1',
        target_type: 'post',
        target_id: 'p1',
        reason: 'Spam promotional link',
      });

      expect(report.status).toBe('pending');

      ReadoraStore.updateReportStatus(report.id, 'resolved', 'Post removed and warned user', 'admin-1');
      const reports = ReadoraStore.getReports();
      const resolved = reports.find(r => r.id === report.id);

      expect(resolved?.status).toBe('resolved');
      expect(resolved?.moderator_notes).toBe('Post removed and warned user');
    });
  });
});
