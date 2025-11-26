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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="mb-4 lg:mb-6 flex items-center justify-between">
          <button 
            onClick={() => router.push('/dashboard')}
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
            <ProviderFilters 
              filters={filters}
              onFiltersChange={setFilters}
            />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search & View Toggle Bar */}
            <div className="ios-card p-4 mb-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search providers by name, location, or specialty..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-xl border-gray-200 bg-gray-50/50 focus:bg-white text-gray-900 shadow-sm focus:border-primary focus:ring-primary text-sm py-2 px-3"
                  >
                    <option value="recommended">Sort: Recommended</option>
                    <option value="rating">Sort: Highest rated</option>
                    <option value="reviews">Sort: Most reviews</option>
                    <option value="price-low">Sort: Lowest price</option>
                    <option value="response">Sort: Fastest response</option>
                  </select>
                  <div className="hidden sm:flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                    <button 
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                    >
                      <Grid3x3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
                    >
                      <List className="w-4 h-4" />
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
              <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-200 flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            {/* Providers Grid/List */}
            {filteredProviders.length === 0 ? (
              <div className="text-center py-12 relative overflow-hidden rounded-2xl bg-gray-50/50 border border-gray-100/50">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center ring-4 ring-gray-50">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">No providers found</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
                    Try adjusting your filters or search terms
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({ verifiedOnly: true, specialties: [], minRating: '', location: '', languages: [], minExperience: '' });
                    }}
                    className="px-6 py-2.5 bg-white border border-gray-200 hover:border-primary/30 hover:text-primary text-gray-600 font-medium rounded-xl text-sm transition-all shadow-sm hover:shadow flex items-center gap-2 mx-auto"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid sm:grid-cols-2 gap-4' : 'space-y-3'}>
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

