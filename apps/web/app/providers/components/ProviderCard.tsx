import React from 'react';
import { useRouter } from 'next/navigation';
import { Star, ShieldCheck } from 'lucide-react';

interface Provider {
  id: string;
  businessName: string;
  description?: string;
  location?: string;
  languages: string[];
  yearsExperience?: number;
  verifiedAt?: string;
  rating?: number;
  reviewCount?: number;
  startingPrice?: number;
  responseTime?: string;
  specialties?: string[];
}

interface ProviderCardProps {
  provider: Provider;
  viewMode: 'grid' | 'list';
}

const currencyFormatter = new Intl.NumberFormat('th-TH', {
  style: 'currency',
  currency: 'THB',
  maximumFractionDigits: 0,
});

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, viewMode }) => {
  const router = useRouter();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (id: string) => {
    const colors = [
      'from-primary to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600',
    ];
    const index = parseInt(id.slice(0, 8), 16) % colors.length;
    return colors[index];
  };

  const renderStars = () => {
    if (!provider.rating) return null;
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i <= provider.rating ? 'fill-current text-amber-400' : 'fill-current text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (viewMode === 'list') {
    return (
      <div className="ios-card hover:border-primary/30 p-4 transition-colors">
        <div className="flex items-start gap-4">
          <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${getAvatarColor(provider.id)} flex flex-shrink-0 items-center justify-center text-xl font-bold text-white shadow-sm`}>
            {getInitials(provider.businessName)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <h3 className="mb-1 text-base font-semibold text-gray-900">
                  {provider.businessName}
                </h3>
                <p className="text-xs text-gray-500">{provider.location}</p>
              </div>
              {provider.verifiedAt && (
                <span className="flex flex-shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/10">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="mb-3 text-sm leading-relaxed text-gray-600">
              {provider.description}
            </p>
            <div className="mb-3 flex flex-wrap items-center gap-4 text-sm">
              {provider.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-0.5">
                    {renderStars()}
                  </div>
                  <span className="font-semibold text-gray-900">{provider.rating}</span>
                  <span className="text-gray-500">({provider.reviewCount} reviews)</span>
                </div>
              )}
              {provider.startingPrice && (
                <span className="text-gray-500">
                  From <span className="font-semibold text-gray-900">{currencyFormatter.format(provider.startingPrice)}</span>
                </span>
              )}
              {provider.responseTime && (
                <span className="text-gray-500">~{provider.responseTime} response</span>
              )}
            </div>
            {provider.specialties && provider.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {provider.specialties.map((specialty) => (
                  <span key={specialty} className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                    {specialty}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => router.push(`/providers/${provider.id}`)}
            className="flex-shrink-0 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600"
          >
            View profile
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="ios-card hover:border-primary/30 p-5 transition-colors">
      <div className="mb-4 flex items-start gap-3">
        <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${getAvatarColor(provider.id)} flex flex-shrink-0 items-center justify-center text-lg font-bold text-white shadow-sm`}>
          {getInitials(provider.businessName)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 truncate text-base font-semibold text-gray-900">
            {provider.businessName}
          </h3>
          <p className="mb-2 text-xs text-gray-500">{provider.location}</p>
          <div className="flex items-center gap-2">
            {provider.rating && (
              <>
                <div className="flex items-center gap-0.5">
                  {renderStars()}
                </div>
                <span className="text-xs font-semibold text-gray-900">{provider.rating}</span>
                <span className="text-xs text-gray-500">({provider.reviewCount})</span>
              </>
            )}
            {provider.verifiedAt && (
              <span className="ml-auto flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/10">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-gray-600">
        {provider.description}
      </p>

      {provider.specialties && provider.specialties.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {provider.specialties.map((specialty) => (
            <span key={specialty} className="rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
              {specialty}
            </span>
          ))}
        </div>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        {provider.startingPrice && (
          <div>
            <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">From</p>
            <p className="font-semibold text-gray-900">{currencyFormatter.format(provider.startingPrice)}</p>
          </div>
        )}
        {provider.responseTime && (
          <div>
            <p className="mb-0.5 text-xs uppercase tracking-wide text-gray-400">Response</p>
            <p className="font-semibold text-gray-900">~{provider.responseTime}</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => router.push(`/providers/${provider.id}`)}
        className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-600"
      >
        View profile
      </button>
    </div>
  );
};

