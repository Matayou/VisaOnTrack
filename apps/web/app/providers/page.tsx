'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SeekerHeader } from '@/components/SeekerHeader';
import { api } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, AlertCircle, ArrowLeft, Search, Filter, Grid3x3, List } from 'lucide-react';
import { ProviderCard } from './components/ProviderCard';
import { ProviderFilters } from './components/ProviderFilters';

interface Provider {
  id: string;
  businessName: string;
  description?: string;
  location?: string;
  languages: string[];
  website?: string;
  yearsExperience?: number;
  verifiedAt?: string;
  rating?: number;
  reviewCount?: number;
  startingPrice?: number;
  responseTime?: string;
  specialties?: string[];
}

export default function ProviderDirectoryPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    verifiedOnly: true,
    specialties: [] as string[],
    minRating: '4',
    location: '',
    languages: [] as string[],
    minExperience: '',
  });

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call when endpoint is ready
        // const response = await api.providers.listProviders();
        // setProviders(response.data);
        
        // Mock data for now
        setProviders([
          {
            id: '1',
            businessName: 'Visa Thailand Experts Co.',
            description: 'Professional visa agency with 15+ years of experience helping expats navigate Thai immigration.',
            location: 'Bangkok, Thailand',
            languages: ['English', 'Thai', 'Mandarin'],
            website: 'https://visathailand.com',
            yearsExperience: 15,
            verifiedAt: new Date().toISOString(),
            rating: 4.9,
            reviewCount: 24,
            startingPrice: 45000,
            responseTime: '2-4 hours',
            specialties: ['DTV', 'Retirement', 'Elite'],
          },
          {
            id: '2',
            businessName: 'Thai Smile Visa Services',
            description: 'Boutique visa agency specializing in Digital Nomad and Education visas.',
            location: 'Chiang Mai, Thailand',
            languages: ['English', 'Thai'],
            yearsExperience: 8,
            verifiedAt: new Date().toISOString(),
            rating: 5.0,
            reviewCount: 18,
            startingPrice: 38000,
            responseTime: '1-2 hours',
            specialties: ['DTV', 'Education'],
          },
          {
            id: '3',
            businessName: 'Bangkok Legal Partners',
            description: 'Full-service law firm specializing in business visas and work permits.',
            location: 'Bangkok, Thailand',
            languages: ['English', 'Thai', 'Japanese'],
            yearsExperience: 20,
            verifiedAt: new Date().toISOString(),
            rating: 4.7,
            reviewCount: 31,
            startingPrice: 85000,
            responseTime: '4-6 hours',
            specialties: ['Business', 'Work Permit', 'BOI'],
          },
        ]);
      } catch (err: any) {
        console.error('[ProviderDirectory] load error', err);
        setError(getErrorDisplayMessage(err, 'load providers'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProviders();
  }, []);

  // Filter and search logic
  const filteredProviders = providers.filter((provider) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!provider.businessName.toLowerCase().includes(query) && 
          !provider.description?.toLowerCase().includes(query) &&
          !provider.location?.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    if (filters.verifiedOnly && !provider.verifiedAt) {
      return false;
    }

    if (filters.specialties.length > 0 && provider.specialties) {
      if (!filters.specialties.some(s => provider.specialties?.includes(s))) {
        return false;
      }
    }

    if (filters.minRating && provider.rating) {
      if (provider.rating < parseFloat(filters.minRating)) {
        return false;
      }
    }

    if (filters.location && provider.location !== filters.location) {
      return false;
    }

    return true;
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading providers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      <SeekerHeader />
      <main className="mx-auto max-w-7xl px-4 py-4 lg:px-8 lg:py-6">
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <button 
            onClick={() => router.push('/dashboard')}
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
            <ProviderFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search & View Toggle Bar */}
            <div className="ios-card mb-4 p-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search providers by name, location, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border-gray-200 bg-gray-50/50 py-2 pl-10 pr-4 text-sm text-gray-900 shadow-sm focus:border-primary focus:bg-white focus:ring-primary"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border-gray-200 bg-gray-50/50 px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-primary focus:bg-white focus:ring-primary"
                  >
                    <option value="recommended">Sort: Recommended</option>
                    <option value="rating">Sort: Highest rated</option>
                    <option value="reviews">Sort: Most reviews</option>
                    <option value="price-low">Sort: Lowest price</option>
                    <option value="response">Sort: Fastest response</option>
                  </select>
                  <div className="hidden items-center gap-1 rounded-lg border border-gray-200 p-1 sm:flex">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`rounded p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`rounded p-1.5 transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                Showing <span className="font-semibold text-gray-900">{filteredProviders.length}</span> verified providers
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                <AlertCircle className="h-5 w-5" />
                {error}
              </div>
            )}

            {/* Providers Grid/List */}
            {filteredProviders.length === 0 ? (
              <div className="relative overflow-hidden rounded-2xl border border-gray-100/50 bg-gray-50/50 py-12 text-center">
                <div className="from-primary/5 pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr to-transparent blur-2xl"></div>
                <div className="relative z-10">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white shadow-sm ring-4 ring-gray-50">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 font-bold text-gray-900">No providers found</h3>
                  <p className="mx-auto mb-6 max-w-xs text-sm leading-relaxed text-gray-500">
                    Try adjusting your filters or search terms
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ verifiedOnly: true, specialties: [], minRating: '', location: '', languages: [], minExperience: '' });
                    }}
                    className="hover:border-primary/30 mx-auto flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 shadow-sm transition-all hover:text-primary hover:shadow"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3'}>
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    provider={provider}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

