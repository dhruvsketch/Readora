import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/common/Layout';
import { ProtectedRoute, AdminRoute } from './components/common/RouteGuards';

// Public Pages
import { HomePage } from './pages/HomePage';
import { DiscoverPage } from './pages/DiscoverPage';
import { BooksPage } from './pages/BooksPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { DigitalReaderPage } from './pages/DigitalReaderPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { AuthorProfilePage } from './pages/AuthorProfilePage';
import { CommunityPage } from './pages/CommunityPage';
import { BorrowingPage } from './pages/BorrowingPage';
import { PricingPage } from './pages/PricingPage';
import { AboutPage } from './pages/AboutPage';
import { HelpPage } from './pages/HelpPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';

// Authenticated Pages
import { DashboardPage } from './pages/DashboardPage';
import { MyLibraryPage } from './pages/MyLibraryPage';
import { WritePage } from './pages/WritePage';
import { SettingsPage } from './pages/SettingsPage';

// Admin CMS Layout & Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminChaptersPage } from './pages/admin/AdminChaptersPage';
import { AdminArticlesPage } from './pages/admin/AdminArticlesPage';
import { AdminCommunityPage } from './pages/admin/AdminCommunityPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminBorrowingsPage } from './pages/admin/AdminBorrowingsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          {/* Standalone Digital Reader (Distraction-free) */}
          <Route path="/read/:bookId" element={<DigitalReaderPage />} />

          {/* Administrative Console (Protected by AdminRoute) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminOverviewPage />} />
            <Route path="books" element={<AdminBooksPage />} />
            <Route path="chapters" element={<AdminChaptersPage />} />
            <Route path="articles" element={<AdminArticlesPage />} />
            <Route path="community" element={<AdminCommunityPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="borrowings" element={<AdminBorrowingsPage />} />
            <Route path="analytics" element={<AdminAnalyticsPage />} />
          </Route>

          {/* Main Website with Layout (Header + Footer) */}
          <Route path="/" element={<Layout />}>
            
            {/* Public Routes */}
            <Route index element={<HomePage />} />
            <Route path="discover" element={<DiscoverPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/:id" element={<BookDetailPage />} />
            <Route path="articles" element={<ArticlesPage />} />
            <Route path="articles/:id" element={<ArticleDetailPage />} />
            <Route path="authors/:id" element={<AuthorProfilePage />} />
            <Route path="categories/:id" element={<DiscoverPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="help" element={<HelpPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            {/* Authenticated Routes */}
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="my-library"
              element={
                <ProtectedRoute>
                  <MyLibraryPage />
                </ProtectedRoute>
              }
            />
            <Route path="my-library/saved" element={<Navigate to="/my-library" replace />} />
            <Route path="my-library/history" element={<Navigate to="/my-library" replace />} />
            <Route path="my-library/notes" element={<Navigate to="/my-library" replace />} />
            <Route path="my-books" element={<Navigate to="/my-library" replace />} />
            <Route path="bookmarks" element={<Navigate to="/my-library" replace />} />

            <Route
              path="borrowed"
              element={
                <ProtectedRoute>
                  <BorrowingPage />
                </ProtectedRoute>
              }
            />
            <Route path="lent" element={<Navigate to="/borrowed" replace />} />

            <Route
              path="write"
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit/:id"
              element={
                <ProtectedRoute>
                  <WritePage />
                </ProtectedRoute>
              }
            />
            <Route path="my-articles" element={<Navigate to="/dashboard" replace />} />
            <Route path="notifications" element={<Navigate to="/dashboard" replace />} />

            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="profile/edit" element={<Navigate to="/settings" replace />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
