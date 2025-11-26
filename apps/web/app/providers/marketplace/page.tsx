'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProviderHeader } from '@/components/ProviderHeader';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="mb-4 lg:mb-6 flex items-center justify-between">
          <button 
            onClick={() => router.push('/providers/dashboard')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-gray-100/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block lg:col-span-1 mb-4 lg:mb-0`}>
            <LeadFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search & Sort Bar */}
            <div className="ios-card p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by visa type, nationality..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary text-sm"
                  />
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary text-sm py-2 px-3"
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
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Leads List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12 relative overflow-hidden rounded-2xl bg-gray-50/50 border border-gray-100/50">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                  <div className="relative z-10">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center ring-4 ring-gray-50">
                      <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">No leads match your filters</h3>
                    <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
                      Try adjusting your filters or check back later for new requests
                    </p>
                    <button 
                      onClick={() => setFilters({ visaTypes: [], budgetMin: '', location: '', urgentOnly: false, newOnly: false })}
                      className="px-6 py-2.5 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary text-gray-600 font-medium rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 mx-auto"
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
    </div>
  );
}

