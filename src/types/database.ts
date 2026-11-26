export type UserRole = 'user' | 'moderator' | 'admin';

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  interests: string[];
  website?: string;
  role: UserRole;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  display_order: number;
  created_at?: string;
}

export type BookFormat = 'Chapter-based' | 'EPUB' | 'PDF';
export type ContentStatus = 'draft' | 'published' | 'archived';
export type ReadingPermission = 'public' | 'members' | 'premium';

export interface Book {
  id: string;
  title: string;
  slug: string;
  description: string;
  author: string;
  cover_image: string;
  category_id?: string;
  category?: Category;
  language: string;
  publisher?: string;
  publication_date?: string;
  format: BookFormat;
  license: string;
  file_url?: string;
  status: ContentStatus;
  is_featured: boolean;
  reading_permissions: ReadingPermission;
  created_at: string;
  updated_at?: string;
  // Computed / aggregated
  average_rating?: number;
  ratings_count?: number;
  chapters_count?: number;
}

export interface BookChapter {
  id: string;
  book_id: string;
  chapter_number: number;
  title: string;
  content: string;
  summary?: string;
  read_time_minutes: number;
  is_published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  author_id: string;
  author?: Profile;
  category_id?: string;
  category?: Category;
  tags: string[];
  related_book_id?: string;
  related_book?: Book;
  read_time_minutes: number;
  status: ContentStatus;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  average_rating?: number;
  ratings_count?: number;
  likes_count?: number;
  comments_count?: number;
}

export type PostType = 'thought' | 'reflection' | 'recommendation' | 'question' | 'insight' | 'quote';
export type PostStatus = 'draft' | 'published' | 'under_review' | 'hidden' | 'removed';

export interface CommunityPost {
  id: string;
  user_id: string;
  author?: Profile;
  content: string;
  post_type: PostType;
  related_book_id?: string;
  related_book?: Book;
  related_article_id?: string;
  related_article?: Article;
  status: PostStatus;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at?: string;
  is_liked_by_user?: boolean;
  is_bookmarked_by_user?: boolean;
}

export interface Comment {
  id: string;
  user_id: string;
  author?: Profile;
  post_id?: string;
  article_id?: string;
  book_id?: string;
  parent_id?: string;
  content: string;
  created_at: string;
  updated_at?: string;
}

export interface Rating {
  id: string;
  user_id: string;
  user?: Profile;
  item_id: string;
  rating: number; // 1-5
  review_title?: string;
  review_text?: string;
  created_at: string;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  book?: Book;
  chapter_id?: string;
  chapter?: BookChapter;
  progress_percent: number;
  last_read_position?: string;
  is_completed: boolean;
  updated_at: string;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id?: string;
  book?: Book;
  article_id?: string;
  article?: Article;
  chapter_id?: string;
  position_marker?: string;
  label?: string;
  created_at: string;
}

export interface PrivateNote {
  id: string;
  user_id: string;
  book_id: string;
  chapter_id?: string;
  selected_text?: string;
  note_text: string;
  color: 'gold' | 'forest' | 'sepia' | 'ink';
  created_at: string;
  updated_at?: string;
}

export type BookCondition = 'Like New' | 'Very Good' | 'Good' | 'Fair' | 'Readable';
export type ListingStatus = 'available' | 'reserved' | 'borrowed' | 'inactive';

export interface BookListing {
  id: string;
  lender_id: string;
  lender?: Profile;
  title: string;
  author: string;
  isbn?: string;
  cover_image?: string;
  condition: BookCondition;
  lending_period_days: number;
  pickup_location: string;
  terms?: string;
  status: ListingStatus;
  created_at: string;
  updated_at?: string;
}

export type BorrowingStatus = 'pending' | 'accepted' | 'declined' | 'borrowed' | 'returned' | 'cancelled';

export interface BorrowingRequest {
  id: string;
  listing_id: string;
  listing?: BookListing;
  borrower_id: string;
  borrower?: Profile;
  lender_id: string;
  lender?: Profile;
  message?: string;
  status: BorrowingStatus;
  due_date?: string;
  returned_at?: string;
  created_at: string;
  updated_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  type: 'follow' | 'comment' | 'rating' | 'borrow_request' | 'borrow_status' | 'due_date' | 'system';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export type ReportTargetType = 'article' | 'post' | 'comment' | 'book' | 'user';
export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';

export interface ReportItem {
  id: string;
  reporter_id: string;
  reporter?: Profile;
  target_type: ReportTargetType;
  target_id: string;
  target_summary?: string;
  reason: string;
  details?: string;
  status: ReportStatus;
  moderator_notes?: string;
  resolved_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin?: Profile;
  action: string;
  target_type: string;
  target_id: string;
  details?: Record<string, unknown>;
  created_at: string;
}
