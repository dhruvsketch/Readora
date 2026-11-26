import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, BookOpen, ShieldCheck, Heart } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const plans = [
    {
      name: 'Free Reader',
      price: '$0',
      period: 'Forever free',
      description: 'Ideal for casual readers and thoughtful writers beginning their journey.',
      buttonText: 'Get Started Free',
      buttonTo: '/signup',
      highlighted: false,
      features: [
        'Access to all public domain classics & open editions',
        'Distraction-free digital reader with custom font sizes',
        'Full progress persistence and personal bookmarking',
        'Write and publish personal essays & reviews',
        'Participate in community reflections & discussions',
        'Browse local physical book lending listings',
      ],
    },
    {
      name: 'Readora Fellow',
      price: '$8',
      period: 'per month',
      description: 'For dedicated bibliophiles, essayists, and active community members.',
      buttonText: 'Join as Fellow',
      buttonTo: '/signup',
      highlighted: true,
      badge: 'Most Popular',
      features: [
        'Everything in Free Reader',
        'Authorized contemporary digital book editions',
        'Unlimited peer-to-peer physical book lending & borrowing',
        'High-resolution PDF & EPUB reading downloads',
        'Private reading salons & annotated reading lists',
        'Fellow reader badge on essays and profile',
      ],
    },
    {
      name: 'Patron & Publisher',
      price: '$24',
      period: 'per month',
      description: 'For scholars, literary presses, and authors building an audience.',
      buttonText: 'Become a Patron',
      buttonTo: '/signup',
      highlighted: false,
      features: [
        'Everything in Readora Fellow',
        'Creator subscription monetization tools',
        'Featured editorial placement in literary journal',
        'Advanced reader analytics & demographic engagement',
        'Direct reader support & tipping enablement',
        'Direct line to Readora editorial board',
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">
          Sustainable Literary Publishing
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-readora-ink">
          Invest in Thoughtful Reading & Writing
        </h1>
        <p className="text-sm sm:text-base text-readora-muted max-w-xl mx-auto">
          Readora operates without invasive advertising or clickbait algorithms. Choose the membership tier that suits your reading and writing ambitions.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-3xl p-8 flex flex-col justify-between border transition-all ${
              p.highlighted
                ? 'bg-readora-surface border-readora-forest shadow-editorial relative ring-1 ring-readora-forest'
                : 'bg-readora-surface/70 border-readora-border shadow-sm'
            }`}
          >
            {p.badge && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-readora-forest text-readora-ivory text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                {p.badge}
              </span>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-readora-ink">{p.name}</h3>
                <p className="text-xs text-readora-muted mt-1">{p.description}</p>
              </div>

              <div className="flex items-baseline space-x-1 pt-2">
                <span className="font-serif text-4xl font-bold text-readora-ink">{p.price}</span>
                <span className="text-xs text-readora-muted">/{p.period}</span>
              </div>

              <div className="pt-6 border-t border-readora-border/60 space-y-3">
                <p className="text-[11px] font-bold uppercase text-readora-forest tracking-wider">What's Included:</p>
                <ul className="space-y-2.5 text-xs text-readora-ink/90">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start space-x-2.5">
                      <Check className="w-4 h-4 text-readora-forest flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <Link
                to={p.buttonTo}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs text-center block transition-all shadow-sm ${
                  p.highlighted
                    ? 'bg-readora-forest text-readora-ivory hover:bg-readora-forest-light'
                    : 'bg-readora-ivory hover:bg-readora-border/60 text-readora-ink border border-readora-border'
                }`}
              >
                {p.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Production Notice */}
      <div className="max-w-2xl mx-auto p-5 bg-readora-surface rounded-2xl border border-readora-border text-center text-xs text-readora-muted space-y-1 shadow-sm">
        <p className="font-semibold text-readora-ink flex items-center justify-center">
          <ShieldCheck className="w-4 h-4 mr-1.5 text-readora-forest" /> Payment Configuration Architecture
        </p>
        <p>
          Readora's data schema includes payment and subscription structures. In accordance with platform security standards, live payment processing activates upon configuring Stripe webhook secrets in your backend environment. Free reading and publishing remain open.
        </p>
      </div>

    </div>
  );
};
