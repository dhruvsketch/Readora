import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSupabaseConfigured && supabase) {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/settings`,
      });
      if (err) {
        setError(err.message);
        return;
      }
    }

    setSubmitted(true);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="bg-readora-surface w-full max-w-md rounded-3xl p-8 sm:p-10 border border-readora-border shadow-editorial space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-readora-forest flex items-center justify-center text-readora-gold shadow-sm mx-auto mb-3">
            <BookOpen className="w-6 h-6 text-readora-ivory" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-readora-ink">Password Recovery</h1>
          <p className="text-xs text-readora-muted">Enter your registered email address to receive recovery instructions</p>
        </div>

        {submitted ? (
          <div className="py-6 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-700 mx-auto" />
            <h3 className="font-serif font-bold text-base text-readora-ink">Instructions Sent</h3>
            <p className="text-xs text-readora-muted leading-relaxed">
              If an account is associated with {email}, you will receive a secure password reset link.
            </p>
            <div className="pt-4">
              <Link to="/login" className="text-xs font-semibold text-readora-forest hover:underline">
                Return to Login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && <p className="text-red-600 bg-red-50 p-2 rounded-lg">{error}</p>}

            <div>
              <label className="font-semibold text-readora-ink block mb-1">Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reader@example.com"
                className="w-full p-3 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-readora-forest text-readora-ivory font-semibold py-3 rounded-xl hover:bg-readora-forest-light transition-colors text-xs shadow-sm"
            >
              Send Password Reset Email
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-readora-border/60 text-center">
          <Link to="/login" className="inline-flex items-center text-xs text-readora-muted hover:text-readora-forest">
            <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};
