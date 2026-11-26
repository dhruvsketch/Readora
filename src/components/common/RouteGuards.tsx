import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin, switchMockRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-readora-surface rounded-2xl border border-red-200 shadow-editorial text-center">
        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="font-serif text-2xl font-bold text-readora-ink">Restricted Administrative Area</h2>
        <p className="text-sm text-readora-muted mt-2 max-w-md mx-auto">
          Access to this management console requires administrator permissions. Frontend route guards enforce this interface boundary, backed by database Row Level Security policies.
        </p>

        <div className="mt-6 p-4 bg-readora-ivory rounded-xl border border-readora-border/60 text-xs text-left max-w-md mx-auto">
          <p className="font-semibold text-readora-ink flex items-center">
            <Lock className="w-3.5 h-3.5 mr-1.5 text-readora-forest" /> Testing & Evaluation Notice:
          </p>
          <p className="text-readora-muted mt-1">
            You are currently signed in as a standard user. You can switch to the administrator persona below to evaluate the book, chapter, article, and community CMS systems.
          </p>
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => switchMockRole('admin')}
              className="bg-readora-forest text-readora-ivory px-3 py-1.5 rounded-lg font-semibold hover:bg-readora-forest-light transition-colors"
            >
              Switch to Administrator Persona
            </button>
            <Link to="/" className="text-readora-muted hover:text-readora-ink underline flex items-center">
              <ArrowLeft className="w-3 h-3 mr-1" /> Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
