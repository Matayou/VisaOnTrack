'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProviderHeader } from '@/components/ProviderHeader';
import { Footer } from '@/components/ui';
import { api, type Request } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, AlertCircle, ArrowLeft, Search, Filter } from 'lucide-react';
import { LeadCard } from './components/LeadCard';
import { LeadFilters } from './components/LeadFilters';

interface ProviderRequest extends Request {
  unlockStatus?: 'LOCKED' | 'UNLOCKED';
}

export default function ProviderMarketplacePage() {
  const router = useRouter();
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    visaTypes: [] as string[],
    budgetMin: '',
    location: '',
    urgentOnly: false,
    newOnly: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [creditsRes, requestsRes] = await Promise.all([
          api.credits.getBalance(),
          api.requests.listRequests({ status: 'OPEN' as any }),
        ]);

        setCredits(creditsRes.credits);
        setRequests(requestsRes.data as ProviderRequest[]);
      } catch (err: any) {
        console.error('[ProviderMarketplace] load error', err);
        setError(getErrorDisplayMessage(err, 'load leads'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUnlock = async (requestId: string) => {
    if (credits < 1) {
      alert('Insufficient credits. Please top up.');
      return;
    }

    try {
      const result = await api.requests.unlockRequest({ id: requestId });
      setCredits(result.remainingCredits);
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, unlockStatus: 'UNLOCKED' } : req
        )
      );
      // Navigate to the unlocked request
      router.push(`/requests/${requestId}`);
    } catch (err) {
      console.error('Unlock failed', err);
      alert(getErrorDisplayMessage(err, 'unlock request'));
    }
  };

  const handleSave = (requestId: string) => {
    // TODO: Implement save/bookmark functionality
    console.log('Save request:', requestId);
  };

  // Filter and sort logic
  const filteredRequests = requests.filter((req) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!req.title?.toLowerCase().includes(query) && 
          !req.visaType?.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (filters.visaTypes.length > 0 && req.visaType) {
      if (!filters.visaTypes.includes(req.visaType)) {
        return false;
      }
    }

    if (filters.location && req.location !== filters.location) {
      return false;
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading marketplace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      <ProviderHeader />
      <main className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:py-6">
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <button 
            onClick={() => router.push('/providers/dashboard')}
            className="-ml-2 inline-flex items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100/50 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 lg:hidden"
          >
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} mb-4 lg:col-span-1 lg:mb-0 lg:block`}>
            <LeadFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search & Sort Bar */}
            <div className="ios-card mb-4 p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by visa type, nationality..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-primary focus:bg-white focus:ring-primary"
                  />
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:bg-white focus:ring-primary"
                >
                  <option value="recommended">Sort: Recommended</option>
                  <option value="newest">Sort: Newest first</option>
                  <option value="budget-high">Sort: Highest budget</option>
                  <option value="budget-low">Sort: Lowest budget</option>
                </select>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Showing <span className="font-semibold text-gray-900">{filteredRequests.length}</span> leads
                </span>
                <span className="text-xs text-gray-400">Updated just now</span>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Leads List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="relative overflow-hidden rounded-2xl border border-gray-100/50 bg-gray-50/50 py-12 text-center">
                  <div className="from-primary/5 pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr to-transparent blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm ring-4 ring-gray-50">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="mb-2 font-bold text-gray-900">No leads match your filters</h3>
                    <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-gray-500">
                      Try adjusting your filters or check back later for new requests
                    </p>
                    <button 
                      onClick={() => setFilters({ visaTypes: [], budgetMin: '', location: '', urgentOnly: false, newOnly: false })}
                      className="hover:border-primary/30 mx-auto flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:text-primary hover:shadow"
                    >
                      Clear all filters
                    </button>
                  </div>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <LeadCard
                    key={request.id}
                    request={request}
                    onUnlock={handleUnlock}
                    onSave={handleSave}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

