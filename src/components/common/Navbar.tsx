import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Search, Menu, X } from 'lucide-react';
import { CTAButton } from './CTAButton';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Discover', to: '/discover' },
    { label: 'Books', to: '/books' },
    { label: 'Articles', to: '/articles' },
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
            className="flex items-center space-x-2 text-readora-muted hover:text-readora-forest px-3.5 py-1.5 rounded-full border border-readora-border bg-readora-surface/60 hover:bg-readora-surface text-xs font-medium transition-colors shadow-sm"
            title="Search books, articles, authors (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden lg:inline text-[10px] bg-readora-ivory px-1.5 py-0.5 rounded border border-readora-border text-readora-muted">⌘K</kbd>
          </button>

          {/* Direct Read CTA */}
          <CTAButton
            to="/books"
            variant="primary"
            size="sm"
            shape="pill"
            ctaName="Navbar Read Books"
            ctaSection="navbar"
          >
            Read Books
          </CTAButton>

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
            to="/books"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold py-2 text-readora-forest"
          >
            Browse Books
          </Link>
        </div>
      )}
    </header>
  );
};
