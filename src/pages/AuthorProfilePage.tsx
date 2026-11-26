import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  UserCheck, 
  UserPlus, 
  Globe, 
  BookOpen, 
  FileText, 
  ArrowLeft,
  Calendar
} from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { useAuth } from '../context/AuthContext';
import { Profile, Article, Book } from '../types/database';

export const AuthorProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!id) return;
    const p = ReadoraStore.getProfileById(id);
    if (p) {
      setProfile(p);
      setArticles(ReadoraStore.getArticles().filter(a => a.author_id === p.id && a.status === 'published'));
      setBooks(ReadoraStore.getBooks().filter(b => b.author.toLowerCase().includes(p.full_name.toLowerCase())));
      
      if (user) {
        setIsFollowing(ReadoraStore.isFollowing(user.id, p.id));
      }
    }
  }, [id, user]);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <h2 className="font-serif text-2xl font-bold text-readora-ink">Author Not Found</h2>
        <Link to="/discover" className="text-xs font-semibold text-readora-forest hover:underline mt-2 inline-block">
          Explore Creators →
        </Link>
      </div>
    );
  }

  const handleToggleFollow = () => {
    if (!user) return alert('Please sign in to follow authors.');
    const following = ReadoraStore.toggleFollow(user.id, profile.id);
    setIsFollowing(following);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <Link to="/discover" className="inline-flex items-center text-xs font-semibold text-readora-muted hover:text-readora-forest">
        <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Discover
      </Link>

      {/* Profile Card */}
      <div className="bg-readora-surface rounded-3xl p-8 sm:p-12 border border-readora-border shadow-sm flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-6 sm:space-y-0 sm:space-x-8">
        <img
          src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
          alt={profile.full_name}
          className="w-28 h-28 rounded-full object-cover border-4 border-readora-forest/20 shadow-md flex-shrink-0"
        />

        <div className="space-y-3 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="font-serif text-3xl font-bold text-readora-ink">{profile.full_name}</h1>
              <p className="text-xs text-readora-muted">@{profile.username}</p>
            </div>

            <button
              onClick={handleToggleFollow}
              className={`inline-flex items-center space-x-1.5 px-5 py-2.5 rounded-full text-xs font-semibold border transition-colors self-center sm:self-auto ${
                isFollowing 
                  ? 'bg-readora-ivory text-readora-forest border-readora-forest/40' 
                  : 'bg-readora-forest text-readora-ivory border-transparent hover:bg-readora-forest-light'
              }`}
            >
              {isFollowing ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
              <span>{isFollowing ? 'Following' : 'Follow Author'}</span>
            </button>
          </div>

          <p className="text-sm text-readora-ink/80 leading-relaxed font-sans max-w-2xl">
            {profile.bio || 'Author and literary contributor on Readora.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-readora-muted">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" /> Joined {new Date(profile.created_at).toLocaleDateString()}
            </span>
            {profile.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-readora-forest hover:underline">
                <Globe className="w-3.5 h-3.5 mr-1" /> {profile.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Published Works */}
      <div className="space-y-6">
        <h2 className="font-serif text-2xl font-bold text-readora-ink flex items-center">
          <FileText className="w-5 h-5 mr-2 text-readora-forest" />
          Published Articles & Essays ({articles.length})
        </h2>

        {articles.length === 0 ? (
          <p className="text-xs text-readora-muted py-6">No articles published by this author yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((art) => (
              <div key={art.id} className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-readora-forest tracking-wider">
                    {art.category?.name || 'Essays'}
                  </span>
                  <h3 className="font-serif font-bold text-base text-readora-ink mt-1">
                    <Link to={`/articles/${art.slug || art.id}`} className="hover:underline">
                      {art.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-readora-muted mt-1.5 line-clamp-2">{art.excerpt}</p>
                </div>
                <div className="pt-4 border-t border-readora-border/60 flex items-center justify-between text-xs text-readora-muted mt-4">
                  <span>{art.read_time_minutes} min read</span>
                  <Link to={`/articles/${art.slug || art.id}`} className="text-readora-forest font-semibold hover:underline">
                    Read Essay →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
