import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Search, 
  Eye, 
  MessageSquare,
  ShieldAlert
} from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { ReportItem } from '../../types/database';
import { useAuth } from '../../context/AuthContext';

export const AdminReportsPage: React.FC = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [moderatorNotes, setModeratorNotes] = useState('');

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, []);

  const loadData = () => {
    setReports(ReadoraStore.getReports());
  };

  const handleResolve = (status: 'resolved' | 'dismissed') => {
    if (!selectedReport) return;
    ReadoraStore.updateReportStatus(selectedReport.id, status, moderatorNotes, user?.id);
    setSelectedReport(null);
    setModeratorNotes('');
    loadData();
  };

  return (
    <div className="space-y-6 max-w-7xl">
      
      <div className="border-b border-readora-border/60 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-red-600">Safety & Trust</span>
        <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Content & User Reports</h1>
        <p className="text-xs text-readora-muted mt-1">
          Investigate reported posts, articles, and copyright concerns. Record formal moderation verdicts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Reports List */}
        <div className="lg:col-span-7 bg-readora-surface rounded-2xl border border-readora-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-readora-border flex items-center justify-between">
            <h3 className="font-serif font-bold text-base text-readora-ink">
              All Reports ({reports.length})
            </h3>
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {reports.filter(r => r.status === 'pending').length} Pending Review
            </span>
          </div>

          <div className="divide-y divide-readora-border">
            {reports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => {
                  setSelectedReport(rep);
                  setModeratorNotes(rep.moderator_notes || '');
                }}
                className={`p-4 cursor-pointer transition-colors space-y-2 ${
                  selectedReport?.id === rep.id ? 'bg-readora-forest/5 border-l-4 border-readora-forest' : 'hover:bg-readora-ivory/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-readora-ink uppercase tracking-wider text-[10px] bg-readora-ivory px-2 py-0.5 rounded border border-readora-border">
                    {rep.target_type}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    rep.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                    rep.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {rep.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-readora-ink">{rep.reason}</h4>
                  {rep.target_summary && (
                    <p className="text-xs text-readora-muted mt-0.5">Target: "{rep.target_summary}"</p>
                  )}
                </div>

                <div className="flex justify-between text-[11px] text-readora-muted pt-1">
                  <span>Reported by: {rep.reporter?.full_name || 'Anonymous'}</span>
                  <span>{new Date(rep.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Verdict Workspace */}
        <div className="lg:col-span-5 bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm space-y-4">
          <h3 className="font-serif font-bold text-base text-readora-ink border-b border-readora-border/60 pb-3">
            Moderator Verdict & Details
          </h3>

          {selectedReport ? (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-readora-ivory rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-readora-muted">Reason Filed</span>
                <p className="font-bold text-readora-ink">{selectedReport.reason}</p>
                {selectedReport.details && (
                  <p className="text-readora-muted pt-1 border-t border-readora-border/60 mt-1">{selectedReport.details}</p>
                )}
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Internal Moderation Notes</label>
                <textarea
                  value={moderatorNotes}
                  onChange={(e) => setModeratorNotes(e.target.value)}
                  placeholder="Record justification, actions taken, or policy references..."
                  rows={4}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={() => handleResolve('resolved')}
                  className="flex-1 bg-emerald-700 text-white font-semibold py-2.5 rounded-xl hover:bg-emerald-800 transition-colors flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Resolve & Take Action</span>
                </button>

                <button
                  onClick={() => handleResolve('dismissed')}
                  className="flex-1 border border-readora-border text-readora-ink font-semibold py-2.5 rounded-xl hover:bg-readora-ivory transition-colors flex items-center justify-center space-x-1.5"
                >
                  <XCircle className="w-4 h-4 text-readora-muted" />
                  <span>Dismiss Report</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-readora-muted">
              Select a report from the list to review details and record a moderation action.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
