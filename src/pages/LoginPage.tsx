import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as any;
  const from =
    locationState?.from?.pathname ||
    (typeof locationState?.from === 'string' ? locationState.from : null) ||
    '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Failed to sign in. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="bg-readora-surface w-full max-w-md rounded-3xl p-8 sm:p-10 border border-readora-border shadow-editorial space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-readora-forest flex items-center justify-center text-readora-gold shadow-sm mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-readora-ivory" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-readora-ink">Welcome to Readora</h1>
          <p className="text-xs text-readora-muted">Enter your email or username to access your library</p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-readora-ink block mb-1 flex items-center">
              <Mail className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Email or Username
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. elena_rostova or reader@example.com"
              className="w-full p-3 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-readora-ink flex items-center">
                <Lock className="w-3.5 h-3.5 mr-1 text-readora-forest" /> Password
              </label>
              <Link to="/forgot-password" className="text-[11px] text-readora-muted hover:text-readora-forest underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-readora-forest text-readora-ivory font-semibold py-3 rounded-xl hover:bg-readora-forest-light transition-colors text-xs flex items-center justify-center space-x-1.5 shadow-sm mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Readora'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-readora-border/60 text-center text-xs text-readora-muted">
          <span>New to Readora? </span>
          <Link to="/signup" state={location.state} className="font-semibold text-readora-forest hover:underline">
            Create an account
          </Link>
        </div>

        {/* Quick Demo Credentials helper */}
        <div className="p-3 bg-readora-ivory rounded-xl border border-readora-border/60 text-[11px] text-readora-muted space-y-1">
          <p className="font-semibold text-readora-ink">Quick Demo Sign-in:</p>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => { setEmail('elena_rostova'); setPassword('password'); }}
              className="text-readora-forest hover:underline font-medium"
            >
              Elena (Admin)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => { setEmail('julian_vance'); setPassword('password'); }}
              className="text-readora-forest hover:underline font-medium"
            >
              Julian (Moderator)
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => { setEmail('marcus_reader'); setPassword('password'); }}
              className="text-readora-forest hover:underline font-medium"
            >
              Marcus (Reader)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
