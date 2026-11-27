import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { CTAButton } from './CTAButton';

export const Footer: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-readora-ivory border-t border-readora-border mt-20 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Final Pre-Footer Call to Action Section */}
        <div className="mb-16 pb-16 border-b border-readora-border/60">
          <div className="bg-readora-forest text-readora-ivory rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-book-lg text-center max-w-4xl mx-auto border border-readora-forest-light/40">
            <div className="relative z-10 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest text-readora-gold inline-flex items-center gap-1.5 bg-readora-forest-dark/50 px-3 py-1 rounded-full border border-readora-gold/20">
                <Sparkles className="w-3.5 h-3.5 text-readora-gold" />
                Join The Movement
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-xl mx-auto leading-tight">
                Your Next Great Idea Starts Here.
              </h2>
              <p className="text-sm sm:text-base text-readora-ivory/85 leading-relaxed max-w-2xl mx-auto font-normal">
                Discover books, share your knowledge, and become part of a community that loves ideas.
              </p>
              <div className="pt-3 flex justify-center">
                <CTAButton
                  to="/discover"
                  variant="gold"
                  size="lg"
                  shape="pill"
                  withArrow
                  ctaName="Footer Start Reading"
                  ctaSection="footer_cta"
                >
                  Start Reading
                </CTAButton>
              </div>
            </div>

            {/* Subtle background glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-readora-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-readora-forest-light/30 blur-3xl pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-readora-border/60">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-readora-forest flex items-center justify-center text-readora-gold shadow-sm">
                <BookOpen className="w-4 h-4 text-readora-ivory" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-readora-ink">Readora</span>
            </Link>
            <p className="font-serif italic text-sm text-readora-forest">
              "Read More. Think Deeper. Share Ideas."
            </p>
            <p className="text-xs text-readora-muted leading-relaxed max-w-sm">
              A place where reading leads to thinking, thinking leads to writing, and writing leads to connection. Explore public domain classics, contemporary essays, physical book lending, and a community of reflective minds.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-readora-ink tracking-wide mb-3">Platform</h4>
            <ul className="space-y-2 text-xs text-readora-muted">
              <li><Link to="/discover" className="hover:text-readora-forest transition-colors">Discover</Link></li>
              <li><Link to="/books" className="hover:text-readora-forest transition-colors">Books & Digital Library</Link></li>
              <li><Link to="/blog" className="hover:text-readora-forest transition-colors font-medium">The Readora Journal (Blog)</Link></li>
              <li><Link to="/articles" className="hover:text-readora-forest transition-colors">Articles & Essays</Link></li>
              <li><Link to="/community" className="hover:text-readora-forest transition-colors">Community Feed</Link></li>
              <li><Link to="/borrowed" className="hover:text-readora-forest transition-colors">Book Lending</Link></li>
            </ul>
          </div>

          {/* Membership & Writers */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-readora-ink tracking-wide mb-3">Publishing</h4>
            <ul className="space-y-2 text-xs text-readora-muted">
              <li><Link to="/write" className="hover:text-readora-forest transition-colors">Write an Article</Link></li>
              <li><Link to="/pricing" className="hover:text-readora-forest transition-colors">Membership & Plans</Link></li>
              <li><Link to="/about" className="hover:text-readora-forest transition-colors">About Readora</Link></li>
              <li><Link to="/help" className="hover:text-readora-forest transition-colors">Help Center & FAQ</Link></li>
            </ul>
          </div>

          {/* Legal & Safety */}
          <div>
            <h4 className="font-serif font-semibold text-sm text-readora-ink tracking-wide mb-3">Legal & Ethics</h4>
            <ul className="space-y-2 text-xs text-readora-muted">
              <li><Link to="/terms" className="hover:text-readora-forest transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-readora-forest transition-colors">Privacy Policy</Link></li>
              <li><Link to="/help#contact" className="hover:text-readora-forest transition-colors">Contact Us</Link></li>
              <li><Link to="/help#licensing" className="hover:text-readora-forest transition-colors">Copyright & Licensing</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-readora-muted space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Readora Platform. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted for thoughtful readers and writers worldwide</span>
            <Heart className="w-3.5 h-3.5 text-readora-gold inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
