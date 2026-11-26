import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Sparkles, Feather, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Editorial Header */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Our Philosophy</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-readora-ink leading-tight">
          Read More. Think Deeper. Share Ideas.
        </h1>
        <p className="font-serif italic text-base sm:text-lg text-readora-muted max-w-2xl mx-auto">
          "A place where reading leads to thinking, thinking leads to writing, and writing leads to connection."
        </p>
      </div>

      {/* Main Narrative */}
      <div className="bg-readora-surface rounded-3xl p-8 sm:p-14 border border-readora-border shadow-sm space-y-8 text-sm sm:text-base text-readora-ink/90 leading-relaxed font-sans">
        
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold text-readora-ink">The Readora Manifest</h2>
          <p>
            In an era dominated by algorithmic brevity and relentless digital noise, Readora was founded on a simple conviction: deep reading is essential to human flourishing. When we surrender our attention to fragments and soundbites, we do not merely lose hours—we surrender our capacity for sustained reflection, moral nuance, and creative interiority.
          </p>
          <p>
            Readora is designed as an architectural sanctuary for the undivided mind. We bring together the curated beauty of an independent literary magazine, the permanence of a classical digital library, and the warmth of a peer-to-peer physical book lending network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-readora-border/60">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-readora-forest/10 flex items-center justify-center text-readora-forest">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-readora-ink">Distraction-Free Reading</h3>
            <p className="text-xs text-readora-muted leading-relaxed">
              No banner ads, intrusive popups, or notification bells interrupting your flow. Adjust typography, toggle sepia or dark modes, and annotate private thoughts.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-readora-gold/15 flex items-center justify-center text-readora-gold">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-readora-ink">Writing Studio</h3>
            <p className="text-xs text-readora-muted leading-relaxed">
              Publish essays, reviews, and philosophical reflections. Connect with readers who value depth over sensationalism.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-800">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-readora-ink">Physical Book Circulation</h3>
            <p className="text-xs text-readora-muted leading-relaxed">
              Share real books from your personal bookshelves with local community members through our safe, tracked lending workflow.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-readora-border/60 text-center">
          <Link
            to="/discover"
            className="inline-flex items-center space-x-2 bg-readora-forest text-readora-ivory px-6 py-3 rounded-full font-semibold text-xs hover:bg-readora-forest-light transition-colors shadow-sm"
          >
            <span>Explore the Library</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
};
