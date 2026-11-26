import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Repeat, 
  BookOpen, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Plus 
} from 'lucide-react';
import { ReadoraStore } from '../lib/store';
import { useAuth } from '../context/AuthContext';
import { BookListing, BorrowingRequest, BookCondition } from '../types/database';
import { CTAButton } from '../components/common/CTAButton';

export const BorrowingPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState<'available' | 'borrowed' | 'lent' | 'create'>('available');
  const [listings, setListings] = useState<BookListing[]>([]);
  const [requests, setRequests] = useState<BorrowingRequest[]>([]);

  // Request modal state
  const [selectedListing, setSelectedListing] = useState<BookListing | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isCreatingListing, setIsCreatingListing] = useState(false);

  // New Listing Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [condition, setCondition] = useState<BookCondition>('Very Good');
  const [periodDays, setPeriodDays] = useState(14);
  const [pickupLocation, setPickupLocation] = useState('');
  const [terms, setTerms] = useState('');
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    loadData();
    window.addEventListener('readora_storage_change', loadData);
    return () => window.removeEventListener('readora_storage_change', loadData);
  }, [user]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['available', 'borrowed', 'lent', 'create'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }

    const reqId = searchParams.get('request');
    if (reqId) {
      const allListings = ReadoraStore.getListings();
      const target = allListings.find(l => l.id === reqId && l.status === 'available');
      if (target) {
        setSelectedListing(target);
      }
    }
  }, [searchParams]);

  const loadData = () => {
    setListings(ReadoraStore.getListings());
    if (user) {
      setRequests(ReadoraStore.getBorrowingRequests(user.id));
    }
  };

  const handleOpenBorrowModal = (listing: BookListing) => {
    if (!isAuthenticated) {
      navigate('/login', {
        state: { from: { pathname: '/borrowed', search: `?request=${listing.id}` } }
      });
      return;
    }
    setSelectedListing(listing);
  };

  const handleSendBorrowRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedListing || isRequesting) return;

    setIsRequesting(true);
    ReadoraStore.createBorrowingRequest(user.id, selectedListing.id, requestMessage);
    setRequestSuccess(true);
    setIsRequesting(false);

    setTimeout(() => {
      setSelectedListing(null);
      setRequestSuccess(false);
      setRequestMessage('');
      setActiveTab('borrowed');
    }, 1500);
  };

  const handleUpdateStatus = (requestId: string, status: any) => {
    ReadoraStore.updateBorrowingStatus(requestId, status);
    loadData();
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', {
        state: { from: { pathname: '/borrowed', search: '?tab=create' } }
      });
      return;
    }
    if (isCreatingListing) return;

    setIsCreatingListing(true);
    ReadoraStore.createListing({
      lender_id: user.id,
      title: title.trim(),
      author: author.trim(),
      condition,
      lending_period_days: Number(periodDays),
      pickup_location: pickupLocation.trim(),
      terms: terms.trim() || undefined,
      cover_image: coverImage.trim() || undefined,
    });

    setTitle('');
    setAuthor('');
    setPickupLocation('');
    setTerms('');
    setCoverImage('');
    setIsCreatingListing(false);
    setActiveTab('available');
    loadData();
  };

  const myBorrowed = requests.filter(r => r.borrower_id === user?.id);
  const myLent = requests.filter(r => r.lender_id === user?.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title & Primary Section CTA Buttons */}
      <div className="border-b border-readora-border/60 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-readora-forest">
            Peer-to-Peer Physical Library
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-readora-ink mt-1">
            Book Borrowing & Lending
          </h1>
          <p className="text-sm text-readora-muted mt-1 max-w-xl">
            Lend your beloved physical books to nearby readers and borrow hardcovers with tracked return dates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <CTAButton
            onClick={() => setActiveTab('available')}
            variant={activeTab === 'available' ? 'primary' : 'secondary'}
            size="sm"
            shape="pill"
            icon={<Repeat className="w-3.5 h-3.5" />}
            ctaName="Lending Borrow a Book"
            ctaSection="borrowing_page_header"
          >
            Borrow a Book
          </CTAButton>

          <CTAButton
            onClick={() => {
              if (!isAuthenticated) {
                navigate('/login', {
                  state: { from: { pathname: '/borrowed', search: '?tab=create' } }
                });
              } else {
                setActiveTab('create');
              }
            }}
            variant={activeTab === 'create' ? 'primary' : 'secondary'}
            size="sm"
            shape="pill"
            icon={<Plus className="w-3.5 h-3.5" />}
            ctaName="Lending List a Book"
            ctaSection="borrowing_page_header"
          >
            List a Book for Lending
          </CTAButton>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-readora-border space-x-8 text-sm overflow-x-auto">
        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'available'
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold'
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Available Copies ({listings.filter(l => l.status === 'available').length})
        </button>
        <button
          onClick={() => setActiveTab('borrowed')}
          className={`pb-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'borrowed'
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold'
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          My Borrowed Books ({myBorrowed.length})
        </button>
        <button
          onClick={() => setActiveTab('lent')}
          className={`pb-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'lent'
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold'
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Lending Requests ({myLent.length})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'create'
              ? 'border-b-2 border-readora-forest text-readora-forest font-semibold'
              : 'text-readora-muted hover:text-readora-ink'
          }`}
        >
          Add New Listing
        </button>
      </div>

      {/* Tab 1: Available Listings */}
      {activeTab === 'available' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.filter(l => l.status === 'available').map((listing) => (
            <div
              key={listing.id}
              className="bg-readora-surface rounded-2xl p-6 border border-readora-border shadow-sm flex flex-col justify-between space-y-4 hover:border-readora-forest/40 transition-colors"
            >
              <div className="flex space-x-4">
                <img
                  src={listing.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=300&q=80'}
                  alt={listing.title}
                  className="w-20 h-28 object-cover rounded-lg shadow-sm flex-shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-readora-forest bg-readora-forest/10 px-2 py-0.5 rounded">
                    {listing.condition}
                  </span>
                  <h3 className="font-serif font-bold text-base text-readora-ink truncate mt-1">{listing.title}</h3>
                  <p className="text-xs text-readora-muted">{listing.author}</p>
                  <p className="text-xs text-readora-ink/80 flex items-center pt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-readora-forest flex-shrink-0" />
                    <span className="truncate">{listing.pickup_location}</span>
                  </p>
                </div>
              </div>

              {listing.terms && (
                <p className="text-xs text-readora-muted bg-readora-ivory p-2.5 rounded-xl border border-readora-border/60 italic">
                  Terms: {listing.terms}
                </p>
              )}

              <div className="pt-3 border-t border-readora-border/60 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <img
                    src={listing.lender?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
                    alt="Lender"
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-xs text-readora-muted truncate max-w-[110px]">{listing.lender?.full_name}</span>
                </div>

                <CTAButton
                  onClick={() => handleOpenBorrowModal(listing)}
                  variant="primary"
                  size="sm"
                  shape="rounded"
                  ctaName={`Request to Borrow - ${listing.title}`}
                  ctaSection="borrowing_available_card"
                >
                  Request to Borrow
                </CTAButton>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: My Borrowed Books */}
      {activeTab === 'borrowed' && (
        <div className="bg-readora-surface rounded-2xl border border-readora-border overflow-hidden">
          {myBorrowed.length === 0 ? (
            <div className="text-center py-14 px-4 space-y-3">
              <BookOpen className="w-10 h-10 text-readora-muted mx-auto opacity-40" />
              <p className="text-xs text-readora-muted">You have not borrowed any physical books yet.</p>
              <CTAButton
                onClick={() => setActiveTab('available')}
                variant="primary"
                size="sm"
                shape="pill"
                ctaName="Empty Borrowed Browse Available"
                ctaSection="borrowed_tab_empty"
              >
                Browse Available Books
              </CTAButton>
            </div>
          ) : (
            <div className="divide-y divide-readora-border">
              {myBorrowed.map((req) => (
                <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                      req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-readora-ivory text-readora-muted'
                    }`}>
                      Status: {req.status}
                    </span>
                    <h3 className="font-serif font-bold text-base text-readora-ink mt-1">{req.listing?.title}</h3>
                    <p className="text-xs text-readora-muted">Lender: {req.lender?.full_name} • Pickup: {req.listing?.pickup_location}</p>
                    {req.due_date && (
                      <p className="text-xs font-semibold text-readora-forest flex items-center pt-1">
                        <Clock className="w-3.5 h-3.5 mr-1" /> Due Date: {new Date(req.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {req.status === 'accepted' && (
                    <CTAButton
                      onClick={() => handleUpdateStatus(req.id, 'returned')}
                      variant="primary"
                      size="sm"
                      shape="rounded"
                      ctaName="Confirm Return Book"
                      ctaSection="borrowed_actions"
                    >
                      Confirm Returned to Lender
                    </CTAButton>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Lending Requests (For Lenders) */}
      {activeTab === 'lent' && (
        <div className="bg-readora-surface rounded-2xl border border-readora-border overflow-hidden">
          {myLent.length === 0 ? (
            <p className="text-xs text-readora-muted text-center py-12">No readers have requested your listed books yet.</p>
          ) : (
            <div className="divide-y divide-readora-border">
              {myLent.map((req) => (
                <div key={req.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-readora-gold bg-readora-gold/15 px-2 py-0.5 rounded">
                      Request: {req.status}
                    </span>
                    <h3 className="font-serif font-bold text-base text-readora-ink mt-1">{req.listing?.title}</h3>
                    <p className="text-xs text-readora-muted">Requested by: {req.borrower?.full_name} (@{req.borrower?.username})</p>
                    {req.message && (
                      <p className="text-xs text-readora-ink/80 bg-readora-ivory p-2 rounded-lg italic">
                        "{req.message}"
                      </p>
                    )}
                  </div>

                  {req.status === 'pending' && (
                    <div className="flex items-center space-x-2">
                      <CTAButton
                        onClick={() => handleUpdateStatus(req.id, 'accepted')}
                        variant="primary"
                        size="sm"
                        shape="rounded"
                        ctaName="Accept Borrow Request"
                        ctaSection="lending_requests"
                      >
                        Accept Request
                      </CTAButton>
                      <CTAButton
                        onClick={() => handleUpdateStatus(req.id, 'declined')}
                        variant="destructive"
                        size="sm"
                        shape="rounded"
                        ctaName="Decline Borrow Request"
                        ctaSection="lending_requests"
                      >
                        Decline
                      </CTAButton>
                    </div>
                  )}

                  {req.status === 'accepted' && (
                    <CTAButton
                      onClick={() => handleUpdateStatus(req.id, 'returned')}
                      variant="primary"
                      size="sm"
                      shape="rounded"
                      ctaName="Confirm Lender Return Completed"
                      ctaSection="lending_requests"
                    >
                      Confirm Return Completed
                    </CTAButton>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Add New Listing Form */}
      {activeTab === 'create' && (
        <div className="bg-readora-surface rounded-3xl p-8 border border-readora-border max-w-2xl mx-auto shadow-sm">
          <h2 className="font-serif font-bold text-xl text-readora-ink mb-2">List a Physical Book for Lending</h2>
          <p className="text-xs text-readora-muted mb-6">
            Share a book from your physical shelf. Set your preferred lending duration and general meeting or pickup point.
          </p>

          <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-readora-ink block mb-1">Book Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gödel, Escher, Bach"
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
            </div>

            <div>
              <label className="font-semibold text-readora-ink block mb-1">Author *</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Douglas Hofstadter"
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-readora-ink block mb-1">Condition *</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as BookCondition)}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                >
                  <option value="Like New">Like New</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Readable">Readable</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-readora-ink block mb-1">Lending Period (Days)</label>
                <input
                  type="number"
                  min="7"
                  max="60"
                  value={periodDays}
                  onChange={(e) => setPeriodDays(Number(e.target.value))}
                  className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-readora-ink block mb-1">General Pickup Area / City *</label>
              <input
                type="text"
                required
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="e.g. Cambridge, MA (Harvard Square or Central)"
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none focus:ring-1 focus:ring-readora-forest"
              />
              <span className="text-[10px] text-readora-muted mt-0.5 block">Keep your private home address hidden. Use public meeting spots or transit hubs.</span>
            </div>

            <div>
              <label className="font-semibold text-readora-ink block mb-1">Cover Image URL (Optional)</label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-readora-ink block mb-1">Special Terms / Handling Care</label>
              <textarea
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="e.g. Please do not fold page corners. Notes in pencil only."
                rows={2}
                className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
              />
            </div>

            <CTAButton
              type="submit"
              isLoading={isCreatingListing}
              loadingText="Creating Listing..."
              variant="primary"
              size="md"
              shape="rounded"
              fullWidth
              ctaName="Create Book Listing Submit"
              ctaSection="create_listing_form"
            >
              List Book for Community Lending
            </CTAButton>
          </form>
        </div>
      )}

      {/* Borrow Request Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-readora-surface w-full max-w-md rounded-2xl p-6 border border-readora-border shadow-editorial space-y-4">
            <h3 className="font-serif font-bold text-lg text-readora-ink">Request to Borrow</h3>
            <p className="text-xs text-readora-muted">
              You are requesting to borrow <span className="font-bold text-readora-ink">"{selectedListing.title}"</span> from {selectedListing.lender?.full_name}.
            </p>

            {requestSuccess ? (
              <div className="py-6 text-center text-readora-forest font-semibold text-xs flex flex-col items-center">
                <CheckCircle className="w-8 h-8 mb-2" />
                <span>Your request has been submitted to the lender!</span>
              </div>
            ) : (
              <form onSubmit={handleSendBorrowRequest} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-readora-ink block mb-1">Message to Lender (Optional)</label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    placeholder="Introduce yourself or suggest convenient times to meet at the pickup location..."
                    rows={3}
                    className="w-full p-2.5 bg-readora-ivory border border-readora-border rounded-xl focus:outline-none"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <CTAButton
                    type="button"
                    onClick={() => setSelectedListing(null)}
                    variant="secondary"
                    size="sm"
                    shape="rounded"
                    ctaName="Cancel Borrow Request Modal"
                    ctaSection="borrow_modal"
                  >
                    Cancel
                  </CTAButton>
                  <CTAButton
                    type="submit"
                    isLoading={isRequesting}
                    loadingText="Submitting..."
                    variant="primary"
                    size="sm"
                    shape="rounded"
                    ctaName="Submit Borrow Request Modal"
                    ctaSection="borrow_modal"
                  >
                    Send Request
                  </CTAButton>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
