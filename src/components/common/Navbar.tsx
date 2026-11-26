import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  PenTool, 
  Bell, 
  User, 
  Shield, 
  LogOut, 
  Bookmark, 
  Library, 
  Repeat, 
  Settings, 
  Menu, 
  X,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ReadoraStore } from '../../lib/store';
import { NotificationItem } from '../../types/database';
import { CTAButton } from './CTAButton';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { user, isAuthenticated, isAdmin, logout, switchMockRole, isSupabaseConnected } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setNotifications(ReadoraStore.getNotifications(user.id));
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = (id: string, link?: string) => {
    ReadoraStore.markNotificationRead(id);
    if (user) setNotifications(ReadoraStore.getNotifications(user.id));
    if (link) {
      setNotificationsOpen(false);
      navigate(link);
    }
  };

  const navLinks = [
    { label: 'Discover', to: '/discover' },
    { label: 'Books', to: '/books' },
    { label: 'Articles', to: '/articles' },
    { label: 'Community', to: '/community' },
    { label: 'Pricing', to: '/pricing' },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header className="sticky top-0 z-40 bg-readora-ivory/95 backdrop-blur-md border-b border-readora-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-full bg-readora-forest flex items-center justify-center text-readora-gold shadow-sm group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5 text-readora-ivory" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-semibold tracking-tight text-readora-ink">Readora</span>
            <span className="text-[10px] uppercase tracking-widest text-readora-muted font-medium -mt-1">Digital Library</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium transition-colors ${
                isActive(item.to)
                  ? 'text-readora-forest font-semibold underline underline-offset-8 decoration-readora-gold decoration-2'
                  : 'text-readora-ink/80 hover:text-readora-forest'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Global Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 text-readora-muted hover:text-readora-forest px-3 py-1.5 rounded-full border border-readora-border bg-readora-surface/60 hover:bg-readora-surface text-xs font-medium transition-colors shadow-sm"
            title="Search books, articles, authors (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline text-[10px] bg-readora-ivory px-1.5 py-0.5 rounded border border-readora-border text-readora-muted">⌘K</kbd>
          </button>

          {/* Write Button */}
          <CTAButton
            to={isAuthenticated ? '/write' : '/login'}
            state={isAuthenticated ? undefined : { from: { pathname: '/write' } }}
            variant="secondary"
            size="sm"
            shape="pill"
            icon={<PenTool className="w-3.5 h-3.5 text-readora-forest" />}
            className="hidden sm:inline-flex border-readora-forest/30 text-readora-forest hover:bg-readora-forest/10"
            ctaName="Navbar Write"
            ctaSection="navbar"
          >
            Write
          </CTAButton>

          {/* Supabase Status Pill */}
          <div 
            title={isSupabaseConnected ? "Connected to Supabase PostgreSQL" : "Running on Local Database (Configure Supabase credentials in .env.local for cloud sync)"}
            className={`hidden xl:flex items-center space-x-1.5 text-[11px] px-2.5 py-1 rounded-full border ${
              isSupabaseConnected 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                : 'bg-amber-50/80 text-amber-800 border-amber-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSupabaseConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span>{isSupabaseConnected ? 'Live DB' : 'Local DB'}</span>
          </div>

          {/* Authenticated Controls */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-3">
              
              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserDropdownOpen(false);
                  }}
                  className="relative p-2 rounded-full hover:bg-readora-surface text-readora-ink/80 hover:text-readora-forest transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-readora-forest text-readora-ivory text-[10px] font-bold flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-readora-surface rounded-xl shadow-editorial border border-readora-border p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-readora-border mb-2">
                      <span className="font-serif font-semibold text-sm text-readora-ink">Notifications</span>
                      <span className="text-xs text-readora-muted">{unreadCount} unread</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto space-y-2">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-readora-muted text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => handleMarkRead(n.id, n.link)}
                            className={`p-2.5 rounded-lg text-xs cursor-pointer transition-colors ${
                              n.is_read ? 'hover:bg-readora-ivory/60' : 'bg-readora-ivory font-medium'
                            }`}
                          >
                            <p className="text-readora-ink font-semibold">{n.title}</p>
                            <p className="text-readora-muted mt-0.5 line-clamp-2">{n.message}</p>
                            <span className="text-[10px] text-readora-muted/80 mt-1 block">
                              {new Date(n.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar & Menu */}
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-full hover:bg-readora-surface border border-transparent hover:border-readora-border transition-all"
                >
                  <img
                    src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt={user.full_name}
                    className="w-8 h-8 rounded-full object-cover border border-readora-border"
                  />
                  <ChevronDown className="w-3.5 h-3.5 text-readora-muted" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-readora-surface rounded-xl shadow-editorial border border-readora-border p-2 z-50 divide-y divide-readora-border/60">
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold text-readora-ink">{user.full_name}</p>
                      <p className="text-xs text-readora-muted">@{user.username}</p>
                      
                      {/* Role indicator & Quick role switch */}
                      <div className="mt-2 pt-2 border-t border-readora-border/40 flex items-center justify-between text-[11px]">
                        <span className="text-readora-muted">Current Role:</span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => switchMockRole('user')}
                            className={`px-1.5 py-0.5 rounded text-[10px] ${user.role === 'user' ? 'bg-readora-forest text-white' : 'bg-readora-ivory text-readora-ink'}`}
                          >
                            User
                          </button>
                          <button
                            onClick={() => switchMockRole('admin')}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${user.role === 'admin' ? 'bg-readora-gold text-readora-ink' : 'bg-readora-ivory text-readora-ink'}`}
                          >
                            Admin
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="py-1">
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-readora-forest hover:bg-readora-forest/10 rounded-lg transition-colors"
                        >
                          <Shield className="w-4 h-4 text-readora-forest" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 text-xs text-readora-ink hover:bg-readora-ivory rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4 text-readora-muted" />
                        <span>Personal Dashboard</span>
                      </Link>
                      <Link
                        to="/my-library"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 text-xs text-readora-ink hover:bg-readora-ivory rounded-lg transition-colors"
                      >
                        <Library className="w-4 h-4 text-readora-muted" />
                        <span>My Reading Library</span>
                      </Link>
                      <Link
                        to="/borrowed"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 text-xs text-readora-ink hover:bg-readora-ivory rounded-lg transition-colors"
                      >
                        <Repeat className="w-4 h-4 text-readora-muted" />
                        <span>Book Borrowing & Lending</span>
                      </Link>
                      <Link
                        to="/bookmarks"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 text-xs text-readora-ink hover:bg-readora-ivory rounded-lg transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-readora-muted" />
                        <span>Bookmarks & Notes</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2.5 px-3 py-2 text-xs text-readora-ink hover:bg-readora-ivory rounded-lg transition-colors"
                      >
                        <Settings className="w-4 h-4 text-readora-muted" />
                        <span>Settings</span>
                      </Link>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="flex items-center space-x-2.5">
              <Link
                to="/login"
                className="text-xs font-semibold text-readora-ink hover:text-readora-forest px-3 py-1.5 transition-colors"
              >
                Log In
              </Link>
              <CTAButton
                to="/signup"
                variant="primary"
                size="sm"
                shape="pill"
                ctaName="Navbar Get Started"
                ctaSection="navbar"
              >
                Get Started
              </CTAButton>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-readora-ink hover:text-readora-forest"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-readora-border bg-readora-ivory px-4 pt-3 pb-6 space-y-3">
          {navLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-medium py-2 text-readora-ink hover:text-readora-forest"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/write"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium py-2 text-readora-forest font-semibold"
          >
            Write an Article
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold py-2 text-readora-gold"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
