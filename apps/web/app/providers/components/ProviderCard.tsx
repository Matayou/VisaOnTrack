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
          className={`w-3.5 h-3.5 ${i <= provider.rating ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`}
        />
      );
    }
    return stars;
  };

  if (viewMode === 'list') {
    return (
      <div className="ios-card p-4 hover:border-primary/30 transition-colors">
        <div className="flex items-start gap-4">
          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getAvatarColor(provider.id)} flex items-center justify-center flex-shrink-0 shadow-sm text-white font-bold text-xl`}>
            {getInitials(provider.businessName)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className="font-semibold text-gray-900 text-base mb-1">
                  {provider.businessName}
                </h3>
                <p className="text-xs text-gray-500">{provider.location}</p>
              </div>
              {provider.verifiedAt && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/10 flex-shrink-0 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">
              {provider.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
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
                  <span key={specialty} className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
                    {specialty}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={() => router.push(`/providers/${provider.id}`)}
            className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200 flex-shrink-0"
          >
            View profile
          </button>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="ios-card p-5 hover:border-primary/30 transition-colors">
      <div className="flex items-start gap-3 mb-4">
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${getAvatarColor(provider.id)} flex items-center justify-center flex-shrink-0 shadow-sm text-white font-bold text-lg`}>
          {getInitials(provider.businessName)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-base mb-1 truncate">
            {provider.businessName}
          </h3>
          <p className="text-xs text-gray-500 mb-2">{provider.location}</p>
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
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/10 ml-auto flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
        {provider.description}
      </p>

      {provider.specialties && provider.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {provider.specialties.map((specialty) => (
            <span key={specialty} className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg">
              {specialty}
            </span>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        {provider.startingPrice && (
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide mb-0.5">From</p>
            <p className="font-semibold text-gray-900">{currencyFormatter.format(provider.startingPrice)}</p>
          </div>
        )}
        {provider.responseTime && (
          <div>
            <p className="text-xs uppercase text-gray-400 tracking-wide mb-0.5">Response</p>
            <p className="font-semibold text-gray-900">~{provider.responseTime}</p>
          </div>
        )}
      </div>

      <button 
        onClick={() => router.push(`/providers/${provider.id}`)}
        className="w-full px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200"
      >
        View profile
      </button>
    </div>
  );
};

