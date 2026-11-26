import React, { useState } from 'react';
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Globe, 
  CheckCircle, 
  Save 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, switchMockRole } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName.trim(),
      username: username.trim(),
      bio: bio.trim(),
      website: website.trim(),
      avatar_url: avatarUrl.trim(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="border-b border-readora-border/60 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Account Preferences</span>
        <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Profile & Settings</h1>
        <p className="text-xs text-readora-muted mt-1">Manage public biography, avatar, and personal privacy controls.</p>
      </div>

      <div className="bg-readora-surface rounded-3xl p-8 border border-readora-border shadow-sm space-y-6">
        
        {savedSuccess && (
          <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Profile updates have been successfully saved to the database.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Avatar Preview & URL */}
          <div className="flex items-center space-x-6 pb-6 border-b border-readora-border/60">
            <img
              src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={fullName}
              className="w-20 h-20 rounded-full object-cover border-2 border-readora-forest/20 shadow-sm flex-shrink-0"
            />
            <div className="flex-1">
              <label className="font-semibold text-readora-ink block mb-1">Avatar Image URL</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-readora-ink block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-readora-ink block mb-1">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-readora-ink block mb-1">Biography</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell readers about your literary interests, favorite books, or background..."
              className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
            />
          </div>

          <div>
            <label className="font-semibold text-readora-ink block mb-1">Website or Portfolio Link</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-readora-border/60 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 bg-readora-forest text-readora-ivory px-6 py-2.5 rounded-xl font-semibold hover:bg-readora-forest-light transition-colors shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
