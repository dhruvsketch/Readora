import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Layers, 
  FileText, 
  MessageSquare, 
  Users, 
  AlertTriangle, 
  FolderTree, 
  Repeat, 
  BarChart3, 
  ArrowLeft,
  Shield,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard },
    { label: 'Book Catalogue', to: '/admin/books', icon: BookOpen },
    { label: 'Chapters & Volumes', to: '/admin/chapters', icon: Layers },
    { label: 'Articles & Content', to: '/admin/articles', icon: FileText },
    { label: 'Community Feed', to: '/admin/community', icon: MessageSquare },
    { label: 'Reports & Moderation', to: '/admin/reports', icon: AlertTriangle },
    { label: 'Users & Roles', to: '/admin/users', icon: Users },
    { label: 'Categories', to: '/admin/categories', icon: FolderTree },
    { label: 'Borrowing System', to: '/admin/borrowings', icon: Repeat },
    { label: 'System Analytics', to: '/admin/analytics', icon: BarChart3 },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-readora-ivory flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-readora-ink text-readora-ivory flex-shrink-0 flex flex-col justify-between border-r border-readora-border/20">
        <div>
          {/* Top Admin Branding */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-readora-forest flex items-center justify-center text-readora-gold shadow-sm">
                <Shield className="w-4 h-4 text-readora-gold" />
              </div>
              <div>
                <span className="font-serif font-bold text-lg text-white block">Readora Admin</span>
                <span className="text-[10px] text-readora-gold font-mono uppercase tracking-widest block">CMS Console</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? 'bg-readora-forest text-white font-semibold shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-readora-gold' : 'text-white/60'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            <span className="flex items-center">
              <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Return to Website
            </span>
            <ExternalLink className="w-3 h-3 text-white/40" />
          </Link>
          <div className="px-3 pt-2 text-[11px] text-white/40 flex items-center justify-between">
            <span>Admin: {user?.username}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="System Active" />
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <Outlet />
      </main>

    </div>
  );
};
