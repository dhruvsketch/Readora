import React from 'react';
import { HelpCircle, Mail, BookOpen, Repeat, ShieldCheck } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const faqs = [
    {
      q: 'How does physical book lending work on Readora?',
      a: 'Users can list books from their physical collection with their general pickup city or neighborhood. Other readers can submit a borrowing request. Once accepted by the owner, a due date is tracked, and both parties confirm the return upon completion.',
    },
    {
      q: 'Are the digital books legal to read and distribute?',
      a: 'Yes. Readora strictly adheres to copyright law. Our digital collection consists of verified public domain classics, openly licensed works (Creative Commons, Open Knowledge Licenses), and direct original publications authorized by the authors.',
    },
    {
      q: 'Can I write and publish my own essays and book reviews?',
      a: 'Absolutely. Every registered reader can open the Write studio, draft articles, format headings and blockquotes, set tags and reading times, and publish directly to the Readora journal.',
    },
    {
      q: 'Are my private notes and reading progress shared with others?',
      a: 'No. Your private reading annotations, notes, and reading history are strictly private to your authenticated user account, protected by Row Level Security policies.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Support & Assistance</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-readora-ink">Help Center & FAQ</h1>
        <p className="text-sm text-readora-muted max-w-lg mx-auto">
          Common questions about digital reading, physical book lending, publishing, and community safety.
        </p>
      </div>

      <div className="bg-readora-surface rounded-3xl p-8 sm:p-12 border border-readora-border shadow-sm space-y-6">
        <h2 className="font-serif font-bold text-xl text-readora-ink pb-3 border-b border-readora-border/60">
          Frequently Asked Questions
        </h2>

        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="space-y-1.5 text-xs">
              <h3 className="font-serif font-bold text-sm text-readora-ink flex items-center">
                <HelpCircle className="w-4 h-4 mr-2 text-readora-forest flex-shrink-0" />
                {f.q}
              </h3>
              <p className="text-readora-muted leading-relaxed pl-6">{f.a}</p>
            </div>
          ))}
        </div>

        {/* Contact box */}
        <div id="contact" className="mt-10 pt-8 border-t border-readora-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-serif font-bold text-sm text-readora-ink">Have questions or copyright inquiries?</h4>
            <p className="text-xs text-readora-muted mt-0.5">Reach out directly to the Readora editorial and safety desk.</p>
          </div>
          <a
            href="mailto:support@readora.example"
            className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-4 py-2 rounded-xl text-xs font-semibold hover:bg-readora-forest-light transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
