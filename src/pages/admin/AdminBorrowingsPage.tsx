import React, { useState, useEffect } from 'react';
import { Repeat, Clock, MapPin, CheckCircle, Search } from 'lucide-react';
import { ReadoraStore } from '../../lib/store';
import { BorrowingRequest, BookListing } from '../../types/database';

export const AdminBorrowingsPage: React.FC = () => {
  const [borrowings, setBorrowings] = useState<BorrowingRequest[]>([]);
  const [listings, setListings] = useState<BookListing[]>([]);

  useEffect(() => {
    setBorrowings(ReadoraStore.getBorrowingRequests());
    setListings(ReadoraStore.getListings());
  }, []);

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="border-b border-readora-border/60 pb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">Physical Logistics</span>
        <h1 className="font-serif text-3xl font-bold text-readora-ink mt-0.5">Borrowing & Lending Overview</h1>
        <p className="text-xs text-readora-muted mt-1">
          Monitor community transactions, active loans, and physical book return statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm">
          <span className="text-xs text-readora-muted">Total Community Listings</span>
          <p className="font-serif text-3xl font-bold text-readora-ink mt-1">{listings.length}</p>
        </div>
        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm">
          <span className="text-xs text-readora-muted">Active On-Loan Books</span>
          <p className="font-serif text-3xl font-bold text-readora-ink mt-1">
            {borrowings.filter(b => b.status === 'accepted' || b.status === 'borrowed').length}
          </p>
        </div>
        <div className="bg-readora-surface p-5 rounded-2xl border border-readora-border shadow-sm">
          <span className="text-xs text-readora-muted">Successfully Returned</span>
          <p className="font-serif text-3xl font-bold text-readora-ink mt-1">
            {borrowings.filter(b => b.status === 'returned').length}
          </p>
        </div>
      </div>

      <div className="bg-readora-surface rounded-2xl border border-readora-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-readora-border">
          <h3 className="font-serif font-bold text-base text-readora-ink">All Borrowing Transactions ({borrowings.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-readora-ivory text-readora-muted uppercase font-bold tracking-wider text-[10px] border-b border-readora-border">
              <tr>
                <th className="py-3 px-4">Book Title</th>
                <th className="py-3 px-4">Borrower</th>
                <th className="py-3 px-4">Lender</th>
                <th className="py-3 px-4">Pickup Location</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-readora-border">
              {borrowings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-readora-muted">
                    No active borrowing transactions recorded in database.
                  </td>
                </tr>
              ) : (
                borrowings.map((b) => (
                  <tr key={b.id} className="hover:bg-readora-ivory/50">
                    <td className="py-3.5 px-4 font-bold text-readora-ink">{b.listing?.title}</td>
                    <td className="py-3.5 px-4">{b.borrower?.full_name}</td>
                    <td className="py-3.5 px-4">{b.lender?.full_name}</td>
                    <td className="py-3.5 px-4 text-readora-muted">{b.listing?.pickup_location}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        b.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-readora-ivory text-readora-muted'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-readora-muted">
                      {b.due_date ? new Date(b.due_date).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
