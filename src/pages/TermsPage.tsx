import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-readora-border/60 pb-6">
        <h1 className="font-serif text-3xl font-bold text-readora-ink">Terms of Service</h1>
        <p className="text-xs text-readora-muted mt-1">Last updated: January 2025</p>
      </div>

      <div className="bg-readora-surface rounded-3xl p-8 sm:p-12 border border-readora-border shadow-sm prose-editorial text-xs sm:text-sm text-readora-ink/90 space-y-4">
        <h2>1. Acceptance of Terms</h2>
        <p>By accessing and utilizing Readora, you agree to comply with these terms, our community guidelines, and all applicable digital copyright laws.</p>

        <h2>2. Content Publishing & Intellectual Property</h2>
        <p>Authors retain all intellectual property rights to their original writings and essays published on Readora. By posting, you grant Readora a non-exclusive license to display your public articles according to your visibility settings. You agree not to publish plagiarized, infringing, or defamatory works.</p>

        <h2>3. Peer-to-Peer Physical Book Lending</h2>
        <p>Readora provides a matching and transaction tracking platform for physical book loans. Users agree to handle borrowed volumes with care, return them by the mutually agreed due date, and respect the privacy and safety of fellow readers during handovers.</p>

        <h2>4. Moderation & Content Removal</h2>
        <p>Readora reserves the right to review reported content, hide posts that violate community standards, and suspend accounts engaging in harassment or copyright infringement.</p>
      </div>
    </div>
  );
};
