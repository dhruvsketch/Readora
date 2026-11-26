import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <div className="border-b border-readora-border/60 pb-6">
        <h1 className="font-serif text-3xl font-bold text-readora-ink">Privacy Policy</h1>
        <p className="text-xs text-readora-muted mt-1">Last updated: January 2025</p>
      </div>

      <div className="bg-readora-surface rounded-3xl p-8 sm:p-12 border border-readora-border shadow-sm prose-editorial text-xs sm:text-sm text-readora-ink/90 space-y-4">
        <h2>1. Commitment to Reader Privacy</h2>
        <p>At Readora, we believe what you read and annotate is deeply personal. We do not sell your personal data, and we do not monetize reader browsing habits through surveillance advertising.</p>

        <h2>2. Data Collected</h2>
        <p>We collect only the information necessary to provide your personalized reading library: account credentials, public profile fields (name, username, bio), your reading progress, bookmarks, private notes, and published essays.</p>

        <h2>3. Private Notes & Reading Security</h2>
        <p>Private notes, unpublished article drafts, and reading progress are protected by strict database Row Level Security policies. These entries are never rendered on public profiles or exposed to other members.</p>

        <h2>4. Physical Handover Information</h2>
        <p>When participating in book lending, we advise users to specify general neighborhoods or public hubs (libraries, coffee shops) rather than private home addresses.</p>
      </div>
    </div>
  );
};
