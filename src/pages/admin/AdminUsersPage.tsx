import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Shield, 
  ShieldCheck, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { Profile, UserRole } from '../../types/database';

export const AdminUsersPage: React.FC = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  const loadData = () => {
    setProfiles(ReadoraStore.getProfiles());
  };

  const handleUpdateRole = (userId: string, newRole: UserRole) => {
    ReadoraStore.saveProfile({ id: userId, role: newRole });
    loadData();
  };

  const filtered = profiles.filter(p => 
    p.full_name.toLowerCase().includes(search.toLowerCase()) || 
    p.username.toLowerCase().includes(search.toLowerCase()) || 
    (p.bio && p.bio.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl">
      
      <div className="border-b border-readora-border/60 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">User Governance</span>
        <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">User Accounts & Roles</h1>
        <p className="text-xs text-readora-muted mt-1">
          Inspect member accounts, assign moderator permissions, and enforce administrative security. Passwords are never stored or exposed in plaintext.
        </p>
      </div>

      <div className="bg-readora-surface rounded-2xl border border-readora-border shadow-sm overflow-hidden">
        
        {/* Filter Bar */}
        <div className="p-4 border-b border-readora-border flex items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-readora-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or username..."
              className="w-full pl-9 pr-3 py-1.5 bg-readora-ivory rounded-xl border border-readora-border text-xs focus:outline-none"
            />
          </div>
          <span className="text-xs text-readora-muted">{filtered.length} registered accounts</span>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-readora-ivory text-readora-muted uppercase font-bold tracking-wider text-[10px] border-b border-readora-border">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Interests</th>
                <th className="py-3 px-4">Member Since</th>
                <th className="py-3 px-4">Role Privileges</th>
                <th className="py-3 px-4 text-right">Account Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-readora-border">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-readora-ivory/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                        alt={p.full_name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-bold text-readora-ink text-sm">{p.full_name}</p>
                        <p className="text-[11px] text-readora-muted">@{p.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] text-readora-muted">
                      {p.interests?.length ? p.interests.join(', ') : 'General Reader'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-readora-muted">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={p.role}
                      onChange={(e) => handleUpdateRole(p.id, e.target.value as UserRole)}
                      className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded border focus:outline-none ${
                        p.role === 'admin' ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold' :
                        p.role === 'moderator' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                        'bg-readora-ivory text-readora-ink border-readora-border'
                      }`}
                    >
                      <option value="user">Reader (User)</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
                      Active
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
