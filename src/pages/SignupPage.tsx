import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ArrowRight, User, Mail, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['philosophy-ideas', 'literary-fiction']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;
  const from =
    locationState?.from?.pathname ||
    (typeof locationState?.from === 'string' ? locationState.from : null) ||
    '/dashboard';

  const availableInterests = [
    { id: 'philosophy-ideas', label: 'Philosophy & Ideas' },
    { id: 'literary-fiction', label: 'Literary Fiction' },
    { id: 'technology-society', label: 'Technology & AI' },
    { id: 'history-culture', label: 'History & Culture' },
    { id: 'science-nature', label: 'Science & Cosmos' },
    { id: 'essays-criticism', label: 'Essays & Criticism' },
    { id: 'psychology', label: 'Psychology & Mind' },
    { id: 'personal-development', label: 'Personal Growth' },
  ];

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(i => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await signup(email, password, fullName, username);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Failed to create account.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="bg-readora-surface w-full max-w-lg rounded-3xl p-8 sm:p-10 border border-readora-border shadow-editorial space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-readora-forest flex items-center justify-center text-readora-gold shadow-sm mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-readora-ivory" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-readora-ink">Create Your Reading Account</h1>
          <p className="text-xs text-readora-muted">Join an independent community of readers, writers, and thinkers</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-readora-ink block mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Elena Rostova"
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
            </div>

            <div>
              <label className="font-semibold text-readora-ink block mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="e.g. elena_rostova"
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-readora-ink block mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="reader@example.com"
              className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
            />
          </div>

          <div>
            <label className="font-semibold text-readora-ink block mb-1">Password *</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
            />
          </div>

          {/* Onboarding Interests Selection */}
          <div className="pt-2">
            <label className="font-semibold text-readora-ink block mb-2">
              Select Your Reading & Writing Interests:
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((item) => {
                const selected = selectedInterests.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleInterest(item.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selected
                        ? 'bg-readora-forest text-readora-ivory border-readora-forest shadow-sm'
                        : 'bg-readora-ivory text-readora-ink border-readora-border hover:bg-readora-border/60'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-readora-forest text-readora-ivory font-semibold py-3 rounded-xl hover:bg-readora-forest-light transition-colors text-xs flex items-center justify-center space-x-1.5 shadow-sm mt-4"
          >
            <span>{loading ? 'Creating Profile...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-readora-border/60 text-center text-xs text-readora-muted">
          <span>Already registered? </span>
          <Link to="/login" state={location.state} className="font-semibold text-readora-forest hover:underline">
            Sign in to your library
          </Link>
        </div>

      </div>
    </div>
  );
};
