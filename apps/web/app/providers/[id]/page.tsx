'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@visaontrack/client';
import { getErrorDisplayMessage } from '@/lib/error-handling';
import { Loader, AlertCircle, ArrowLeft, Star, ShieldCheck, Globe, Clock, MessageCircle } from 'lucide-react';

interface ProviderProfile {
  id: string;
  businessName: string;
  description?: string;
  location?: string;
  languages: string[];
  website?: string;
  contactPhone?: string;
  yearsExperience?: number;
  verifiedAt?: string;
}

// Mock service packages and reviews until backend is ready
interface ServicePackage {
  id: string;
  title: string;
  description: string;
  priceTHB: number;
  deliverables: string[];
  etaDays: number;
}

interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ProviderPublicProfilePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const providerId = Array.isArray(params?.id) ? params?.id[0] : params?.id;

  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for now
  const [servicePackages] = useState<ServicePackage[]>([
    {
      id: '1',
      title: 'Digital Nomad Visa (DTV) - Full Service',
      description: 'Complete DTV application support including document preparation, embassy liaison, and follow-up. Perfect for remote workers and freelancers.',
      priceTHB: 45000,
      deliverables: [
        'Document review & preparation',
        'Embassy appointment booking',
        'Application submission & tracking',
        'Post-approval support & guidance'
      ],
      etaDays: 10
    },
    {
      id: '2',
      title: 'Retirement Visa (Non-O) - Premium',
      description: 'Comprehensive retirement visa service including bank account setup, insurance coordination, and annual extension planning.',
      priceTHB: 65000,
      deliverables: [
        'Bank account opening assistance',
        'Health insurance coordination',
        'Full visa application & submission',
        '1-year extension planning'
      ],
      etaDays: 18
    },
    {
      id: '3',
      title: 'Visa Consultation - 1 Hour',
      description: 'Expert consultation to assess your situation and recommend the best visa pathway. Includes personalized action plan.',
      priceTHB: 3500,
      deliverables: [
        '1-hour video consultation',
        'Personalized visa recommendation',
        'Written action plan & timeline'
      ],
      etaDays: 1
    }
  ]);

  const [reviews] = useState<Review[]>([
    {
      id: '1',
      authorName: 'John Doe',
      rating: 5,
      text: 'Excellent service! The team was professional, responsive, and made the entire DTV application process smooth and stress-free. Got my visa approved in just 8 days. Highly recommend!',
      createdAt: '2 weeks ago'
    },
    {
      id: '2',
      authorName: 'Sarah Miller',
      rating: 5,
      text: 'Very knowledgeable team. They helped me with my retirement visa and explained every step clearly. The bank account setup assistance was particularly helpful. Worth every baht!',
      createdAt: '1 month ago'
    },
    {
      id: '3',
      authorName: 'Michael Chen',
      rating: 4,
      text: 'Good service overall. The process took a bit longer than expected (about 12 days instead of 7-10), but they kept me updated throughout. Would use again.',
      createdAt: '2 months ago'
    }
  ]);

  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  useEffect(() => {
    if (!providerId) return;

    const loadProvider = async () => {
      try {
        setIsLoading(true);
        
        // Mock data for demo providers (matching the directory)
        const mockProviders: Record<string, ProviderProfile> = {
          '1': {
            id: '1',
            businessName: 'Visa Thailand Experts Co.',
            description: 'Professional visa agency with 15+ years of experience helping expats navigate Thai immigration. We specialize in Digital Nomad, Retirement, and Elite visas with a 98% success rate.',
            location: 'Bangkok, Thailand',
            languages: ['English', 'Thai', 'Mandarin'],
            website: 'https://visathailand.com',
            contactPhone: '+66 2 123 4567',
            yearsExperience: 15,
            verifiedAt: new Date().toISOString(),
          },
          '2': {
            id: '2',
            businessName: 'Thai Smile Visa Services',
            description: 'Boutique visa agency specializing in Digital Nomad and Education visas. Fast processing with personalized service.',
            location: 'Chiang Mai, Thailand',
            languages: ['English', 'Thai'],
            website: 'https://thaismile.com',
            yearsExperience: 8,
            verifiedAt: new Date().toISOString(),
          },
          '3': {
            id: '3',
            businessName: 'Bangkok Legal Partners',
            description: 'Full-service law firm specializing in business visas, work permits, and corporate immigration solutions.',
            location: 'Bangkok, Thailand',
            languages: ['English', 'Thai', 'Japanese'],
            website: 'https://bangkoklegal.com',
            yearsExperience: 20,
            verifiedAt: new Date().toISOString(),
          },
        };

        // Check if it's a mock provider
        if (mockProviders[providerId]) {
          setProvider(mockProviders[providerId]);
        } else {
          // Try to fetch from API for real providers
          const data = await api.providers.getProvider({ id: providerId });
          setProvider(data);
        }
      } catch (err: any) {
        console.error('[ProviderProfile] load error', err);
        setError(getErrorDisplayMessage(err, 'load provider profile'));
      } finally {
        setIsLoading(false);
      }
    };

    loadProvider();
  }, [providerId]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${i <= rating ? 'text-amber-400 fill-current' : 'text-gray-300 fill-current'}`}
        />
      );
    }
    return stars;
  };

  const currencyFormatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader className="h-5 w-5 animate-spin" />
          <span>Loading provider profile...</span>
        </div>
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl border border-red-100 max-w-md w-full text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">Unable to load provider</h2>
          <p className="text-gray-600 mb-6">{error || 'Provider not found'}</p>
          <button 
            onClick={() => router.push('/providers')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32 lg:pb-12">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <span className="font-bold text-gray-900">SawadeePass</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-500 hover:text-gray-900 font-medium">
              Sign in
            </button>
            <button className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200">
              Get started
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-6">
        <div className="mb-4 lg:mb-6">
          <button 
            onClick={() => router.push('/providers')}
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors px-2 py-1 -ml-2 rounded-lg hover:bg-gray-100/50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-4 mb-4 lg:mb-0">
            
            {/* Provider Header Card */}
            <div className="ios-card p-5 lg:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/40 to-transparent rounded-full -mr-20 -mt-20 pointer-events-none"></div>

              <div className="relative flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200 ring-4 ring-white text-white font-bold text-2xl">
                  {getInitials(provider.businessName)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h1 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                        {provider.businessName}
                      </h1>
                      <p className="text-sm text-gray-500 mt-1">{provider.location}</p>
                    </div>
                    {provider.verifiedAt && (
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/10 flex-shrink-0 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {provider.description || 'No description provided'}
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 text-sm mb-4">
                    {provider.yearsExperience && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          <span className="font-semibold text-gray-900">{provider.yearsExperience}</span> years experience
                        </span>
                      </div>
                    )}
                    {provider.languages && provider.languages.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{provider.languages.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({reviews.length} reviews)</span>
                  </div>

                  {/* Portfolio Photos - Mock for now */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&h=200&fit=crop" alt="Office" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&h=200&fit=crop" alt="Team" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&h=200&fit=crop" alt="Building" className="w-full h-full object-cover" />
                    </div>
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&h=200&fit=crop" alt="Workspace" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Packages */}
            <div className="ios-card p-5 lg:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-gray-900 text-base lg:text-lg">Service Packages</h2>
                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  {servicePackages.length} packages
                </span>
              </div>

              <div className="space-y-4">
                {servicePackages.map((pkg) => (
                  <div key={pkg.id} className="border border-gray-100 rounded-xl p-4 bg-white hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{pkg.title}</h3>
                        {pkg.id === '1' && (
                          <p className="text-xs uppercase text-gray-400 font-semibold mt-1">Most Popular</p>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg font-bold text-gray-900">{currencyFormatter.format(pkg.priceTHB)}</p>
                        <p className="text-xs text-gray-500">~{pkg.etaDays} days</p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                      {pkg.description}
                    </p>

                    {/* Deliverables */}
                    <div className="space-y-2 mb-4">
                      {pkg.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <svg className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>

                    <button className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2">
                      <span>Request this service</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="ios-card p-5 lg:p-6">
              <h2 className="font-bold text-gray-900 text-base lg:text-lg mb-6">Reviews</h2>
              
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-gray-100 rounded-xl p-4 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                          {getInitials(review.authorName)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm">{review.authorName}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{review.createdAt}</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-6">
            
            {/* Contact Card */}
            <div className="ios-card p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Provider</h3>
              <div className="space-y-3">
                <button className="w-full px-5 py-2.5 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  <span>Send message</span>
                </button>
                <div className="text-sm text-center text-gray-500">
                  Typical response time: <span className="font-semibold text-gray-900">2-4 hours</span>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="ios-card p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Business Information</h3>
              <div className="space-y-3 text-sm">
                {provider.location && (
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">Location</p>
                    <p className="text-gray-900 font-medium">{provider.location}</p>
                  </div>
                )}
                {provider.languages && provider.languages.length > 0 && (
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {provider.languages.map((lang) => (
                        <span key={lang} className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {provider.website && (
                  <div>
                    <p className="text-xs uppercase text-gray-400 tracking-wide mb-1">Website</p>
                    <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                      {provider.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="ios-card p-5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Trust & Safety</h3>
              <div className="space-y-2">
                <div className="flex gap-3.5 items-start p-3 -mx-3 rounded-xl bg-green-50/50 border border-green-100/50">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 ring-4 ring-white">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Identity verified</p>
                    <p className="text-xs text-green-700/80 mt-0.5 leading-relaxed">Business license confirmed</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start p-3 -mx-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 ring-4 ring-white">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Payment protected</p>
                    <p className="text-xs text-blue-700/80 mt-0.5 leading-relaxed">Secure escrow system</p>
                  </div>
                </div>

                <div className="flex gap-3.5 items-start p-3 -mx-3 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                  <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center flex-shrink-0 ring-4 ring-white">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Data privacy</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Your info stays confidential</p>
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </main>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg z-50">
        <button className="w-full px-5 py-3 text-sm font-semibold text-white bg-primary hover:bg-indigo-600 rounded-xl transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2">
          <MessageCircle className="w-4 h-4" />
          <span>Contact provider</span>
        </button>
      </div>
    </div>
  );
}

